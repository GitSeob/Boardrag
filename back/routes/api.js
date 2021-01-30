const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { Op, fn, col } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const router = require(".");
const db = require("../models");

const { isNotLoggedIn, isLoggedIn } = require("./middleware");
const { sequelize } = require("../models/tag");

const delURL = env === 'development' ? "http://localhost:3095/" : "https://api.42board.com/";

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

Date.prototype.format = function(f) {
	if (!this.valueOf()) return " ";

	var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	var d = this;

	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
		switch ($1) {
			case "yyyy": return d.getFullYear();
			case "yy": return (d.getFullYear() % 1000).zf(2);
			case "MM": return (d.getMonth() + 1).zf(2);
			case "dd": return d.getDate().zf(2);
			case "E": return weekName[d.getDay()];
			case "HH": return d.getHours().zf(2);
			case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
			case "mm": return d.getMinutes().zf(2);
			case "ss": return d.getSeconds().zf(2);
			case "a/p": return d.getHours() < 12 ? "오전" : "오후";
			default: return $1;
		}
	});
};

const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, done) {
			done(null, 'uploads')
		},
		filename(req, file, done){
			let ext = path.extname(file.originalname);
			let basename = req.query.board + "_" + req.query.contentName + "_";
			let savename = basename + new Date().format("yyyy-MM-dd_hh:mm:ss") + ext;
			savename = savename.replace(/\s/g, "_");
			done(null, savename);
		}
	}),
	limits: {fileSize: 20*1024*1024},
});

const uploadBoardImage = multer({
	storage: multer.diskStorage({
		destination(req, file, done) {
			done(null, 'board_bgs')
		},
		filename(req, file, done){
			let savename = req.query.name + "_bg_image:::not_save:::" + path.extname(file.originalname);
			savename = savename.replace(/\s/g, "_");
			done(null, savename);
		}
	}),
	limits: {fileSize: 20*1024*1024},
});

const uploadProfileImage = multer({
	storage: multer.diskStorage({
		destination(req, file, done) {
			done(null, 'board_profileImages')
		},
		filename(req, file, done){
			let savename = req.query.name + "_" + req.user.username + ":::not_save:::" + path.extname(file.originalname);
			savename = savename.replace(/\s/g, "_");
			done(null, savename);
		}
	}),
	limits: {fileSize: 4*1024*1024},
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

router.get(`/auth/callback`, passport.authenticate('local', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/api/auth');
});

router.post('/logout', isLoggedIn, (req, res) => {
	req.logout();
	req.session.destroy();
	res.send('logout 성공');
});

router.get(`/checkBoardName/:boardName`, isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: { name: req.params.boardName }
		});
		if (board)
			return res.send(false);
		return res.send(true);
	} catch (e) {
		next(e);
	}
})

router.post(`/createBoard`, isLoggedIn, async (req, res, next) => {
	try {

		const query = {
			password: req.body.is_lock ? await bcrypt.hash(req.body.pw, 12) : null,
			expiry_times: req.body.ETime === 0 ? null : req.body.ETime
		}
		const background_img_url = await req.body.background.replace(":::not_save:::", "");
		await fs.renameSync(req.body.background.replace(delURL, "./"), background_img_url.replace(delURL, "./"));
		const newBoard = await db.Board.create({
			...query,
			name: req.body.title,
			description: req.body.des,
			default_blocks: req.body.defaultBlocks > 640 ? 640 : req.body.defaultBlocks,
			is_lock: req.body.is_lock,
			AdminId: req.user.id,
			background: background_img_url,
		})
		const profile_img_url = await req.body.profileImage.replace(":::not_save:::", "");
		await fs.renameSync(req.body.profileImage.replace(delURL, "./"), profile_img_url.replace(delURL, "./"));
		await db.BoardMember.create({
			username: req.body.nickName,
			profile_img: profile_img_url,
			avail_blocks: req.body.defaultBlocks > 640 ? 640 : req.body.defaultBlocks,
			UserId: req.user.id,
			BoardId: newBoard.id
		})
		return res.send('create OK');
	} catch (e) {
		next(e);
	}
});

