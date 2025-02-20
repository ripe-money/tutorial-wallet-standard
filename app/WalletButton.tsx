'use client';

import {
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
  UiWallet, UiWalletAccount,
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/react/core
  useConnect,
} from '@wallet-standard/react';

import { StandardConnect } from '@wallet-standard/core';
import { SOLANA_MAINNET_CHAIN } from '@solana/wallet-standard';

type WalletButtonProps = Readonly<{
  onWalletConnect: (accounts: readonly UiWalletAccount[]) => void;
  wallet: UiWallet
}>

export default function WalletButton({ wallet, onWalletConnect }: WalletButtonProps) {
  const supportStandardConnect = wallet.features.includes(StandardConnect) && wallet.chains.includes(SOLANA_MAINNET_CHAIN);

  // Note: Show WalletConnectButton only if the wallet supports StandardConnect
  // because calling useConnect() (in WalletConnectButton) on a wallet
  // that doesn't support StandardConnect will throw an error.
  if (supportStandardConnect) {
    return (
      <WalletConnectButton wallet={wallet} onWalletConnect={onWalletConnect}>
        <ConnectButtonText wallet={wallet} />
      </WalletConnectButton>
    );
  } else {
    return (
      <button className={ConnectButtonClass} disabled>
        <ConnectButtonText wallet={wallet} />
      </button>
    );
  }
}

type WalletConnectButtonProps = Readonly<{
  onWalletConnect: (accounts: readonly UiWalletAccount[]) => void;
  wallet: UiWallet;
  children?: React.ReactNode;
}>

function WalletConnectButton({ wallet, onWalletConnect, children }: WalletConnectButtonProps) {
  const [isConnecting, connect] = useConnect(wallet);

  return (
    <button className={ConnectButtonClass} disabled={isConnecting} onClick={async () => {
      const accounts = await connect();
      onWalletConnect(accounts);
    }}>
      {isConnecting ? 'Connecting...' : children}
    </button>
  );
}

const ConnectButtonClass = 'btn btn-primary m-2';
const ConnectButtonText = ({wallet}: { wallet: UiWallet }) => (
  <>
    {wallet.name}&nbsp;
    ({wallet.chains[0].split(':')[0] /* Pull out the chain name */})
  </>
);
