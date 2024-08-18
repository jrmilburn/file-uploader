const { Router }= require("express");
const { passport } = require("../config/passport");

const logInRouter = Router();

logInRouter.get("/", async (req, res) => {
    res.render("log-in");
});

logInRouter.post("/", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in"
}),async (req, res) => {

})

module.exports = logInRouter;