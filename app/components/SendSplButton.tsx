import type { UiWalletAccount } from '@wallet-standard/react';

import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import { address } from '@solana/kit';

import solana from '../lib/solana';

// https://github.com/anza-xyz/kit/tree/main/packages/react
const SendSplButton = ({ account }: { account: UiWalletAccount }) => {
  const signer = useWalletAccountTransactionSendingSigner(account, 'solana:devnet');

  return (
    <button
      className="btn btn-primary m-2"
      onClick={() => {
        solana.transferTokens(
          signer,
          address('7pEduvx1xwxM4QVpPWyXQMyVFAz14hSTMBVPMPpVXtWs'), // Devnet 2
          BigInt(50000), // 0.01 USDC
          'Your money is ripe',
        );
      }}
    >
      Send 0.05 USDC
    </button>
  );
};

export default SendSplButton;
