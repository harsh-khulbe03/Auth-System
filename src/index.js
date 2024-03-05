const express = require("express");
const dotenv = require("dotenv");
const { db } = require("./db/db");
const authRoutes = require("./routes/user");
const app = express();

dotenv.config();

db();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
