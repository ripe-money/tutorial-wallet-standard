import { useEffect, useState } from 'react';

import type { WalletAccount } from '@wallet-standard/core';
import type { UiWallet } from '@wallet-standard/ui';

import WalletBalance from './WalletBalance';
// import SendSplButton from './SendSplButton';
import { getAccount } from '../lib/wallet-standard';

const WalletInfo = ({ wallet }: { wallet: UiWallet }) => {
  const [account, setAccount] = useState<WalletAccount | undefined>(undefined);

  useEffect(() => {
    const updateBalance = async () => {
      const account = await getAccount(wallet);
      if (!account) return;

      setAccount(account);
    };
    updateBalance();
  }, [wallet]);

  return (
    <>
      {account
        ? <>
            <WalletBalance account={account} />
            {/* <SendSplButton wallet={wallet} /> */}
          </>
        : 'No wallet connected'
      }
    </>
  );
};

export default WalletInfo;
