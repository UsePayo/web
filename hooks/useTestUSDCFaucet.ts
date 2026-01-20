'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { USDC_ADDRESS, TEST_USDC_ABI } from '@/lib/contracts';
import { formatUnits } from 'viem';

export function useTestUSDCFaucet() {
  const { address, isConnected } = useAccount();
  const [lastTxHash, setLastTxHash] = useState<`0x${string}` | undefined>();

  // Read USDC balance
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useReadContract({
    address: USDC_ADDRESS,
    abi: TEST_USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read faucet cooldown
  const {
    data: cooldownData,
    isLoading: isCooldownLoading,
    refetch: refetchCooldown,
  } = useReadContract({
    address: USDC_ADDRESS,
    abi: TEST_USDC_ABI,
    functionName: 'faucetCooldownRemaining',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Write contract - call faucet
  const {
    writeContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  // Wait for transaction receipt
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: lastTxHash,
  });

  // Format balance (6 decimals for USDC)
  const balance = balanceData ? formatUnits(balanceData as bigint, 6) : '0';

  // Format cooldown in seconds
  const cooldownSeconds = cooldownData ? Number(cooldownData as bigint) : 0;
  const canUseFaucet = cooldownSeconds === 0;

  // Format cooldown for display
  const formatCooldown = (seconds: number): string => {
    if (seconds === 0) return 'Ready';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  const cooldownDisplay = formatCooldown(cooldownSeconds);

  // Request faucet
  const requestFaucet = useCallback(async () => {
    if (!address || !canUseFaucet) return;

    try {
      writeContract(
        {
          address: USDC_ADDRESS,
          abi: TEST_USDC_ABI,
          functionName: 'faucet',
          args: [],
        },
        {
          onSuccess: (hash) => {
            setLastTxHash(hash);
          },
        }
      );
    } catch (error) {
      console.error('[useTestUSDCFaucet] Error requesting faucet:', error);
    }
  }, [address, canUseFaucet, writeContract]);

  // Refetch data when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      refetchBalance();
      refetchCooldown();
    }
  }, [isConfirmed, refetchBalance, refetchCooldown]);

  // Periodically refetch cooldown
  useEffect(() => {
    if (!isConnected || cooldownSeconds === 0) return;

    const interval = setInterval(() => {
      refetchCooldown();
    }, 10000); // Refetch every 10 seconds

    return () => clearInterval(interval);
  }, [isConnected, cooldownSeconds, refetchCooldown]);

  return {
    balance,
    isBalanceLoading,
    cooldownSeconds,
    cooldownDisplay,
    canUseFaucet,
    isCooldownLoading,
    requestFaucet,
    isRequesting: isWritePending || isConfirming,
    isConfirmed,
    requestError: writeError,
    refetchBalance,
    refetchCooldown,
    lastTxHash,
  };
}
