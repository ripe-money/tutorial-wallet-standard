import { WalletAccount } from "@wallet-standard/core";

import { address } from '@solana/web3.js';

import { createSolanaRpc, Rpc, GetBalanceApi } from '@solana/web3.js';
const rpc: Rpc<GetBalanceApi> = createSolanaRpc('https://sibylla-ghbj3j-fast-mainnet.helius-rpc.com');

export const getSolBalance = async (account: WalletAccount) => {
  const { value: lamports } =
    await rpc.getBalance(address(account.address), { commitment: 'confirmed' }).send();
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 5 }).format(
      // @ts-expect-error This format string is 100% allowed now.
      `${lamports}E-9`,
  );
}
