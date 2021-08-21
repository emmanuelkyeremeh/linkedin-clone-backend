import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import express from "express";
import User from "../models/UserModel.js";

const UserRouter = express.Router();

UserRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      avatar: req.body.avatar,
      avatar_filename: req.body.avatar_filename,
      bio: req.body.bio,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    const newUser = await user.save();
    res.send({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      avatar: newUser.avatar,
      avatar_filename: newUser.avatar_filename,
      bio: newUser.bio,
      email: newUser.email,
    });
  })
);

UserRouter.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    const user = await User.findOne({
      email: req.body.email,
    });
    if (user) {
      if ((bcrypt.compareSync(req.body.password), user.password)) {
        res.send({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          avatar_filename: user.avatar_filename,
          bio: user.bio,
          email: user.email,
        });
      }
    }
  })
);

UserRouter.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id);
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.avatar = req.boy.avatar || user.avatar;
      user.avatar_filename = req.body.avatar_filename || user.avatar_filename;
      user.bio = req.body.bio || user.bio;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = user.save();
      res.send({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        avatar: updatedUser.avatar,
        avatar_filename: updatedUser.avatar_filename,
        bio: updatedUser.bio,
        email: updatedUser.email,
      });
    }
  })
);

export default UserRouter;
