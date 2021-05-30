export const socketRoute = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected");
    socket.emit("kepler", { message: "pipe" });
  });
};
