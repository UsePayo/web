'use client';

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { arbitrumSepolia } from 'viem/chains';
import { useCallback } from 'react';

export function useWalletConnection() {
  // useAccount gives us the ACTUAL chain the wallet is connected to
  const { address, isConnected, isConnecting, isReconnecting, chain } = useAccount();
  const { connect, connectors, isPending: isConnectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitchPending } = useSwitchChain();

  // Use the actual wallet chain, not the config chain
  const chainId = chain?.id;
  const isCorrectChain = chainId === arbitrumSepolia.id;

  // Debug logging
  console.log('[useWalletConnection] wallet chainId:', chainId, 'arbitrumSepolia.id:', arbitrumSepolia.id, 'isCorrectChain:', isCorrectChain, 'isConnected:', isConnected);

  const connectWallet = useCallback(
    (connectorId?: string) => {
      const connector = connectorId
        ? connectors.find((c) => c.id === connectorId)
        : connectors[0];

      if (connector) {
        connect({ connector });
      }
    },
    [connect, connectors]
  );

  const switchToArbitrumSepolia = useCallback(() => {
    console.log('[useWalletConnection] Switching to Arbitrum Sepolia...');
    switchChain({ chainId: arbitrumSepolia.id });
  }, [switchChain]);

  const shortenAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return {
    // State
    address,
    isConnected,
    isConnecting: isConnecting || isReconnecting || isConnectPending,
    isCorrectChain,
    chainId,

    // Actions
    connectWallet,
    disconnect,
    switchToArbitrumSepolia,

    // Available connectors
    connectors,

    // Utils
    shortenAddress: address ? shortenAddress(address) : '',
    isSwitchingChain: isSwitchPending,
  };
}
