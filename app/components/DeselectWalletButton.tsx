'use client';
import { useContext } from 'react';

// https://github.com/wallet-standard/wallet-standard/blob/master/packages/ui/core
import type { UiWallet } from '@wallet-standard/ui';
// https://github.com/wallet-standard/wallet-standard/tree/master/packages/react/core#usedisconnectuiwallet
import { useDisconnect } from '@wallet-standard/react';

import SelectedWalletContext from '../context/SelectedWalletContext';

export default function DeselectWalletButton({
  wallet
}: Readonly<{
  wallet: UiWallet
}>) {
  const { deselectWallet } = useContext(SelectedWalletContext);
    const [isDisconnecting, disconnect] = useDisconnect(wallet);

  return (
    <button
      className="btn btn-primary my-2"
      onClick={() => {
        deselectWallet();
        // At least some wallets (e.g. Phantom) don't seem to do anything on disconnect.
        disconnect().then(() => console.log('Disconnected'));
      }}
    >
      {isDisconnecting ? 'Disconnecting...' : `Disconnect ${wallet.name}`}
    </button>
  );
}