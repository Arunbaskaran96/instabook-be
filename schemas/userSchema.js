const mongoose = require("mongoose");

const usermodal = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    profilepicture: {
      type: String,
    },
    dob: {
      type: Date,
      require: true,
    },
    followings: {
      type: Array,
    },
    followers: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", usermodal);
