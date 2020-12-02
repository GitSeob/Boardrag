const passport = require("passport");
const local = require("./local");
const db = require("../models");

module.exports = () => {
    passport.serializeUser((user, done) => {
        console.log(user);
        return done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await db.User.findOne({
                where: {id},
            });
            return done(null, user);
        } catch (e) {
            console.error(e);
            return done(e);
        }
    })

    local();
}
