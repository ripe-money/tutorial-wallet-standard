import { createContext, useEffect, useState, type ReactNode } from 'react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/core/base/src/wallet.ts
import type { WalletAccount } from "@wallet-standard/core";
// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
import type { UiWallet } from '@wallet-standard/react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/react/core
import { useWallets } from '@wallet-standard/react';

import { connectUiWallet as _connectUiWallet } from '../lib/wallet-standard';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/core/base/src/identifier.ts
import type { IdentifierString } from "@wallet-standard/core";
const isIdentifierString = (value: string): value is IdentifierString => value.includes(':');

const STORAGE_KEY = 'ripe:connected-wallet';
const saveWallet = (wallet: UiWallet) => {
  // Wallet name doesn't uniquely identify a wallet.
  // E.g. "Phantom" injects multiple wallets (Solana, Bitcoin, Sui, etc.)
  // Each injected wallet has multiple chains, but they're basically mainnet and various testnets.
  // AFAIK, the first chain is always the mainnet, so this key should be unique enough.
  const storedWalletKey = `${wallet.chains[0]}@${wallet.name}`;
  localStorage.setItem(STORAGE_KEY, storedWalletKey);
}
const loadWallet = (availableWallets: readonly UiWallet[]) => {
  const storedWalletKey = localStorage.getItem(STORAGE_KEY);
  if (!storedWalletKey) return;

  const [chain, walletName] = storedWalletKey.split('@');
  if (!chain || !walletName || !isIdentifierString(chain)) {
    return console.error('Invalid wallet key format:', storedWalletKey);
  }

  return availableWallets.find((w: UiWallet) =>
    w.name === walletName && w.chains.includes(chain)
  );
}

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

  useEffect(() => {
    if (connectedAccount) return; // already connected

    const wallet = loadWallet(availableWallets);
    if (!wallet) return; // The wallet may not be available yet.

    console.log('Found wallet:', wallet);

    _connectUiWallet(wallet)
      .then((accounts) => {if (accounts.length > 0) setConnectedAccount(accounts[0])})
      .catch((error) => {
        console.error(`Error connecting to ${wallet.name}:`, error);
      });
  }, [availableWallets, connectedAccount]);

  const connectUiWallet = (wallet: UiWallet) => {
    console.log('Connecting to wallet:', wallet.name);

    _connectUiWallet(wallet)
      .then((accounts) => {if (accounts.length > 0) setConnectedAccount(accounts[0])})
      .catch((error) => {
        console.error(`Error connecting to ${wallet.name}:`, error);
      })
      .then(() => saveWallet(wallet));
  };

  return (
    <ConnectedAccountContext.Provider value={{ connectedAccount, connectUiWallet }}>
      {children}
    </ConnectedAccountContext.Provider>
  );
}

export default ConnectedAccountContext;
export { ConnectedAccountContextProvider };
