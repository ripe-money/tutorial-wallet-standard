import { useEffect, useState } from 'react';

import type { UiWalletAccount } from '@wallet-standard/ui';

import { address } from '@solana/kit';
import solana from '../lib/solana';

const abortController = new AbortController();

const WalletBalance = ({ account }: { account: UiWalletAccount }) => {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const getBalances = async () => {
      const refreshTokenBalance = async () => {
        solana.getTokenBalance(account).then(balance => setBalance(balance));
      };

      solana.getSolBalance(account);
      refreshTokenBalance();

      // Set up to be notified of account changes
      const accountNotifications = await solana.rpcSubscriptions
        .accountNotifications(address(account.address), { commitment: 'confirmed' })
        .subscribe({ abortSignal: abortController.signal });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const notification of accountNotifications) {
        refreshTokenBalance();
      }
    };
    getBalances();
  }, [account]);

  if (balance === null) {
    return <>Loading balance...</>;
  }

  return (
    <>
      {formatAddress(account.address)} has {formatBalance(balance)} USDC
    </>
  );
};

const formatAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

const formatBalance = (balance: number) => {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(balance);
}

export default WalletBalance;
