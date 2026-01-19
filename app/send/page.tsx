'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input, Textarea } from '@/components/ui/input';

export default function SendPage() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    recipient?: string;
    amount?: string;
  }>({});

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

    setIsLoading(true);

    // Simulate API call - replace with actual implementation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // After successful send, redirect to dashboard
    // router.push('/dashboard');
    alert(
      `Sending $${amount} USDC to ${recipient}${message ? ` with message: "${message}"` : ''}`
    );

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
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 pt-24">
        <h1 className="font-heading text-4xl font-bold text-pencil mb-8 text-center">
          Send USDC
        </h1>

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
                    <p className="font-body text-pencil/60 text-sm mb-2">
                      Summary
                    </p>
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
                <Button type="submit" size="lg" isLoading={isLoading}>
                  {isLoading ? 'Sending...' : 'Send USDC'}
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
              <p className="font-heading font-bold text-pencil mb-1">
                How it works
              </p>
              <p className="font-body text-sm text-pencil/70">
                The recipient will receive a Telegram message with a link to
                claim their USDC. They can verify with their phone number or
                connect a wallet to receive the funds.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
