const { Router } = require("express");
const { prisma } = require("../config/passport");
const uploadRouter = require("./uploadRouter");

const foldersRouter = Router();
const fileRouter = Router();

foldersRouter.get("/", async (req, res) => {

    const userId = req.user.id;

    try {
        const folder = await prisma.folder.findMany({
            where: {
                userId,
            },
            include: { files: true },
        });

        res.render("folders", {
            folders: folder,
        });

        res.status(201);
    } catch(err) {
        console.error(err);
        res.status(500);
    }

})

foldersRouter.get("/create", async (req, res) => {

    res.render("create-folder", {

    });
})

foldersRouter.post("/create", async (req, res) => {

    const { name } = req.body;
    const userId = req.user.id;

    try {

        const folder = await prisma.folder.create({
            data: {
                name,
                userId
            },
        });

        res.status(201);

    } catch(err) {
        console.error(err);
        res.status(500);
    }

    res.redirect("/folders");

})

foldersRouter.get("/:id", async (req, res) => {

    try {
        const folder = await prisma.folder.findUnique({
            where: {
                id: req.params.id,
            }
        })

        const files = await prisma.file.findMany({
            where: {
                folderId: folder.id
            }
        })

        res.render("folder", {
            folder: folder,
            files: files,
        })

    } catch (err) {
        console.error(err);
    }

})

foldersRouter.get("/:id/delete", async (req, res) => {
    try {

        const files = await prisma.file.deleteMany({
            where: {
                folderId: req.params.id,
            }
        })

        const folder = await prisma.folder.delete({
            where: {
                id: req.params.id,
            }
        });

        res.redirect("/folders");

    } catch (err) {
        console.log(err);
    }
})

foldersRouter.use("/:id/upload", uploadRouter);

foldersRouter.use("/:id/files/", fileRouter);

module.exports = foldersRouter;