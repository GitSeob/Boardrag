
// const { Op } = require("sequelize");
const express = require("express");
// const passport = require("passport");
const bcrypt = require("bcrypt");
const axios = require("axios");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

// const { sequelize } = require("../models");
const router = require(".");

router.get('/auth/:codeValue', async (req, res, next) => {
    if (!req.params.codeValue) {
        res.status(203).send({message: "Non-Authoritative Information"})
    }
    try {
        const access_token = await axios.post(`${config.api_oauth_url}?code=${req.params.codeValue}&grant_type=authorization_code&client_id=${config.api_client_id}&client_secret=${config.api_client_secret}&redirect_uri=${config.api_redirect_uri}`).then(res => {
            return res.data;
        });
        res.send({access_token: access_token});
    } catch (error) {
        next(error);
    }
})

module.exports = router;
