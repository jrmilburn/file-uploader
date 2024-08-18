const { Router }= require("express");
const multer = require("multer");
const { prisma } = require("../config/passport"); 

const uploadRouter = Router({mergeParams: true});
const upload = multer();

uploadRouter.get("/", async (req, res) => {

    const folderId = req.params.id;
    const folder = await prisma.folder.findUnique({
        where: { id: folderId },
    });

    res.render("upload-file", {
        folder: folder
    });
})

uploadRouter.post("/", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        const folderId = req.params.id;

        if(!file) {
            return res.status(400).send("No file uploaded");
        }

        const folder = await prisma.folder.findUnique({
            where: { id: folderId },
        });

        const savedFile = await prisma.file.create({
            data: {
                name: file.originalname,
                mimeType: file.mimetype,
                data: file.buffer,
                folderId: folder.id,
                userId: req.user.id
            },
        });

        res.redirect(`/folders/${folderId}`);

    } catch(err) {
        res.status(500).send("Server error");
    }
})

module.exports = uploadRouter;