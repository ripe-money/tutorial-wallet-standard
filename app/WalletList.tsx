'use client';

// May be helpful to look at the Solana sample app
// https://github.com/anza-xyz/solana-web3.js/tree/main/examples/react-app/src
import { useContext } from 'react';

import {
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/react/core
  useWallets,
  // https://github.com/wallet-standard/wallet-standard/tree/master/packages/ui/compare
  // getUiWalletAccountStorageKey,
} from '@wallet-standard/react';

import SelectedAccountContext from './context/SelectedAccountContext';
import WalletButton from './WalletButton';

import { getBalance } from './solana';

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
          <WalletButton key={i} wallet={wallet} onWalletConnect={async (accounts) => {
            console.log('Connected to accounts:', accounts.map(account => account.address));
            if (accounts.length > 0) {
              setSelectedAccount(accounts[0]);
              getBalance(accounts[0]);
            }
          }}
          />
        ))}
      </div>
    </>
  );
}
