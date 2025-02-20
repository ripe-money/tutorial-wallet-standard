'use client';

// May be helpful to look at the Solana sample app
// https://github.com/anza-xyz/solana-web3.js/tree/main/examples/react-app/src
import {
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
  UiWallet,
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/react/core
  useWallets, useConnect,
  // https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/features
  // getWalletFeature,
  // https://github.com/wallet-standard/wallet-standard/tree/master/packages/ui/compare
  // getUiWalletAccountStorageKey,
} from '@wallet-standard/react';

import { StandardConnect } from '@wallet-standard/core';
import { SOLANA_MAINNET_CHAIN } from '@solana/wallet-standard';

export default function WalletList() {
  const wallets = useWallets();
  console.log(wallets);

  return (
    <>
      <h1 className="text-3xl font-bold">
        Available Wallets:
      </h1>
      <div className="flex flex-col">
        {wallets.map((wallet, i) => {
          const supportStandardConnect = wallet.features.includes(StandardConnect) && wallet.chains.includes(SOLANA_MAINNET_CHAIN);

          if (!supportStandardConnect) {
            return (
              <button key={i} className={ConnectButtonClass} disabled>
                <ConnectButtonText wallet={wallet} />
              </button>
            );
          } else {
            return (
              <WalletConnectButton key={i} wallet={wallet}>
                <ConnectButtonText wallet={wallet} />
              </WalletConnectButton>
            );
          }
        })}
      </div>
    </>
  );
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
