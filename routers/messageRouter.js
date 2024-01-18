const router = require("express").Router();
const messagemodal = require("../schemas/messageSchema");
const verifyToken = require("../middleware/verifyToken");

router.post("/newmsg", verifyToken, async (req, res) => {
  try {
    const newmsg = new messagemodal({
      senderId: req.body.senderId,
      receiverId: req.body.receiverId,
      message: req.body.message,
    });
    await newmsg.save();
    res.status(200).json({ message: "message sent" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/getmsg/:receiverId", verifyToken, async (req, res) => {
  try {
    const sendercon = await messagemodal
      .find({
        $and: [
          { senderId: req.user._id },
          { receiverId: req.params.receiverId },
        ],
      })
      .populate("senderId");
    const receivercon = await messagemodal
      .find({
        $and: [
          { senderId: req.params.receiverId },
          { receiverId: req.user._id },
        ],
      })
      .populate("senderId");
    let conv = [...sendercon, ...receivercon];
    conv.sort((a, b) => a.createdAt - b.createdAt);
    res.status(200).json(conv);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
