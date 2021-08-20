import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";
import Message from "../models/MessageModel.js";

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

    socket.on("createPost", async (post) => {
      const { userId, time, caption, postImage, postImage_filename } = post;
      const createPost = new Post({
        userId: userId,
        time: time,
        caption: caption,
        image: postImage,
        image_filename: postImage_filename,
      });
      await createPost.save();
    });
    socket.on("newMessage", async (newMessage) => {
      const {
        avatar,
        firstName,
        lastName,
        time,
        message,
        senderId,
        receiverId,
      } = newMessage;
      const createMessage = new Message({
        avatar: avatar,
        firstName: firstName,
        lastName: lastName,
        time: time,
        message: message,
        senderId: senderId,
        receiverId: receiverId,
      });
      await createMessage.save();
      socket.emit("saved!!!");
    });

    socket.on("messages", async (data) => {
      const { senderId, receiverId } = data;
      const messages = await Message.find({
        senderId: senderId,
        receiverId: receiverId,
      });
      if (messages) {
        socket.emit("Messages", messages);
      }
    });
    socket.on("singleUser", async (id) => {
      const singleUser = await User.find({ _id: id });
      if (user) {
        socket.emit("SingleUser", singleUser);
      }
    });
    socket.on("idProp", (id) => {
      socket.emit("idprop", id);
      console.log(id);
    });
  });
};
