"use client";
import { useEffect } from 'react';

import { removeWallet } from '../lib/localStore';

const Page = () => {
  useEffect(() => removeWallet(), []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-3xl font-bold">Reset</h1>
      <p>Coming to this page resets the app.</p>
      <p>It removes the wallet identifier from local storage.</p>
      <p>You could do this manually on a desktop browser using the developer console, but this page makes it easy on a DApp browsers.</p>
    </div>
  );
};

export default Page;