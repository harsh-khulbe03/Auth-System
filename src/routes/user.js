const express = require("express");
const authController = require("../controllers/user");
const Authentication = require("../middlewares/user");
const router = express.Router();
router.post("/signup", authController.signUp);

router.post("/signin", authController.signIn);

router.get(
  "/profile",
  Authentication.authenticate,
  authController.accessProfile
);
router.post("/logout", Authentication.authenticate, authController.logOut);

module.exports = router;
