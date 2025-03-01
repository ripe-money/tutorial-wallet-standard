import { useContext, useEffect } from "react";

import SelectedWalletContext from "../context/SelectedWalletContext";

import type { SolanaSignAndSendTransactionFeature } from '@solana/wallet-standard';
import { SolanaSignAndSendTransaction } from '@solana/wallet-standard';
import { getWalletFeature } from '@wallet-standard/react';
type SolanaSignAndSendTransactionFeatureType = SolanaSignAndSendTransactionFeature[typeof SolanaSignAndSendTransaction];

// import { getTransferInstruction } from '@solana-program/token';

import solana from '../lib/solana';

// const sendSolUsdcFrom = async (wallet: UiWallet) => {
//   console.log('latest block hash:', await solana.getLatestBlockhash());
//   console.log('Sending 0.01 USDC from', wallet.features);
//   const feature = getWalletFeature(wallet, SolanaSignAndSendTransaction) as SolanaSignAndSendTransactionFeatureType;
//   console.log('Feature:', feature.signAndSendTransaction);
//   // feature.signAndSendTransaction({
//   //   chain: SOLANA_MAINNET_CHAIN,
//   //   account: address('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
//   //   transaction: null,
//   // })
//   // const instr = getTransferInstruction({
//   //   source: address('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
//   //   destination: address('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
//   //   amount: 1,
//   //   authority: address('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
//   // });
//   // console.log('Instruction:', instr, typeof instr);
// };

export const SendSplButton = () => {
  const { selectedWallet } = useContext(SelectedWalletContext); // getWalletAccount

  useEffect(() => {
    const init = async () => {
      console.log('latest block hash:', await solana.getLatestBlockhash());

      if (!selectedWallet) return;
      console.log('Wallet:', selectedWallet);

      const feature = getWalletFeature(selectedWallet, SolanaSignAndSendTransaction) as SolanaSignAndSendTransactionFeatureType;
      console.log('Feature:', feature);
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
