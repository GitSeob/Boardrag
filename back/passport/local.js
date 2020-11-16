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
        console.log(codeValue, trashValue);
        try {
            console.log(codeValue, trashValue);
            const access_token = await axios.post(`${config.api_oauth_url}?code=${codeValue}&grant_type=authorization_code&client_id=${config.api_client_id}&client_secret=${config.api_client_secret}&redirect_uri=${config.api_redirect_uri}`).then(res => {
                return res.data.access_token;
            }).catch(e => {
                return done(null, false, { reason: 'not available code value please retry login.'});
            });

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
            else {
                if (user_in_db.access_token !== access_token)
                    user_in_db = await db.User.update({
                        access_token: access_token
                    },{
                        where: {id : user_in_db.id}
                    })
                return done(null, user_in_db);
            }
        } catch (e) {
            return done(e);
        }
    }))
    //         const result = await axios.get(`${config.api_url}/me?access_token=${access_token}`).then(res => {
    //             return res.data;
    //         }).catch(e => {
    //             return done(null, false, { reason: '유효하지않은 토큰입니다.' });
    //         });
    //         return done(null, result);
    //     } catch (e) {
    //         console.error(e);
    //         return done(e);
    //     }
    // }))
}
