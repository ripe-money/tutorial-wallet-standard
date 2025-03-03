import type { UiWalletAccount } from '@wallet-standard/react';

import { useWalletAccountTransactionSendingSigner } from '@solana/react';

import solana from '../lib/solana';

// https://github.com/anza-xyz/kit/tree/main/packages/react
const SendSplButton = ({ account }: { account: UiWalletAccount }) => {
  const signer = useWalletAccountTransactionSendingSigner(account, 'solana:devnet');

  return (
    <button
      className="btn btn-primary"
      onClick={() => solana.transferTokens(signer, 'Your money is ripe')}
    >
      Send memo onchain
    </button>
  );
};

export default SendSplButton;
