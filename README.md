# Barebone mobile dApp using Wallet Standard and @solana/kit (formerly known as @solana/web3.js v2)
This is a barebone app to explore a standard way of connecting to wallets by using [Wallet Standard](https://github.com/wallet-standard/wallet-standard). Wallet Standard is the [foundation](https://docs.phantom.com/developer-powertools/wallet-standard) for Solana Wallet Adapter. But unlike Solana Wallet Adapter, Wallet Standard is a cross-chain standard that's been [adopted by other chains such as Sui](https://docs.sui.io/standards/wallet-standard#managing-wallets).

We avoid using Solana Wallet Adapters not only because they're Solana-specific. Many (all?) of them were written with @solana/web3.js v1 and haven't been updated/maintained, while we're trying to use v2.

While we try to be chain-agnostic as much as possible, looking up balances and creating transactions will unavoidably be chain-specific. We try to factor out all Solana-specific code into the `/lib/solana.ts` file.

## Development
It's a Next.js app (`create-next-app`). Create a `.env` file with something like the following for Solana devnet. (Ask Chuck for the RPC endpoint for Helius, but any RPC endpoint for devnet should work.)
```sh
NEXT_PUBLIC_SOLANA_RPC=
NEXT_PUBLIC_SOLANA_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
```

You can run locally using `npm run dev`. The [homepage](http://localhost:3000/) shows wallets accessible from the dApp.

After selecting to a wallet, the app remembers the selection by storing it in the browser's local storage. You can delete that memory by going to the `/reset` page.
