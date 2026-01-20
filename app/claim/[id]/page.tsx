'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ConnectWallet } from '@/components/wallet/ConnectWallet';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { usePendingTransfer } from '@/hooks/usePayoVault';
import { usePayoVault } from '@/hooks/usePayoVault';
import { useToast } from '@/components/ui/toast';
import { PAYO_VAULT_ADDRESS, formatUSDC } from '@/lib/contracts';
import { HelpCircle, CircleCheck, AlertTriangle, Smartphone, Wallet, Lock } from 'lucide-react';

// Mock claim data - used when contract not deployed
const mockClaim = {
  id: 'claim-abc123',
  sender: '@alice_crypto',
  amount: 50.0,
  message: 'Thanks for dinner!',
  createdAt: '2024-01-15',
  status: 'pending',
};

type ClaimMethod = 'phone' | 'wallet' | null;

export default function ClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToast } = useToast();
  const { isConnected, address, shortenAddress } = useWalletConnection();

  const [claimMethod, setClaimMethod] = useState<ClaimMethod>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if contract is deployed
  const isContractDeployed =
    PAYO_VAULT_ADDRESS !== '0x0000000000000000000000000000000000000000';

  // Format the transfer ID from params
  const transferId = resolvedParams.id.startsWith('0x')
    ? (resolvedParams.id as `0x${string}`)
    : (`0x${resolvedParams.id}` as `0x${string}`);

  // Fetch transfer data from contract
  const { transfer, isLoading: isTransferLoading } = usePendingTransfer(
    isContractDeployed ? transferId : undefined
  );

  // Hook for claiming
  const { claim, isClaiming, claimError } = usePayoVault();

  // Show claim error as toast
  useEffect(() => {
    if (claimError) {
      addToast(claimError.message, 'error');
    }
  }, [claimError, addToast]);

  // Determine display data
  const displayAmount = transfer
    ? formatUSDC(transfer.amount)
    : mockClaim.amount.toFixed(2);
  const displayMessage = mockClaim.message; // Message not stored on-chain in MVP
  const isClaimed = transfer?.claimed ?? false;
  const transferExists = transfer?.exists ?? true;

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

    addToast(`Claimed $${displayAmount} USDC successfully!`, 'success');
    setIsLoading(false);

    // Redirect to dashboard after a moment
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  const handleConnectWallet = async () => {
    // This is handled by the ConnectWallet component
  };

  const handleClaimWithWallet = async () => {
    if (!isConnected || !address) {
      addToast('Please connect your wallet first', 'warning');
      return;
    }

    if (!isContractDeployed) {
      addToast(`Demo: Would claim $${displayAmount} USDC to ${shortenAddress}`, 'info');
      return;
    }

    try {
      // Use wallet address as the recipient identifier
      await claim({
        transferId,
        recipientIdentifier: `wallet:${address}`,
      });

      addToast('Claim submitted successfully!', 'success');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      // Error handled via useEffect
    }
  };

  // Show loading state
  if (isTransferLoading && isContractDeployed) {
    return (
      <main className="min-h-screen pb-20 pt-20">
        <div className="max-w-xl mx-auto px-4 pt-4 text-center">
          <p className="font-body text-pencil/70">Loading transfer details...</p>
        </div>
      </main>
    );
  }

  // Show not found state
  if (!transferExists && isContractDeployed) {
    return (
      <main className="min-h-screen pb-20 pt-20">
        <div className="max-w-xl mx-auto px-4 pt-4">
          <Card variant="outlined" className="text-center">
            <CardContent>
              <HelpCircle className="w-12 h-12 text-pencil/60 mx-auto mb-4" />
              <p className="font-heading text-xl font-bold text-pencil mb-2">
                Transfer Not Found
              </p>
              <p className="font-body text-pencil/70 mb-4">
                This transfer ID does not exist or has been deleted.
              </p>
              <Link href="/">
                <Button>Go Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Show already claimed state
  if (isClaimed) {
    return (
      <main className="min-h-screen pb-20 pt-20">
        <div className="max-w-xl mx-auto px-4 pt-4">
          <Card variant="postit" className="text-center" rotate="right">
            <CardContent>
              <CircleCheck className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="font-heading text-xl font-bold text-pencil mb-2">
                Already Claimed
              </p>
              <p className="font-body text-pencil/70 mb-4">
                This transfer has already been claimed.
              </p>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20 pt-20">
      <div className="max-w-xl mx-auto px-4 pt-4">
        {/* Contract Not Deployed Warning */}
        {!isContractDeployed && (
          <Card variant="outlined" className="mb-6 bg-yellow-50">
            <CardContent className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-heading font-bold text-pencil">Demo Mode</p>
                <p className="font-body text-sm text-pencil/70">
                  Contract not deployed. Showing mock data.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Amount Card */}
        <Card variant="postit" className="mb-8 text-center" rotate="right">
          <CardContent>
            <p className="font-body text-lg text-pencil/60 mb-2">You received</p>
            <p className="font-heading text-6xl font-bold text-pencil mb-4">
              ${displayAmount}
            </p>
            <p className="font-body text-lg text-pencil/70 mb-2">
              from{' '}
              <span className="font-heading font-bold">
                {transfer ? 'a Payo user' : mockClaim.sender}
              </span>
            </p>
            {displayMessage && (
              <Card variant="outlined" className="mt-4 bg-paper/50">
                <CardContent>
                  <p className="font-body text-pencil italic">
                    &quot;{displayMessage}&quot;
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
                <Smartphone className="w-10 h-10 text-pencil" />
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
                <Wallet className="w-10 h-10 text-pencil" />
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
              {!isConnected ? (
                <>
                  <p className="font-body text-pencil/70 text-center">
                    Connect your wallet to receive the USDC directly.
                  </p>
                  <div className="flex justify-center">
                    <ConnectWallet onConnect={handleConnectWallet} />
                  </div>
                  <div className="text-center">
                    <p className="font-body text-sm text-pencil/50">
                      Supported: MetaMask, WalletConnect, Coinbase Wallet
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <p className="font-body text-pencil/70">
                      Connected:{' '}
                      <span className="font-heading font-bold">{shortenAddress}</span>
                    </p>
                  </div>
                  <Button
                    onClick={handleClaimWithWallet}
                    isLoading={isClaiming}
                    className="w-full"
                  >
                    Claim ${displayAmount} USDC
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Security Info */}
        <Card variant="outlined" className="mt-8 rotate-slight">
          <CardContent className="flex items-start gap-4">
            <Lock className="w-6 h-6 text-pencil" />
            <div>
              <p className="font-heading font-bold text-pencil mb-1">
                Secure & Non-Custodial
              </p>
              <p className="font-body text-sm text-pencil/70">
                Your funds are held in a smart contract on Arbitrum. Only you can claim
                them after verification.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
