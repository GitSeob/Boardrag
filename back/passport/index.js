const passport = require("passport");
const local = require("./local");
const db = require("../models");

module.exports = () => {
    passport.serializeUser((user, done) => {
        return done(null, user);
    });

    passport.deserializeUser(async (user, done) => {
        try {
            // const user = await db.User.findOne({
            //     where: {id},
            // });
            return done(null, user);
        } catch (e) {
            return done(e);
        }
    })

    local();
}
