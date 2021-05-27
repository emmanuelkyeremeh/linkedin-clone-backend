import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import Grid from "gridfs-stream";
import UserRouter from "./routes/UserRouter.js";
import fileRouter from "./routes/fileRouter.js";
import { Server } from "socket.io";
import { createServer } from "http";

const server = createServer();

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

app.use((err, req, res, next) => [
  res.status(500).send({ message: err.message }),
]);

app.use("/api/users", UserRouter);
app.use("/api/file", fileRouter);

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on("error", () => {
  console.error.bind(console, "Error: ");
});

export let GridFs;
export let GridFsBucket;

connection.once("open", () => {
  console.log("Connected successfully!");

  GridFsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: "uploads",
  });

  GridFs = Grid(connection.db, mongoose.mongo);
  GridFs.collection("uploads");
});

app.get("/", (req, res) => {
  res.send("Server Ready!");
});

server.listen(PORT, () => console.log(`Express app listening on port ${PORT}`));
