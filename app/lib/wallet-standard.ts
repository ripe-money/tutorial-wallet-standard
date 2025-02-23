import {
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
  type UiWallet,
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/features
  getWalletFeature,
} from '@wallet-standard/react';

import { StandardConnect, type StandardConnectFeature } from '@wallet-standard/core';

export const connectUiWallet = async (wallet: UiWallet) => {
  type StandardConnectFeatureType = StandardConnectFeature[typeof StandardConnect];
  const connectFeature = getWalletFeature(wallet, StandardConnect) as StandardConnectFeatureType;
  const accounts = await connectFeature.connect().then(({ accounts }) => accounts);

  console.log(`Connected to ${wallet.name} with accounts:`, accounts);

  return accounts;
}