router.get(`/board`, isLoggedIn, async (req, res, next) => {
	try {
		const boardIds = [];
		await db.BoardMember.findAll({
			where: {UserId: req.user.id},
			attributes: ["BoardId"]
		}).then(res => {
			res.forEach(elem => {
				boardIds.push(elem.BoardId)
			})
		})
		const joinedBoards = await db.Board.findAll({
			where: { id: boardIds },
			attributes: [
				"id", "name", "is_lock", "description", "background", "AdminId",
				[fn('COUNT', col('Member.username')), 'memberCount']
			],
			include: [{
				model: db.BoardMember,
				as: "Member",
				attributes: ["username", "profile_img", "UserId"]
			}],
			group: ['Board.id'],
			order: [["createdAt", "DESC"]],
		});
		return res.send(joinedBoards);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

router.get(`/manageBoards`, isLoggedIn, async (req, res, next) => {
	try {
		const boardIds = [];
		await db.BoardMember.findAll({
			where: {UserId: req.user.id},
			attributes: ["BoardId"]
		}).then(res => {
			res.forEach(elem => {
				boardIds.push(elem.BoardId)
			})
		})
		const joinedBoards = await db.Board.findAll({
			where: { id: boardIds },
			attributes: [
				"id", "name", "is_lock", "description", "background", "AdminId",
			],
			include: [{
				model: db.BoardMember,
				as: "Member",
				attributes: ["username", "profile_img", "UserId"]
			}],
			order: [["createdAt", "DESC"]],
		});
		return res.send(joinedBoards);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

router.get(`/notJoinedBoards`, isLoggedIn, async (req, res, next) => {
	try {
		const boardIds = [];
		await db.BoardMember.findAll({
			where: {UserId: req.user.id},
			attributes: ["BoardId"]
		}).then(res => {
			res.forEach(elem => {
				boardIds.push(elem.BoardId)
			})
		})
		const notJoinedBoards = await db.Board.findAll({
			where: {
				id: {
					[Op.not]: boardIds
				}
			},
			attributes: [
				"id", "name", "is_lock", "description", "background",
				[fn('COUNT', col('Member.username')), 'memberCount']
			],
			include: [{
				model: db.BoardMember,
				as: "Member",
				attributes: []
			}],
			group: ['Board.id'],
			order: [["createdAt", "DESC"]],
		});
		return res.send(notJoinedBoards);
	} catch(e) {
		next(e);
	}
})

router.get(`/board/:boardName`, isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: { name: req.params.boardName }
		})
		const me = await db.BoardMember.findOne({
			where: {
				BoardId: board.id,
				UserId: req.user.id
			}
		});

		if (!me)
			res.send("not assigned");

		const boardData = await db.Board.findOne({
			where: {name: req.params.boardName},
			attributes: ['id', 'name', 'background', 'AdminId'],
			include: [{
				model: db.TextContent,
				include: [{
					model: db.Comment,
					include: {
						model: db.BoardMember
					},
					order: [["createdAt", "DESC"]],
				}, {
					model: db.BoardMember
				}],
				order: [["createdAt", "DESC"]],
			}, {
				model: db.Image,
				include: [{
					model: db.Comment,
					include: [{
						model: db.BoardMember
					}],
					order: [["createdAt", "DESC"]],
				}, {
					model: db.BoardMember
				}],
				order: [["createdAt", "DESC"]],
			}, {
				model: db.Note,
				include: [{
					model: db.Comment,
					include: [{
						model: db.BoardMember
					}],
					order: [["createdAt", "DESC"]],
				}, {
					model: db.BoardMember
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

router.get(`/board/:boardName/me`, isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: { name: req.params.boardName }
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		return res.send(await db.BoardMember.findOne({
				where: {
					UserId: req.user.id,
					BoardId: board.id
				}
			}) || false);
	} catch(e) {
		next(e);
	}
});

router.post('/board/:boardName/write/text', isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName }
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		const now = new Date();
		const member = await db.BoardMember.findOne({where: {
			id: req.body.BoardMemberId,
			UserId: req.user.id,
			BoardId: board.id
		}});
		if (!member)
			return res.status(404).send({ reason: "알 수 없는 문제가 발생했습니다." });
		const availBlocks = await member.avail_blocks - (req.body.width * req.body.height);
		if (availBlocks < 0)
			return res.status(403).send({ reason: `생성 가능한 블록 수는 ${member.avail_blocks}입니다.`});

		const newText = await db.TextContent.create({
			x: req.body.x,
			y: req.body.y,
			width: req.body.width,
			height: req.body.height,
			content: req.body.content,
			expiry_date: board.expiry_times ? now.setDate(now.getDate() + board.expiry_times) : null,
			BoardMemberId: member.id,
			BoardId: board.id
		})
		await db.BoardMember.update({
			avail_blocks: availBlocks
		}, {
			where: {id: member.id}
		});
		await db.Board.update({
			recent_time: fn('NOW')
		},{
			where: {id: board.id}
		})

		const io = req.app.get("io");
		io.of(`/board-${board.name}`).emit('refresh');
		return res.send(`${availBlocks}`);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

router.post('/board/:boardName/write/note', isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		const now = new Date();
		const member = await db.BoardMember.findOne({where: {
			id: req.body.BoardMemberId,
			UserId: req.user.id,
			BoardId: board.id
		}});
		if (!member)
			return res.status(404).send({ reason: "알 수 없는 문제가 발생했습니다." });
		const availBlocks = await member.avail_blocks - (req.body.width * req.body.height);
		if (availBlocks < 0)
			return res.status(403).send({ reason: `생성 가능한 블록 수는 ${member.avail_blocks}입니다.`});

		const newText = await db.Note.create({
			x: req.body.x,
			y: req.body.y,
			width: req.body.width,
			height: req.body.height,
			head: req.body.head,
			paragraph: req.body.paragraph,
			background_img: req.body.background_img,
			expiry_date: board.expiry_times ? now.setDate(now.getDate() + board.expiry_times) : null,
			BoardMemberId: member.id,
			BoardId: board.id
		})
		await db.BoardMember.update({
			avail_blocks: availBlocks
		}, {
			where: {id: member.id}
		});
		await db.Board.update({
			recent_time: fn('NOW')
		},{
			where: {id: board.id}
		})

		const io = req.app.get("io");
		io.of(`/board-${board.name}`).emit('refresh');
		return res.send(`${availBlocks}`);
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

router.post('/uploadBoardBackground', isLoggedIn, uploadBoardImage.single('image'), async (req, res) => {
	res.json({
		url: `${env === "development" ? 'http://localhost:3095' : 'https://api.42board.com'}/board_bgs/${req.file.filename}`
	})
});

router.post('/uploadProfileImage', isLoggedIn, uploadProfileImage.single('image'), async (req, res) => {
	res.json({
		url: `${env === "development" ? 'http://localhost:3095' : 'https://api.42board.com'}/board_profileImages/${req.file.filename}`
	})
});

router.post('/board/:boardName/write/image', isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		const now = new Date();
		const member = await db.BoardMember.findOne({where: {
			id: req.body.BoardMemberId,
			UserId: req.user.id,
			BoardId: board.id
		}});
		if (!member)
			return res.status(404).send({ reason: "알 수 없는 문제가 발생했습니다." });
		const availBlocks = await member.avail_blocks - (req.body.width * req.body.height);

		if (availBlocks < 0)
			return res.status(403).send({ reason: `생성 가능한 블록 수는 ${member.avail_blocks}입니다.`});
		if (!req.body.url)
			return res.status(403).send({ reason: `이미지가 등록되지 않았습니다.`});
		const newImage = await db.Image.create({
			url: req.body.url,
			x: req.body.x,
			y: req.body.y,
			width: req.body.width,
			height: req.body.height,
			expiry_date: board.expiry_times ? now.setDate(now.getDate() + board.expiry_times) : null,
			BoardMemberId: member.id,
			BoardId: board.id
		});

		await db.BoardMember.update({
			avail_blocks: availBlocks
		}, {
			where: {id: member.id}
		});
		await db.Board.update({
			recent_time: fn('NOW')
		},{
			where: {id: board.id}
		})

		const io = req.app.get("io");
		io.of(`/board-${board.name}`).emit('refresh');
		return res.send(`${availBlocks}`);
	} catch(e) {
		console.error(e);
		next(e);
	}
});

router.post('/board/:boardName/comment/:cid/:id', isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		let query = {};
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		if (req.params.cid === '1') {
			query.TextContentId = parseInt(req.params.id);
		} else if (req.params.cid === '2') {
			query.NoteId = parseInt(req.params.id);
		} else if (req.params.cid === '3') {
			query.ImageId = parseInt(req.params.id);
		} else {
			return res.status(401).send({reason: 'category parameter is wrong.'});
		}
		await db.Comment.create({
			...query,
			content_category: req.params.cid,
			content_id: req.params.id,
			content: req.body.content,
			BoardMemberId: req.body.BoardMemberId,
			BoardId: board.id
		})
		const io = req.app.get("io");
		io.of(`/board-${board.name}`).emit('refresh');
		res.send('write comment ok');
	} catch(e) {
		console.error(e);
		next(e);
	}
});

router.get('/board/:boardName/comment/:cid/:id', isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		let query = {};
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
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
			where: { ...query, BoardId: board.id },
			order: [["createdAt", "ASC"]],
			include: [{
				model: db.BoardMember
			}]
		});
		return res.send(comments);
	} catch(e) {
		console.error(e);
		next(e);
	}
});

router.patch('/board/:boardName/comment/:id', isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		const comment = await db.Comment.findOne({
			where: {id: req.params.id}
		});
		if (!comment)
			return res.status(404).send({ reason: '존재하지 않는 댓글입니다.' });
		const member = await db.BoardMember.findOne({
			where: {
				UserId: req.user.id,
				BoardId: board.id
			}
		})
		if (!member)
			return res.status(404).send({ reason: '참여하지 않은 유저입니다.' });
		if (comment.BoardMemberId !== member.id)
			return res.status(401).send({ reason: '다른 사람의 덧글은 수정할 수 없습니다.' });

		await db.Comment.update({
			content: req.body.content,
		}, {
			where: {
				id: req.params.id
			}
		});
		const io = req.app.get("io");
		io.of(`/board-${board.name}`).emit('refresh');
		res.send('update comment ok');
	} catch (e) {
		console.error(e);
		next(e);
	}
});

