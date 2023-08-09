const express = require("express");
const router =  express.Router();
const {
  login,
  signUp,
  sendotp,
  changePassword,
} = require("../controllers/Auth")
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword")
const { auth } = require("../middlewares/auth")

//Authentication Routes
router.post("/signup", signUp);
router.post("/login", login);
router.post("/sendotp", sendotp);
router.post("/changepassword", auth, changePassword);

//Reset Password
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

module.exports = router