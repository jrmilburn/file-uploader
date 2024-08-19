const { prisma } = require("../config/passport");
const { Router } = require("express");

const shareRouter = Router();

shareRouter.get("/:id", async (req, res) => {
    try {
        const sharedFolderId = req.params.id;

        console.log(sharedFolderId);

        // Use findUnique to fetch the shared folder
        const sharedFolder = await prisma.sharedFolder.findUnique({
            where: {
                id: sharedFolderId
            },
            include: {
                folder: true
            }
        });

        // Check if the shared folder exists and if the link has expired
        if (!sharedFolder || sharedFolder.expiresAt < new Date()) {
            return res.status(404).send('This link has expired or is invalid');
        }

        // Retrieve files associated with the folder
        const files = await prisma.file.findMany({
            where: {
                folderId: sharedFolder.folderId,
            }
        });

        // Render the shared folder view
        res.render('shared-folder', {
            folder: sharedFolder.folder,
            files: files
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while trying to access the shared folder.");
    }
});

module.exports = shareRouter;
