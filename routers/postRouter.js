const router = require("express").Router();
const postmodal = require("../schemas/postSchema");
const verifyToken = require("../middleware/verifyToken");
const userSchema = require("../schemas/userSchema");

router.post("/addpost", verifyToken, async (req, res) => {
  try {
    const newPost = new postmodal({
      userid: req.user._id,
      postImage: req.body.postImage,
      description: req.body.description,
    });
    await newPost.save();
    res.status(200).json({ message: "post created" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/getallpost", verifyToken, async (req, res) => {
  try {
    const posts = await postmodal.find().populate("userid");
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/getindividualposts/:id", verifyToken, async (req, res) => {
  try {
    const userpost = await postmodal.find({ userid: req.params.id });
    res.status(200).json(userpost);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/post/:id", verifyToken, async (req, res) => {
  try {
    const userpost = await postmodal.findById(req.params.id).populate("userid");
    res.status(200).json(userpost);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.put("/like/:id", verifyToken, async (req, res) => {
  try {
    const post = await postmodal.findById(req.params.id);
    if (post) {
      const isLiked = post.likes.includes(req.user._id);
      if (!isLiked) {
        await post.updateOne({
          $push: {
            likes: req.body.id,
          },
        });
        res.status(200).json({ message: "liked" });
      } else {
        await post.updateOne({
          $pull: {
            likes: req.body.id,
          },
        });
        res.status(200).json({ message: "disliked" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.put("/comment/:id", verifyToken, async (req, res) => {
  try {
    const post = await postmodal.findById(req.params.id);
    if (post) {
      const newComment = {
        userid: req.user._id,
        comment: req.body.comment,
      };
      post.comment.push(newComment);
      await post.save();
      res.status(200).json({ message: "comment added" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/followerspost", verifyToken, async (req, res) => {
  try {
    const user = await userSchema.findById(req.user._id);
    const userpost = await postmodal
      .find({ userid: user._id })
      .populate("userid");
    const followerspost = await Promise.all(
      user.followings.map((item) => {
        return postmodal.find({ userid: item }).populate("userid");
      })
    );
    const posts = userpost.concat(...followerspost);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
