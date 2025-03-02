import { useContext, useEffect, useState } from 'react';

import type { WalletAccount } from '@wallet-standard/core';

import SelectedWalletContext from '../context/SelectedWalletContext';
import solana from '../lib/solana';

import { SendSplButton } from './SendSplButton';

const WalletInfo = () => {
  const { getWalletAccount } = useContext(SelectedWalletContext);
  const [account, setAccount] = useState<WalletAccount | undefined>(undefined);

  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const updateBalance = async () => {
      const account = await getWalletAccount();
      if (!account) return;

      setAccount(account);
      solana.getSolBalance(account);
      solana.getUsdcBalance(account).then(balance => setBalance(balance));
    };
    updateBalance();
  }, [getWalletAccount]);

  return (
    <div>
      <h1 className="text-3xl font-bold">
        {!account
          ? 'No wallet connected'
          : balance === null
            ? 'Loading balance...'
            : (<>
                {formatAddress(account.address)} has {formatBalance(balance)} USDC
                <SendSplButton />
              </>)
        }
      </h1>
    </div>
  );
};

const formatAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

const formatBalance = (balance: number) => {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(balance);
}

export default WalletInfo;
