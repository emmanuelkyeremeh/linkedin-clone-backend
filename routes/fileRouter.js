import express from "express";
import expressAsyncHandler from "express-async-handler";
import GridFsStorage from "multer-gridfs-storage";
import multer from "multer";
import dotenv from "dotenv";
import { GridFs } from "../server.js";
import { GridFsBucket } from "../server.js";
dotenv.config();

const fileRouter = express.Router();

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "uploads",
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage: storage });

fileRouter.post(
  "/",
  upload.single(image),
  expressAsyncHandler((req, res) => {
    res.status(200).send("Image Added!!!!!!");
  })
);

fileRouter.get(
  "/:filename",
  expressAsyncHandler((req, res) => {
    await GridFs.files.findOne(
      { filename: req.params.filename },
      (err, file) => {
        if (!file || file.length === 0) {
          return res.status(404).json({
            err: "No files exist",
          });
        } else if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png"
        ) {
          const readStream = GridFsBucket.openDownloadStreamByName(
            file.filename
          );
          let data = "";
          readStream.on("data", (chunk) => {
            data += chunk.toString("base64");
          });
          readStream.on("end", () => {
            res.send(data);
          });
        } else {
          res.status(404).json({
            err: "Not an image",
          });
        }
      }
    );
  })
);

fileRouter.delete(
  "/:filename",
  expressAsyncHandler((req, res) => {
    await GridFs.remove(
      { filename: req.params.filename, root: "uploads" },
      (error, files) => {
        if (error) {
          res.status(404).send("An error occured");
        } else {
          res.send("Post Deleted!");
        }
      }
    );
  })
);

export default fileRouter;
