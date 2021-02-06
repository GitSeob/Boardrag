const db = require("../models");
const { fn } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = process.env.NODE_ENV || "development";

const modules = {}
String.prototype.string = function(len) {var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len) {return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len) {return this.toString().zf(len);};

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

db.Board.checkBoardWithName = async (boardName) => {
	const board = await db.Board.findOne({
		where: {name: boardName}
	});
	return (board);
};

db.BoardMember.getMyInfo = async (boardName, user) => {
	const board = await db.Board.checkBoardWithName(boardName);
	if (!board)
		throw new Error("Can not find board");
	const member = await db.BoardMember.findOne({
		where: {
			BoardId: board.id,
			UserId: user.id
		}
	});
	return (member);
};

modules.createAndUpdate = async (datas, board, member, Model) => {
	const availBlocks = await member.avail_blocks - (datas.width * datas.height);
	if (availBlocks < 0)
		return -1;
	const t = await db.sequelize.transaction();
	const now = new Date();
	const insertDatas = {
		x: datas.x,
		y: datas.y,
		width: datas.width,
		height: datas.height,
		expiry_date: board.expiry_times ? now.setDate(now.getDate() + board.expiry_times) : null,
		BoardMemberId: member.id,
		BoardId: board.id,
	}

	if (Model === db.TextContent)
		insertDatas.content = datas.content;
	else if (Model === db.Image)
		insertDatas.url = datas.url;
	else if (Model === db.Note)
	{
		insertDatas.head = datas.head;
		insertDatas.paragraph = datas.paragraph;
		insertDatas.background_img = datas.background_img;
	}
	else
		throw new Error("Not an accepted model");

	try {
		await Model.create(insertDatas, {
			transaction: t
		});
		await db.BoardMember.update({
			avail_blocks: availBlocks
		}, {
			where: {id: member.id},
			transaction: t
		});
		await db.Board.update({
			recent_time: fn('NOW')
		},{
			where: {id: board.id},
			transaction: t
		});
		await t.commit();
		return availBlocks;
	} catch (e) {
		console.error(e);
		await t.rollback();
		return -2;
	}
}

modules.BoardPermissionCheck = async (boardName, user) => {
	const board = await db.Board.checkBoardWithName(boardName);
	if (!board)
		throw new Error("Can not find board");
	return (board.AdminId === user.id);
};

modules.upload = multer({
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

modules.uploadBoardImage = multer({
	storage: multer.diskStorage({
		destination(req, file, done) {
			done(null, 'board_bgs')
		},
		filename(req, file, done){
			const ext = path.extname(file.originalname);
			let savename = req.query.name + "_bg_image:::not_save:::" + ext;
			savename = savename.replace(/\s/g, "_");
			done(null, savename);
		}
	}),
	limits: {fileSize: 20*1024*1024},
});

modules.uploadProfileImage = multer({
	storage: multer.diskStorage({
		destination(req, file, done) {
			done(null, 'board_profileImages')
		},
		filename(req, file, done){
			const ext = path.extname(file.originalname);
			let savename = req.query.name + "_" + req.user.username + ":::not_save:::" + ext;
			savename = savename.replace(/\s/g, "_");
			done(null, savename);
		}
	}),
	limits: {fileSize: 4*1024*1024},
});

modules.deleteFile = async (dir, filename) => {
	const delURL = env === 'development' ? "http://localhost:3095/" : "https://api.42board.com/";
	const log_time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	const file = `./${filename.indexOf(dir) ? "uploads/" : ""}${filename.replace(delURL, "")}`;
	console.log(file);
	fs.unlink(`./${file}`, () => {
		return;
	});
	fs.appendFileSync('./logs/delete_files.txt', `${log_time} >> delete image\t\t ${file}\n`);
}

modules.deleteBlock = async (Model, req) => {
	const member = await db.BoardMember.getMyInfo(req.params.boardName, req.user);
	if (!member)
		return { error: 404, reason: '참여하지 않은 유저입니다.' };
	const content = await Model.findOne({
		where: {id: req.params.id}
	});
	if (!content)
		return {error: 404, reason: '콘텐츠가 존재하지 않습니다.'};

	if (member.id !== content.BoardMemberId && !req.user.is_admin)
		return {error: 401, reason: '다른 사람의 게시물을 삭제할 수 없습니다.'};
	const size = content.width * content.height;
	const t = await db.sequelize.transaction();
	try {
		await Model.destroy({
			where: {id: req.params.id },
			transaction: t
		});
		await db.BoardMember.increment({
			avail_blocks: size
		}, {
			where: { id: content.BoardMemberId },
			transaction: t
		});
		await t.commit();
		return content;
	} catch(e) {
		await t.rollback();
		throw e;
	}
}

module.exports = modules;
