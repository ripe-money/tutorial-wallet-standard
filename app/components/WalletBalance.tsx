import { useContext, useEffect, useState } from 'react';

import SelectedWalletContext from '../context/SelectedWalletContext';
import solana from '../lib/solana';
import { getAccount } from '../lib/wallet-standard';

import { SendSplButton } from './SendSplButton';

const WalletBalance = () => {
  const { selectedWallet } = useContext(SelectedWalletContext);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedWallet) return;

    getAccount(selectedWallet)
      .then(account => {
        if (!account) return;

        setWalletAddress(account.address);
        solana.getSolBalance(account);
        solana.getUsdcBalance(account)
          .then(balance => setBalance(balance));
      });
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
                <SendSplButton wallet={selectedWallet} />
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
