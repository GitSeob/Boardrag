const Sequelize = require("sequelize");

//////// DB Models require
const user = require('./user');
const text = require('./text');
const component = require('./component');
const comment = require('./comment');

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	maxConcurrentQueries: 100,
	dialect: config.dialect,
	pool: { maxConnections: 5, maxIdleTime: 30},
});

//////// DB that import from require connect to db var
db.User = user;
db.Text = text;
db.Component = component;
db.Comment = comment;

Object.keys(db).forEach((modelName) => {
    db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
