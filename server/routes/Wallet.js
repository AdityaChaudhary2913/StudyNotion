const express = require("express");
const router = express.Router();
const {
	addToWallet,
	getWallet,
	deductFromWallet,
} = require("../controllers/Wallet");
const { auth } = require("../middlewares/auth");

// Add to wallet
router.post("/add", auth, addToWallet);

// Get wallet balance
router.get("/balance", auth, getWallet);

// Deduct from wallet
router.post("/deduct", auth, deductFromWallet);

module.exports = router;
