const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const axios = require('axios');
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

var GoogleStrategy = require('passport-google-oauth20').Strategy

const db = require('../models');

module.exports = () => {
	passport.use(new LocalStrategy({
		usernameField: "codeValue",
		passwordField: "trashValue",
	}, async (codeValue, trashValue, done) => {
		try {
			let access_token;
			let refresh_token;
			await axios.post(`https://www.googleapis.com/oauth2/v4/token?code=${codeValue}&client_id=${config.google_cid}&client_secret=${config.google_secret}&redirect_uri=${"http://localhost:3090/auth"}&grant_type=authorization_code`, {

			}, {
				headers: {"Content-Type": "application/x-www-form-urlencoded"}
			}).then(res => {
				access_token = res.data.access_token;
				refresh_token = res.data.refresh_token;
			}).catch(e => {
				return done(null, false, { reason: 'not available code value please retry login.'});
			});
			if (!access_token || !refresh_token)
				return done(null, false, { reason: 'not available code value please retry login.'});
			const oauthGoogleUrlAPI = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="

			const user_data = await axios.get(`${oauthGoogleUrlAPI}${access_token}`).then(res => {
				return res.data;
			}).catch(e => {
				return done(null, false, { reason: '42api server was unable to send valid data.'});
			});
			if (!user_data) {
				return done(null, false, { reason: '다시 로그인해주시기바랍니다.' });
			}
			const user_in_db = await db.User.findOne({
				where: {
					email: user_data.email
				}
			});
			if (!user_in_db) {
				const newUser = await db.User.create({
					email: user_data.email,
					profile_img: user_data.picture,
					is_admin: false,
					access_token: access_token,
					refresh_token: refresh_token
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
