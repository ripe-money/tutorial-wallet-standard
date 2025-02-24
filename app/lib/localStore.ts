// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
import type { UiWallet } from '@wallet-standard/react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/core/base/src/identifier.ts
import type { IdentifierString } from "@wallet-standard/core";
const isIdentifierString = (value: string): value is IdentifierString => value.includes(':');

const STORAGE_KEY = 'ripe:connected-wallet';
interface StoredWalletKeyObj {
  walletName: string;
  mainChain: IdentifierString;
}
function isStoredWalletKeyObj(value: unknown): value is StoredWalletKeyObj {
  return (
    typeof value === 'object' &&
    value !== null &&
    'walletName' in value &&
    'mainChain' in value &&
    typeof value.mainChain === 'string' &&
    isIdentifierString(value.mainChain)
  );
}

const saveWallet = (wallet: UiWallet) => {
  // Wallet name doesn't uniquely identify a wallet.
  // E.g. "Phantom" injects multiple wallets (Solana, Bitcoin, Sui, etc.)
  // Each injected wallet has multiple chains, but they're basically mainnet and various testnets.
  // AFAIK, the first chain is always the mainnet, so this key should be unique enough.
  const walletName = wallet.name;
  const mainChain = wallet.chains[0];
  if (!isIdentifierString(mainChain)) {
    return console.error('Invalid wallet chain:', mainChain);
  }

  const storedWalletKeyObj = { walletName, mainChain };
  if (!isStoredWalletKeyObj(storedWalletKeyObj)) {
    return console.error('Invalid wallet key object:', storedWalletKeyObj);
  }

  const storedWalletKeyJson = JSON.stringify({ walletName, mainChain });
  localStorage.setItem(STORAGE_KEY, storedWalletKeyJson);
};

const loadWallet = (availableWallets: readonly UiWallet[]) => {
  const storedWalletKey = localStorage.getItem(STORAGE_KEY);
  if (!storedWalletKey) return;

  const storedWalletKeyObj = JSON.parse(storedWalletKey);
  if (!isStoredWalletKeyObj(storedWalletKeyObj)) return;
  const { walletName, mainChain } = storedWalletKeyObj;

  return availableWallets.find((w: UiWallet) =>
    w.name === walletName && w.chains.includes(mainChain)
  );
};

const removeWallet = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export { saveWallet, loadWallet, removeWallet };
