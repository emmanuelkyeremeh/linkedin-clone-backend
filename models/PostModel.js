import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  time: { type: String, required: true },
  caption: { type: String, required: true },
  image: { type: String, required: false },
});

const Posts = mongoose.model("Posts", PostSchema);

export default Posts;
