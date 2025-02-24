'use client';
// May be helpful to look at the Solana sample app
// https://github.com/anza-xyz/solana-web3.js/tree/main/examples/react-app/src

// import { useEffect } from 'react';

// import { registerWalletAdapter, SOLANA_MAINNET_CHAIN } from '@solana/wallet-standard';

/**
 * These adapters could've been used to register Solana providers for Coinbase and MetaMask,
 * which don't natively support Wallet Standard (as of Feb 2025). However, these adapters
 * are using v1 of @solana/web3.js, which conflicts with our use of v2.
 * 
 * We may have to write our own adapters for these wallets.

import {
  CoinbaseWalletAdapter, // Need this to expose the Coinbase wallet
  SolflareWalletAdapter, // Not necessary for Solflare, but has a side effect of showing Solana on MetaMask
} from '@solana/wallet-adapter-wallets';
const adapters = [new SolflareWalletAdapter(), new CoinbaseWalletAdapter()];

*/

import { ConnectedAccountContextProvider } from './context/ConnectedAccountContext';
import WalletBalance from './components/WalletBalance';
import WalletList from './components/WalletList';

export default function Home() {
  // Register adapters for wallets that don't natively support Wallet Standard
  // useEffect(() => {
  //   const destructors = adapters.map((adapter) => registerWalletAdapter(adapter, SOLANA_MAINNET_CHAIN));
  //   return () => destructors.forEach((destroy) => destroy());
  // }, []);

  return (
    <ConnectedAccountContextProvider>
      <WalletBalance />
      <hr />
      <WalletList />
    </ConnectedAccountContextProvider>
  );
}
