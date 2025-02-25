import { useContext, useEffect, useState } from 'react';

import SelectedWalletContext from '../context/SelectedWalletContext';
import { getSolUsdcBalance, sendSolUsdcFrom } from '../lib/solana';
import { getWalletAddress } from '../lib/wallet-standard';

const WalletBalance = () => {
  const { selectedWallet } = useContext(SelectedWalletContext);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedWallet) return;

    getWalletAddress(selectedWallet)
      .then(address => setWalletAddress(address))
      // .then(() => getSolBalance(selectedWallet))
      .then(() => getSolUsdcBalance(selectedWallet))
      .then(balance => setBalance(balance));
  }, [selectedWallet]);

  return (
    <div>
      <h1 className="text-3xl font-bold">
        {!selectedWallet
          ? 'No wallet selected'
          : (balance === null || walletAddress === undefined)
            ? 'Loading balance...'
            : (<>
                {formatAddress(walletAddress)} has {formatBalance(balance)} USDC
                <button className="btn btn-primary my-2"
                  onClick={() => sendSolUsdcFrom(selectedWallet)}
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
