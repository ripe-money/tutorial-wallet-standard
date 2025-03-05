import type { UiWalletAccount } from "@wallet-standard/ui";

// https://github.com/anza-xyz/kit/tree/main/packages/react
import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import { address } from '@solana/kit';

import solana from '../lib/solana';

// TODO: Just assume it's a Solana chain for now
const CHAIN = process.env.NEXT_PUBLIC_CHAIN as `solana:${string}`;
// TODO: Hardcoding "Devnet 2" in Chuck's wallet
const RECEIVER_ADDRESS = address('7pEduvx1xwxM4QVpPWyXQMyVFAz14hSTMBVPMPpVXtWs');
// TODO: Need to ensure the right number of decimals when setting the amount
const AMOUNT = BigInt(30000); // 0.03 USDC
const MEMO = 'Your money is ripe';

const SendSplButton = ({
  account,
  onTransactionSent,
}: {
  account: UiWalletAccount,
  onTransactionSent?: () => void,
}) => {
  const signer = useWalletAccountTransactionSendingSigner(account, CHAIN);

  return (
    <button
      className="btn btn-primary my-2"
      onClick={() => {
        solana.transferTokens(signer, RECEIVER_ADDRESS, AMOUNT, MEMO)
        .then(() => onTransactionSent?.())
      }}
    >
      Send 0.03 USDC
    </button>
  );
};

export default SendSplButton;
