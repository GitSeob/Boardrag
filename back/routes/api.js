
// const { Op } = require("sequelize");
const express = require("express");
// const passport = require("passport");
const bcrypt = require("bcrypt");
const axios = require("axios");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

// const { sequelize } = require("../models");
const router = require(".");

router.get('auth', async (req, res, next) => {
    res.status(400).send({
        message: "Bad Request: codeValue is not defined"
    });
})

router.get('/auth/:codeValue', async (req, res, next) => {
    if (!req.params.codeValue) {
        res.status(203).send({message: "Non-Authoritative Information"})
    }
    try {
        const access_token = await axios.post(`${config.api_oauth_url}?code=${req.params.codeValue}&grant_type=authorization_code&client_id=${config.api_client_id}&client_secret=${config.api_client_secret}&redirect_uri=${config.api_redirect_uri}`).then(res => {
            return res.data.access_token;
        }).catch(e => {
            res.status(401).send({ message: 'not available code value please retry login.'});
        });
        const user_data = await axios.get(`${config.api_url}/me?access_token=${access_token}`).then(res => {
            return res.data;
        }).catch(e => {
            res.status(401).send({ message: '42api server was unable to send valid data.'})
        });
        res.send(user_data);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
