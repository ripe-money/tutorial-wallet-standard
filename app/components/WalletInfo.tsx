import { useContext, useEffect, useState } from 'react';

import type { WalletAccount } from '@wallet-standard/core';

import SelectedWalletContext from '../context/SelectedWalletContext';
import WalletBalance from './WalletBalance';
// import SendSplButton from './SendSplButton';
import { getAccount } from '../lib/wallet-standard';

const WalletInfo = () => {
  const { selectedWallet } = useContext(SelectedWalletContext);
  const [account, setAccount] = useState<WalletAccount | undefined>(undefined);

  useEffect(() => {
    const updateBalance = async () => {
      if (!selectedWallet) return;
      const account = await getAccount(selectedWallet);
      if (!account) return;

      setAccount(account);
    };
    updateBalance();
  }, [selectedWallet]);

  return (
    <div>
      <h1 className="text-3xl font-bold">
        {account && selectedWallet
          ? <>
              <WalletBalance account={account} />
              {/* <SendSplButton wallet={selectedWallet} /> */}
            </>
          : 'No wallet connected'
        }
      </h1>
    </div>
  );
};

export default WalletInfo;