router.delete('/board/:boardName/comment/:id', isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		const comment = await db.Comment.findOne({
			where: {id: req.params.id}
		});
		if (!comment)
			return res.status(404).send({ reason: '존재하지 않는 댓글입니다.' });
		const member = await db.BoardMember.findOne({
			where: {
				UserId: req.user.id,
				BoardId: board.id
			}
		})
		if (!member)
			return res.status(404).send({ reason: '참여하지 않은 유저입니다.' });
		if (comment.BoardMemberId !== member.id)
			return res.status(401).send({ reason: '다른 사람의 덧글은 삭제할 수 없습니다.' });
		await db.Comment.destroy({
			where: { id: req.params.id }
		});
		const io = req.app.get("io");
		io.of(`/board-${board.name}`).emit('refresh');
		res.send('delete comment ok');
	} catch (e) {
		console.error(e);
		next(e);
	}
})

router.delete('/board/:boardName/delete/text/:id', isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		const content = await db.TextContent.findOne({
			where: {id: req.params.id}
		});
		if (!content)
			return res.status(404).send('콘텐츠가 존재하지 않습니다.');
		const member = await db.BoardMember.findOne({
			where: {
				UserId: req.user.id,
				BoardId: board.id
			}
		})
		if (!member)
			return res.status(404).send({ reason: '참여하지 않은 유저입니다.' });
		if (member.id !== content.BoardMemberId && !req.user.is_admin)
			return res.status(401).send('다른 사람의 게시물을 삭제할 수 없습니다.');

		const size = content.width * content.height;
		await db.TextContent.destroy({ where: {id: req.params.id }});
		await db.Comment.destroy({ where: { TextContentId: req.params.id }});
		await db.BoardMember.increment({ avail_blocks: size }, {where: { id: content.BoardMemberId }});

		const io = req.app.get("io");
		io.of(`/board-${board.name}`).emit('refresh');
		return res.send(`delete done`);
	} catch(e) {
		console.error(e);
		next(e);
	}
})

