/**Dependencies */
const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { prisma } = require("./config/passport");
const indexRouter = require("./routes/indexRouter");
require("dotenv").config();

/**Initialisations */
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3 * 24 * 60 * 60 * 1000
    },
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
    )
}));



app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

require("./config/passport");

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`App started on port ${PORT}`));


