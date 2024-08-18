const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { prisma } = require("../config/passport");

const signUpRouter = Router();

signUpRouter.get("/", (req, res) => {
    res.render("sign-up");
});

signUpRouter.post("/", async (req, res) => {

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
                return res.redirect('/sign-up');
            }

            // Create a new user if the username is not taken
            const user = await prisma.user.create({
                data: {
                    username: req.body.username,
                    password: hashedPassword,
                },
            });

            res.redirect("/log-in");

        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });
});

module.exports = signUpRouter;