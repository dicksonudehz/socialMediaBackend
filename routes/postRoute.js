import express from "express";
import Post from "../models/Post.js";
import User from "../models/Users.js";

const router = express.Router();

// create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json("can not create a post");
  }
});

// update a post created

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      const updatedPost = await post.updateOne({ $set: req.body });
      res.status(200).json({ Message: "post has been update", updatedPost });
    } else {
      res.status(500).json("you can only update your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      const deletedPost = await post.deleteOne();
      res.status(200).json({ Message: "post has been deleted", deletedPost });
    } else {
      res.status(500).json("you can only update your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//   like a post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json('you liked this post');
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json('you dislike this post');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json({ Message: "post found", post });
  } catch (error) {
    res.json(error);
  }
});

// get timeline post
router.get("/timelines/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPost = await Post.find({ userId: currentUser._id });
    const friendsPost = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPost.concat(...friendsPost));
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
