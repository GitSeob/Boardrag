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
		if (!codeValue)
			return done(null, false, {reason: 'code value is undefined'});

		const t = await db.sequelize.transaction();

		try {
			let access_token;
			let refresh_token;

			await axios.post(`https://www.googleapis.com/oauth2/v4/token?code=${codeValue}&client_id=${config.google_cid}&client_secret=${config.google_secret}&redirect_uri=${config.google_redirect_uri}&grant_type=authorization_code`).then(res => {
				access_token = res.data.access_token;
				refresh_token = res.data.refresh_token;
			}).catch(e => {
				console.error(e.response.data);
			});
			if (!access_token || !refresh_token)
				return done(null, false, { reason: '로그인 에러' });

			const oauthGoogleUrlAPI = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="

			const user_data = await axios.get(`${oauthGoogleUrlAPI}${access_token}`).then(res => {
				return res.data;
			}).catch(e => {
				console.error(e);
				throw e;
			});
			if (!user_data) {
				return done(null, false, { reason: '다시 로그인해주시기바랍니다.' });
			}

			const [user, created] = await db.User.findOrCreate({
				where: {email: user_data.email},
				defaults: {
					email: user_data.email,
					profile_img: user_data.picture,
					access_token: access_token,
					refresh_token: refresh_token,
					is_admin: false
				},
				transaction: t
			})

			await t.commit();
			return done(null, user);
		} catch (e) {
			console.error(e);
			await t.rollback();
			return done(e);
		}
	}))
}
