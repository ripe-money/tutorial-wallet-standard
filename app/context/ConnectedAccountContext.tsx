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
