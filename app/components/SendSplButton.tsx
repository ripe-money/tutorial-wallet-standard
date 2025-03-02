import { useEffect, useState } from "react";

// import { getWalletFeature } from '@wallet-standard/react';
import { useConnect, type UiWalletAccount, type UiWallet } from '@wallet-standard/react';

// import type { SolanaSignAndSendTransactionFeature } from '@solana/wallet-standard';
// import { SolanaSignAndSendTransaction } from '@solana/wallet-standard';
// type SolanaSignAndSendTransactionFeatureType = SolanaSignAndSendTransactionFeature[typeof SolanaSignAndSendTransaction];

// import { getTransferInstruction } from '@solana-program/token';

// import solana from '../lib/solana';

// import {
//   address,
//   // appendTransactionMessageInstruction,
//   createTransactionMessage,
//   pipe,
//   setTransactionMessageFeePayer,
//   setTransactionMessageLifetimeUsingBlockhash,
// } from '@solana/kit';

const SendSplButton = ({ wallet }: { wallet: UiWallet }) => {
  const [isConnecting, connect] = useConnect(wallet);
  const [connectedAccounts, setConnectedAccounts] = useState<readonly UiWalletAccount[]>();

  useEffect(() => {
    const init = async () => {
      // const latestBlockhash = await solana.getLatestBlockhash();
      // console.log('latest block hash:', latestBlockhash);

      // const feature = getWalletFeature(wallet, SolanaSignAndSendTransaction) as SolanaSignAndSendTransactionFeatureType;
      // console.log('Feature:', feature);

      // const feePayer = address('AxZfZWeqztBCL37Mkjkd4b8Hf6J13WCcfozrBY6vZzv3');
      // const message = pipe(
      //   createTransactionMessage({ version: 'legacy' }),
      //   m => setTransactionMessageFeePayer(feePayer, m),
      //   m => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
      //   // m => appendTransactionMessageInstruction(getAddMemoInstruction({ memo: text }), m),
      // );
      // console.log('Message:', message);

      if (connectedAccounts) return;
      connect().then((accounts) => {
        setConnectedAccounts(accounts);
        console.log('Connected accounts:', accounts);
        if (accounts.length === 0) return;
        const account = accounts[0];
        console.log('Account:', account);
      });
    };
    init();
  }, [connect, connectedAccounts, wallet]);

  return (
    <button
      className="btn btn-primary"
      onClick={() =>console.log('Button clicked')}
    >
      Send 0.01 USDC&nbsp;
      {isConnecting && 'Connecting...'}
    </button>
  );
};

export default SendSplButton;
