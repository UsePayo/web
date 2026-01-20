'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input, Textarea } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { ConnectWallet } from '@/components/wallet/ConnectWallet';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { usePayoVault } from '@/hooks/usePayoVault';
import { useLinkStatus } from '@/hooks/useLinkStatus';
import { useToast } from '@/components/ui/toast';
import { PAYO_VAULT_ADDRESS } from '@/lib/contracts';

export default function SendPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { isConnected, address, isCorrectChain } = useWalletConnection();

  // Check if wallet is linked to Telegram
  const { linkStatus, isLoading: isLinkStatusLoading } = useLinkStatus(address);

  // Use linked Telegram ID if available, otherwise use wallet address
  const senderIdentifier = linkStatus?.linked && linkStatus.telegramId
    ? `telegram:${linkStatus.telegramId}`
    : address
      ? `wallet:${address}`
      : undefined;

  const { send, isSending, sendError, balance, isBalanceLoading } =
    usePayoVault(senderIdentifier);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{
    recipient?: string;
    amount?: string;
  }>({});

  // Check if contract is deployed
  const isContractDeployed =
    PAYO_VAULT_ADDRESS !== '0x0000000000000000000000000000000000000000';

  // Show toast on send error
  useEffect(() => {
    if (sendError) {
      addToast(sendError.message, 'error');
    }
  }, [sendError, addToast]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!recipient.trim()) {
      newErrors.recipient = 'Telegram username is required';
    } else if (!recipient.startsWith('@')) {
      newErrors.recipient = 'Username must start with @';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (parseFloat(amount) > 10000) {
      newErrors.amount = 'Maximum amount is $10,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!isConnected) {
      addToast('Please connect your wallet first', 'warning');
      return;
    }

    if (!senderIdentifier) {
      addToast('Unable to identify sender', 'error');
      return;
    }

    // If contract not deployed, show demo message
    if (!isContractDeployed) {
      addToast(
        `Demo: Would send $${amount} USDC to ${recipient}${message ? ` with message: "${message}"` : ''}`,
        'info'
      );
      return;
    }

    try {
      const txHash = await send({
        fromUsername: senderIdentifier,
        toUsername: recipient,
        amount,
        message,
      });

      if (txHash) {
        addToast('Transaction submitted successfully!', 'success');
        // Wait a moment then redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error) {
      // Error is already handled via useEffect
    }
  };

  return (
    <main className="min-h-screen pb-20">
      <Header />

      <div className="max-w-xl mx-auto px-4 pt-24">
        <h1 className="font-heading text-4xl font-bold text-pencil mb-8 text-center">
          Send USDC
        </h1>

        {/* Contract Not Deployed Warning */}
        {!isContractDeployed && (
          <Card variant="outlined" className="mb-6 bg-yellow-50">
            <CardContent className="flex items-center gap-3">
              <span className="text-xl">&#x26A0;</span>
              <div>
                <p className="font-heading font-bold text-pencil">Demo Mode</p>
                <p className="font-body text-sm text-pencil/70">
                  Contract not deployed. Transactions will be simulated.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connect Wallet Prompt */}
        {!isConnected && (
          <Card variant="outlined" className="mb-6">
            <CardContent className="text-center py-6">
              <p className="font-body text-pencil/70 mb-4">
                Connect your wallet to send USDC
              </p>
              <ConnectWallet />
            </CardContent>
          </Card>
        )}

        {/* Balance Display */}
        {isConnected && (
          <Card variant="outlined" className="mb-6">
            <CardContent className="flex items-center justify-between">
              <span className="font-body text-pencil/70">Available Balance</span>
              {isBalanceLoading || isLinkStatusLoading ? (
                <span className="font-heading text-xl font-bold text-pencil animate-pulse">
                  Loading...
                </span>
              ) : (
                <span className="font-heading text-xl font-bold text-pencil">
                  ${isContractDeployed ? balance : '1,234.56'} USDC
                </span>
              )}
            </CardContent>
          </Card>
        )}

        <Card variant="postit" rotate="left">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="To (Telegram Username)"
                placeholder="@username"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                error={errors.recipient}
                hint="Enter the recipient's Telegram username"
              />

              <Input
                label="Amount (USDC)"
                type="number"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                error={errors.amount}
                hint="Minimum $0.01, maximum $10,000"
              />

              <Textarea
                label="Message (Optional)"
                placeholder="Add a note to your payment..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                hint="This message will be visible to the recipient"
              />

              {/* Summary */}
              {recipient && amount && parseFloat(amount) > 0 && (
                <Card variant="outlined" className="bg-paper">
                  <CardContent>
                    <p className="font-body text-pencil/60 text-sm mb-2">Summary</p>
                    <div className="flex justify-between items-center">
                      <span className="font-heading text-pencil">
                        Sending to {recipient}
                      </span>
                      <span className="font-heading text-2xl font-bold text-marker">
                        ${parseFloat(amount).toFixed(2)}
                      </span>
                    </div>
                    <p className="font-body text-xs text-pencil/50 mt-2">
                      + ~$0.01 network fee on Arbitrum
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isSending}
                  disabled={(!isConnected || !isCorrectChain) && isContractDeployed}
                >
                  {!isCorrectChain && isConnected ? 'Switch to Arbitrum Sepolia' : isSending ? 'Sending...' : 'Send USDC'}
                </Button>
                <Link href="/dashboard" className="w-full">
                  <Button type="button" variant="ghost" size="lg" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card variant="outlined" className="mt-8 rotate-slight-reverse">
          <CardContent className="flex items-start gap-4">
            <span className="text-2xl">&#x1F4A1;</span>
            <div>
              <p className="font-heading font-bold text-pencil mb-1">How it works</p>
              <p className="font-body text-sm text-pencil/70">
                The recipient will receive a Telegram message with a link to claim their
                USDC. They can verify with their phone number or connect a wallet to
                receive the funds.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
