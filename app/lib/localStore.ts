// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
import type { UiWallet } from '@wallet-standard/react';

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
};

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
};

const removeWallet = () => {
  localStorage.removeItem(STORAGE_KEY);
}

export { saveWallet, loadWallet, removeWallet };
