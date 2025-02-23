import { createContext, useState, type ReactNode } from 'react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/core/base/src/wallet.ts
import type { WalletAccount } from "@wallet-standard/core";

// WalletAccount has fields: address, publicKey, chains, features, label, icon.
// It's possible for two different wallets to be configured with the same WalletAccount.
// We add a walletName field to track which wallet the user has connected the account from.
type AccountWithWallet = WalletAccount & {
  walletName: string;
}

const SelectedAccountContext = createContext<{
  selectedAccount: AccountWithWallet | undefined;
  setSelectedAccount: (account: AccountWithWallet) => void;
}>({
  selectedAccount: undefined,
  setSelectedAccount: () => {},
});

const SelectedAccountContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAccount, _setSelectedAccount] = useState<AccountWithWallet | undefined>(undefined);

  const setSelectedAccount = (account: AccountWithWallet) => {
    console.log('Setting selected account:', account);
    _setSelectedAccount(account);
  };

  return (
    <SelectedAccountContext.Provider value={{ selectedAccount, setSelectedAccount }}>
      {children}
    </SelectedAccountContext.Provider>
  );
}

export default SelectedAccountContext;
export { SelectedAccountContextProvider };