router.delete('/board/:boardName/delete/image/:id', isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		const content = await db.Image.findOne({
			where: {id: req.params.id}
		});

		if (!content)
			return res.status(404).send('콘텐츠가 존재하지 않습니다.');
		const member = await db.BoardMember.findOne({
			where: {
				UserId: req.user.id,
				BoardId: board.id
			}
		})
		if (!member)
			return res.status(404).send({ reason: '참여하지 않은 유저입니다.' });
		if (member.id !== content.BoardMemberId && !req.user.is_admin)
			return res.status(401).send('다른 사람의 게시물을 삭제할 수 없습니다.');

		const size = content.width * content.height;
		await db.Image.destroy({ where: {id: req.params.id }});
		await db.Comment.destroy({ where: { ImageId: req.params.id }});
		await db.BoardMember.increment({ avail_blocks: size }, {where: { id: content.BoardMemberId }});
		fs.unlink(`./uploads/${content.url.replace(delURL, "")}`, () => {
			return;
		});
		const log_time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
		fs.appendFileSync('./logs/delete_files.txt', `${log_time} >> delete image\t\t /uploads/${content.url.replace(delURL, "")}\n`);
		const io = req.app.get("io");
		io.of(`/board-${board.name}`).emit('refresh');
		return res.send(`delete done`);
	} catch(e) {
		console.error(e);
		next(e);
	}
})

