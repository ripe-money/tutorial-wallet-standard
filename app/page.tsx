'use client';
import { useEffect } from 'react';

import { registerWalletAdapter, SOLANA_MAINNET_CHAIN } from '@solana/wallet-standard';

import WalletList from './WalletList';

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

  return <WalletList />;
}
