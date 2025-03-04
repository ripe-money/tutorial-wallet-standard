import type { UiWallet, UiWalletAccount } from '@wallet-standard/ui';

import type { Address, Rpc, TransactionSigner } from '@solana/kit';
import type { GetBalanceApi, GetTokenAccountsByOwnerApi, GetLatestBlockhashApi, GetAccountInfoApi } from '@solana/kit';
import {
  address,
  appendTransactionMessageInstructions,
  createSolanaRpc,
  createTransactionMessage,
  getBase58Decoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
} from '@solana/kit';
import {
  fetchMint,
  findAssociatedTokenPda,
  getCreateAssociatedTokenInstruction,
  getTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from '@solana-program/token';
import { getAddMemoInstruction } from '@solana-program/memo';

import { SOLANA_MAINNET_CHAIN } from '@solana/wallet-standard';
export const isSolanaWallet = (wallet: UiWallet) => wallet.chains.includes(SOLANA_MAINNET_CHAIN);

const rpc: Rpc<GetBalanceApi & GetTokenAccountsByOwnerApi & GetLatestBlockhashApi & GetAccountInfoApi> =
  createSolanaRpc(process.env.NEXT_PUBLIC_SOLANA_RPC!);

const getLatestBlockhash = async () => {
  const { value: blockhash } = await rpc.getLatestBlockhash().send();
  return blockhash;
};

/**
 * Get the token balance of a Solana wallet account
 * @param account - The wallet account to get the token balance for
 * @param mint - The token mint address, default to USDC
 * @returns The token balance of the wallet account
 */
const getTokenBalance = async (
  account: UiWalletAccount,
  // Default to USDC mint address if unspecified
  mint: Address = address(process.env.NEXT_PUBLIC_SOLANA_USDC_MINT!)
) => {
  const { value } = await rpc.getTokenAccountsByOwner(
    address(account.address),
    { mint },
    { commitment: 'confirmed', encoding: 'jsonParsed' }
  ).send();

  return value[0]?.account.data.parsed.info.tokenAmount.uiAmount || 0;
};

/**
 * Get the SOL balance of a Solana wallet.
 * Not needed for our app, but keeping it here to test it occasionally.
 * @param account - The wallet account to get the SOL balance for
 * @returns The SOL balance of the wallet account
 */
const getSolBalance = async (account: UiWalletAccount) => {
  const { value: lamports } =
    await rpc.getBalance(address(account.address), { commitment: 'confirmed' }).send();

  const formattedValue = new Intl.NumberFormat(undefined, { maximumFractionDigits: 5 }).format(
    // @ts-expect-error This format string is 100% allowed now.
    `${lamports}E-9`,
  );
  console.log('SOL Balance:', formattedValue, 'SOL');

  return lamports;
};

// We're using signAndSendTransactionMessageWithSigners from @solana/kit
// to sign and send the transaction. For other chains (Sui?), we may have
// to use something like the following.
// import { getWalletAccountFeature } from '@wallet-standard/react';
// import type { SolanaSignAndSendTransactionFeature } from '@solana/wallet-standard';
// import { SolanaSignAndSendTransaction } from '@solana/wallet-standard';
// type SolanaSignAndSendTransactionFeatureType = SolanaSignAndSendTransactionFeature[typeof SolanaSignAndSendTransaction];

// const feature = getWalletAccountFeature(account, SolanaSignAndSendTransaction) as SolanaSignAndSendTransactionFeatureType;
// console.log('Feature:', feature);

/**
 * Transfer tokens from one wallet to another
 * 
 * Written based on studying the following resources:
 * https://solana.stackexchange.com/questions/20108/how-do-i-transfer-an-spl-token-using-web3-js-version-2
 * https://github.com/helius-labs/kite/blob/main/src/lib/tokens.ts
 * @param sender - Wallet account to send tokens from. Must be a transaction signer.
 * @param receiver - Wallet account to send tokens to.
 * @param amount - Amount of tokens to send. Represented as a bigint so need to be aware of the decimals.
 * @param memo - Memo to include in the transaction
 * @param mintAddress - Token mint address. Default to USDC.
 */
const transferTokens = async (
  sender: TransactionSigner,
  receiver: Address,
  amount: bigint,
  memo: string,
  mintAddress: Address = address(process.env.NEXT_PUBLIC_SOLANA_USDC_MINT!),
) => {
  const latestBlockhash = await getLatestBlockhash();

  // Get the mint's metadata, such as its decimals
  const mint = await fetchMint(rpc, mintAddress);
  console.log('Mint:', mint);

  const [sourceAssociatedTokenAddress] = await findAssociatedTokenPda({
    mint: mint.address,
    owner: sender.address,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  const [destinationAssociatedTokenAddress] = await findAssociatedTokenPda({
    mint: mint.address,
    owner: receiver,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  const createAssociatedTokenInstruction = getCreateAssociatedTokenInstruction({
    ata: destinationAssociatedTokenAddress,
    mint: mint.address,
    owner: receiver,
    payer: sender,
  });
  console.log('Create Associated Token Instruction:', createAssociatedTokenInstruction);

  const transferInstruction = getTransferCheckedInstruction({
    source: sourceAssociatedTokenAddress,
    mint: mintAddress,
    destination: destinationAssociatedTokenAddress,
    authority: sender.address,
    amount,
    decimals: mint.data.decimals,
  });
  console.log('Transfer Instruction:', transferInstruction);

  const addMemoInstruction = getAddMemoInstruction({ memo });
  console.log('Add Memo Instruction:', addMemoInstruction);

  const instructions = [
    // createAssociatedTokenInstruction,
    transferInstruction,
    addMemoInstruction,
  ];

  const transferTokenTxMsg = pipe(
    createTransactionMessage({ version: 0 }),
    m => setTransactionMessageFeePayerSigner(sender, m),
    m => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    // @ts-expect-error - I can't figure out the type compatibility issue. Ignore it for now.
    m => appendTransactionMessageInstructions(instructions, m),
  );
  console.log('Transaction Message:', transferTokenTxMsg);

  const signatureBytes = await signAndSendTransactionMessageWithSigners(transferTokenTxMsg);
  const base58Signature = getBase58Decoder().decode(signatureBytes);
  console.log(`View transaction: https://explorer.solana.com/tx/${base58Signature}?cluster=devnet`);
}

const solana = {
  getTokenBalance, getSolBalance, transferTokens
};
export default solana;
