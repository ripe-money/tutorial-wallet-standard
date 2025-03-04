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
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (connectedAccounts) return;

    connect().then(setConnectedAccounts);
  }, [connect, connectedAccounts]);

  const account = connectedAccounts?.[0];
  return (
    <>
      {account
        ? <div className="flex flex-col">
            <WalletBalance account={account} key={key} />
            <DeselectWalletButton wallet={wallet} />
            <SendSplButton account={account} onTransactionSent={() => {
              // Update the wallet balance after sending a transaction
              // Force a re-render by changing the (unnecessary) `key` prop.
              // See https://josipmisko.com/posts/react-force-rerender
              // Also wait 2 seconds to ensure the new balance is properly reflected
              setTimeout(() => setKey((k) => k + 1), 2000);
            }} />
          </div>
        : (isConnecting
          ? <>Connecting...</>
          : <>No account found</>)
      }
    </>
  );
};

export default WalletInfo;
