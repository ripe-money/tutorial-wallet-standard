import { createContext, useState, type ReactNode } from 'react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/core/base/src/wallet.ts
import type { WalletAccount } from "@wallet-standard/core";

const ConnectedAccountContext = createContext<{
  connectedAccount: WalletAccount | undefined;
  setConnectedAccount: (account: WalletAccount) => void;
}>({
  connectedAccount: undefined,
  setConnectedAccount: () => {},
});

const ConnectedAccountContextProvider = ({ children }: { children: ReactNode }) => {
  const [connectedAccount, setConnectedAccount] = useState<WalletAccount | undefined>(undefined);

  return (
    <ConnectedAccountContext.Provider value={{ connectedAccount, setConnectedAccount }}>
      {children}
    </ConnectedAccountContext.Provider>
  );
}

export default ConnectedAccountContext;
export { ConnectedAccountContextProvider };
