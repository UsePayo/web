import { http, createConfig } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// WalletConnect Project ID - Get one at https://cloud.walletconnect.com
const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

// Arbitrum Sepolia RPC - use public endpoint or env var
const ARBITRUM_SEPOLIA_RPC = process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc';

export const config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [
    injected(),
    ...(WALLET_CONNECT_PROJECT_ID
      ? [
          walletConnect({
            projectId: WALLET_CONNECT_PROJECT_ID,
            metadata: {
              name: 'Payo',
              description: 'Send USDC to anyone on Telegram',
              url: 'https://usepayo.com',
              icons: ['https://usepayo.com/logo.png'],
            },
          }),
        ]
      : []),
  ],
  transports: {
    [arbitrumSepolia.id]: http(ARBITRUM_SEPOLIA_RPC),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
