import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
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

connection.once("open", () => {
  console.log("Connected successfully!");
});

app.get("/", (req, res) => {
  res.send("Server Ready!");
});

app.listen(PORT, () => console.log(`Express app listening on port ${PORT}`));
