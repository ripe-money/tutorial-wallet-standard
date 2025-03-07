import type { UiWalletAccount } from '@wallet-standard/ui';

import { address } from '@solana/kit';

import { rpc, rpcSubscriptions } from '.'

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

/**
 * Get the token balance of a Solana wallet account
 * @param account - The wallet account to get the token balance for
 * @param mint - The token mint address, default to USDC
 * @returns The token balance of the wallet account
 */
const getTokenBalance = async (
  account: UiWalletAccount,
  // Default to USDC mint address if unspecified
  mint = address(process.env.NEXT_PUBLIC_SOLANA_USDC_MINT!)
) => {
  const { value } = await rpc.getTokenAccountsByOwner(
    address(account.address),
    { mint },
    { commitment: 'confirmed', encoding: 'jsonParsed' }
  ).send();

  return value[0]?.account.data.parsed.info.tokenAmount.uiAmount || 0;
};

/**
 * Subscribe to the balance of a Solana wallet account
 * @param account - The wallet account to subscribe to
 * @param callback - The callback function to call when the balance changes
 */
export const subscribeToBalance = async (
  account: UiWalletAccount,
  callback: (balance: number) => void
) => {
  // https://github.com/anza-xyz/kit?tab=readme-ov-file#subscriptions-as-asynciterators
  const getAccountNotifications = async (account: UiWalletAccount) => {
    const abortController = new AbortController();
    return rpcSubscriptions
      .accountNotifications(address(account.address), { commitment: 'confirmed' })
      .subscribe({ abortSignal: abortController.signal });
  };

  getSolBalance(account); // Just for testing

  const balance = await getTokenBalance(account);
  callback(balance);

  // Set up to be notified of account changes
  const accountNotifications = await getAccountNotifications(account);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for await (const notification of accountNotifications) {
    const balance = await getTokenBalance(account);
    callback(balance);
  }
};
