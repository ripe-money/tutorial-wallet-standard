import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
import type { UiWallet } from '@wallet-standard/react';
// https://github.com/wallet-standard/wallet-standard/blob/master/packages/react/core
import { useWallets } from '@wallet-standard/react';

import { saveWallet, loadWallet } from '../lib/localStore';

const SelectedWalletContext = createContext<{
  selectedWallet: UiWallet | undefined;
  selectWallet: (wallet: UiWallet) => void;
}>({
  selectedWallet: undefined,
  selectWallet: () => console.error('selectWallet not implemented'),
});

const SelectedWalletContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedWallet, setSelectedWallet] = useState<UiWallet | undefined>(undefined);
  const availableWallets = useWallets();

  // Connect to a wallet using the Standard Connect feature.
  // I.e., the wallet is assumed to support the "standard:connect" feature.
  const _connectWallet = useCallback(({ wallet }: { wallet: UiWallet }) => {
    setSelectedWallet(wallet);
  }, []);

  useEffect(() => {
    if (selectedWallet) return; // already connected

    const wallet = loadWallet(availableWallets);
    if (!wallet) return; // The wallet may not be available (injected into our environment) yet.

    console.log('Reconnecting to previous wallet:', wallet);
    _connectWallet({ wallet });
  }, [_connectWallet, availableWallets, selectedWallet]);

  const selectWallet = (wallet: UiWallet) => {
    console.log('Connecting to wallet:', wallet.name);
    _connectWallet({ wallet })
    saveWallet(wallet);
  };

  return (
    <SelectedWalletContext.Provider value={{ selectedWallet, selectWallet }}>
      {children}
    </SelectedWalletContext.Provider>
  );
}

export default SelectedWalletContext;
export { SelectedWalletContextProvider };
