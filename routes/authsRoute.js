import express from "express";
import User from "../models/Users.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";

const router = express.Router();

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

//create login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = await generateToken(user._id);
        res.json({
          Message: "Login is successful",
          email: email,
          token,
          username: user.username,
        });
      }
    } else {
      res.status(401).json({ message: "user does not exist" });
    }
  } catch (err) {
    throw new Error(err);
  }
});

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id ) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("user id does not match ");
  }
});

export default router;
