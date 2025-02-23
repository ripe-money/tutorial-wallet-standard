import { createContext, useState, type ReactNode } from 'react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/core/base/src/wallet.ts
import type { WalletAccount } from "@wallet-standard/core";

const ConnectedAccountContext = createContext<{
  selectedAccount: WalletAccount | undefined;
  setSelectedAccount: (account: WalletAccount) => void;
}>({
  selectedAccount: undefined,
  setSelectedAccount: () => {},
});

const ConnectedAccountContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAccount, setSelectedAccount] = useState<WalletAccount | undefined>(undefined);

  return (
    <ConnectedAccountContext.Provider value={{ selectedAccount, setSelectedAccount }}>
      {children}
    </ConnectedAccountContext.Provider>
  );
}

export default ConnectedAccountContext;
export { ConnectedAccountContextProvider as SelectedAccountContextProvider };
