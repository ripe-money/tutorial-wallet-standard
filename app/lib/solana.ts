import type { WalletAccount } from "@wallet-standard/core";
import type { UiWallet } from "@wallet-standard/react";

import type { Rpc, GetBalanceApi, GetTokenAccountsByOwnerApi, GetLatestBlockhashApi } from '@solana/kit';
import { address, createSolanaRpc } from '@solana/kit';

import { SOLANA_MAINNET_CHAIN } from '@solana/wallet-standard';
export const isSolanaWallet = (wallet: UiWallet) => wallet.chains.includes(SOLANA_MAINNET_CHAIN);

console.log(process.env.NEXT_PUBLIC_SOLANA_RPC)
const rpc: Rpc<GetBalanceApi & GetTokenAccountsByOwnerApi & GetLatestBlockhashApi> =
  createSolanaRpc(process.env.NEXT_PUBLIC_SOLANA_RPC!);

export const getLatestBlockhash = async () => {
  const { value: blockhash } = await rpc.getLatestBlockhash().send();
  return blockhash;
};

// Get the USDC balance of a Solana wallet account
export const getSolUsdcBalance = async (account: WalletAccount) => {
  console.log('Getting USDC balance for', account);

  const { value } = await rpc.getTokenAccountsByOwner(
    address(account.address),
    { mint: address(process.env.NEXT_PUBLIC_SOLANA_USDC_MINT!) },
    { commitment: 'confirmed', encoding: 'jsonParsed' }
  ).send();

  return value[0]?.account.data.parsed.info.tokenAmount.uiAmount || 0;
};

// // Get the SOL balance of a Solana wallet
// // Not needed for our app, but keeping it here to test it occasionally.
// const getSolBalance = async (wallet: UiWallet) => {
//   console.log('Getting SOL balance for', wallet);

//   const walletAddress = await getWalletAddress(wallet);
//   if (!walletAddress) return;

//   const { value: lamports } =
//     await rpc.getBalance(address(walletAddress), { commitment: 'confirmed' }).send();

//   const formattedValue = new Intl.NumberFormat(undefined, { maximumFractionDigits: 5 }).format(
//     // @ts-expect-error This format string is 100% allowed now.
//     `${lamports}E-9`,
//   );
//   console.log('Balance:', formattedValue, 'SOL');

//   return lamports;
// };
