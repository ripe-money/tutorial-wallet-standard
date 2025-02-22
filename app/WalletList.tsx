'use client';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/react/core
import { useWallets } from '@wallet-standard/react';

import WalletButton from './WalletButton';

export default function WalletList() {
  const availableWallets = useWallets();
  console.log(availableWallets);

  return (
    <>
      <h1 className="text-3xl font-bold">
        Available Wallets:
      </h1>
      <div className="flex flex-col">
        {availableWallets.map((wallet, i) => <WalletButton key={i} wallet={wallet} />)}
      </div>
    </>
  );
}
