import { useContext, useEffect, useState } from 'react';

import ConnectedWalletContext from '../context/SelectedWalletContext';
import { getSolUsdcBalance, sendSolUsdcFrom } from '../lib/solana';
import { getWalletAddress } from '../lib/wallet-standard';

const WalletBalance = () => {
  const { connectedWallet } = useContext(ConnectedWalletContext);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!connectedWallet) return;

    getWalletAddress(connectedWallet)
      .then(address => setWalletAddress(address))
      // .then(() => getSolBalance(connectedWallet))
      .then(() => getSolUsdcBalance(connectedWallet))
      .then(balance => setBalance(balance));
  }, [connectedWallet]);

  return (
    <div>
      <h1 className="text-3xl font-bold">
        {!connectedWallet
          ? 'No wallet connected'
          : (balance === null || walletAddress === undefined)
            ? 'Loading balance...'
            : (<>
                {formatAddress(walletAddress)} has {formatBalance(balance)} USDC
                <button className="btn btn-primary my-2"
                  onClick={() => sendSolUsdcFrom(connectedWallet)}
                >
                  Send 0.01 USDC
                </button>
              </>)
        }
      </h1>
    </div>
  );
};

const formatAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

const formatBalance = (balance: number) => {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(balance);
}

export default WalletBalance;
