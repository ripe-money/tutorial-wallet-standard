import React, { useContext } from 'react';

import SelectedAccountContext from './context/SelectedAccountContext';

const WalletBalance = () => {
  const { selectedAccount } = useContext(SelectedAccountContext);
  console.log('Selected account:', selectedAccount);

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Wallet Balance Component
      </h1>
    </div>
  );
};

export default WalletBalance;
