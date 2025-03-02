import { useContext, useEffect, useState } from 'react';

import type { WalletAccount } from '@wallet-standard/core';

import SelectedWalletContext from '../context/SelectedWalletContext';
import WalletBalance from './WalletBalance';

const WalletInfo = () => {
  const { getWalletAccount } = useContext(SelectedWalletContext);
  const [account, setAccount] = useState<WalletAccount | undefined>(undefined);

  useEffect(() => {
    const updateBalance = async () => {
      const account = await getWalletAccount();
      if (!account) return;

      setAccount(account);
    };
    updateBalance();
  }, [getWalletAccount]);

  return (
    <div>
      <h1 className="text-3xl font-bold">
        {!account
          ? 'No wallet connected'
          : <WalletBalance account={account} />
        }
      </h1>
    </div>
  );
};

export default WalletInfo;
