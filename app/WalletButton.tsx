'use client';
import { useContext } from 'react';

import {
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
  UiWallet,
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/features
  getWalletFeature,
} from '@wallet-standard/react';

import { StandardConnect, type StandardConnectFeature } from '@wallet-standard/core';
// import { SOLANA_MAINNET_CHAIN } from '@solana/wallet-standard';
const SOLANA_MAINNET_CHAIN = 'solana:mainnet';

import SelectedAccountContext from './context/SelectedAccountContext';

export default function WalletButton({ wallet }: Readonly<{ wallet: UiWallet }>) {
  const { setSelectedAccount } = useContext(SelectedAccountContext);

  const supportStandardConnect =
    wallet.features.includes(StandardConnect)
    && wallet.chains.includes(SOLANA_MAINNET_CHAIN);

  return (
    <button
      className="btn btn-primary m-2"
      disabled={!supportStandardConnect}
      onClick={async () => {
        if (supportStandardConnect) {
          const connectFeature =
            getWalletFeature(wallet, StandardConnect) as StandardConnectFeature[typeof StandardConnect];
          const accounts = (await connectFeature.connect()).accounts;
          if (accounts.length > 0) setSelectedAccount(accounts[0]);

          console.log(
            `Connected to ${wallet.name} with accounts:`,
            accounts.map(account => account.address)
          );
        }
      }}
    >
    {wallet.name}&nbsp;
    ({wallet.chains[0].split(':')[0] /* Pull out the chain name */})
    </button>
  );
}
