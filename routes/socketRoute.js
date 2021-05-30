import { io } from "../server.js";

io.on("connection", (socket) => {
  console.log("User connected");
  socket.emit("kepler", { message: "pipe" });
});
