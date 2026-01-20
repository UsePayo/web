'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConnectWallet } from '@/components/wallet/ConnectWallet';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useToast } from '@/components/ui/toast';
import { XCircle, CircleCheck, Lock } from 'lucide-react';

interface CodeInfo {
  telegramUsername: string | null;
  expiresAt: string;
}

export default function LinkPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToast } = useToast();
  const { isConnected, address, shortenAddress } = useWalletConnection();

  const [codeInfo, setCodeInfo] = useState<CodeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLinked, setIsLinked] = useState(false);

  const code = resolvedParams.code.toUpperCase();

  // Fetch code info on mount
  useEffect(() => {
    async function fetchCodeInfo() {
      try {
        const response = await fetch(`/api/link/code/${code}`);
        const data = await response.json();

        if (!data.success) {
          setError(data.error ?? 'Invalid or expired code');
          return;
        }

        setCodeInfo({
          telegramUsername: data.telegramUsername,
          expiresAt: data.expiresAt,
        });
      } catch (err) {
        setError('Failed to load code information');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCodeInfo();
  }, [code]);

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!codeInfo) return '';
    const expiresAt = new Date(codeInfo.expiresAt);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    if (diffMs <= 0) return 'Expired';
    const minutes = Math.ceil(diffMs / 60000);
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  };

  const handleLink = async () => {
    if (!isConnected || !address) {
      addToast('Please connect your wallet first', 'warning');
      return;
    }

    setIsLinking(true);

    try {
      const response = await fetch('/api/link/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          walletAddress: address,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        addToast(data.error ?? 'Failed to link wallet', 'error');
        setIsLinking(false);
        return;
      }

      setIsLinked(true);
      addToast('Wallet linked successfully!', 'success');

      // Redirect to dashboard after a moment
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      addToast('Failed to link wallet. Please try again.', 'error');
      setIsLinking(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen pb-20 pt-20">
        <div className="max-w-xl mx-auto px-4 pt-4 text-center">
          <p className="font-body text-pencil/70">Loading...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen pb-20 pt-20">
        <div className="max-w-xl mx-auto px-4 pt-4">
          <Card variant="outlined" className="text-center">
            <CardContent>
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="font-heading text-xl font-bold text-pencil mb-2">
                {error === 'Code has expired' ? 'Code Expired' : 'Invalid Code'}
              </p>
              <p className="font-body text-pencil/70 mb-4">
                {error === 'Code has expired'
                  ? 'This link code has expired. Please use /link in the Telegram bot to get a new one.'
                  : 'This link code is invalid or has already been used.'}
              </p>
              <div className="flex flex-col gap-4 items-center">
                <a
                  href="https://t.me/usepayo_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>Open Telegram Bot</Button>
                </a>
                <Link href="/">
                  <Button variant="secondary">Go Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Success state
  if (isLinked) {
    return (
      <main className="min-h-screen pb-20 pt-20">
        <div className="max-w-xl mx-auto px-4 pt-4">
          <Card variant="postit" className="text-center" rotate="right">
            <CardContent>
              <CircleCheck className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="font-heading text-xl font-bold text-pencil mb-2">
                Wallet Linked!
              </p>
              <p className="font-body text-pencil/70 mb-4">
                {codeInfo?.telegramUsername
                  ? `@${codeInfo.telegramUsername} is now linked to ${shortenAddress}`
                  : `Your Telegram account is now linked to ${shortenAddress}`}
              </p>
              <p className="font-body text-sm text-pencil/50">
                Redirecting to dashboard...
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20 pt-20">
      <div className="max-w-xl mx-auto px-4 pt-4">
        {/* Code Card */}
        <Card variant="postit" className="mb-8 text-center" rotate="left">
          <CardContent>
            <p className="font-body text-lg text-pencil/60 mb-2">Verification Code</p>
            <p className="font-heading text-4xl font-bold text-pencil mb-4 tracking-widest">
              {code}
            </p>
            {codeInfo?.telegramUsername && (
              <p className="font-body text-pencil/70 mb-2">
                For Telegram user{' '}
                <span className="font-heading font-bold">@{codeInfo.telegramUsername}</span>
              </p>
            )}
            <Badge variant={getTimeRemaining() === 'Expired' ? 'warning' : 'success'}>
              {getTimeRemaining() === 'Expired' ? 'Expired' : `Expires in ${getTimeRemaining()}`}
            </Badge>
          </CardContent>
        </Card>

        {/* Linking Flow */}
        <Card variant="outlined" rotate="right">
          <CardHeader>
            <CardTitle>Link Your Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="font-body text-pencil/70">
                Connect your wallet to link it with your Telegram account. This will allow
                you to:
              </p>
              <ul className="font-body text-pencil/70 mt-4 text-left list-disc list-inside">
                <li>Deposit USDC from this wallet via the web</li>
                <li>Withdraw USDC to this wallet</li>
                <li>View your Payo balance on the dashboard</li>
              </ul>
            </div>

            {!isConnected ? (
              <div className="flex flex-col items-center gap-4">
                <ConnectWallet />
                <p className="font-body text-sm text-pencil/50">
                  Supported: MetaMask, WalletConnect, Coinbase Wallet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="font-body text-pencil/70">
                    Connected:{' '}
                    <span className="font-heading font-bold">{shortenAddress}</span>
                  </p>
                </div>
                <Button
                  onClick={handleLink}
                  isLoading={isLinking}
                  className="w-full"
                >
                  Link This Wallet
                </Button>
                <p className="font-body text-xs text-pencil/50 text-center">
                  By linking, you confirm this wallet belongs to you
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card variant="outlined" className="mt-8">
          <CardContent className="flex items-start gap-4">
            <Lock className="w-6 h-6 text-pencil" />
            <div>
              <p className="font-heading font-bold text-pencil mb-1">Secure Linking</p>
              <p className="font-body text-sm text-pencil/70">
                We only store the association between your Telegram account and wallet
                address. We never have access to your private keys or funds.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
