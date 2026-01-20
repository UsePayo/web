'use client';

import { useState, useCallback } from 'react';
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi';
import { keccak256, toBytes, type Address } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import {
  PAYO_VAULT_ADDRESS,
  PAYO_VAULT_ABI,
  formatUSDC,
  parseUSDC,
} from '@/lib/contracts';

export interface PendingTransfer {
  fromHash: `0x${string}`;
  toHash: `0x${string}`;
  amount: bigint;
  claimed: boolean;
  exists: boolean;
}

export interface UsePayoVaultReturn {
  // State
  isConnected: boolean;
  address: Address | undefined;

  // Balance
  balance: string;
  balanceRaw: bigint;
  isBalanceLoading: boolean;
  refetchBalance: () => void;

  // Send
  send: (params: {
    fromUsername: string;
    toUsername: string;
    amount: string;
    message?: string;
  }) => Promise<`0x${string}` | undefined>;
  isSending: boolean;
  sendError: Error | null;

  // Deposit
  deposit: (params: {
    username: string;
    amount: string;
  }) => Promise<void>;
  isDepositing: boolean;
  depositError: Error | null;

  // Withdraw
  withdraw: (params: {
    username: string;
    toAddress: Address;
    amount: string;
  }) => Promise<void>;
  isWithdrawing: boolean;
  withdrawError: Error | null;

  // Claim
  claim: (params: {
    transferId: `0x${string}`;
    recipientIdentifier: string; // The identifier to hash for where funds should go
  }) => Promise<void>;
  isClaiming: boolean;
  claimError: Error | null;

  // Get Transfer
  getPendingTransfer: (transferId: `0x${string}`) => PendingTransfer | null;
  isTransferLoading: boolean;

  // Utils
  hashUsername: (username: string) => `0x${string}`;
  clearErrors: () => void;
}

// Helper to hash username
function hashUsername(username: string): `0x${string}` {
  // Normalize: lowercase, remove @ prefix if present
  const normalized = username.toLowerCase().replace(/^@/, '');
  return keccak256(toBytes(normalized));
}

