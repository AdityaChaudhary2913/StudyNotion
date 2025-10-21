import React, { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import ImageUploader from "./ImageUploader";
import PersonalDataUploader from "./PersonalDataUploader";
import PasswordUpdater from "./PasswordUpdater";
import AccountDeleter from "./AccountDeleter";
import ConfirmationModel from "../../../common/ConfirmationModel";
import IconBtn from "../../../common/IconBtn";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../../../../services/apiConnector";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1";
// import ImageUploader from "./ImageUploader";
// import PersonalDataUploader from "./PersonalDataUploader";
// import PasswordUpdater from "./PasswordUpdater";
// import AccountDeleter from "./AccountDeleter";
// import ConfirmationModel from "../../../common/ConfirmationModel";
// import IconBtn from "../../../common/IconBtn";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { apiConnector } from "../../../../services/apiConnector";
// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1";

const Settings = () => {
	const [confirmationModal, setConfirmationModal] = useState(null);
	const [walletAmount, setWalletAmount] = useState(0);
	const [walletBalance, setWalletBalance] = useState(0);
	const [stripeOpen, setStripeOpen] = useState(false);
	const [stripeToken, setStripeToken] = useState(null);
	const { token, user } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const STRIPE_PKEY = process.env.REACT_APP_STRIPE_PKEY;

	// Fetch wallet balance on mount
	useEffect(() => {
		const fetchWallet = async () => {
			if (!token) return;
			try {
				const res = await apiConnector(
					"GET",
					`${BASE_URL}/wallet/balance`,
					null,
					{ Authorization: `Bearer ${token}` }
				);
				setWalletBalance(res.data.wallet || 0);
			} catch (err) {
				setWalletBalance(0);
			}
		};
		fetchWallet();
	}, [token]);

	// Handle Stripe token after payment
	useEffect(() => {
		const handleStripePayment = async () => {
			if (!stripeToken) return;
			try {
				// Call backend to credit wallet
				const res = await apiConnector(
					"POST",
					`${BASE_URL}/wallet/add`,
					{ amount: walletAmount },
					{ Authorization: `Bearer ${token}` }
				);
				setWalletBalance(res.data.wallet || 0);
				setWalletAmount(0);
			} catch (err) {
				// Optionally show error
			}
			setStripeToken(null);
		};
		handleStripePayment();
		// eslint-disable-next-line
	}, [stripeToken]);

	const handleAddToWallet = async () => {
		if (!token) {
			setConfirmationModal({
				text1: "You are not logged in!",
				text2: "Please login to add money to your wallet.",
				btn1Text: "Login",
				btn2Text: "Cancel",
				btn1Handler: () => navigate("/login"),
				btn2Handler: () => setConfirmationModal(null),
			});
			return;
		}
		if (walletAmount <= 0) {
			setConfirmationModal({
				text1: "Invalid Amount!",
				text2: "Please enter a valid amount to add.",
				btn1Text: "OK",
				btn2Text: "Cancel",
				btn1Handler: () => setConfirmationModal(null),
				btn2Handler: () => setConfirmationModal(null),
			});
			return;
		}
		setConfirmationModal({
			text1: `Add ₹${walletAmount} to wallet?`,
			text2: "You will be redirected to Stripe for payment.",
			btn1Text: "Proceed to Pay",
			btn2Text: "Cancel",
			btn1Handler: () => {
				setStripeOpen(true);
				setConfirmationModal(null);
			},
			btn2Handler: () => setConfirmationModal(null),
		});
	};

	return (
		<>
			<div>
				<div className="flex flex-col gap-4 border-y border-y-richblack-500 py-4">
					<p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
						Wallet Balance: ₹{walletBalance}
					</p>
					<div className="mx-auto flex flex-col items-center gap-2">
						<input
							type="number"
							min="1"
							value={walletAmount}
							onChange={(e) => setWalletAmount(Number(e.target.value))}
							placeholder="Enter amount"
							className="mb-2 px-3 py-2 border rounded text-black"
						/>
						<IconBtn text="Add to Wallet" onclick={handleAddToWallet} />
						{stripeOpen && (
							<StripeCheckout
								token={token => { setStripeToken(token); setStripeOpen(false); }}
								name="Add to Wallet"
								amount={walletAmount * 100}
								currency="INR"
								stripeKey={STRIPE_PKEY}
								description={`Add ₹${walletAmount} to wallet`}
								email={user?.email}
								closed={() => setStripeOpen(false)}
							/>
						)}
					</div>
				</div>
				<h1 className="mb-14 text-3xl font-medium text-center mt-10 text-richblack-5">
					Edit Profile
				</h1>
				<ImageUploader />
				<PersonalDataUploader />
				<PasswordUpdater />
				<AccountDeleter setConfirmationModel={setConfirmationModal} />
			</div>
			{confirmationModal && (
				<ConfirmationModel modelData={confirmationModal} />
			)}
		</>
	);
};

export default Settings;
