'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { keccak256, toBytes, parseUnits, formatUnits } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PAYO_VAULT_ADDRESS, USDC_ADDRESS, PAYO_VAULT_ABI } from '@/lib/contracts';

// Standard ERC20 ABI for approve and allowance
const ERC20_ABI = [
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  telegramId: number;
  onSuccess: () => void;
}

type DepositStep = 'input' | 'approve' | 'deposit' | 'success';

export function DepositModal({ isOpen, onClose, telegramId, onSuccess }: DepositModalProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<DepositStep>('input');
  const [approveTxHash, setApproveTxHash] = useState<`0x${string}` | undefined>();
  const [depositTxHash, setDepositTxHash] = useState<`0x${string}` | undefined>();

  // Use ref to track if we should auto-deposit after approval
  const shouldAutoDeposit = useRef(false);

  // Hash the telegram ID for the contract
  const telegramHash = keccak256(toBytes(`telegram:${telegramId}`));

  // Read USDC balance
  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, PAYO_VAULT_ADDRESS] : undefined,
    query: { enabled: !!address },
  });

  // Write contract hooks
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  // Wait for approve transaction
  const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  });

  // Wait for deposit transaction
  const { isLoading: isDepositLoading, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositTxHash,
  });

  // Parse amount to USDC units (6 decimals)
  const amountInUnits = amount ? parseUnits(amount, 6) : BigInt(0);

  // Check if approval is needed
  const needsApproval = allowance !== undefined && amountInUnits > allowance;

  // Format USDC balance for display
  const formattedUsdcBalance = usdcBalance ? formatUnits(usdcBalance, 6) : '0';

  // Execute deposit
  const executeDeposit = useCallback(async () => {
    try {
      setError(null);
      const currentAmountInUnits = amount ? parseUnits(amount, 6) : BigInt(0);
      const hash = await writeContractAsync({
        address: PAYO_VAULT_ADDRESS,
        abi: PAYO_VAULT_ABI,
        functionName: 'deposit',
        args: [telegramHash, currentAmountInUnits],
        chainId: arbitrumSepolia.id,
      });
      setDepositTxHash(hash);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Deposit failed';
      setError(errorMessage);
      setStep('input');
      shouldAutoDeposit.current = false;
    }
  }, [writeContractAsync, telegramHash, amount]);

  // Handle approve success - trigger deposit
  useEffect(() => {
    if (isApproveSuccess && step === 'approve' && shouldAutoDeposit.current) {
      shouldAutoDeposit.current = false;
      refetchAllowance();
      setStep('deposit');
      executeDeposit();
    }
  }, [isApproveSuccess, step, refetchAllowance, executeDeposit]);

  // Handle deposit success
  useEffect(() => {
    if (isDepositSuccess && step === 'deposit') {
      setStep('success');
      onSuccess();
    }
  }, [isDepositSuccess, step, onSuccess]);

  const validateAmount = (): boolean => {
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
      setError('Minimum deposit is $0.01');
      return false;
    }

    const balance = parseFloat(formattedUsdcBalance);
    if (numAmount > balance) {
      setError(`Insufficient USDC balance. You have $${balance.toFixed(2)}`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleApprove = useCallback(async () => {
    try {
      setError(null);
      const currentAmountInUnits = amount ? parseUnits(amount, 6) : BigInt(0);
      const hash = await writeContractAsync({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [PAYO_VAULT_ADDRESS, currentAmountInUnits],
        chainId: arbitrumSepolia.id,
      });
      setApproveTxHash(hash);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Approval failed';
      setError(errorMessage);
      setStep('input');
      shouldAutoDeposit.current = false;
    }
  }, [writeContractAsync, amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAmount()) return;

    if (needsApproval) {
      setStep('approve');
      shouldAutoDeposit.current = true;
      await handleApprove();
    } else {
      setStep('deposit');
      await executeDeposit();
    }
  };

  const handleClose = () => {
    setAmount('');
    setError(null);
    setStep('input');
    setApproveTxHash(undefined);
    setDepositTxHash(undefined);
    shouldAutoDeposit.current = false;
    onClose();
  };

  const setMaxAmount = () => {
    setAmount(formattedUsdcBalance);
    setError(null);
  };

  if (!isOpen) return null;

  const isProcessing = isWritePending || isApproveLoading || isDepositLoading;

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
            <CardTitle>Deposit USDC</CardTitle>
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
              <div className="text-5xl mb-4">&#x2705;</div>
              <p className="font-heading text-xl font-bold text-pencil mb-2">
                Deposit Successful!
              </p>
              <p className="font-body text-pencil/70 mb-6">
                ${amount} USDC has been deposited to your Payo balance.
              </p>
              <Button onClick={handleClose} variant="secondary">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Wallet USDC Balance */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-body text-pencil/60">Wallet USDC Balance:</span>
                <span className="font-heading font-bold text-pencil">
                  ${parseFloat(formattedUsdcBalance).toFixed(2)}
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
                  error={error ?? undefined}
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

              {/* Step Indicator */}
              {(step === 'approve' || step === 'deposit') && (
                <Card variant="outlined" className="bg-paper">
                  <CardContent className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin h-5 w-5 border-2 border-pen border-t-transparent rounded-full" />
                      <div>
                        <p className="font-heading font-bold text-pencil text-sm">
                          {step === 'approve' ? 'Step 1 of 2: Approving USDC' : 'Step 2 of 2: Depositing'}
                        </p>
                        <p className="font-body text-xs text-pencil/60">
                          {step === 'approve'
                            ? 'Please confirm the approval in your wallet'
                            : 'Please confirm the deposit in your wallet'}
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
                      <span className="font-bold">Note:</span> Depositing adds USDC to your Payo balance,
                      which you can use to send payments via Telegram.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isProcessing}
                  disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                >
                  {needsApproval ? 'Approve & Deposit' : 'Deposit USDC'}
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
