const { prisma, passport } = require("../config/passport"); 
const { Router } = require("express");
const express = require("express");
const bcrypt = require("bcryptjs");

const indexRouter = Router();
const signUpRouter = require("./signUpRouter");
const logInRouter = require("./logInRouter");
const foldersRouter = require("./foldersRouter");

async function main() {
    const users = await prisma.user.findMany();
    console.log(users);
}

main()



indexRouter.get("/", (req, res) => {
    res.render("index", {
        user: req.user
    });
});

indexRouter.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        res.redirect("/");
    });
})

indexRouter.use("/sign-up", signUpRouter);
indexRouter.use("/log-in", logInRouter);
indexRouter.use("/folders", foldersRouter);


module.exports = indexRouter;
