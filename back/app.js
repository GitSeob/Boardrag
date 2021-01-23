const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const hpp = require("hpp");
const helmet = require("helmet");
const passport = require("passport");
const axios = require('axios');
const schedule = require('node-schedule');
const fs = require('fs');
const env = process.env.NODE_ENV || "development";

dotenv.config();

axios.defaults.withCredentials = true;

const { TextContent, Note, Image ,sequelize, Sequelize } = require("./models");
const passportConfig = require('./passport');
const apiRouter = require("./routes/api");
const webSocket = require("./socket");

const app = express();
app.set("PORT", process.env.PORT || 3095);
sequelize.sync()
	.then(() => {
		console.log('✓ DB connection success.');
		console.log('  Press CTRL-C to stop\n');
	})
	.catch(err => {
		console.error(err);
		console.log('✗ DB connection error. Please make sure DB is running.');
		process.exit();
});
passportConfig();

const prod = process.env.NODE_ENV === "production";

app.use(express.static(path.join(__dirname, "public")));

if (prod) {
	app.enable("trust proxy");
	app.use(morgan("combined"));
	app.use(helmet({ contentSecurityPolicy: false }));
	app.use(hpp());
	app.use(cors({
		origin: true,
		credentials: true,
	}))
} else {
	app.use(morgan("dev"));
	app.use(
		cors({
			origin: true,
			credentials: true,
		})
	);
}

app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use('/board_bgs', express.static(path.join(__dirname, 'board_bgs')));
app.use('/board_profileImages', express.static(path.join(__dirname, 'board_profileImages')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
	resave: false,
	saveUninitialized: false,
	secret: process.env.COOKIE_SECRET,
	cookie: {
		httpOnly: true,
		// domain 쓰면 안된다.
	},
};

if (prod) {
	sessionOption.cookie.secure = true;
	sessionOption.cookie.proxy = true;
}

app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

const deleter = schedule.scheduleJob('0 0 * * * *', async () => {
	console.log("run scheduler...");
	const t = await sequelize.transaction();
	const now = new Date();
	const delURL = env === 'development' ? "http://localhost:3095/" : "https://api.42board.com/";
	const deleteIds = {
		text: [],
		note: [],
		image: [],
	};
	const deleteUrl = {
		image: [],
		note: [],
	};

	await TextContent.findAll({
		where: {
			expiry_date: {
				[Sequelize.Op.lte]: now,
				[Sequelize.Op.ne]: null
			}
		},
		attributes: ["id"],
	}, {
		transaction: t
	}).then(res => {
		res.forEach(elem => {
			deleteIds.text.push(elem.id);
		});
	});
	await Image.findAll({
		where: {
			expiry_date: {
				[Sequelize.Op.lte]: now,
				[Sequelize.Op.ne]: null
			}
		},
		attributes: ["id", "url"],
	}, {
		transaction: t
	}).then(res => {
		res.forEach(elem => {
			deleteIds.image.push(elem.id);
			deleteUrl.image.push(elem.url);
		});
	});
	await Note.findAll({
		where: {
			expiry_date: {
				[Sequelize.Op.lte]: now,
				[Sequelize.Op.ne]: null
			}
		},
		attributes: ["id", "background_img"],
	}, {
		transaction: t
	}).then(res => {
		res.forEach(elem => {
			deleteIds.note.push(elem.id);
			if (elem.background_img)
				deleteUrl.note.push(elem.background_img);
		});
	});

	if (!(deleteIds.text.length === 0 && deleteIds.image.length === 0 && deleteIds.note.length === 0))
	{
		if (deleteIds.text.length > 0)
			await TextContent.destroy({
				where: {
					id: deleteIds.text
				}
			}, {
				transaction: t
			});
		if (deleteIds.note.length > 0)
		{
			await Note.destroy({
				where: {
					id: deleteIds.note
				}
			}, {
				transaction: t
			});
			if (deleteUrl.note.length > 0)
				await deleteUrl.note.forEach(elem => {
					console.log("delete => ", elem);
					fs.unlink(`./uploads/${elem.replace(delURL, "")}`, () => {
						return;
					});
				});
		}
		if (deleteIds.image.length > 0)
		{
			await Image.destroy({
				where: {
					id: deleteIds.image
				}
			}, {
				transaction: t
			});
			await deleteUrl.image.forEach(elem => {
				console.log("delete => ", elem);
				fs.unlink(`./uploads/${elem.replace(delURL, "")}`, () => {
					return;
				});
			});
		}
	}

	const availFiles = [];

	await Image.findAll({
		attributes: ["url"]
	}).then(res => {
		availFiles.push(res.url);
	})
	await Note.findAll({
		attributes: ["background_img"]
	}).then(res => {
		if (res.background_img)
			availFiles.push(res.background_img);
	})
	if (availFiles.length > 0)
	{
		fs.readdir("./uploads", (error, filelist) => {
			filelist.filter(elem => !(availFiles.find(file => file === elem))).forEach(e => {
				console.log("delete => ", e);
				fs.unlink(`./uploads/${e.replace(delURL, "")}`, () => {
					return;
				});
			})
		});
	}
});

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

app.use("/api", apiRouter);
app.get("*", (req, res, next) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = app.listen(app.get("PORT"), () => {
	console.log(`listening on port ${app.get("PORT")}`);
});

webSocket(server, app);
