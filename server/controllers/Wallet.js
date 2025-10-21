const User = require("../models/User");

// Add to wallet
exports.addToWallet = async (req, res) => {
	try {
		const userId = req.user.id;
		const { amount } = req.body;
		if (!amount || amount <= 0) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid amount." });
		}
		const user = await User.findById(userId);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found." });
		}
		user.wallet = (user.wallet || 0) + Number(amount);
		await user.save();
		return res.status(200).json({ success: true, wallet: user.wallet });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Server error.", error: error.message });
	}
};

// Get wallet balance
exports.getWallet = async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found." });
		}
		return res.status(200).json({ success: true, wallet: user.wallet || 0 });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Server error.", error: error.message });
	}
};

// Deduct from wallet
exports.deductFromWallet = async (req, res) => {
	try {
		const userId = req.user.id;
		const { amount } = req.body;
		if (!amount || amount <= 0) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid amount." });
		}
		const user = await User.findById(userId);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found." });
		}
		if ((user.wallet || 0) < Number(amount)) {
			return res
				.status(400)
				.json({ success: false, message: "Insufficient wallet balance." });
		}
		user.wallet = user.wallet - Number(amount);
		await user.save();
		return res.status(200).json({ success: true, wallet: user.wallet });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Server error.", error: error.message });
	}
};
