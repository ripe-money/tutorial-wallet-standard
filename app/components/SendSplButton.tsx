import { useContext, useEffect } from "react";

import SelectedWalletContext from "../context/SelectedWalletContext";

import type { SolanaSignAndSendTransactionFeature } from '@solana/wallet-standard';
import { SolanaSignAndSendTransaction } from '@solana/wallet-standard';
import { getWalletFeature } from '@wallet-standard/react';
type SolanaSignAndSendTransactionFeatureType = SolanaSignAndSendTransactionFeature[typeof SolanaSignAndSendTransaction];

// import { getTransferInstruction } from '@solana-program/token';

import solana from '../lib/solana';

import {
  address,
  // appendTransactionMessageInstruction,
  createTransactionMessage,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
} from '@solana/kit';

export const SendSplButton = () => {
  const { selectedWallet } = useContext(SelectedWalletContext); // getWalletAccount

  useEffect(() => {
    const init = async () => {
      const latestBlockhash = await solana.getLatestBlockhash();
      console.log('latest block hash:', latestBlockhash);

      if (!selectedWallet) return;
      console.log('Wallet:', selectedWallet);

      const feature = getWalletFeature(selectedWallet, SolanaSignAndSendTransaction) as SolanaSignAndSendTransactionFeatureType;
      console.log('Feature:', feature);

      const feePayer = address('AxZfZWeqztBCL37Mkjkd4b8Hf6J13WCcfozrBY6vZzv3');
      const message = pipe(
        createTransactionMessage({ version: 'legacy' }),
        m => setTransactionMessageFeePayer(feePayer, m),
        m => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
        // m => appendTransactionMessageInstruction(getAddMemoInstruction({ memo: text }), m),
      );
      console.log('Message:', message);
    };
    init();
  }, [selectedWallet]);

  return (
    <button
      className="btn btn-primary"
      onClick={() => console.log('Send USDC')}
    >
      Send 0.01 USDC
    </button>
  );
};