router.delete('/board/:boardName/delete/note/:id', isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		const content = await db.Note.findOne({
			where: {id: req.params.id}
		});

		const size = content.width * content.height;
		if (!content)
			return res.status(404).send('콘텐츠가 존재하지 않습니다.');
		const member = await db.BoardMember.findOne({
			where: {
				UserId: req.user.id,
				BoardId: board.id
			}
		})
		if (!member)
			return res.status(404).send({ reason: '참여하지 않은 유저입니다.' });
		if (member.id !== content.BoardMemberId && !req.user.is_admin)
			return res.status(401).send('다른 사람의 게시물을 삭제할 수 없습니다.');
		await db.Note.destroy({ where: {id: req.params.id }});
		await db.Comment.destroy({ where: { NoteId: req.params.id }});
		await db.BoardMember.increment({ avail_blocks: size }, {where: { id: content.BoardMemberId }});
		if (content.background_img)
			fs.unlink(`./uploads/${content.background_img.replace(delURL, "")}`, () => {
				return;
			});
		const log_time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
		fs.appendFileSync('./logs/delete_files.txt', `${log_time} >> delete image\t\t /uploads/${content.background_img.replace(delURL, "")}\n`);
		const io = req.app.get("io");
		io.of(`/board-${board.name}`).emit('refresh');
		return res.send(`delete done`);
	} catch(e) {
		console.error(e);
		next(e);
	}
});

router.patch('/board/:boardName/text/:id', isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		const content = await db.TextContent.findOne({ where: {id: req.params.id }});
		if (!content)
			return res.status(404).send('콘텐츠가 존재하지 않습니다.');
		const member = await db.BoardMember.findOne({
			where: {
				UserId: req.user.id,
				BoardId: board.id
			}
		})
		if (!member)
			return res.status(404).send({ reason: '참여하지 않은 유저입니다.' });
		if (member.id !== content.BoardMemberId && !req.user.is_admin)
			return res.status(401).send('다른 사람의 게시물을 수정할 수 없습니다.');

		const oldSize = content.width * content.height;
		if (member.avail_blocks - ( req.body.width * req.body.height - oldSize ) < 0)
			return res.status(403).send({ reason: `현재 추가 가능한 블록 수는 ${member.avail_blocks}입니다.`});
		await db.TextContent.update({
			content: req.body.content,
			x: req.body.x,
			y: req.body.y,
			width: req.body.width,
			height: req.body.height,
		}, {
			where: {id: req.params.id}
		});
		await db.BoardMember.increment({
			avail_blocks: oldSize - (req.body.width * req.body.height)
		}, {
			where: {id: content.BoardMemberId}
		})

		const io = req.app.get("io");
		io.of(`/board-${board.name}`).emit('refresh');
		if (req.body.width * req.body.height === oldSize)
			return res.send(false);
		return res.send(`${member.avail_blocks + oldSize - (req.body.width * req.body.height)}`);
	} catch(e) {
		console.error(e);
		next(e);
	}
});

router.patch('/board/:boardName/note/:id', isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		const content = await db.Note.findOne({ where: {id: req.params.id }});
		if (!content)
			return res.status(404).send('콘텐츠가 존재하지 않습니다.');
		const member = await db.BoardMember.findOne({
			where: {
				UserId: req.user.id,
				BoardId: board.id
			}
		})
		if (!member)
			return res.status(404).send({ reason: '참여하지 않은 유저입니다.' });
		if (member.id !== content.BoardMemberId && !req.user.is_admin)
			return res.status(401).send('다른 사람의 게시물을 수정할 수 없습니다.');

		const oldSize = content.width * content.height;
		if (member.avail_blocks - ( req.body.width * req.body.height - oldSize ) < 0)
			return res.status(403).send({ reason: `현재 추가 가능한 블록 수는 ${member.avail_blocks}입니다.`});
		await db.Note.update({
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
		await db.BoardMember.increment({
			avail_blocks: oldSize - (req.body.width * req.body.height)
		}, {
			where: {id: content.BoardMemberId}
		});

		const io = req.app.get("io");
		io.of(`/board-${board.name}`).emit('refresh');
		if (req.body.width * req.body.height === oldSize)
			return res.send(false);
		return res.send(`${member.avail_blocks + oldSize - (req.body.width * req.body.height)}`);
	} catch(e) {
		console.error(e);
		next(e);
	}
});

