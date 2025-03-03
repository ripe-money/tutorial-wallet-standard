import { useEffect, useState } from 'react';

import type { UiWalletAccount } from '@wallet-standard/ui';

import solana from '../lib/solana';

const WalletBalance = ({ account }: { account: UiWalletAccount }) => {
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
