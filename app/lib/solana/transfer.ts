import type { Address, TransactionSigner } from '@solana/kit';

import {
  address,
  appendTransactionMessageInstructions,
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
  // getCreateAssociatedTokenInstruction,
  getTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from '@solana-program/token';
import { getAddMemoInstruction } from '@solana-program/memo';

import { rpc } from '.'

const getLatestBlockhash = async () => {
  const { value: blockhash } = await rpc.getLatestBlockhash().send();
  return blockhash;
};

// We're using signAndSendTransactionMessageWithSigners from @solana/kit
// to sign and send the transaction. For other chains (Sui?), we may have
// to use something like the following.
// See also:
// https://github.com/anza-xyz/wallet-standard/blob/master/packages/core/features/src/signTransaction.ts
// https://github.com/anza-xyz/wallet-standard/blob/master/packages/core/features/src/signAndSendTransaction.ts
// 
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
export const transferTokens = async (
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

  // const createAssociatedTokenInstruction = getCreateAssociatedTokenInstruction({
  //   ata: destinationAssociatedTokenAddress,
  //   mint: mint.address,
  //   owner: receiver,
  //   payer: sender,
  // });
  // console.log('Create Associated Token Instruction:', createAssociatedTokenInstruction);

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

  // https://github.com/anza-xyz/kit/tree/main/packages/react#usewalletaccounttransactionsendingsigneruiwalletaccount-chain
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