router.patch('/board/:boardName/image/:id', isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		const content = await db.Image.findOne({ where: {id: req.params.id }});
		if (!content)
			return res.status(404).send('콘텐츠가 존재하지 않습니다.');
		const member = await db.BoardMember.findOne({
			where: {
				UserId: req.user.id,
				BoardId: board.id
			}
		})
		if (!member)
			return res.status(404).send({ reason: '참여하지 않은 유저입니다.' });
		if (member.id !== content.BoardMemberId && !req.user.is_admin)
			return res.status(401).send('다른 사람의 게시물을 수정할 수 없습니다.');

		const oldSize = await content.width * content.height;
		if (member.avail_blocks - ( req.body.width * req.body.height - oldSize ) < 0)
			return res.status(403).send({ reason: `현재 추가 가능한 블록 수는 ${member.avail_blocks}입니다.`});
		await db.Image.update({
			url: req.body.url,
			x: req.body.x,
			y: req.body.y,
			width: req.body.width,
			height: req.body.height,
		}, {
			where: {id: req.params.id}
		});
		await db.BoardMember.increment({
			avail_blocks: oldSize - (req.body.width * req.body.height)
		}, {
			where: {id: content.BoardMemberId}
		});
		const io = req.app.get("io");
		io.of(`/board-${board.name}`).emit('refresh');
		if (req.body.width * req.body.height === oldSize)
			return res.send(false);
			return res.send(`${member.avail_blocks + oldSize - (req.body.width * req.body.height)}`);
	} catch(e) {
		console.error(e);
		next(e);
	}
});

