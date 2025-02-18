'use client';
import { useEffect } from 'react';

import { getWallets, StandardConnect } from '@wallet-standard/core';
import { registerWalletAdapter, SOLANA_MAINNET_CHAIN } from '@solana/wallet-standard';

import {
  CoinbaseWalletAdapter, // Need this to expose the Coinbase wallet
  SolflareWalletAdapter, // Not necessary for Solflare, but has a side effect of showing Solana on MetaMask
} from '@solana/wallet-adapter-wallets';
const adapters = [new SolflareWalletAdapter(), new CoinbaseWalletAdapter()];

export default function Home() {
  // Register adapters for wallets that don't natively support Wallet Standard
  useEffect(() => {
    const destructors = adapters.map((adapter) => registerWalletAdapter(adapter, SOLANA_MAINNET_CHAIN));
    return () => destructors.forEach((destroy) => destroy());
  }, []);

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
