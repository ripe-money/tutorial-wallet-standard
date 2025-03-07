import { useEffect, useState } from 'react';

import type { UiWallet, UiWalletAccount } from '@wallet-standard/ui';
// https://github.com/wallet-standard/wallet-standard/tree/master/packages/react/core
import { useConnect } from '@wallet-standard/react';

import WalletBalance from './WalletBalance';
import SendSplButton from './SendSplButton';
import DeselectWalletButton from './DeselectWalletButton';

const WalletInfo = ({ wallet }: { wallet: UiWallet }) => {
  const [isConnecting, connect] = useConnect(wallet);
  const [connectedAccounts, setConnectedAccounts] = useState<readonly UiWalletAccount[]>();

  useEffect(() => {
    if (connectedAccounts) return;

    connect().then(setConnectedAccounts);
  }, [connect, connectedAccounts]);

  const account = connectedAccounts?.[0];
  return (
    <>
      {account
        ? <div className="flex flex-col">
            <WalletBalance account={account} />
            <DeselectWalletButton wallet={wallet} />
            <SendSplButton account={account} />
          </div>
        : (isConnecting
          ? <>Connecting...</>
          : <>No account found</>)
      }
    </>
  );
};

export default WalletInfo;
