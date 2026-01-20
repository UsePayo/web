'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { ConnectWallet } from '@/components/wallet/ConnectWallet';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useTestUSDCFaucet } from '@/hooks/useTestUSDCFaucet';
import { useToast } from '@/components/ui/toast';
import { USDC_ADDRESS } from '@/lib/contracts';
import { Droplets, ExternalLink, ArrowLeft } from 'lucide-react';

export default function FaucetPage() {
  const { addToast } = useToast();
  const { isConnected, address, isCorrectChain } = useWalletConnection();
  const {
    balance,
    isBalanceLoading,
    cooldownSeconds,
    cooldownDisplay,
    canUseFaucet,
    isCooldownLoading,
    requestFaucet,
    isRequesting,
    isConfirmed,
    requestError,
    lastTxHash,
  } = useTestUSDCFaucet();

  const [showSuccess, setShowSuccess] = useState(false);

  // Handle success
  useEffect(() => {
    if (isConfirmed && lastTxHash) {
      setShowSuccess(true);
      addToast('Successfully received 100 tUSDC!', 'success');
    }
  }, [isConfirmed, lastTxHash, addToast]);

  // Handle error
  useEffect(() => {
    if (requestError) {
      const message = requestError.message.includes('FaucetCooldown')
        ? 'Please wait for cooldown to expire'
        : requestError.message.slice(0, 100);
      addToast(message, 'error');
    }
  }, [requestError, addToast]);

  const handleFaucetClick = () => {
    if (!isCorrectChain) {
      addToast('Please switch to Arbitrum Sepolia network', 'warning');
      return;
    }
    setShowSuccess(false);
    requestFaucet();
  };

  return (
    <main className="min-h-screen pb-20">
      <Header />

      <div className="max-w-2xl mx-auto px-4 pt-24">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 font-body text-pencil/60 hover:text-pencil mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-pen/10 rounded-full mb-4">
            <Droplets className="w-10 h-10 text-pen" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-pencil mb-2">
            Test USDC Faucet
          </h1>
          <p className="font-body text-pencil/60">
            Get free test USDC to try out Payo on Arbitrum Sepolia
          </p>
        </div>

        {/* Connect Wallet Prompt */}
        {!isConnected && (
          <Card variant="postit" className="mb-8 text-center" rotate="left">
            <CardContent>
              <p className="font-heading text-2xl font-bold text-pencil mb-4">
                Connect Your Wallet
              </p>
              <p className="font-body text-pencil/70 mb-6">
                Connect your wallet to request test USDC
              </p>
              <ConnectWallet />
            </CardContent>
          </Card>
        )}

        {/* Main Faucet Card */}
        {isConnected && (
          <Card variant="postit" className="mb-8 text-center" rotate="right">
            <CardContent>
              {/* Balance Display */}
              <p className="font-body text-lg text-pencil/60 mb-2">
                Your tUSDC Balance
              </p>
              {isBalanceLoading ? (
                <div className="animate-pulse">
                  <div className="h-14 bg-pencil/10 rounded w-40 mx-auto mb-4" />
                </div>
              ) : (
                <p className="font-heading text-5xl font-bold text-pencil mb-4">
                  {parseFloat(balance).toFixed(2)}
                </p>
              )}
              <p className="font-body text-sm text-pencil/50 mb-6">tUSDC</p>

              {/* Cooldown Display */}
              {isCooldownLoading ? (
                <div className="animate-pulse mb-6">
                  <div className="h-6 bg-pencil/10 rounded w-32 mx-auto" />
                </div>
              ) : (
                <div className="mb-6">
                  <p className="font-body text-sm text-pencil/60">
                    {canUseFaucet ? (
                      <span className="text-green-600 font-semibold">
                        Faucet ready!
                      </span>
                    ) : (
                      <span>
                        Next request in:{' '}
                        <span className="font-semibold text-marker">
                          {cooldownDisplay}
                        </span>
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Faucet Button */}
              <Button
                size="lg"
                onClick={handleFaucetClick}
                disabled={!canUseFaucet || isRequesting || !isCorrectChain}
                isLoading={isRequesting}
                className="px-8"
              >
                <Droplets className="w-5 h-5 mr-2" />
                Request 100 tUSDC
              </Button>

              {/* Wrong network warning */}
              {isConnected && !isCorrectChain && (
                <p className="font-body text-sm text-marker mt-4">
                  Please switch to Arbitrum Sepolia network
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {showSuccess && lastTxHash && (
          <Card variant="outlined" className="mb-8 bg-green-50/50">
            <CardContent className="text-center">
              <p className="font-heading text-xl font-bold text-green-700 mb-2">
                Success!
              </p>
              <p className="font-body text-green-600 mb-4">
                You received 100 tUSDC
              </p>
              <a
                href={`https://sepolia.arbiscan.io/tx/${lastTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-body text-sm text-pen hover:underline"
              >
                View transaction
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="space-y-4">
          <Card variant="outlined">
            <CardContent>
              <p className="font-heading text-lg font-bold text-pencil mb-2">
                How it works
              </p>
              <ul className="font-body text-pencil/70 space-y-2 list-disc list-inside">
                <li>Request 100 tUSDC per request</li>
                <li>1 hour cooldown between requests</li>
                <li>Use tUSDC to test Payo features</li>
                <li>Deposit to your Payo account via Dashboard</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <p className="font-heading text-lg font-bold text-pencil mb-2">
                Next Steps
              </p>
              <ul className="font-body text-pencil/70 space-y-2">
                <li className="flex items-center gap-2">
                  <span>1.</span>
                  <span>Get test USDC from the faucet above</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>2.</span>
                  <Link href="/link" className="text-pen hover:underline">
                    Link your Telegram account
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span>3.</span>
                  <Link href="/dashboard" className="text-pen hover:underline">
                    Deposit to your Payo account
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span>4.</span>
                  <span>Send USDC to friends via Telegram!</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contract Info */}
          <Card variant="outlined" className="text-center">
            <CardContent>
              <p className="font-body text-sm text-pencil/50">
                TestUSDC Contract: {USDC_ADDRESS}
              </p>
              <p className="font-body text-xs text-pencil/40 mt-1">
                Arbitrum Sepolia Testnet
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
