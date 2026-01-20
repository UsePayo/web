'use client';

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CircleCheck } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: string;
  onSuccess: () => void;
}

type WithdrawStep = 'input' | 'processing' | 'success';

export function WithdrawModal({ isOpen, onClose, balance, onSuccess }: WithdrawModalProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<WithdrawStep>('input');
  const [txHash, setTxHash] = useState<string | null>(null);

  // Pre-fill destination with connected wallet address
  const useConnectedWallet = () => {
    if (address) {
      setDestinationAddress(address);
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    // Validate amount
    if (!amount.trim()) {
      setError('Amount is required');
      return false;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (numAmount < 0.01) {
      setError('Minimum withdrawal is $0.01');
      return false;
    }

    const availableBalance = parseFloat(balance);
    if (numAmount > availableBalance) {
      setError(`Insufficient balance. You have $${availableBalance.toFixed(2)}`);
      return false;
    }

    // Validate destination address
    if (!destinationAddress.trim()) {
      setError('Destination address is required');
      return false;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(destinationAddress)) {
      setError('Invalid Ethereum address format');
      return false;
    }

    setError(null);
    return true;
  };

  const handleWithdraw = useCallback(async () => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    try {
      setError(null);
      setStep('processing');

      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          toAddress: destinationAddress,
          amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Withdraw failed');
      }

      setTxHash(data.txHash);
      setStep('success');
      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Withdrawal failed';
      setError(errorMessage);
      setStep('input');
    }
  }, [address, destinationAddress, amount, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await handleWithdraw();
  };

  const handleClose = () => {
    setAmount('');
    setDestinationAddress('');
    setError(null);
    setStep('input');
    setTxHash(null);
    onClose();
  };

  const setMaxAmount = () => {
    setAmount(balance);
    setError(null);
  };

  if (!isOpen) return null;

  const isProcessing = step === 'processing';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-pencil/50"
        onClick={step === 'input' || step === 'success' ? handleClose : undefined}
      />

      {/* Modal */}
      <Card variant="postit" className="relative z-10 w-full max-w-md mx-4" rotate="left">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Withdraw USDC</CardTitle>
            {(step === 'input' || step === 'success') && (
              <button
                onClick={handleClose}
                className="text-pencil/60 hover:text-pencil text-2xl leading-none"
                aria-label="Close"
              >
                &times;
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {step === 'success' ? (
            <div className="text-center py-4">
              <CircleCheck className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="font-heading text-xl font-bold text-pencil mb-2">
                Withdrawal Successful!
              </p>
              <p className="font-body text-pencil/70 mb-4">
                ${amount} USDC has been sent to your wallet.
              </p>
              {txHash && (
                <a
                  href={`https://sepolia.arbiscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-pen hover:underline block mb-6"
                >
                  View on Explorer
                </a>
              )}
              <Button onClick={handleClose} variant="secondary">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Payo Balance */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-body text-pencil/60">Available Balance:</span>
                <span className="font-heading font-bold text-pencil">
                  ${parseFloat(balance).toFixed(2)} USDC
                </span>
              </div>

              {/* Amount Input */}
              <div className="relative">
                <Input
                  label="Amount (USDC)"
                  type="number"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError(null);
                  }}
                  disabled={isProcessing}
                />
                <button
                  type="button"
                  onClick={setMaxAmount}
                  className="absolute right-3 top-[42px] text-sm font-body text-pen hover:underline disabled:opacity-50"
                  disabled={isProcessing}
                >
                  Max
                </button>
              </div>

              {/* Destination Address Input */}
              <div className="relative">
                <Input
                  label="Destination Address"
                  type="text"
                  placeholder="0x..."
                  value={destinationAddress}
                  onChange={(e) => {
                    setDestinationAddress(e.target.value);
                    setError(null);
                  }}
                  disabled={isProcessing}
                  hint="The Ethereum address to receive your USDC"
                />
                {address && !destinationAddress && (
                  <button
                    type="button"
                    onClick={useConnectedWallet}
                    className="absolute right-3 top-[42px] text-sm font-body text-pen hover:underline disabled:opacity-50"
                    disabled={isProcessing}
                  >
                    Use Connected
                  </button>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <p className="text-sm font-body text-marker">{error}</p>
              )}

              {/* Processing Indicator */}
              {step === 'processing' && (
                <Card variant="outlined" className="bg-paper">
                  <CardContent className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin h-5 w-5 border-2 border-pen border-t-transparent rounded-full" />
                      <div>
                        <p className="font-heading font-bold text-pencil text-sm">
                          Processing Withdrawal
                        </p>
                        <p className="font-body text-xs text-pencil/60">
                          Please wait while the transaction is being processed...
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Info Box */}
              {step === 'input' && (
                <Card variant="outlined" className="bg-paper">
                  <CardContent className="py-3">
                    <p className="font-body text-sm text-pencil/70">
                      <span className="font-bold">Note:</span> Withdrawals are processed on Arbitrum Sepolia.
                      Gas fees are covered by Payo.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Summary */}
              {amount && parseFloat(amount) > 0 && destinationAddress && (
                <Card variant="outlined" className="bg-paper">
                  <CardContent className="py-3">
                    <p className="font-body text-pencil/60 text-sm mb-2">Summary</p>
                    <div className="flex justify-between items-center">
                      <span className="font-body text-pencil text-sm">
                        To: {destinationAddress.slice(0, 6)}...{destinationAddress.slice(-4)}
                      </span>
                      <span className="font-heading text-xl font-bold text-marker">
                        ${parseFloat(amount).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isProcessing}
                  disabled={!amount || parseFloat(amount) <= 0 || !destinationAddress || isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Withdraw USDC'}
                </Button>
                {step === 'input' && (
                  <Button type="button" variant="ghost" onClick={handleClose}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
