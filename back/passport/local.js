const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const axios = require('axios');

const db = require('../models');
const { User } = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'access_token'
    }, async (username, password, done) => {
        try {
            const user = await User.findOne({
                where: { username }
            });
            if (!user) {
                return done(null, false, { reason: '다시 로그인해주시기바랍니다.' });
            }
            const result = await axios.get(`${config.api_url}/me?access_token=${access_token}`).then(res => {
                return res.data;
            }).catch(e => {
                return done(null, false, { reason: '유효하지않은 토큰입니다.' });
            });
            return done(null, result);
        } catch (e) {
            console.error(e);
            return done(e);
        }
    }))
}
