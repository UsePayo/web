'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'withdraw' | 'deposit';
  amount: string;
  counterparty: string;
  timestamp: string;
  status: string;
  message?: string;
}

interface UseTransactionHistoryReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTransactionHistory(
  walletAddress?: string,
  limit: number = 10
): UseTransactionHistoryReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!walletAddress) {
      setTransactions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/history?wallet=${encodeURIComponent(walletAddress)}&limit=${limit}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setTransactions(data.transactions ?? []);
      } else {
        // Not linked or other error - just set empty
        setError(data.error ?? null);
        setTransactions([]);
      }
    } catch (err) {
      setError('Failed to fetch transaction history');
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchHistory,
  };
}
