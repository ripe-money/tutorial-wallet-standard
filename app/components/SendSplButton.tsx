import type { UiWallet } from "@wallet-standard/react";

import type { SolanaSignAndSendTransactionFeature } from '@solana/wallet-standard';
import { SolanaSignAndSendTransaction } from '@solana/wallet-standard';
import { getWalletFeature } from '@wallet-standard/react';
type SolanaSignAndSendTransactionFeatureType = SolanaSignAndSendTransactionFeature[typeof SolanaSignAndSendTransaction];

// import { getTransferInstruction } from '@solana-program/token';

import { getLatestBlockhash } from '../lib/solana';

export const SendSplButton = ({ wallet }: { wallet: UiWallet }) => {
  return (
    <button
      className="btn btn-primary"
      onClick={() => sendSolUsdcFrom(wallet)}
    >
      Send 0.01 USDC
    </button>
  );
};

const sendSolUsdcFrom = async (wallet: UiWallet) => {
  console.log('latest block hash:', await getLatestBlockhash());
  console.log('Sending 0.01 USDC from', wallet.features);
  const feature = getWalletFeature(wallet, SolanaSignAndSendTransaction) as SolanaSignAndSendTransactionFeatureType;
  console.log('Feature:', feature.signAndSendTransaction);
  // feature.signAndSendTransaction({
  //   chain: SOLANA_MAINNET_CHAIN,
  //   account: address('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
  //   transaction: null,
  // })
  // const instr = getTransferInstruction({
  //   source: address('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
  //   destination: address('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
  //   amount: 1,
  //   authority: address('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
  // });
  // console.log('Instruction:', instr, typeof instr);
};
