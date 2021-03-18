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
const { runSchduler } = require('./file_modules');
dotenv.config();

axios.defaults.withCredentials = true;

const { sequelize } = require("./models");
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
	},
};

if (prod) {
	sessionOption.cookie.secure = true;
	sessionOption.cookie.proxy = true;
}

app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRouter);
app.get("*", (req, res, next) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = app.listen(app.get("PORT"), () => {
	console.log(`listening on port ${app.get("PORT")}`);
});

// 일정 주기마다 각 콘텐츠들이 만료되었는지 확인하고
// 만료되었으면 삭제해주며 이미지를 포함하고 있으면
// 로컬 디렉터리 내의 이미지 파일도 같이 삭제해주는 스케쥴러
// runSchduler();
// 기존 데이터들 스케쥴러로 삭제하지 않고 보존하기 위해 일단 주석 처리

webSocket(server, app);
