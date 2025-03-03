import { useEffect, useState } from 'react';

import type { UiWallet, UiWalletAccount } from '@wallet-standard/ui';
import { useConnect } from '@wallet-standard/react';

import WalletBalance from './WalletBalance';
import SendSplButton from './SendSplButton';

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
        ? <>
            <WalletBalance account={account} />
            <SendSplButton account={account} />
          </>
        : (isConnecting
          ? <>Connecting...</>
          : <>No account found</>)
      }
    </>
  );
};

export default WalletInfo;
