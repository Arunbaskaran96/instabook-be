const router = require("express").Router();
const usermodal = require("../schemas/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");

//signup

router.post("/signup", async (req, res) => {
  try {
    const isExist = await usermodal.findOne({ email: req.body.email });
    if (!isExist) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      const newData = new usermodal({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        profilepicture: req.body.profilepicture,
        dob: req.body.dob,
      });
      await newData.save();
      res.status(200).json({ message: "new user added" });
    } else {
      res.status(400).json({ message: "user already exists" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

//signin

router.post("/signin", async (req, res) => {
  try {
    const isExist = await usermodal.findOne({ email: req.body.email });
    if (isExist) {
      const compare = await bcrypt.compare(req.body.password, isExist.password);
      if (compare) {
        const data = {
          email: isExist.email,
          _id: isExist._id,
        };
        const token = jwt.sign(data, process.env.JWT_SCT, { expiresIn: "30d" });
        const { password, ...user } = isExist._doc;
        res.status(200).json({ user, token: token });
      } else {
        res.status(400).json({ message: "Incorrect email/password" });
      }
    } else {
      res.status(400).json({ message: "User not exists" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/user", verifyToken, async (req, res) => {
  let username = req.query.name;
  try {
    const users = await usermodal.find({
      name: { $regex: username, $options: "i" },
    });
    const filteredUser = users.filter((item) => item._id != req.user._id);
    res.status(200).json(filteredUser);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const user = await usermodal.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.put("/follow/:id", verifyToken, async (req, res) => {
  try {
    const user = await usermodal.findById(req.body._id);
    const friend = await usermodal.findById(req.params.id);
    if (user && friend) {
      const isFollowed = user.followings.includes(req.params.id);
      if (isFollowed) {
        await user.updateOne({
          $pull: {
            followings: friend._id,
          },
        });
        await friend.updateOne({
          $pull: {
            followers: user._id,
          },
        });
        res.status(200).json({ message: "unfollowed" });
      } else {
        await user.updateOne({
          $push: {
            followings: friend._id,
          },
        });
        await friend.updateOne({
          $push: {
            followers: user._id,
          },
        });
        res.status(200).json({ message: "followed" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/getfollowings", verifyToken, async (req, res) => {
  try {
    const user = await usermodal.findById(req.user._id);
    const folloings = await Promise.all(
      user.followings.map((item) => {
        return usermodal.findById(item);
      })
    );
    res.status(200).json(folloings);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
