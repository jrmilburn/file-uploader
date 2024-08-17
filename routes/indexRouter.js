const { prisma, passport } = require("../config/passport"); 
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");

const indexRouter = Router();
const upload = multer();

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

indexRouter.get("/log-in", async (req, res) => {
    res.render("log-in");
});

indexRouter.post("/log-in", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in"
}),async (req, res) => {

})

indexRouter.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;

        console.log(file);

        if(!file) {
            return res.status(400).send("No file uploaded");
        }

        const savedFile = await prisma.file.create({
            data: {
                name: file.originalname,
                mimeType: file.mimetype,
                data: file.buffer,
            },
        });

        res.status(200).json({ message: "File uploaded successfully", fileId: savedFile.id });

        const files = await prisma.file.findMany();
        console.log(files);

    } catch(err) {
        res.status(500).send("Server error");
    }
})

module.exports = indexRouter;
