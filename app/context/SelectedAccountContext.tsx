import { createContext, useState, type ReactNode } from 'react';

// import {
//   // https://github.com/wallet-standard/wallet-standard/tree/master/packages/ui/compare
//   getUiWalletAccountStorageKey,
// } from '@wallet-standard/react';
import type { WalletAccount } from "@wallet-standard/core";

const SelectedAccountContext = createContext<{
  selectedAccount: WalletAccount | undefined;
  setSelectedAccount: (account: WalletAccount) => void;
}>({
  selectedAccount: undefined,
  setSelectedAccount: () => {},
});

const SelectedAccountContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAccount, setSelectedAccount] = useState<WalletAccount | undefined>(undefined);

  return (
    <SelectedAccountContext.Provider value={{ selectedAccount, setSelectedAccount }}>
      {children}
    </SelectedAccountContext.Provider>
  );
}

export default SelectedAccountContext;
export { SelectedAccountContextProvider };
