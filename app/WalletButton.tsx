'use client';
import { useContext } from 'react';

import {
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
  type UiWallet,
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/features
  getWalletFeature,
} from '@wallet-standard/react';

import { StandardConnect, type StandardConnectFeature } from '@wallet-standard/core';

import SelectedAccountContext from './context/SelectedAccountContext';
import { isSolanaWallet } from './solana';

export default function WalletButton({ wallet }: Readonly<{ wallet: UiWallet }>) {
  const { setSelectedAccount } = useContext(SelectedAccountContext);

  return (
    <button
      className="btn btn-primary m-2"
      disabled={!isSolanaWallet(wallet)}
      onClick={async () => {
        try {
          const connectFeature =
            getWalletFeature(wallet, StandardConnect) as StandardConnectFeature[typeof StandardConnect];
          const accounts = (await connectFeature.connect()).accounts;

          console.log(
            `Connected to ${wallet.name} with accounts:`,
            accounts.map(account => account.address)
          );

          if (accounts.length > 0) setSelectedAccount(accounts[0]);
        } catch (WalletStandardError) {
          console.error('Error. Maybe Standard Connect is not supported by wallet:', WalletStandardError);
        }
      }}
    >
    {wallet.name}&nbsp;
    ({wallet.chains[0].split(':')[0] /* Pull out the chain name */})
    </button>
  );
}
