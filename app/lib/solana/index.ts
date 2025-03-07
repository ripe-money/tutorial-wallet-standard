import type {
  Rpc,
  RpcSubscriptions,
  GetBalanceApi,
  GetTokenAccountsByOwnerApi,
  GetLatestBlockhashApi,
  GetAccountInfoApi,
  AccountNotificationsApi,
} from '@solana/kit';

import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit';

import { subscribeToBalance } from './balance';
import { transferTokens } from './transfer';

export const rpc: Rpc<
  GetBalanceApi &
  GetTokenAccountsByOwnerApi &
  GetLatestBlockhashApi &
  GetAccountInfoApi
> =
  createSolanaRpc(process.env.NEXT_PUBLIC_SOLANA_RPC!);
export const rpcSubscriptions: RpcSubscriptions<AccountNotificationsApi> =
  createSolanaRpcSubscriptions(process.env.NEXT_PUBLIC_SOLANA_RPC_WS!);

const solana = { subscribeToBalance, transferTokens };
export default solana;
