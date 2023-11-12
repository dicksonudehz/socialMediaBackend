import express from "express";
import User from "../models/Users.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";
// import {protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// register a user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword, desc } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      const newUser = new User({
        username: username,
        email: email,
        desc: desc,  
        password: await bcrypt.hashSync(password, 10),
        confirmPassword: await bcrypt.hashSync(confirmPassword, 10),
      });
      if (password === confirmPassword) {
        const saveUser = await newUser.save();
        if (saveUser) {
          res
            .status(200)
            .json({ Message: "registration is successful", saveUser });
        } else {
          res.json({ Message: "user already registered" });
        }
      } else {
        res.json({ Message: "password must match" });
      }
    } else {
      res.json({ Message: "invalid credentials" });
    }
  } catch (err) {
    throw new Error(err);
  }
});

//   update the route
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const { username, desc, email } = req.body;
    if (user) {
      const updateUser = await User.findByIdAndUpdate(
        user._id,
        {
          username: username ? username : user.username,
          desc: desc ? desc : user.desc,
          email: email ? email : user.email,
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      if (updateUser) {
        res.json({ Message: "user updated successfully", user });
      } else {
        res.status(400).json({ Message: "unable to update user" });
      }
    } else {
      res.status(400).json({ Message: "user not found" });
    }
  } catch (err) {
    throw new Error(err);
  }
});

//   delete route
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(500).json("Account has been deleted successfully");
    } catch (error) {
      res.status(200).json(error);
    }
  } else {
    res
      .status(500)
      .json("account cannot be deleted because is not your account");
  }
});

//   get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ Message: "user details", user });
  } catch (error) {
    res.status(500).json(error);
  }
});

// follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({
          $push: { followers: req.params.userId },
        });
        res.status(200).json("you have follow this user successfully");
      } else {
        res.json("you cannot follow yourself");
      }
    } catch (error) {
      res.json(error);
    }
  }
});

// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followings: req.body.userId } });
        await currentUser.updateOne({
          $pull: { followings: req.params.userId },
        });
        res.status(200).json("you have follow this user successfully");
      } else {
        res.json("you already follow this user");
      }
    } catch (error) {
      res.json(error);
    }
  }
});

export default router;
