'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { ConnectWallet } from '@/components/wallet/ConnectWallet';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { usePayoVault } from '@/hooks/usePayoVault';
import { useLinkStatus } from '@/hooks/useLinkStatus';
import { useToast } from '@/components/ui/toast';
import { PAYO_VAULT_ADDRESS } from '@/lib/contracts';

export default function DashboardPage() {
  const { addToast } = useToast();
  const { isConnected, address, isCorrectChain } = useWalletConnection();

  // Check if this wallet is linked to a Telegram account
  const { linkStatus, isLoading: isLinkStatusLoading, refetch: refetchLinkStatus } = useLinkStatus(address);

  // Use linked Telegram ID if available, otherwise use wallet address
  // This allows viewing the correct balance based on link status
  const userIdentifier = linkStatus?.linked && linkStatus.telegramId
    ? `telegram:${linkStatus.telegramId}`
    : address
      ? `wallet:${address}`
      : undefined;

  const {
    balance,
    isBalanceLoading,
    refetchBalance,
    deposit,
    isDepositing,
    depositError,
  } = usePayoVault(userIdentifier);

  // Check if contract is deployed
  const isContractDeployed = PAYO_VAULT_ADDRESS !== '0x0000000000000000000000000000000000000000';

  // Show toast on deposit error
  useEffect(() => {
    if (depositError) {
      addToast(depositError.message, 'error');
    }
  }, [depositError, addToast]);

  return (
    <main className="min-h-screen pb-20">
      <Header />

      <div className="max-w-4xl mx-auto px-4 pt-24">
        {/* Connect Wallet Prompt - show when not connected */}
        {!isConnected && (
          <Card variant="postit" className="mb-8 text-center" rotate="left">
            <CardContent>
              <p className="font-heading text-2xl font-bold text-pencil mb-4">
                Connect Your Wallet
              </p>
              <p className="font-body text-pencil/70 mb-6">
                Connect your wallet to view your balance and send USDC
              </p>
              <ConnectWallet />
            </CardContent>
          </Card>
        )}

        {/* Link Status Card - show when connected but not linked */}
        {isConnected && isCorrectChain && !isLinkStatusLoading && linkStatus && !linkStatus.linked && (
          <Card variant="outlined" className="mb-6 bg-yellow-50/50">
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">&#x1F517;</span>
                <div>
                  <p className="font-heading font-bold text-pencil">Link Your Telegram</p>
                  <p className="font-body text-sm text-pencil/70">
                    Connect your Telegram account to access your Payo balance
                  </p>
                </div>
              </div>
              <Link href="/link">
                <Button variant="secondary" size="sm">
                  Link Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Linked Account Badge - show when linked */}
        {isConnected && isCorrectChain && linkStatus?.linked && (
          <Card variant="outlined" className="mb-6 bg-green-50/50">
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">&#x2705;</span>
                <div>
                  <p className="font-heading font-bold text-pencil">
                    Linked to Telegram
                    {linkStatus.telegramUsername && (
                      <span className="font-body font-normal text-pencil/70 ml-2">
                        @{linkStatus.telegramUsername}
                      </span>
                    )}
                  </p>
                  <p className="font-body text-sm text-pencil/70">
                    Viewing your Payo balance from Telegram
                  </p>
                </div>
              </div>
              <Badge variant="success">Linked</Badge>
            </CardContent>
          </Card>
        )}

        {/* Balance Card - only show when connected */}
        {isConnected && (
          <Card variant="postit" className="mb-8 text-center" rotate="left">
            <CardContent>
              <p className="font-body text-lg text-pencil/60 mb-2">
                {linkStatus?.linked ? 'Payo Balance' : 'Your Balance'}
              </p>
              {isBalanceLoading || isLinkStatusLoading ? (
                <div className="animate-pulse">
                  <div className="h-16 bg-pencil/10 rounded w-48 mx-auto mb-6" />
                </div>
              ) : (
                <p className="font-heading text-6xl font-bold text-pencil mb-6">
                  ${balance}
                </p>
              )}
              <p className="font-body text-sm text-pencil/50 mb-6">USDC</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {linkStatus?.linked ? (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        addToast('Deposit feature coming soon! Use the Telegram bot for now.', 'info');
                      }}
                      isLoading={isDepositing}
                    >
                      Deposit USDC
                    </Button>
                    <Link href="/send">
                      <Button>Send USDC</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/link">
                      <Button variant="secondary">Link Telegram</Button>
                    </Link>
                    <Link href="/send">
                      <Button>Send USDC</Button>
                    </Link>
                  </>
                )}
              </div>
              <button
                onClick={() => {
                  refetchBalance();
                  refetchLinkStatus();
                }}
                className="mt-4 font-body text-sm text-pen hover:underline"
              >
                Refresh Balance
              </button>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        {isConnected && (
          <Card variant="outlined" className="mb-8">
            <CardContent>
              <p className="font-heading text-lg font-bold text-pencil mb-2">
                How to Use Payo
              </p>
              <ul className="font-body text-pencil/70 space-y-2 list-disc list-inside">
                <li>Use the Telegram bot for the best experience: <a href="https://t.me/PayoBot" target="_blank" rel="noopener noreferrer" className="text-pen underline">@PayoBot</a></li>
                <li>Send USDC to any Telegram username - they don&apos;t need a wallet!</li>
                <li>Recipients can claim funds when they start using the bot</li>
                <li>Withdraw to any external wallet anytime</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Contract Info */}
        {isConnected && (
          <Card variant="outlined" className="text-center">
            <CardContent>
              <p className="font-body text-sm text-pencil/50">
                Contract: {PAYO_VAULT_ADDRESS}
              </p>
              <p className="font-body text-xs text-pencil/40 mt-1">
                Arbitrum Sepolia Testnet
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
