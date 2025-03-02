import { useEffect, useState } from 'react';

import type { WalletAccount } from '@wallet-standard/core';

import solana from '../lib/solana';

import { SendSplButton } from './SendSplButton';

const WalletBalance = ({ account }: { account: WalletAccount }) => {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    solana.getSolBalance(account);
    solana.getUsdcBalance(account).then(balance => setBalance(balance));
  }, [account]);

  if (balance === null) {
    return <>Loading balance...</>;
  }

  return (
    <>
      {formatAddress(account.address)} has {formatBalance(balance)} USDC
      <SendSplButton />
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
