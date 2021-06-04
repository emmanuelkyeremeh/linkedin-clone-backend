import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  caption: { type: String, required: true },
  image: { type: String, required: false },
  image_filename: { type: String, required: false },
  time: { type: String, required: true },
});

const Posts = mongoose.model("Posts", PostSchema);

export default Posts;
