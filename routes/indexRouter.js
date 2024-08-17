const { prisma, passport } = require("../config/passport"); 
const { Router } = require("express");
const bcrypt = require("bcryptjs");

const indexRouter = Router();

async function main() {
    const users = await prisma.user.findMany();
    console.log(users);
}

main()



indexRouter.get("/", (req, res) => {
    res.render("index");
});

indexRouter.get("/sign-up", (req, res) => {
    res.render("sign-up");
});

indexRouter.post("/sign-up", async (req, res) => {

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Server error");
        }

        try {
            // Check if the username already exists
            const existingUser = await prisma.user.findUnique({
                where: {
                    username: req.body.username,
                },
            });

            if (existingUser) {
                // Handle the case where the username is already taken
                return res.status(400).send("Username already taken");
            }

            // Create a new user if the username is not taken
            const user = await prisma.user.create({
                data: {
                    username: req.body.username,
                    password: hashedPassword,
                },
            });

            res.redirect("/");

        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });
});

indexRouter.get("/log-in", async (req, res) => {
    res.render("log-in");
});

indexRouter.post("/log-in", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in"
}),async (req, res) => {

})

module.exports = indexRouter;
