'use client';

// May be helpful to look at the Solana sample app
// https://github.com/anza-xyz/solana-web3.js/tree/main/examples/react-app/src
import {
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/react/core
  useWallets,
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/features
  // getWalletFeature,
  // https://github.com/wallet-standard/wallet-standard/tree/master/packages/ui/compare
  // getUiWalletAccountStorageKey,
} from '@wallet-standard/react';

import WalletButton from './WalletButton';

export default function WalletList() {
  const wallets = useWallets();
  console.log(wallets);

  return (
    <>
      <h1 className="text-3xl font-bold">
        Available Wallets:
      </h1>
      <div className="flex flex-col">
        {wallets.map((wallet, i) => (
          <WalletButton key={i} wallet={wallet} />
        ))}
      </div>
    </>
  );
}
