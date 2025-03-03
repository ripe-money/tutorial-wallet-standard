import { useEffect, useState } from 'react';

import type { UiWallet, UiWalletAccount } from '@wallet-standard/ui';
import { useConnect } from '@wallet-standard/react';

import WalletBalance from './WalletBalance';
// import SendSplButton from './SendSplButton';

const WalletInfo = ({ wallet }: { wallet: UiWallet }) => {
  const [isConnecting, connect] = useConnect(wallet);
  const [connectedAccounts, setConnectedAccounts] = useState<readonly UiWalletAccount[]>();

  useEffect(() => {
    if (connectedAccounts) return;

    connect().then((accounts) => {
      setConnectedAccounts(accounts);
      console.log('Connected accounts:', accounts);
    });
  }, [connect, connectedAccounts]);

  return (
    <>
      {connectedAccounts && connectedAccounts.length > 0
        ? <>
            <WalletBalance account={connectedAccounts[0]} />
            {/* <SendSplButton wallet={wallet} /> */}
          </>
        : (isConnecting
          ? <>Connecting...</>
          : <>No account found</>)
      }
    </>
  );
};

export default WalletInfo;