export function usePayoVault(userIdentifier?: string): UsePayoVaultReturn {
  const { address, isConnected } = useAccount();

  // Error states
  const [sendError, setSendError] = useState<Error | null>(null);
  const [depositError, setDepositError] = useState<Error | null>(null);
  const [withdrawError, setWithdrawError] = useState<Error | null>(null);
  const [claimError, setClaimError] = useState<Error | null>(null);

  // Transaction state
  const [pendingTxHash, setPendingTxHash] = useState<`0x${string}` | undefined>();

  // Get user's identifier hash if provided
  const identifierHash = userIdentifier ? hashUsername(userIdentifier) : undefined;

  // Read balance
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useReadContract({
    address: PAYO_VAULT_ADDRESS,
    abi: PAYO_VAULT_ABI,
    functionName: 'getBalance',
    args: identifierHash ? [identifierHash] : undefined,
    query: {
      enabled: !!identifierHash && PAYO_VAULT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Write contract hook
  const {
    writeContractAsync,
    isPending: isWritePending,
  } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isWaitingForTx } = useWaitForTransactionReceipt({
    hash: pendingTxHash,
  });

  // Computed loading states
  const isSending = isWritePending || isWaitingForTx;
  const isDepositing = isWritePending || isWaitingForTx;
  const isWithdrawing = isWritePending || isWaitingForTx;
  const isClaiming = isWritePending || isWaitingForTx;

  // Send USDC
  const send = useCallback(
    async (params: {
      fromUsername: string;
      toUsername: string;
      amount: string;
      message?: string;
    }): Promise<`0x${string}` | undefined> => {
      try {
        setSendError(null);

        const fromHash = hashUsername(params.fromUsername);
        const toHash = hashUsername(params.toUsername);
        const amountWei = parseUSDC(params.amount);

        if (amountWei === BigInt(0)) {
          throw new Error('Invalid amount');
        }

        const hash = await writeContractAsync({
          address: PAYO_VAULT_ADDRESS,
          abi: PAYO_VAULT_ABI,
          functionName: 'send',
          args: [fromHash, toHash, amountWei],
          chainId: arbitrumSepolia.id,
        });

        setPendingTxHash(hash);

        // Refetch balance after send
        setTimeout(() => refetchBalance(), 2000);

        return hash;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Send failed');
        setSendError(err);
        throw err;
      }
    },
    [writeContractAsync, refetchBalance]
  );

  // Deposit USDC
  const deposit = useCallback(
    async (params: { username: string; amount: string }): Promise<void> => {
      try {
        setDepositError(null);

        const identifierHash = hashUsername(params.username);
        const amountWei = parseUSDC(params.amount);

        if (amountWei === BigInt(0)) {
          throw new Error('Invalid amount');
        }

        const hash = await writeContractAsync({
          address: PAYO_VAULT_ADDRESS,
          abi: PAYO_VAULT_ABI,
          functionName: 'deposit',
          args: [identifierHash, amountWei],
          chainId: arbitrumSepolia.id,
        });

        setPendingTxHash(hash);

        // Refetch balance after deposit
        setTimeout(() => refetchBalance(), 2000);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Deposit failed');
        setDepositError(err);
        throw err;
      }
    },
    [writeContractAsync, refetchBalance]
  );

  // Withdraw USDC
  const withdraw = useCallback(
    async (params: {
      username: string;
      toAddress: Address;
      amount: string;
    }): Promise<void> => {
      try {
        setWithdrawError(null);

        const identifierHash = hashUsername(params.username);
        const amountWei = parseUSDC(params.amount);

        if (amountWei === BigInt(0)) {
          throw new Error('Invalid amount');
        }

        const hash = await writeContractAsync({
          address: PAYO_VAULT_ADDRESS,
          abi: PAYO_VAULT_ABI,
          functionName: 'withdraw',
          args: [identifierHash, params.toAddress, amountWei],
          chainId: arbitrumSepolia.id,
        });

        setPendingTxHash(hash);

        // Refetch balance after withdrawal
        setTimeout(() => refetchBalance(), 2000);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Withdrawal failed');
        setWithdrawError(err);
        throw err;
      }
    },
    [writeContractAsync, refetchBalance]
  );

  // Claim transfer
  const claim = useCallback(
    async (params: {
      transferId: `0x${string}`;
      recipientIdentifier: string; // The identifier to hash for where funds should go (e.g., "wallet:0x..." or username)
    }): Promise<void> => {
      try {
        setClaimError(null);

        // Generate the recipient hash from the identifier
        const recipientHash = hashUsername(params.recipientIdentifier);

        const hash = await writeContractAsync({
          address: PAYO_VAULT_ADDRESS,
          abi: PAYO_VAULT_ABI,
          functionName: 'claim',
          args: [params.transferId, recipientHash],
          chainId: arbitrumSepolia.id,
        });

        setPendingTxHash(hash);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Claim failed');
        setClaimError(err);
        throw err;
      }
    },
    [writeContractAsync]
  );

  // Get pending transfer - using a simpler approach with direct contract read
  const [transferData, setTransferData] = useState<PendingTransfer | null>(null);
  const [isTransferLoading, setIsTransferLoading] = useState(false);

  const getPendingTransfer = useCallback(
    (transferId: `0x${string}`): PendingTransfer | null => {
      // This is a simplified version - in production, you'd use useReadContract
      // with the transferId as a dependency
      return transferData;
    },
    [transferData]
  );

  // Clear all errors
  const clearErrors = useCallback(() => {
    setSendError(null);
    setDepositError(null);
    setWithdrawError(null);
    setClaimError(null);
  }, []);

  // Format balance
  const balanceRaw = (balanceData as bigint) || BigInt(0);
  const balance = formatUSDC(balanceRaw);

  return {
    // State
    isConnected,
    address,

    // Balance
    balance,
    balanceRaw,
    isBalanceLoading,
    refetchBalance,

    // Send
    send,
    isSending,
    sendError,

    // Deposit
    deposit,
    isDepositing,
    depositError,

    // Withdraw
    withdraw,
    isWithdrawing,
    withdrawError,

    // Claim
    claim,
    isClaiming,
    claimError,

    // Get Transfer
    getPendingTransfer,
    isTransferLoading,

    // Utils
    hashUsername,
    clearErrors,
  };
}

// Hook to fetch a specific pending transfer
export function usePendingTransfer(transferId: `0x${string}` | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: PAYO_VAULT_ADDRESS,
    abi: PAYO_VAULT_ABI,
    functionName: 'getTransfer',
    args: transferId ? [transferId] : undefined,
    query: {
      enabled: !!transferId && PAYO_VAULT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Parse the tuple response: [fromHash, toHash, amount, claimed, exists]
  type TransferTuple = readonly [`0x${string}`, `0x${string}`, bigint, boolean, boolean];
  const transfer: PendingTransfer | null = data
    ? {
        fromHash: (data as TransferTuple)[0],
        toHash: (data as TransferTuple)[1],
        amount: (data as TransferTuple)[2],
        claimed: (data as TransferTuple)[3],
        exists: (data as TransferTuple)[4],
      }
    : null;

  return {
    transfer,
    isLoading,
    error,
    refetch,
  };
}

