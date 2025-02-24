import type { UiWallet } from "@wallet-standard/react";

import type { Rpc, GetBalanceApi, GetTokenAccountsByOwnerApi } from '@solana/web3.js';
import { address, createSolanaRpc } from '@solana/web3.js';

// import { SOLANA_MAINNET_CHAIN } from '@solana/wallet-standard';
const SOLANA_MAINNET_CHAIN = 'solana:mainnet';
export const isSolanaWallet = (wallet: UiWallet) => wallet.chains.includes(SOLANA_MAINNET_CHAIN);

const rpc: Rpc<GetBalanceApi & GetTokenAccountsByOwnerApi> =
  createSolanaRpc('https://sibylla-ghbj3j-fast-mainnet.helius-rpc.com');

// Get the USDC balance of a Solana wallet
export const getSolUsdcBalance = async (wallet: UiWallet) => {
  console.log('Getting USDC balance for', wallet);
  const { value } = await rpc.getTokenAccountsByOwner(
    address(wallet.accounts[0].address),
    { mint: address('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') }, // USDC
    { commitment: 'confirmed', encoding: 'jsonParsed' }
  ).send();

  return value[0]?.account.data.parsed.info.tokenAmount.uiAmount || 0;
};

// Get the SOL balance of a Solana wallet
// Not needed for our app, but keeping it here for reference
export const getSolBalance = async (wallet: UiWallet) => {
  console.log('Getting SOL balance for', wallet);
  const { value: lamports } =
    await rpc.getBalance(address(wallet.accounts[0].address), { commitment: 'confirmed' }).send();

  const formattedValue = new Intl.NumberFormat(undefined, { maximumFractionDigits: 5 }).format(
    // @ts-expect-error This format string is 100% allowed now.
    `${lamports}E-9`,
  );
  console.log('Balance:', formattedValue, 'SOL');

  return lamports;
};

export const sendSolUsdcFrom = async (wallet: UiWallet) => {
  console.log('Sending 0.01 USDC from', wallet.features);
};
