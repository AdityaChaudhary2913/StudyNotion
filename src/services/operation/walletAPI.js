import { walletEndpoints } from "../walletApis";
import { apiConnector } from "../apiConnector";

export const payWithWallet = async (amount, token) => {
  try {
    const response = await apiConnector(
      "POST",
      walletEndpoints.WALLET_DEDUCT_API,
      { amount },
      { Authorization: `Bearer ${token}` }
    );
    return response.data;
  } catch (error) {
    return { success: false, message: error?.response?.data?.message || "Payment failed" };
  }
};

export const getWalletBalance = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      walletEndpoints.WALLET_BALANCE_API,
      null,
      { Authorization: `Bearer ${token}` }
    );
    return response.data.wallet;
  } catch (error) {
    return 0;
  }
};
