import type { UiWalletAccount } from '@wallet-standard/react';

// import { getWalletAccountFeature } from '@wallet-standard/react';
// import type { SolanaSignAndSendTransactionFeature } from '@solana/wallet-standard';
// import { SolanaSignAndSendTransaction } from '@solana/wallet-standard';
// type SolanaSignAndSendTransactionFeatureType = SolanaSignAndSendTransactionFeature[typeof SolanaSignAndSendTransaction];

import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import { getAddMemoInstruction } from '@solana-program/memo';
// import { getTransferInstruction } from '@solana-program/token';

import solana from '../lib/solana';

import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getBase58Decoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
} from '@solana/kit';

// https://github.com/anza-xyz/kit/tree/main/packages/react
const SendSplButton = ({ account }: { account: UiWalletAccount }) => {
  const signer = useWalletAccountTransactionSendingSigner(account, 'solana:devnet');

  const onClick = async () => {
    const latestBlockhash = await solana.getLatestBlockhash();
    console.log('latest block hash:', latestBlockhash);

    // const feature = getWalletAccountFeature(account, SolanaSignAndSendTransaction) as SolanaSignAndSendTransactionFeatureType;
    // console.log('Feature:', feature);

    const message = pipe(
      createTransactionMessage({ version: 0 }),
      m => setTransactionMessageFeePayerSigner(signer, m),
      m => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
      m => appendTransactionMessageInstructions([
        getAddMemoInstruction({ memo: 'Your money is ripe' }),
      ], m),
    );
    console.log('Transaction Message:', message);

    const signatureBytes = await signAndSendTransactionMessageWithSigners(message);
    const base58Signature = getBase58Decoder().decode(signatureBytes);
    console.log(`View transaction: https://explorer.solana.com/tx/${base58Signature}?cluster=devnet`);
  };

  return (
    <button
      className="btn btn-primary"
      onClick={onClick}
    >
      Send memo onchain
    </button>
  );
};

export default SendSplButton;
