const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

function db() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { db };
