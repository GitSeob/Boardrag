const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const axios = require('axios');
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const db = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: "codeValue",
        passwordField: "trashValue",
    }, async (codeValue, trashValue, done) => {
        try {
            const access_token = await axios.post(`${config.api_oauth_url}?code=${codeValue}&grant_type=authorization_code&client_id=${config.api_client_id}&client_secret=${config.api_client_secret}&redirect_uri=${config.api_redirect_uri}`).then(res => {
                return res.data.access_token;
            }).catch(e => {
                return done(null, false, { reason: 'not available code value please retry login.'});
            });
            if (!access_token)
                return done(null, false, { reason: 'not available code value please retry login.'});
            const user_data = await axios.get(`${config.api_url}/me?access_token=${access_token}`).then(res => {
                return res.data;
            }).catch(e => {
                return done(null, false, { reason: '42api server was unable to send valid data.'});
            });
            if (!user_data) {
                return done(null, false, { reason: '다시 로그인해주시기바랍니다.' });
            }
            const user_in_db = await db.User.findOne({
                where: {
                    username: user_data.login
                }
            });
            if (!user_in_db) {
                const newUser = await db.User.create({
                    username: user_data.login,
                    profile_img: user_data.image_url,
                    is_admin: false,
                    access_token: access_token,
                })
                return done(null, newUser);
            }
            const updateUser = await db.User.update({
                access_token: access_token
            },{
                where: {id : user_in_db.id}
            })
            if (!updateUser)
                return done(null, false, {reason: 'update Error'});
            return done(null, await db.User.findOne({ where: {id: user_in_db.id }}));

        } catch (e) {
            return done(e);
        }
    }))
}
