# Payo Web

Next.js dashboard for Payo. [use-payo.vercel.app](https://use-payo.vercel.app)

## Run

```bash
npm install
npm run dev     # localhost:3000
npm run build   # production build
```

## Environment

```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=  # Required
BOT_API_URL=http://localhost:3001       # Bot backend
BOT_API_SECRET=                          # API auth
```

## Pages

| Route          | Description                |
| -------------- | -------------------------- |
| `/`            | Landing page               |
| `/dashboard`   | Balance, send, withdraw    |
| `/faucet`      | Get 100 tUSDC for testing  |
| `/link`        | Link Telegram to wallet    |
| `/link/[code]` | Verify linking code        |
| `/send`        | Send USDC to Telegram user |
| `/claim/[id]`  | Claim pending transfer     |

## Contracts

| Contract  | Address                                      |
| --------- | -------------------------------------------- |
| PayoVault | `0xab141b97c3c589b6213cc64e634bfdf4dc8e091b` |
| TestUSDC  | `0x16cae166b4358fb2f15f8ddce059afbac90ab676` |

## Hooks

| Hook                    | Purpose                          |
| ----------------------- | -------------------------------- |
| `usePayoVault`          | Send, deposit, withdraw, balance |
| `useWalletConnection`   | Wallet state + chain switching   |
| `useLinkStatus`         | Telegram-wallet link status      |
| `useTestUSDCFaucet`     | Faucet interactions              |
| `useTransactionHistory` | Tx history from bot API          |

## Design

Hand-drawn aesthetic:

- **Colors:** `paper`, `pencil`, `marker`, `pen`, `postit`
- **Fonts:** Kalam (headings), Patrick Hand (body)
- **Shadows:** `shadow-hard`, `shadow-hard-sm`

## Stack

- Next.js 14 (App Router)
- wagmi v3 + viem
- GSAP animations
- Tailwind CSS
