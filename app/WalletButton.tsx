'use client';
import { useContext } from 'react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
import type { UiWallet } from '@wallet-standard/react';

import ConnectedAccountContext from './context/ConnectedAccountContext';
import { isSolanaWallet } from './solana';
import { connectUiWallet } from './lib/wallet-standard';

export default function WalletButton({ wallet }: Readonly<{ wallet: UiWallet }>) {
  const { setConnectedAccount } = useContext(ConnectedAccountContext);

  return (
    <button
      className="btn btn-primary m-2"
      disabled={!isSolanaWallet(wallet)}
      onClick={async () => {
        const accounts = await connectUiWallet(wallet);
        if (accounts.length > 0) setConnectedAccount(accounts[0]);
      }}
    >
    {wallet.name}&nbsp;
    ({wallet.chains[0].split(':')[0] /* Pull out the chain name */})
    </button>
  );
}
