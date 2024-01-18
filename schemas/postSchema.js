const mongoose = require("mongoose");

const postmodal = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    postImage: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    likes: {
      type: Array,
    },
    comment: [
      {
        name: {
          type: String,
          require: true,
        },
        profilepicture: {
          type: String,
          require: true,
        },
        comment: {
          type: String,
          require: true,
        },
      },
    ],
  },
  { timeseries: true }
);

module.exports = mongoose.model("posts", postmodal);
