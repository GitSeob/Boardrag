const db = require("../models");
const { fn } = require('sequelize');
const multer = require('multer');
const path = require('path');

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
	if (!board)
		return {error: 404, reason: '존재하지 않는 board입니다.'};
	return (board);
};

db.BoardMember.getMyInfo = async (boardName, user) => {
	const board = await db.Board.checkBoardWithName(boardName);
	if (board.error)
		return {error: board.error, reason: board.reason };
	const member = await db.BoardMember.findOne({
		where: {
			BoardId: board.id,
			UserId: user.id
		}
	});
	if (!member)
		return {error: 401, reason: "해당 보드에 참여하지 않습니다."};
	return (member);
};


modules.boardPermissionCheck = async (boardName, user) => {
	const board = await db.Board.checkBoardWithName(boardName);
	if (board.error)
		return {error: board.error, reason: board.reason };
	if (board.AdminId !== user.id)
		return {error: 401, reason: '권한이 없습니다.'};
	return board;
};

modules.upload = multer({
	storage: multer.diskStorage({
		destination(req, file, done) {
			done(null, `uploads${req.query.type === 'upload' ? "" : `/${req.query.type}`}`);
		},
		filename(req, file, done){
			let ext = path.extname(file.originalname);
			let savename;
			console.log(req.query);
			const boardName = encodeURIComponent(req.query.name);

			if (req.query.type === 'upload')
			{
				let basename = req.query.board + "_" + req.query.contentName + "_";
				savename = basename + new Date().format("yyyy-MM-dd_hh:mm:ss") + ext;
			}
			else if (req.query.type === 'background')
				savename = boardName + "_bg_image:::not_save:::" + ext;
			else if (req.query.type === 'profile')
				savename = boardName + "_" + req.user.username + ":::not_save:::" + ext;
			savename = savename.replace(/\s/g, "_");
			done(null, savename);
		}
	}),
	limits: {fileSize: 20*1024*1024},
});

modules.createAndUpdate = async (Model, req) => {
	const board = await db.Board.checkBoardWithName(req.params.boardName);
	if (board.error)
		return {error: board.error, reason: board.reason };
	const member = await db.BoardMember.getMyInfo(req.params.boardName, req.user);
	if (member.error)
		return {error: member.error, reason: member.reason };

	const availBlocks = await member.avail_blocks - (req.body.width * req.body.height);
	if (availBlocks < 0)
		return {error: 403, reason: `생성 가능한 블록 수는 ${member.avail_blocks}입니다.`}

	const t = await db.sequelize.transaction();
	const now = new Date();

	const insertDatas = {
		x: req.body.x,
		y: req.body.y,
		width: req.body.width,
		height: req.body.height,
		expiry_date: board.expiry_times ? now.setDate(now.getDate() + board.expiry_times) : null,
		BoardMemberId: member.id,
		BoardId: board.id,
	}

	if (Model === db.TextContent)
		insertDatas.content = req.body.content;
	else if (Model === db.Image)
		insertDatas.url = req.body.url;
	else if (Model === db.Note)
	{
		insertDatas.head = req.body.head;
		insertDatas.paragraph = req.body.paragraph;
		insertDatas.background_img = req.body.background_img;
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
		throw e;
	}
}

modules.updateBlock = async (Model, req) => {
	const member = await db.BoardMember.getMyInfo(req.params.boardName, req.user);
	if (member.error)
		return { error: member.error, reason: member.reason };

	const insertDatas = {
		x: req.body.x,
		y: req.body.y,
		width: req.body.width,
		height: req.body.height,
	};
	if (Model === db.TextContent)
		insertDatas.content = req.body.content;
	else if (Model === db.Image)
		insertDatas.url = req.body.url;
	else if (Model === db.Note)
	{
		insertDatas.head = req.body.head;
		insertDatas.paragraph = req.body.paragraph;
		insertDatas.background_img = req.body.background_img;
	}
	else
		throw new Error("Not an accepted model");

	const content = await Model.findOne({ where: {id: req.params.id }});
	if (!content)
		return { error: 404, reason: '콘텐츠가 존재하지 않습니다.' };


	if (member.id !== content.BoardMemberId && !req.user.is_admin)
		return { error: 401, reason: '권한이 없습니다.' };

	const oldSize = content.width * content.height;

	if (member.avail_blocks - ( req.body.width * req.body.height - oldSize ) < 0)
		return { error: 403, reason: `현재 추가 가능한 블록 수는 ${member.avail_blocks}입니다.` };

	const t = await db.sequelize.transaction();
	try {
		await Model.update(insertDatas, {
			where: {id: req.params.id},
			transaction: t
		});

		await db.BoardMember.increment({
			avail_blocks: oldSize - (req.body.width * req.body.height)
		}, {
			where: {id: content.BoardMemberId},
			transaction: t
		});

		await t.commit();
		if (req.body.width * req.body.height === oldSize)
			return false;
		return member.avail_blocks + oldSize - (req.body.width * req.body.height);
	} catch (e) {
		console.error(e);
		await t.rollback();
		throw e;
	}
}

modules.deleteBlock = async (Model, req) => {
	const member = await db.BoardMember.getMyInfo(req.params.boardName, req.user);
	if (member.error)
		return { error: member.errer, reason: member.reason };
	const content = await Model.findOne({
		where: {id: req.params.id}
	});
	if (!content)
		return {error: 404, reason: '콘텐츠가 존재하지 않습니다.'};

	if (member.id !== content.BoardMemberId && !req.user.is_admin)
		return {error: 401, reason: '권한이 없습니다.'};
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
};

module.exports = modules;
