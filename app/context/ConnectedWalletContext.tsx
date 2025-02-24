import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';

import { StandardConnect, type StandardConnectFeature } from '@wallet-standard/core';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
import type { UiWallet } from '@wallet-standard/react';
// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/features
import { getWalletFeature } from '@wallet-standard/react';
// https://github.com/wallet-standard/wallet-standard/blob/master/packages/react/core
import { useWallets } from '@wallet-standard/react';

import { saveWallet, loadWallet } from '../lib/localStore';

const ConnectedWalletContext = createContext<{
  connectedWallet: UiWallet | undefined;
  connectWallet: (wallet: UiWallet) => void;
}>({
  connectedWallet: undefined,
  connectWallet: () => console.error('connectWallet not implemented'),
});

const ConnectedWalletContextProvider = ({ children }: { children: ReactNode }) => {
  const [connectedWallet, setConnectedWallet] = useState<UiWallet | undefined>(undefined);
  const availableWallets = useWallets();

  // Connect to a wallet using the Standard Connect feature.
  // I.e., the wallet is assumed to support the "standard:connect" feature.
  type StandardConnectFeatureType = StandardConnectFeature[typeof StandardConnect];
  const _connectUiWallet = useCallback(({ wallet, silent = false }: { wallet: UiWallet, silent?: boolean }) => {
    return (getWalletFeature(wallet, StandardConnect) as StandardConnectFeatureType)
      .connect({ silent })
      .then(() => setConnectedWallet(wallet))
      // .then(({ accounts }) => {if (accounts.length > 0) setConnectedWallet(accounts[0])})
      .catch((error) => console.log(`Error connecting to ${wallet.name}:`, error));
  }, []);

  useEffect(() => {
    if (connectedWallet && connectedWallet.accounts.length > 0) return; // already connected

    const wallet = loadWallet(availableWallets);
    if (!wallet) return; // The wallet may not be available (injected into our environment) yet.

    console.log('Reconnecting to previous wallet:', wallet);
    _connectUiWallet({ wallet, silent: true });
  }, [_connectUiWallet, availableWallets, connectedWallet]);

  const connectWallet = (wallet: UiWallet) => {
    console.log('Connecting to wallet:', wallet.name);
    _connectUiWallet({ wallet })
      .then(() => saveWallet(wallet));
  };

  return (
    <ConnectedWalletContext.Provider value={{ connectedWallet: connectedWallet, connectWallet }}>
      {children}
    </ConnectedWalletContext.Provider>
  );
}

export default ConnectedWalletContext;
export { ConnectedWalletContextProvider };
