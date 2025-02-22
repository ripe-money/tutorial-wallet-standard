'use client';
import { useContext } from 'react';

import {
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/react/core
  useWallets,
  // https://github.com/wallet-standard/wallet-standard/tree/master/packages/ui/compare
  // getUiWalletAccountStorageKey,
} from '@wallet-standard/react';

import SelectedAccountContext from './context/SelectedAccountContext';
import WalletButton from './WalletButton';

export default function WalletList() {
  const { setSelectedAccount } = useContext(SelectedAccountContext);
  const availableWallets = useWallets();
  console.log(availableWallets);

  return (
    <>
      <h1 className="text-3xl font-bold">
        Available Wallets:
      </h1>
      <div className="flex flex-col">
        {availableWallets.map((wallet, i) => (
          <WalletButton key={i} wallet={wallet} onWalletConnect={(accounts) => {
            console.log(
              `Connected to ${wallet.name} with accounts:`,
              accounts.map(account => account.address)
            );
            if (accounts.length > 0) setSelectedAccount(accounts[0]);
          }}
          />
        ))}
      </div>
    </>
  );
}
