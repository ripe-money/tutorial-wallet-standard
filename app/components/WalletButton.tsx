'use client';
import { useContext } from 'react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
import type { UiWallet } from '@wallet-standard/react';

import SelectedWalletContext from '../context/SelectedWalletContext';
import { isSolanaWallet } from '../lib/solana';

export default function WalletButton({ wallet }: Readonly<{ wallet: UiWallet }>) {
  const { selectWallet } = useContext(SelectedWalletContext);

  return (
    <button
      className="btn btn-primary my-2"
      disabled={!isSolanaWallet(wallet)}
      onClick={() => selectWallet(wallet)}
    >
      {wallet.name}&nbsp;
      ({wallet.chains[0].split(':')[0] /* Pull out the chain name */})
    </button>
  );
}
