import type { UiWallet } from "@wallet-standard/react";

import { StandardConnect } from '@wallet-standard/core';
import type { StandardConnectFeature } from '@wallet-standard/core';
type StandardConnectFeatureType = StandardConnectFeature[typeof StandardConnect];

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/features
import { getWalletFeature } from '@wallet-standard/react';

export const connectWallet = async ({
  wallet,
  // Default to not bother user with permission prompt.
  // Set to false only when the action is user-initiated, e.g. clicking a button.
  silent = true,
}: {
  wallet: UiWallet,
  silent?: boolean,
}) => {
  return (getWalletFeature(wallet, StandardConnect) as StandardConnectFeatureType)
    .connect({ silent })
    .then(({ accounts }) => accounts)
    .catch((error) => {
      console.error('Error connecting wallet:', wallet.name, error);
      return [];
    });
};
