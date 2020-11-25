const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const axios = require("axios");
const multer = require('multer');
const path = require('path');
// const { Op } = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const get_token_url = `${config.api_url}/me?access_token=`

// const { sequelize } = require("../models");
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

router.get('/auth', isLoggedIn, async (req, res, next) => {
    try {
        if (!req.user)
            res.status(202).send({ reason: "before created cookie" });
        const userInfo = await db.User.findOne({
            where: {id: req.user.id},
            attributes: ['id', 'username', 'profile_img', 'is_admin']
        });

        // if (new Date().getTime() > userInfo.updatedAt.getTime() + 7200 )
        //     res.status(401).send({ reason: "만료된 토큰입니다." });
        // const get_user_42api = await axios.get(get_token_url + userInfo.access_token).then(res => {
        //     return res.data;
        // }).catch(e => {
        //     res.status(401).send({ reason: "만료된 토큰입니다." });
        // })
        // if (get_user_42api)
            res.send(userInfo);
    } catch (e) {
        console.error(e);
        next(e);
    }
})

router.post('/auth', isNotLoggedIn, async (req, res, next) => {
    passport.authenticate('local', (e, user, info) => {
        if (e) {
            return next(e);
        }
        if (info) {
            console.error(info);
            return res.status(401).send(info.reason);
        }
        console.log(user);
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

router.post('/write/text', isLoggedIn, async (req, res, next) => {
    try {
        const now = new Date();
        const availBlocks = await req.user.avail_blocks - (req.body.width * req.body.height);
        if (availBlocks < 0)
            res.status(202).send({ reason: `생성 가능한 블록 수는 ${req.user.avail_blocks}입니다.`});
        else
        {
            const newText = await db.TextContent.create({
                x: req.body.x,
                y: req.body.y,
                width: req.body.width,
                height: req.body.height,
                content: req.body.content,
                expiry_date: now.setDate(now.getDate() + 7),
                UserId: req.user.id,
                BoardId: 42
            })
            await db.User.update({
                avail_blocks: availBlocks
            }, {
                where: {id: req.user.id}
            });
            res.send(newText);
        }
    } catch (e) {
        console.error(e);
        next(e);
    }
})

router.post('/write/note', isLoggedIn, async (req, res, next) => {
    try {
        const now = new Date();
        const availBlocks = await req.user.avail_blocks - (req.body.width * req.body.height);
        if (availBlocks < 0)
            res.status(202).send({ reason: `생성 가능한 블록 수는 ${req.user.avail_blocks}입니다.`});
        else
        {
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
                BoardId: 42
            })
            await db.User.update({
                avail_blocks: availBlocks
            }, {
                where: {id: req.user.id}
            });
            res.send(newText);
        }
    } catch (e) {
        console.error(e);
        next(e);
    }
})

router.get('/test/text', async (req, res, next) => {
    try {
        const allTexts = await db.TextContent.findAll({
            where: {BoardId: 42}
        });
        res.send(allTexts);
    } catch (e) {
        console.error(e);
        next(e);
    }
})

router.get(`/board/:boardId`, async (req, res, next) => {
    try {
        const boardData = await db.Board.findOne({
            where: {id: req.params.boardId},
            attributes: ['id', 'name'],
            include: [{
                model: db.TextContent,
                include: [{
                    model: db.Comment,
                    include: [{
                        model: db.User
                    }],
                    order: [["createdAt", "DESC"]],
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
                }],
                order: [["createdAt", "DESC"]],
            }]
        });
        res.send(boardData);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/uploadImage', isLoggedIn, upload.single('image'), async (req, res, next) => {
    try {
        res.json({
            url: `${env === "development" ? 'http://localhost:3095' : 'https://42board.kr'}/${req.file.filename}`
        })
    } catch (e) {
        console.error(e);
        next(e);
    }
})

router.post('/write/image', isLoggedIn, async (req, res, next) => {
    try {
        const now = new Date();
        const availBlocks = await req.user.avail_blocks - (req.body.width * req.body.height);
        if (availBlocks < 0)
            res.status(202).send({ reason: `생성 가능한 블록 수는 ${req.user.avail_blocks}입니다.`});

        const newImage = await db.Image.create({
            url: req.body.url,
            x: req.body.x,
            y: req.body.y,
            width: req.body.width,
            height: req.body.height,
            expiry_date: now.setDate(now.getDate() + 7),
            UserId: req.user.id,
            BoardId: 42,
        });
        await db.User.update({
            avail_blocks: availBlocks
        }, {
            where: {id: req.user.id}
        });
        res.send(newImage);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

router.post('/comment/:category/:id', isLoggedIn, async (req, res, next) => {
    try {
        const cid = await req.params.category;
        const id = await req.params.id;

        let query = {};
        if (cid === '1') {
            query = {
                TextContentId: id
            }
        } else if (cid === '2') {
            query = {
                NoteId: id
            }
        } else if (cid === '3') {
            query = {
                ImageId: id
            }
        } else {
            res.status(401).send({reason: 'category parameter is wrong.'});
            return ;
        }
        const newComment = await db.Comment.create({
            content_category: cid,
            content_id: id,
            content: req.body.content,
            BoardId: 42,
            UserId: req.user.id,
            ...query,
        })
        res.send(newComment);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

router.get('/comment/:cid/:id', isLoggedIn, async (req, res, next) => {
    try {
        let query = {};
        if (req.params.cid === '1') {
            query = {
                TextContentId: parseInt(req.params.id)
            }
        } else if (req.params.cid === '2') {
            query = {
                NoteId: parseInt(req.params.id)
            }
        } else if (req.params.cid === '3') {
            query = {
                ImageId: parseInt(req.params.id)
            }
        } else {
            res.status(401).send({reason: 'category parameter is wrong.'});
            return ;
        }
        const comments = await db.Comment.findAll({
            where: query,
            order: [["createdAt", "ASC"]],
            include: [{
                model: db.User
            }]
        })
        res.send(comments);
    } catch(e) {
        console.error(e);
        next(e);
    }
})

module.exports = router;
