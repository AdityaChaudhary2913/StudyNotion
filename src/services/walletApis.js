const BASE_URL = process.env.REACT_APP_BASE_URL;

export const walletEndpoints = {
  WALLET_DEDUCT_API: BASE_URL + "/wallet/deduct",
  WALLET_BALANCE_API: BASE_URL + "/wallet/balance",
};
