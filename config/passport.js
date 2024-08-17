const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const verifyCallback = async (username, password, done) => {

    try {

        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        if(!user) {
            return done(null, false, { message: "Incorrect username" });
        }

        const match = await bcrypt.compare(password, user.password);

        if(!match) {
            return done(null, false, { message: "Incorrect password" });
        }

    return done(null, user);

    } catch(err) {
        return done(err);
    }

};

const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
    
        const user = await prisma.user.findUnique({
            where: { id: id },
        });

        if(!user) {
            return done(new Error("User not found"));
        }

        done(null, user);
        
    } catch(err) {
        done(err);
    }
});

module.exports = {
    passport,
    prisma
};