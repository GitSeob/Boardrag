
// const { Op } = require("sequelize");
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const axios = require("axios");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

// const { sequelize } = require("../models");
const router = require(".");
const db = require("../models");

const { isNotLoggedIn, isLoggedIn } = require("./middleware");

router.get('/auth', isNotLoggedIn, async (req, res, next) => {
    console.log(req.user);
})

router.post('/auth', isNotLoggedIn, async (req, res, next) => {
    passport.authenticate('local', (e, user, info) => {
        console.log(info);
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
                    attributes: ['id', 'username', 'profile_img', 'is_admin', 'access_token']
                });
                return res.json(userInfo);
            } catch (e) {
                console.error(e);
                next(e);
            }
        })
    })(req, res, next);
});

module.exports = router;
