import { createContext, useEffect, useState, type ReactNode } from 'react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/core/base/src/wallet.ts
import type { WalletAccount } from "@wallet-standard/core";
// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
import type { UiWallet } from '@wallet-standard/react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/react/core
import { useWallets } from '@wallet-standard/react';

import { connectUiWallet as _connectUiWallet } from '../lib/wallet-standard';

const STORAGE_KEY = 'ripe:connected-wallet';
const saveWallet = (wallet: UiWallet) => {
  localStorage.setItem(STORAGE_KEY, wallet.name);
}

const ConnectedAccountContext = createContext<{
  connectedAccount: WalletAccount | undefined;
  connectUiWallet: (wallet: UiWallet) => void;
}>({
  connectedAccount: undefined,
  connectUiWallet: () => console.error('connectUiWallet not implemented'),
});

const ConnectedAccountContextProvider = ({ children }: { children: ReactNode }) => {
  const [connectedAccount, setConnectedAccount] = useState<WalletAccount | undefined>(undefined);
  const availableWallets = useWallets();

  useEffect(() => {
    const storedWalletName = localStorage.getItem(STORAGE_KEY);

    // If we were previously connected to a wallet but not now, try to reconnect to it.
    if (storedWalletName && !connectedAccount) {
      const wallet = availableWallets.find((w: UiWallet) => w.name === storedWalletName);
      if (!wallet) return; // The wallet may not be available yet.

      console.log('Found wallet:', wallet);

      _connectUiWallet(wallet)
        .then((accounts) => {if (accounts.length > 0) setConnectedAccount(accounts[0])})
        .catch((error) => {
          console.error(`Error connecting to ${wallet.name}:`, error);
        });
    }
  }, [availableWallets, connectedAccount]);

  const connectUiWallet = (wallet: UiWallet) => {
    console.log('Connecting to wallet:', wallet.name);

    _connectUiWallet(wallet)
      .then((accounts) => {if (accounts.length > 0) setConnectedAccount(accounts[0])})
      .catch((error) => {
        console.error(`Error connecting to ${wallet.name}:`, error);
      })
      .then(() => saveWallet(wallet));
  };

  return (
    <ConnectedAccountContext.Provider value={{ connectedAccount, connectUiWallet }}>
      {children}
    </ConnectedAccountContext.Provider>
  );
}

export default ConnectedAccountContext;
export { ConnectedAccountContextProvider };
