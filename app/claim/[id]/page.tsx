'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Mock claim data - replace with actual API/blockchain fetch
const mockClaim = {
  id: 'claim-abc123',
  sender: '@alice_crypto',
  amount: 50.0,
  message: 'Thanks for dinner!',
  createdAt: '2024-01-15',
  status: 'pending',
};

type ClaimMethod = 'phone' | 'wallet' | null;

export default function ClaimPage({ params }: { params: { id: string } }) {
  const [claimMethod, setClaimMethod] = useState<ClaimMethod>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate sending verification code
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsCodeSent(true);
    setIsLoading(false);
  };

  const handleVerifyAndClaim = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate verification and claim
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert(`Claimed $${mockClaim.amount} USDC successfully!`);
    setIsLoading(false);
  };

  const handleConnectWallet = async () => {
    setIsLoading(true);

    // Simulate wallet connection - replace with Privy integration
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert('Wallet connected! Claiming USDC...');
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/80 backdrop-blur-sm border-b-2 border-dashed border-pencil">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-heading text-2xl font-bold text-pencil">
            Payo
          </Link>
          <Badge variant="info">Claim #{params.id.slice(0, 8)}</Badge>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 pt-24">
        {/* Amount Card */}
        <Card variant="postit" className="mb-8 text-center" rotate="right">
          <CardContent>
            <p className="font-body text-lg text-pencil/60 mb-2">
              You received
            </p>
            <p className="font-heading text-6xl font-bold text-pencil mb-4">
              ${mockClaim.amount.toFixed(2)}
            </p>
            <p className="font-body text-lg text-pencil/70 mb-2">
              from <span className="font-heading font-bold">{mockClaim.sender}</span>
            </p>
            {mockClaim.message && (
              <Card variant="outlined" className="mt-4 bg-paper/50">
                <CardContent>
                  <p className="font-body text-pencil italic">
                    &quot;{mockClaim.message}&quot;
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Claim Method Selection */}
        {!claimMethod && (
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold text-pencil text-center mb-6">
              How would you like to claim?
            </h2>

            <Card
              className="cursor-pointer hover:shadow-hard-lg transition-shadow"
              onClick={() => setClaimMethod('phone')}
            >
              <CardContent className="flex items-center gap-4">
                <span className="text-4xl">&#x1F4F1;</span>
                <div>
                  <p className="font-heading text-xl font-bold text-pencil">
                    Verify with Phone
                  </p>
                  <p className="font-body text-pencil/60">
                    No wallet needed - we&apos;ll create one for you
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              variant="outlined"
              className="cursor-pointer hover:shadow-hard transition-shadow"
              onClick={() => setClaimMethod('wallet')}
            >
              <CardContent className="flex items-center gap-4">
                <span className="text-4xl">&#x1F4B3;</span>
                <div>
                  <p className="font-heading text-xl font-bold text-pencil">
                    Connect Wallet
                  </p>
                  <p className="font-body text-pencil/60">
                    Receive directly to your existing wallet
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Phone Verification Flow */}
        {claimMethod === 'phone' && (
          <Card variant="outlined" rotate="left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setClaimMethod(null);
                    setIsCodeSent(false);
                    setPhoneNumber('');
                    setVerificationCode('');
                    setError('');
                  }}
                  className="text-pen hover:underline font-body text-sm"
                >
                  &larr; Back
                </button>
                <span>Phone Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isCodeSent ? (
                <>
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    error={error}
                    hint="Enter the phone number linked to your Telegram account"
                  />
                  <Button
                    onClick={handleSendCode}
                    isLoading={isLoading}
                    className="w-full"
                  >
                    Send Verification Code
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <p className="font-body text-pencil/70">
                      We sent a code to{' '}
                      <span className="font-heading font-bold">{phoneNumber}</span>
                    </p>
                  </div>
                  <Input
                    label="Verification Code"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    error={error}
                    hint="Enter the 6-digit code"
                  />
                  <Button
                    onClick={handleVerifyAndClaim}
                    isLoading={isLoading}
                    className="w-full"
                  >
                    Verify & Claim USDC
                  </Button>
                  <button
                    onClick={() => {
                      setIsCodeSent(false);
                      setVerificationCode('');
                    }}
                    className="w-full text-center font-body text-pen hover:underline"
                  >
                    Didn&apos;t receive code? Try again
                  </button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Wallet Connection Flow */}
        {claimMethod === 'wallet' && (
          <Card variant="outlined" rotate="right">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <button
                  onClick={() => setClaimMethod(null)}
                  className="text-pen hover:underline font-body text-sm"
                >
                  &larr; Back
                </button>
                <span>Connect Wallet</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="font-body text-pencil/70 text-center">
                Connect your wallet to receive the USDC directly.
              </p>

              <Button
                onClick={handleConnectWallet}
                isLoading={isLoading}
                variant="secondary"
                className="w-full"
              >
                Connect Wallet
              </Button>

              <div className="text-center">
                <p className="font-body text-sm text-pencil/50">
                  Supported: MetaMask, WalletConnect, Coinbase Wallet
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Info */}
        <Card variant="outlined" className="mt-8 rotate-slight">
          <CardContent className="flex items-start gap-4">
            <span className="text-2xl">&#x1F512;</span>
            <div>
              <p className="font-heading font-bold text-pencil mb-1">
                Secure & Non-Custodial
              </p>
              <p className="font-body text-sm text-pencil/70">
                Your funds are held in a smart contract on Arbitrum. Only you
                can claim them after verification.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
