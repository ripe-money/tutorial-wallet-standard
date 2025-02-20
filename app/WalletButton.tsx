'use client';

import {
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
  UiWallet,
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/features
  getWalletFeature,
} from '@wallet-standard/react';

import { StandardConnect, StandardConnectFeature, WalletAccount } from '@wallet-standard/core';
import { SOLANA_MAINNET_CHAIN } from '@solana/wallet-standard';

type WalletButtonProps = Readonly<{
  onWalletConnect: (accounts: readonly WalletAccount[]) => void;
  wallet: UiWallet
}>

export default function WalletButton({ wallet, onWalletConnect }: WalletButtonProps) {
  const supportStandardConnect = wallet.features.includes(StandardConnect) && wallet.chains.includes(SOLANA_MAINNET_CHAIN);

  return (
    <button
      className="btn btn-primary m-2"
      disabled={!supportStandardConnect}
      onClick={async () => {
        if (supportStandardConnect) {
          const connectFeature = getWalletFeature(wallet, StandardConnect) as StandardConnectFeature[typeof StandardConnect];
          const accounts = (await connectFeature.connect()).accounts;
          onWalletConnect(accounts);
        }
      }}
    >
    {wallet.name}&nbsp;
    ({wallet.chains[0].split(':')[0] /* Pull out the chain name */})
    </button>
  );
}
