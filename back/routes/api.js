const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const axios = require("axios");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const router = require(".");
const db = require("../models");

const { isNotLoggedIn, isLoggedIn } = require("./middleware");

const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, done) {
			done(null, 'uploads')
		},
		filename(req, file, done){
			let ext = path.extname(file.originalname);
			let basename = path.basename(file.originalname, ext);
			let savename = basename + new Date() + ext;
			savename = savename.replace(/\s/g, "_");
			done(null, savename);
		}
	}),
});

router.get('/auth', async (req, res, next) => {
    try {
        return res.send(req.user || false);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/auth', isNotLoggedIn, async (req, res, next) => {
    passport.authenticate('local', (e, user, info) => {
        if (e) {
            return next(e);
        }
        if (info) {
            console.error(info);
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (loginErr) => {
            try {
                if (loginErr)
                    return next(loginErr);
                const userInfo = await db.User.findOne({
                    where: { id: user.id },
                    attributes: ['id', 'username', 'profile_img', 'is_admin']
                });
                return res.json(userInfo);
            } catch (e) {
                console.error(e);
                next(e);
            }
        })
    })(req, res, next);
});

router.post('/logout', isLoggedIn, (req, res) => {
	req.logout();
	req.session.destroy();
	res.send('logout 성공');
});

router.get(`/board/:boardId`, async (req, res, next) => {
    try {
        const boardData = await db.Board.findOne({
            where: {name: req.params.boardId},
            attributes: ['id', 'name'],
            include: [{
                model: db.TextContent,
                include: [{
                    model: db.Comment,
                    include: {
                        model: db.User
                    },
                    order: [["createdAt", "DESC"]],
                }, {
                    model: db.User
                }],
                order: [["createdAt", "DESC"]],
            }, {
                model: db.Image,
                include: [{
                    model: db.Comment,
                    include: [{
                        model: db.User
                    }],
                    order: [["createdAt", "DESC"]],
                }, {
                    model: db.User
                }],
                order: [["createdAt", "DESC"]],
            }, {
                model: db.Note,
                include: [{
                    model: db.Comment,
                    include: [{
                        model: db.User
                    }],
                    order: [["createdAt", "DESC"]],
                }, {
                    model: db.User
                }],
                order: [["createdAt", "DESC"]],
            }]
        });
        return res.send(boardData);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/board/:boardId/write/text', isLoggedIn, async (req, res, next) => {
    try {
        const board = await db.Board.findOne({
            where: {name: req.params.boardId}
        });
        if (!board)
            return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
        const now = new Date();
        const availBlocks = await req.user.avail_blocks - (req.body.width * req.body.height);
        if (availBlocks < 0)
            return res.status(403).send({ reason: `생성 가능한 블록 수는 ${req.user.avail_blocks}입니다.`});

        const newText = await db.TextContent.create({
            x: req.body.x,
            y: req.body.y,
            width: req.body.width,
            height: req.body.height,
            content: req.body.content,
            expiry_date: now.setDate(now.getDate() + 7),
            UserId: req.user.id,
            BoardId: req.params.boardId
        })
        await db.User.update({
            avail_blocks: availBlocks
        }, {
            where: {id: req.user.id}
        });

        const io = req.app.get("io");
        io.of(`/board-${board.name}`).emit('refresh');
        return res.send(`${req.user.avail_blocks - (req.body.width * req.body.height)}`);
    } catch (e) {
        console.error(e);
        next(e);
    }
})

router.post('/board/:boardId/write/note', isLoggedIn, async (req, res, next) => {
    try {
        const board = await db.Board.findOne({
            where: {name: req.params.boardId}
        });
        if (!board)
            return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
        const now = new Date();
        const availBlocks = await req.user.avail_blocks - (req.body.width * req.body.height);
        if (availBlocks < 0)
            return res.status(403).send({ reason: `생성 가능한 블록 수는 ${req.user.avail_blocks}입니다.`});

        const newText = await db.Note.create({
            x: req.body.x,
            y: req.body.y,
            width: req.body.width,
            height: req.body.height,
            head: req.body.head,
            paragraph: req.body.paragraph,
            background_img: req.body.background_img,
            expiry_date: now.setDate(now.getDate() + 7),
            UserId: req.user.id,
            BoardId: req.params.boardId
        })
        await db.User.update({
            avail_blocks: availBlocks
        }, {
            where: {id: req.user.id}
        });

        const io = req.app.get("io");
        io.of(`/board-${board.name}`).emit('refresh');
        return res.send(`${req.user.avail_blocks - (req.body.width * req.body.height)}`);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/uploadImage', isLoggedIn, upload.single('image'), async (req, res) => {
    res.json({
        url: `${env === "development" ? 'http://localhost:3095' : 'https://api.42board.com'}/${req.file.filename}`
    });
});

router.post('/board/:boardId/write/image', isLoggedIn, async (req, res, next) => {
    try {
        const board = await db.Board.findOne({
            where: {name: req.params.boardId}
        });
        if (!board)
            return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
        const now = new Date();
        const availBlocks = await req.user.avail_blocks - (req.body.width * req.body.height);

        if (availBlocks < 0)
            return res.status(403).send({ reason: `생성 가능한 블록 수는 ${req.user.avail_blocks}입니다.`});
        if (!req.body.url)
            return res.status(403).send({ reason: `이미지가 등록되지 않았습니다.`});
        const newImage = await db.Image.create({
            url: req.body.url,
            x: req.body.x,
            y: req.body.y,
            width: req.body.width,
            height: req.body.height,
            expiry_date: now.setDate(now.getDate() + 7),
            UserId: req.user.id,
            BoardId: req.params.boardId
        });

        await db.User.update({
            avail_blocks: availBlocks
        }, {
            where: {id: req.user.id}
        });

        const io = req.app.get("io");
        io.of(`/board-${board.name}`).emit('refresh');
        return res.send(`${req.user.avail_blocks - (req.body.width * req.body.height)}`);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

router.post('/board/:boardId/comment/:cid/:id', isLoggedIn, async (req, res, next) => {
    try {
        const board = await db.Board.findOne({
            where: {name: req.params.boardId}
        });
        if (!board)
            return res.status(404).send({ reason: '존재하지 않는 board입니다.' });

        let query = {
            BoardId: req.params.boardId
        };
        if (req.params.cid === '1') {
            query.TextContentId = parseInt(req.params.id);
        } else if (req.params.cid === '2') {
            query.NoteId = parseInt(req.params.id);
        } else if (req.params.cid === '3') {
            query.ImageId = parseInt(req.params.id);
        } else {
            return res.status(401).send({reason: 'category parameter is wrong.'});
        }
        const newComment = await db.Comment.create({
            content_category: req.params.cid,
            content_id: req.params.id,
            content: req.body.content,
            BoardId: req.params.boardId,
            UserId: req.user.id,
            ...query,
        })
        return res.send(newComment);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

router.get('/board/:boardId/comment/:cid/:id', isLoggedIn, async (req, res, next) => {
    try {
        const board = await db.Board.findOne({
            where: {name: req.params.boardId}
        });
        if (!board)
            return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
        let query = {
            BoardId: req.params.boardId
        };
        if (req.params.cid === '1') {
            query.TextContentId = parseInt(req.params.id);
        } else if (req.params.cid === '2') {
            query.NoteId = parseInt(req.params.id);
        } else if (req.params.cid === '3') {
            query.ImageId = parseInt(req.params.id);
        } else {
            return res.status(401).send({reason: 'category parameter is wrong.'});
        }
        const comments = await db.Comment.findAll({
            where: query,
            order: [["createdAt", "ASC"]],
            include: [{
                model: db.User
            }]
        });
        return res.send(comments);
    } catch(e) {
        console.error(e);
        next(e);
    }
})

router.delete('/board/:boardId/delete/text/:id', isLoggedIn, async (req, res, next) => {
    try {
        const board = await db.Board.findOne({
            where: {name: req.params.boardId}
        });
        if (!board)
            return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
        const content = await db.TextContent.findOne({
            where: {id: req.params.id}
        });
        if (!content)
            return res.status(404).send('콘텐츠가 존재하지 않습니다.');
        if (req.user.id !== content.UserId && !req.user.is_admin)
            return res.status(401).send('다른 사람의 게시물을 삭제할 수 없습니다.');
        const size = content.width * content.height;
        await db.TextContent.destroy({ where: {id: req.params.id }});
        await db.Comment.destroy({ where: { TextContentId: req.params.id }});
        await db.User.increment({ avail_blocks: size }, {where: { id: content.UserId }});

        const io = req.app.get("io");
        io.of(`/board-${board.name}`).emit('refresh');
        return res.send(`delete done`);
    } catch(e) {
        console.error(e);
        next(e);
    }
})

router.delete('/board/:boardId/delete/image/:id', isLoggedIn, async (req, res, next) => {
    try {
        const board = await db.Board.findOne({
            where: {name: req.params.boardId}
        });
        if (!board)
            return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
        const content = await db.Image.findOne({
            where: {id: req.params.id}
        });
        const delURL = env === 'development' ? "http://localhost:3095/" : "https://api.42board.com/";
        if (!content)
            return res.status(404).send('콘텐츠가 존재하지 않습니다.');
        if (req.user.id !== content.UserId && !req.user.is_admin)
            return res.status(401).send('다른 사람의 게시물을 삭제할 수 없습니다.');
        const size = content.width * content.height;
        await db.Image.destroy({ where: {id: req.params.id }});
        await db.Comment.destroy({ where: { ImageId: req.params.id }});
        await db.User.increment({ avail_blocks: size }, {where: { id: content.UserId }});
        fs.unlink(`./uploads/${content.url.replace(delURL, "")}`, () => {
            return;
        });

        const io = req.app.get("io");
        io.of(`/board-${board.name}`).emit('refresh');
        return res.send(`delete done`);
    } catch(e) {
        console.error(e);
        next(e);
    }
})

router.delete('/board/:boardId/delete/note/:id', isLoggedIn, async (req, res, next) => {
    try {
        const board = await db.Board.findOne({
            where: {name: req.params.boardId}
        });
        if (!board)
            return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
        const content = await db.Note.findOne({
            where: {id: req.params.id}
        });
        const delURL = env === 'development' ? "http://localhost:3095/" : "https://api.42board.com/";
        const size = content.width * content.height;
        if (!content)
            return res.status(404).send('콘텐츠가 존재하지 않습니다.');
        if (req.user.id !== content.UserId && !req.user.is_admin)
            return res.status(401).send('다른 사람의 게시물을 삭제할 수 없습니다.');
        await db.Note.destroy({ where: {id: req.params.id }});
        await db.Comment.destroy({ where: { NoteId: req.params.id }});
        await db.User.increment({ avail_blocks: size }, {where: { id: content.UserId }});
        if (content.background_img)
            fs.unlink(`./uploads/${content.background_img.replace(delURL, "")}`, () => {
                return;
            });

        const io = req.app.get("io");
        io.of(`/board-${board.name}`).emit('refresh');
        return res.send(`delete done`);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

router.patch('/board/:boardId/text/:id', isLoggedIn, async (req, res, next) => {
    try {
        const board = await db.Board.findOne({
            where: {name: req.params.boardId}
        });
        if (!board)
            return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
        const content = await db.TextContent.findOne({ where: {id: req.params.id }});
        if (!content)
            return res.status(404).send('콘텐츠가 존재하지 않습니다.');
        if (req.user.id !== content.UserId && !req.user.is_admin)
            return res.status(401).send('다른 사람의 게시물을 수정할 수 없습니다.');
        const oldSize = content.width * content.height;
        if (req.user.avail_blocks - ( req.body.width * req.body.height - oldSize ) < 0)
            return res.status(403).send({ reason: `현재 추가 가능한 블록 수는 ${req.user.avail_blocks}입니다.`});
        const editedContent = await db.TextContent.update({
            content: req.body.content,
            x: req.body.x,
            y: req.body.y,
            width: req.body.width,
            height: req.body.height,
        }, {
            where: {id: req.params.id}
        });
        await db.User.increment({
            avail_blocks: oldSize - (req.body.width * req.body.height)
        }, {
            where: {id: content.UserId}
        })

        const io = req.app.get("io");
        io.of(`/board-${board.name}`).emit('refresh');
        if (req.body.width * req.body.height === oldSize)
            return res.send(false);
        return res.send(`${req.user.avail_blocks - (req.body.width * req.body.height)}`);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

router.patch('/board/:boardId/note/:id', isLoggedIn, async (req, res, next) => {
    try {
        const board = await db.Board.findOne({
            where: {name: req.params.boardId}
        });
        if (!board)
            return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
        const content = await db.Note.findOne({ where: {id: req.params.id }});
        if (!content)
            return res.status(404).send('콘텐츠가 존재하지 않습니다.');
        if (req.user.id !== content.UserId && !req.user.is_admin)
            return res.status(401).send('다른 사람의 게시물을 수정할 수 없습니다.');
        const oldSize = content.width * content.height;
        if (req.user.avail_blocks - ( req.body.width * req.body.height - oldSize ) < 0)
            return res.status(403).send({ reason: `현재 추가 가능한 블록 수는 ${req.user.avail_blocks}입니다.`});
        const editedContent = await db.Note.update({
            background_img: req.body.background_img,
            head: req.body.head,
            paragraph: req.body.paragraph,
            x: req.body.x,
            y: req.body.y,
            width: req.body.width,
            height: req.body.height,
        }, {
            where: {id: req.params.id}
        });
        await db.User.increment({
            avail_blocks: oldSize - (req.body.width * req.body.height)
        }, {
            where: {id: content.UserId}
        });

        const io = req.app.get("io");
        io.of(`/board-${board.name}`).emit('refresh');
        if (req.body.width * req.body.height === oldSize)
            return res.send(false);
        return res.send(`${req.user.avail_blocks - (req.body.width * req.body.height)}`);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

router.patch('/board/:boardId/image/:id', isLoggedIn, async (req, res, next) => {
    try {
        const board = await db.Board.findOne({
            where: {name: req.params.boardId}
        });
        if (!board)
            return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
        const content = await db.Image.findOne({ where: {id: req.params.id }});
        if (!content)
            return res.status(404).send('콘텐츠가 존재하지 않습니다.');
        if (req.user.id !== content.UserId && !req.user.is_admin)
            return res.status(401).send('다른 사람의 게시물을 수정할 수 없습니다.');
        const oldSize = await content.width * content.height;
        if (req.user.avail_blocks - ( req.body.width * req.body.height - oldSize ) < 0)
            return res.status(403).send({ reason: `현재 추가 가능한 블록 수는 ${req.user.avail_blocks}입니다.`});
        const editedContent = await db.Image.update({
            url: req.body.url,
            x: req.body.x,
            y: req.body.y,
            width: req.body.width,
            height: req.body.height,
        }, {
            where: {id: req.params.id}
        });
        await db.User.increment({
            avail_blocks: oldSize - (req.body.width * req.body.height)
        }, {
            where: {id: content.UserId}
        });
        const io = req.app.get("io");
        io.of(`/board-${board.name}`).emit('refresh');
        if (req.body.width * req.body.height === oldSize)
            return res.send(false);
        return res.send(`${req.user.avail_blocks - (req.body.width * req.body.height)}`);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

router.get(`/board/:boardId/chats`, isLoggedIn, async (req, res, next) => {
    try {
        const board = await db.Board.findOne({
            where: {name: req.params.boardId}
        });
        if (!board)
            return res.status(404).send({ reason: '존재하지 않는 board입니다.' });

        return res.json(
            await db.Chat.findAll({
                where: { BoardId: board.id },
                limit: parseInt(req.query.perPage),
                offset: req.query.perPage * (req.query.page - 1),
                order: [["createdAt", "DESC"]],
            })
        );
    } catch(e) {
        console.error(e);
        next(e);
    }
})

router.post(`/board/:boardId/chat`, isLoggedIn, async (req, res, next) => {
    try {
        const board = await db.Board.findOne({
            where: {name: req.params.boardId}
        });
        if (!board)
            return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
        const newChat = await db.Chat.create({
            userId: req.body.userId,
            username: req.body.username,
            content: req.body.content,
            BoardId: board.id
        });
        const io = req.app.get("io");
        io.of(`/board-${board.name}`).emit('newChat', newChat);
        res.send('message emit ok');
    } catch(e) {
        console.error(e);
        next(e);
    }
})

module.exports = router;
