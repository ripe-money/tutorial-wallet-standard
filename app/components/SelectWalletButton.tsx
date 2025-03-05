'use client';
import { useContext } from 'react';

import type { IdentifierString } from '@wallet-standard/core';
// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
import type { UiWallet } from '@wallet-standard/ui';

import SelectedWalletContext from '../context/SelectedWalletContext';

const CHAIN = process.env.NEXT_PUBLIC_CHAIN as IdentifierString;
export const isSupportedWallet = (wallet: UiWallet) => wallet.chains.includes(CHAIN);

export default function SelectWalletButton({ wallet }: Readonly<{ wallet: UiWallet }>) {
  const { selectWallet } = useContext(SelectedWalletContext);

  return (
    <button
      className="btn btn-primary my-2"
      disabled={!isSupportedWallet(wallet)}
      onClick={() => selectWallet(wallet)}
    >
      {wallet.name}&nbsp;
      ({wallet.chains[0].split(':')[0] /* Pull out the chain name */})
    </button>
  );
}
