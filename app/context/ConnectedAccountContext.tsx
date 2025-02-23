import { createContext, useState, type ReactNode } from 'react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/core/base/src/wallet.ts
import type { WalletAccount } from "@wallet-standard/core";
// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
import type { UiWallet } from '@wallet-standard/react';

import { connectUiWallet as _connectUiWallet } from '../lib/wallet-standard';

const ConnectedAccountContext = createContext<{
  connectedAccount: WalletAccount | undefined;
  connectUiWallet: (wallet: UiWallet) => Promise<void>;
}>({
  connectedAccount: undefined,
  connectUiWallet: () => Promise.resolve(),
});

const ConnectedAccountContextProvider = ({ children }: { children: ReactNode }) => {
  const [connectedAccount, setConnectedAccount] = useState<WalletAccount | undefined>(undefined);

  const connectUiWallet = async (wallet: UiWallet) => {
    console.log('Connecting to wallet:', wallet.name);

    try {
      const accounts = await _connectUiWallet(wallet);
      if (accounts.length > 0) setConnectedAccount(accounts[0]);
    } catch (WalletStandardError) {
      console.error('Error. Maybe Standard Connect is not supported by wallet:', WalletStandardError);
    }
  };

  return (
    <ConnectedAccountContext.Provider value={{ connectedAccount, connectUiWallet }}>
      {children}
    </ConnectedAccountContext.Provider>
  );
}

export default ConnectedAccountContext;
export { ConnectedAccountContextProvider };
