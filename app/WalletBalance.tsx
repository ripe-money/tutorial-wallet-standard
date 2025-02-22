import { useContext, useEffect, useState } from 'react';

import SelectedAccountContext from './context/SelectedAccountContext';
import { getSolUsdcBalance } from './solana';

const WalletBalance = () => {
  const { selectedAccount } = useContext(SelectedAccountContext);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (selectedAccount) {
      console.log('Fetching balance for account:', selectedAccount);

      // getSolBalance(selectedAccount);
      getSolUsdcBalance(selectedAccount).then(balance => setBalance(balance));
    }
  }, [selectedAccount]);

  return (
    <div>
      <h1 className="text-3xl font-bold">
        {!selectedAccount
          ? 'No account selected'
          : (balance === null
            ? 'Loading balance...'
            : `${formatAddress(selectedAccount.address)} has ${formatBalance(balance)} USDC`)}
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
