import { WalletAccount } from "@wallet-standard/core";

import { address } from '@solana/web3.js';

import { createSolanaRpc, Rpc, GetBalanceApi, GetTokenAccountsByOwnerApi } from '@solana/web3.js';
const rpc: Rpc<GetBalanceApi & GetTokenAccountsByOwnerApi> =
  createSolanaRpc('https://sibylla-ghbj3j-fast-mainnet.helius-rpc.com');

export const getBalance = async (account: WalletAccount) => {
  const { value: lamports } =
    await rpc.getBalance(address(account.address), { commitment: 'confirmed' }).send();
  const formattedSolValue = new Intl.NumberFormat(undefined, { maximumFractionDigits: 5 }).format(
    // @ts-expect-error This format string is 100% allowed now.
    `${lamports}E-9`,
  );
  console.log('Balance:', formattedSolValue, 'SOL');

  const info = await rpc.getTokenAccountsByOwner(
    address(account.address),
    { mint: address('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') }, // USDC
    { commitment: 'confirmed', encoding: 'jsonParsed' }
  ).send();
  info.value.forEach((tokenAccount) => {
    console.log('USDC:', tokenAccount.account.data.parsed.info.tokenAmount.uiAmount);
  });
}
