import { io } from "../server.js";

const pipe = "pipe";

io.on("connection", (socket) => {
  socket.emit("connect", pipe);
});
