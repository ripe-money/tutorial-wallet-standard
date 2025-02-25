import type { UiWallet } from "@wallet-standard/react";

import { StandardConnect, type StandardConnectFeature } from '@wallet-standard/core';
type StandardConnectFeatureType = StandardConnectFeature[typeof StandardConnect];

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/features
import { getWalletFeature } from '@wallet-standard/react';

const connectWallet = async ({
  wallet,
  // Default to not bother user with permission prompt.
  // Set to false only when the action is user-initiated, e.g. clicking a button.
  silent = true,
}: {
  wallet: UiWallet,
  silent?: boolean,
}) => {
  const { accounts } = await (getWalletFeature(wallet, StandardConnect) as StandardConnectFeatureType)
    .connect({ silent })
  return accounts;
};

const getWalletAddress = async (wallet: UiWallet) => {
  const accounts = await connectWallet({ wallet });
  if (accounts.length === 0) return;

  return accounts[0].address;
};

export { connectWallet, getWalletAddress };
