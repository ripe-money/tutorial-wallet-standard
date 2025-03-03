import { useEffect } from "react";

import { getWalletAccountFeature } from '@wallet-standard/react';
import { type UiWalletAccount } from '@wallet-standard/react';

import type { SolanaSignAndSendTransactionFeature } from '@solana/wallet-standard';
import { SolanaSignAndSendTransaction } from '@solana/wallet-standard';
type SolanaSignAndSendTransactionFeatureType = SolanaSignAndSendTransactionFeature[typeof SolanaSignAndSendTransaction];

// import { getTransferInstruction } from '@solana-program/token';

import solana from '../lib/solana';

// import {
//   address,
//   // appendTransactionMessageInstruction,
//   createTransactionMessage,
//   pipe,
//   setTransactionMessageFeePayer,
//   setTransactionMessageLifetimeUsingBlockhash,
// } from '@solana/kit';

const SendSplButton = ({ account }: { account: UiWalletAccount }) => {

  useEffect(() => {
    const init = async () => {
      const latestBlockhash = await solana.getLatestBlockhash();
      console.log('latest block hash:', latestBlockhash);

      const feature = getWalletAccountFeature(account, SolanaSignAndSendTransaction) as SolanaSignAndSendTransactionFeatureType;
      console.log('Feature:', feature);

      // const feePayer = address('AxZfZWeqztBCL37Mkjkd4b8Hf6J13WCcfozrBY6vZzv3');
      // const message = pipe(
      //   createTransactionMessage({ version: 'legacy' }),
      //   m => setTransactionMessageFeePayer(feePayer, m),
      //   m => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
      //   // m => appendTransactionMessageInstruction(getAddMemoInstruction({ memo: text }), m),
      // );
      // console.log('Message:', message);
    };
    init();
  }, [account]);

  return (
    <button
      className="btn btn-primary"
      onClick={() =>console.log('Button clicked')}
    >
      Send 0.01 USDC
    </button>
  );
};

export default SendSplButton;
