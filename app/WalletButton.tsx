'use client';

import {
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
  UiWallet,
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/react/core
  useConnect,
} from '@wallet-standard/react';

import { StandardConnect } from '@wallet-standard/core';
import { SOLANA_MAINNET_CHAIN } from '@solana/wallet-standard';

export default function WalletButton({ wallet }: { wallet: UiWallet }) {
  const supportStandardConnect = wallet.features.includes(StandardConnect) && wallet.chains.includes(SOLANA_MAINNET_CHAIN);

  // Note: Show WalletConnectButton only if the wallet supports StandardConnect
  // because calling useConnect() on a wallet that doesn't support StandardConnect
  // will throw an error.
  if (supportStandardConnect) {
    return (
      <WalletConnectButton wallet={wallet}>
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

function WalletConnectButton({ wallet, children }: { wallet: UiWallet, children?: React.ReactNode }) {
  const [isConnecting, connect] = useConnect(wallet);

  const handleConnectClick = async () => {
    const nextAccounts = await connect();
    console.log('Connected to wallet with accounts:', nextAccounts.map(account => account.address));
  }

  return (
    <button className={ConnectButtonClass} disabled={isConnecting} onClick={handleConnectClick}>
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
