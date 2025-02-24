import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/core/base/src/wallet.ts
import type { WalletAccount } from "@wallet-standard/core";
import { StandardConnect, type StandardConnectFeature } from '@wallet-standard/core';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
import type { UiWallet } from '@wallet-standard/react';
// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/features
import { getWalletFeature } from '@wallet-standard/react';
// https://github.com/wallet-standard/wallet-standard/blob/master/packages/react/core
import { useWallets } from '@wallet-standard/react';

import { saveWallet, loadWallet } from '../lib/localStore';

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

  // Connect to a wallet using the Standard Connect feature.
  // I.e., the wallet is assumed to support the "standard:connect" feature.
  type StandardConnectFeatureType = StandardConnectFeature[typeof StandardConnect];
  const _connectUiWallet = useCallback(({ wallet, silent = false }: { wallet: UiWallet, silent?: boolean }) => {
    return (getWalletFeature(wallet, StandardConnect) as StandardConnectFeatureType)
      .connect({ silent })
      .then(({ accounts }) => {if (accounts.length > 0) setConnectedAccount(accounts[0])})
      .catch((error) => console.log(`Error connecting to ${wallet.name}:`, error));
  }, []);

  useEffect(() => {
    if (connectedAccount) return; // already connected

    const wallet = loadWallet(availableWallets);
    if (!wallet) return; // The wallet may not be available yet.

    console.log('Reconnecting to previous wallet:', wallet);
    _connectUiWallet({ wallet, silent: true });
  }, [_connectUiWallet, availableWallets, connectedAccount]);

  const connectUiWallet = (wallet: UiWallet) => {
    console.log('Connecting to wallet:', wallet.name);
    _connectUiWallet({ wallet }).then(() => saveWallet(wallet));
  };

  return (
    <ConnectedAccountContext.Provider value={{ connectedAccount, connectUiWallet }}>
      {children}
    </ConnectedAccountContext.Provider>
  );
}

export default ConnectedAccountContext;
export { ConnectedAccountContextProvider };
