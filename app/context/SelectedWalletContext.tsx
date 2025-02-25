import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
import type { UiWallet } from '@wallet-standard/react';
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
  const _connectWallet = useCallback(({ wallet }: { wallet: UiWallet }) => {
    setConnectedWallet(wallet);
  }, []);

  useEffect(() => {
    if (connectedWallet) return; // already connected

    const wallet = loadWallet(availableWallets);
    if (!wallet) return; // The wallet may not be available (injected into our environment) yet.

    console.log('Reconnecting to previous wallet:', wallet);
    _connectWallet({ wallet });
  }, [_connectWallet, availableWallets, connectedWallet]);

  const connectWallet = (wallet: UiWallet) => {
    console.log('Connecting to wallet:', wallet.name);
    _connectWallet({ wallet })
    saveWallet(wallet);
  };

  return (
    <ConnectedWalletContext.Provider value={{ connectedWallet, connectWallet }}>
      {children}
    </ConnectedWalletContext.Provider>
  );
}

export default ConnectedWalletContext;
export { ConnectedWalletContextProvider };
