const express = require("express");
const server = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyparser = require("body-parser");

dotenv.config();

server.use(cors());
server.use(bodyparser.json());

const userrouter = require("./routers/userRouter");
const postrouter = require("./routers/postRouter");
const messagerouter = require("./routers/messageRouter");

server.use("/api", userrouter);
server.use("/api", postrouter);
server.use("/api", messagerouter);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

server.listen(8000, () => {
  console.log("server connected");
});
