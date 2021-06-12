import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  avatar: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  time: { type: String, required: true },
  message: { type: String, required: true },
  SenderId: { type: String, required: true },
  receiverId: { type: String, required: true },
});

const Message = mongoose.model("Messages", MessageSchema);

export default Message;
