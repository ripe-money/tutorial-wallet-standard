import type { UiWalletAccount } from "@wallet-standard/ui";

// https://github.com/anza-xyz/kit/tree/main/packages/react
import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import { address } from '@solana/kit';

import solana from '../lib/solana';

const SendSplButton = ({
  account,
  onTransactionSent,
}: {
  account: UiWalletAccount,
  onTransactionSent?: () => void,
}) => {
  const signer = useWalletAccountTransactionSendingSigner(account, 'solana:devnet');

  return (
    <button
      className="btn btn-primary my-2"
      onClick={() => {
        solana.transferTokens(
          signer,
          // "Devnet 2" in Chuck's wallet
          address('7pEduvx1xwxM4QVpPWyXQMyVFAz14hSTMBVPMPpVXtWs'),
          BigInt(30000), // 0.03 USDC
          'Your money is ripe',
        )
        .then(() => onTransactionSent?.())
      }}
    >
      Send 0.03 USDC
    </button>
  );
};

export default SendSplButton;