router.get(`/board/:boardName/chats`, isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
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

router.post(`/board/:boardName/chat`, isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
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

router.post(`/join/:boardName`, isLoggedIn, async (req, res, next) => {
	try {
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		if (board.is_lock)
		{
			const compPW = await bcrypt.compare(req.body.pw, board.password);
			if (!compPW)
				return res.status(401).send({ reason: '비밀번호가 일치하지 않습니다.' });
		}
		await db.BoardMember.create({
			username: req.body.nickname,
			profile_img: req.body.profile_img,
			avail_blocks: board.default_blocks,
			UserId: req.user.id,
			BoardId: board.id
		})
		return res.send(`${board.name}`);
	} catch(e) {
		next(e);
	}
});

router.delete(`/deleteBoard/:boardName`, isLoggedIn, async (req, res, next) => {
	try {
		const t = await db.sequelize.transaction();
		const board = await db.Board.findOne({
			where: {name: req.params.boardName},
			include: [{
				model: db.BoardMember,
				as: "Member"
			}],
		}, {
			transaction: t
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		if (board.AdminId !== req.user.id)
			return res.status(401).send({ reason: "해당 board의 관리자가 아닙니다. "});
		const deleteUploads = [];
		await db.Image.findAll({
			where: {
				BoardId: board.id
			},
			attributes: ["url"],
		}, {
			transaction: t
		}).then(res => {
			res.forEach(elem => {
				deleteUploads.push(elem.url);
			});
		});
		await db.Note.findAll({
			where: {
				BoardId: board.id
			},
			attributes: ["background_img"],
		}, {
			transaction: t
		}).then(res => {
			res.forEach(elem => {
				if (elem.background_img)
					deleteUploads.push(elem.background_img);
			});
		});
		await db.Board.destroy({
			where: { id: board.id },
			force: true
		}, {
			transaction: t
		});
		let deleteList = [];
		await board.Member.map(c => {
			if (c.profile_img)
				deleteList.push(c.profile_img);
		});

		const log_time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
		let filePath;
		deleteUploads.forEach(file => {
			filePath = file.replace(delURL, "");
			fs.unlink(`./uploads/${filePath}`, () => {
				return;
			});
			fs.appendFileSync('./logs/delete_files.txt', `${log_time} >> delete image\t\t /uploads/${filePath}\n`);
		});
		deleteList.forEach(file => {
			filePath = file.replace(delURL, "");
			fs.unlink(`./${filePath}`, () => {
				return;
			});
			fs.appendFileSync('./logs/delete_files.txt', `${log_time} >> delete image\t\t /${filePath}\n`);
		});
		filePath = board.background.replace(delURL, "");
		fs.unlink(`./${filePath}`, () => {
			return;
		});
		fs.appendFileSync('./logs/delete_files.txt', `${log_time} >> delete image\t\t /${filePath}\n`);
		res.send("done");
	}
	catch (e){
		next(e);
	}
});

router.post(`/BoardMember/edit`, isLoggedIn, async (req, res, next) => {
	try {
		const t = await db.sequelize.transaction();
		const board = await db.Board.findOne({
			where: {name: req.body.boardName},
			include: [{
				model: db.BoardMember,
				as: "Member"
			}],
		}, {
			transaction: t
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		const me = await db.BoardMember.findOne({
			where: {
				BoardId: board.id,
				UserId: req.user.id
			}
		}, {
			transaction: t
		});
		if (!me)
			return res.status(401).send({ reason: "접근 권한이 없습니다." });
		const profile_img_url = await req.body.profile_img.replace(":::not_save:::", "");
		if (req.body.profile_img)
			await fs.renameSync(req.body.profile_img.replace(delURL, "./"), profile_img_url.replace(delURL, "./"));
		await db.BoardMember.update({
			profile_img: profile_img_url,
			username: req.body.username
		},{
			where: {
				id: me.id,
				BoardId: board.id,
				UserId: req.user.id
			}
		}, {
			transaction: t
		});
		return res.send(`${profile_img_url}`);
	} catch(e) {
		next(e);
	}
});

router.post(`/editBoard/:boardName`, isLoggedIn, async (req, res, next) => {
	try {
		const t = await db.sequelize.transaction();
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		if (!board)
			return res.status(404).send({ reason: '존재하지 않는 board입니다.' });
		if (req.user.id !== board.AdminId)
			return res.status(401).send({ reason: "접근 권한이 없습니다." });
		const samename = await db.Board.findOne({
			where: {name: req.body.name}
		});
		if (samename)
			return res.send("동일한 이름의 Board가 존재합니다.");
		let query = {}
		if (board.name !== req.body.name)
			query.name = req.body.name
		if (board.description !== req.body.description)
			query.description = req.body.description;
		if (board.background !== req.body.background)
			query.background = req.body.background;
		await db.Board.update(query, {
			where: {
				id: board.id,
				AdminId: req.user.id
			}
		}, {
			transaction: t
		});
		return res.send("done");
	} catch(e) {
		next(e);
	}
});

router.delete(`/kick/:boardName`, isLoggedIn, async (req, res, next) => {
	try {
		const t = await db.sequelize.transaction();
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		if (!board)
			return res.status(404).send('존재하지 않는 board입니다.');
		if (req.user.id !== board.AdminId)
			return res.status(401).send("접근 권한이 없습니다.");
		const kickUser = await db.BoardMember.findOne({
			where: {
				BoardId: board.id,
				username: req.query.username
			}
		}, {
			transaction: t
		});
		if (!kickUser || kickUser.UserId === board.AdminId || kickUser.UserId === req.user.id)
			return res.status(401).send("잘못된 접근입니다.");
		await db.BoardMember.destroy({
			where: {
				BoardId: board.id,
				username: req.query.username,
				id: kickUser.id
			}
		}, {
			transaction: t
		});
		return res.send(req.query.username);
	} catch(e) {
		next(e);
	}
})

router.delete(`/quitBoard/:boardName`, isLoggedIn, async (req, res, next) => {
	try {
		const t = await db.sequelize.transaction();
		const board = await db.Board.findOne({
			where: {name: req.params.boardName}
		});
		if (!board)
			return res.status(404).send('존재하지 않는 board입니다.');
		if (req.user.id === board.AdminId)
			return res.status(401).send("일단 관리자는 탈퇴 불가능"); // 이후 수정
		await db.BoardMember.destroy({
			where: {
				BoardId: board.id,
				UserId: req.user.id,
			}
		}, {
			transaction: t
		});
		res.send("quit board");
	} catch (e) {
		next(e);
	}
});

module.exports = router;
