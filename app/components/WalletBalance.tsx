import { useContext, useEffect, useState } from 'react';

import ConnectedWalletContext from '../context/ConnectedWalletContext';
import { getSolUsdcBalance, sendSolUsdcFrom } from '../lib/solana';

const WalletBalance = () => {
  const { connectedAccount } = useContext(ConnectedWalletContext);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (connectedAccount) {
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
            : (<>
                {formatAddress(connectedAccount.address)} has {formatBalance(balance)} USDC
                <button className="btn btn-primary my-2"
                  onClick={() => sendSolUsdcFrom(connectedAccount)}
                >
                  Send 0.01 USDC
                </button>
              </>)
            )
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
