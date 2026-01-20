'use client';

import { useState, useEffect, useCallback } from 'react';

interface LinkStatus {
  linked: boolean;
  telegramId?: number;
  telegramUsername?: string | null;
  linkedAt?: string;
}

interface UseLinkStatusReturn {
  linkStatus: LinkStatus | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useLinkStatus(walletAddress?: string): UseLinkStatusReturn {
  const [linkStatus, setLinkStatus] = useState<LinkStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLinkStatus = useCallback(async () => {
    if (!walletAddress) {
      setLinkStatus(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/link/status?wallet=${encodeURIComponent(walletAddress)}`
      );
      const data = await response.json();

      if (response.ok) {
        setLinkStatus({
          linked: data.linked,
          telegramId: data.telegramId,
          telegramUsername: data.telegramUsername,
          linkedAt: data.linkedAt,
        });
      } else {
        setError(data.error ?? 'Failed to check link status');
        setLinkStatus({ linked: false });
      }
    } catch (err) {
      setError('Failed to check link status');
      setLinkStatus({ linked: false });
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchLinkStatus();
  }, [fetchLinkStatus]);

  return {
    linkStatus,
    isLoading,
    error,
    refetch: fetchLinkStatus,
  };
}
