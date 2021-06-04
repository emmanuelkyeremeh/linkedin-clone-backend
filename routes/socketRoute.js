import Post from "../models/PostModel.js";
export const socketRoute = (io) => {
  io.on("connection", async (socket) => {
    console.log("User connected");
    socket.emit("kepler", { message: "pipe" });

    socket.on("createPost", async (post) => {
      const { userId, time, caption, postImage, postImage_filename } = post;
      const createPost = new Post({
        userId: userId,
        time: time,
        caption: caption,
        image: postImage,
        image_filename: postImage_filename,
      });
      const newPost = await createPost.save();
      socket.emit("createPostSuccess", newPost);
    });
  });
};
