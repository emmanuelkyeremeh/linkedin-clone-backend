import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";
export const socketRoute = (io) => {
  const changeStream = Post.watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const task = change.fullDocument;
      io.emit("createPostSuccess", {
        id: task._id,
        userId: task.userId,
        time: task.time,
        caption: task.caption,
        image: task.postImage,
        image_filename: task.postImage_filename,
      });
    }
  });
  io.on("connection", async (socket) => {
    const posts = await Post.find();
    io.emit("getPosts", posts);

    const users = await User.find();
    socket.emit("users", users);

    // socket.on("getUsers", async () => {
    //   socket.emit("socket recieved");
    //   const Users = await User.find();
    //   socket.emit("users", Users);
    //   console.log(messageUsers);
    // });

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
      // io.emit("createPostSuccess", newPost);
    });
    socket.on("newMessage", (newMessage) => {
      console.log(newMessage);
      socket.emit("message recieved!");
    });
  });
};
