const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};


const sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		maxConcurrentQueries: 100,
		dialect: 'mysql',
		pool: { maxConnections: 5, maxIdleTime: 30},
	}
);


//////// DB Models require
const user = require('./user');
const textContent = require('./textContent');
const note = require('./note');
const comment = require('./comment');
const image = require('./image');
const board = require('./board');
const boardMember = require('./boardMember');
const chat = require('./chat');

//////// DB that import from require connect to db var
db.User = user;
db.TextContent = textContent;
db.Note = note;
db.Comment = comment;
db.Image = image;
db.Board = board;
db.BoardMember = boardMember;
db.Chat = chat;

Object.keys(db).forEach(async (modelName) => {
	await db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
