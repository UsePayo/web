# Payo Web

Next.js dashboard for Payo. [use-payo.vercel.app](https://use-payo.vercel.app)

## Run Locally

```bash
npm install
cp .env.example .env   # Add WALLET_CONNECT_PROJECT_ID
npm run dev            # localhost:3000
```

## Deploy to Vercel

```bash
# Option 1: Vercel Dashboard
1. vercel.com → Add Project → GitHub repo
2. Root directory: usepayo/web
3. Add environment variables (see below)
4. Deploy

# Option 2: Vercel CLI
vercel
vercel env add NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
vercel env add BOT_API_URL
vercel env add BOT_API_SECRET
vercel --prod
```

## Environment Variables

```bash
# Required
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=  # From cloud.walletconnect.com

# Required for API routes (connect to bot)
BOT_API_URL=https://your-bot.up.railway.app  # Or http://localhost:3001 for local
BOT_API_SECRET=                               # Same secret as bot

# Optional
NEXT_PUBLIC_ARBITRUM_RPC_URL=  # Custom RPC (has default)
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

## Contracts (Arbitrum Sepolia)

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

## Design System

Hand-drawn sketch aesthetic:

- **Colors:** `paper`, `pencil`, `marker`, `pen`, `postit`
- **Fonts:** Kalam (headings), Patrick Hand (body)
- **Shadows:** `shadow-hard`, `shadow-hard-sm`, `shadow-hard-lg`
- **Borders:** `rounded-wobbly`, `rounded-wobbly-alt`

## Stack

- Next.js 16 (App Router)
- wagmi v3 + viem
- GSAP animations
- Tailwind CSS
