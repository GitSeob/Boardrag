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

app.use("/api", apiRouter);
app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


const server = app.listen(app.get("PORT"), () => {
    console.log(`listening on port ${app.get("PORT")}`);
});

webSocket(server, app);
