'use client';

import { getWallets, StandardConnect } from '@wallet-standard/core';
import { SOLANA_MAINNET_CHAIN } from '@solana/wallet-standard';

export default function Home() {
  const availableWallets = getWallets().get();
  console.log(availableWallets);

  return (
    <>
      <h1 className="text-3xl font-bold">
        Available Wallets:
      </h1>
      <div className="flex flex-col">
        {availableWallets.map((wallet, i) => (
          <button key={i} className="btn btn-primary m-2"
            disabled={!(
              StandardConnect in wallet.features &&
              wallet.chains.includes(SOLANA_MAINNET_CHAIN)
            )}
          >
            {i + 1}: {wallet.name}&nbsp;
            ({wallet.chains[0].split(':')[0]})
          </button>
        ))}
      </div>
    </>
  );
}
