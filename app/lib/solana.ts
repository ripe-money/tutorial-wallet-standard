import type { WalletAccount } from "@wallet-standard/core";
import type { UiWallet } from "@wallet-standard/react";

import type { Rpc, GetBalanceApi, GetTokenAccountsByOwnerApi } from '@solana/web3.js';
import { address, createSolanaRpc } from '@solana/web3.js';

// import { SOLANA_MAINNET_CHAIN } from '@solana/wallet-standard';
const SOLANA_MAINNET_CHAIN = 'solana:mainnet';
export const isSolanaWallet = (wallet: UiWallet) => wallet.chains.includes(SOLANA_MAINNET_CHAIN);

const rpc: Rpc<GetBalanceApi & GetTokenAccountsByOwnerApi> =
  createSolanaRpc('https://sibylla-ghbj3j-fast-mainnet.helius-rpc.com');

// Get the USDC balance of a Solana account
export const getSolUsdcBalance = async (account: WalletAccount) => {
  const { value } = await rpc.getTokenAccountsByOwner(
    address(account.address),
    { mint: address('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') }, // USDC
    { commitment: 'confirmed', encoding: 'jsonParsed' }
  ).send();

  return value[0]?.account.data.parsed.info.tokenAmount.uiAmount || 0;
};

// // Get the SOL balance of a Solana account
// // Not needed for our app, but keeping it here for reference
// export const getSolBalance = async (account: WalletAccount) => {
//   const { value: lamports } =
//     await rpc.getBalance(address(account.address), { commitment: 'confirmed' }).send();

//   const formattedValue = new Intl.NumberFormat(undefined, { maximumFractionDigits: 5 }).format(
//     // @ts-expect-error This format string is 100% allowed now.
//     `${lamports}E-9`,
//   );
//   console.log('Balance:', formattedValue, 'SOL');

//   return lamports;
// };

export const sendSolUsdcFrom = async (account: WalletAccount) => {
  console.log('Sending 0.01 USDC from', account.features);
};
