const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const axios = require("axios");
// const { Op } = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const get_token_url = `${config.api_url}/me?access_token=`

// const { sequelize } = require("../models");
const router = require(".");
const db = require("../models");

const { isNotLoggedIn, isLoggedIn } = require("./middleware");

router.get('/auth', isLoggedIn, async (req, res, next) => {
    try {
        if (!req.user)
            res.status(202).send({ reason: "before created cookie" });
        const userInfo = await db.User.findOne({
            where: {id: req.user.id},
            attributes: ['id', 'username', 'profile_img', 'is_admin', 'access_token']
        });
        if (new Date().getTime() > new Date(userInfo.access_token).getTime() + 7200 )
            res.status(401).send({ reason: "만료된 토큰입니다." });
        // const get_user_42api = await axios.get(get_token_url + userInfo.access_token).then(res => {
        //     return res.data;
        // }).catch(e => {
        //     res.status(401).send({ reason: "만료된 토큰입니다." });
        // })
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
