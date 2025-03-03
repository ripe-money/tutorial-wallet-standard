import { createContext, useEffect, useState, type ReactNode } from 'react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
import type { UiWallet } from '@wallet-standard/react';
// https://github.com/wallet-standard/wallet-standard/blob/master/packages/react/core
import { useWallets } from '@wallet-standard/react';

import { saveWallet, loadWallet } from '../lib/localStore';

const SelectedWalletContext = createContext<{
  selectWallet: (wallet: UiWallet) => void;
  selectedWallet?: UiWallet;
}>({
  selectWallet: () => console.error('selectWallet not implemented'),
  selectedWallet: undefined,
});

const SelectedWalletContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedWallet, setSelectedWallet] = useState<UiWallet | undefined>(undefined);
  const availableWallets = useWallets();

  // Re-selecting previously selected wallet, which was recorded in localStorage.
  useEffect(() => {
    if (selectedWallet) return;

    const wallet = loadWallet(availableWallets);
    if (!wallet) return; // The wallet may not be available (injected into our environment) yet.

    setSelectedWallet(wallet);
  }, [availableWallets, selectedWallet]);

  const selectWallet = (wallet: UiWallet) => {
    setSelectedWallet(wallet)
    saveWallet(wallet);
  };

  return (
    <SelectedWalletContext.Provider value={{ selectWallet, selectedWallet }}>
      {children}
    </SelectedWalletContext.Provider>
  );
}

export default SelectedWalletContext;
export { SelectedWalletContextProvider };
