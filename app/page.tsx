'use client';
import { useEffect } from 'react';

import { getWallets, StandardConnect, type Wallet } from '@wallet-standard/core';
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
        {availableWallets.map((wallet, i) => {
          const isEnabled = StandardConnect in wallet.features && wallet.chains.includes(SOLANA_MAINNET_CHAIN);
          const buttonStatus = 'primary';

          return (
            <button key={i} className={`btn btn-${buttonStatus} m-2`} disabled={!isEnabled} onClick={() => connectWallet(wallet)}>
              {i + 1}: {wallet.name}&nbsp;
              ({wallet.chains[0].split(':')[0] /* Pull out the chain name */})
            </button>
          );
        })}
      </div>
    </>
  );
}

const connectWallet = async (wallet: Wallet) => {
  console.log('Connecting to wallet:', wallet.name);
  try {
    const connectFeature = wallet.features[StandardConnect] as { connect: () => Promise<void> };
    await connectFeature.connect();
    console.log('Connected to wallet with accounts:', wallet.accounts.map(account => account.address));
  } catch (error) {
    console.error('Failed to connect to wallet:', wallet.name, error);
  }
};
