import { useContext, useEffect, useState } from 'react';

import ConnectedAccountContext from './context/SelectedAccountContext';
import { getSolUsdcBalance } from './solana';

const WalletBalance = () => {
  const { connectedAccount } = useContext(ConnectedAccountContext);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (connectedAccount) {
      console.log('Fetching balance for account:', connectedAccount);

      // getSolBalance(connectedAccount);
      getSolUsdcBalance(connectedAccount).then(balance => setBalance(balance));
    }
  }, [connectedAccount]);

  return (
    <div>
      <h1 className="text-3xl font-bold">
        {!connectedAccount
          ? 'No account connected'
          : (balance === null
            ? 'Loading balance...'
            : `${formatAddress(connectedAccount.address)} has ${formatBalance(balance)} USDC`)}
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
