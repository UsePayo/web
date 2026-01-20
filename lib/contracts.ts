import { type Address } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

// PayoVault Contract Address - Deployed on Arbitrum Sepolia
export const PAYO_VAULT_ADDRESS: Address = '0xa58ef4f38cec398c8a40e203a67484884158cc49';

// USDC Contract Address on Arbitrum Sepolia
export const USDC_ADDRESS: Address = '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d';

// Chain configuration
export const SUPPORTED_CHAIN = arbitrumSepolia;

// PayoVault ABI - MVP version (simplified)
export const PAYO_VAULT_ABI = [
  // Initialize
  {
    type: 'function',
    name: 'initialize',
    inputs: [{ name: 'relayer', type: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  // Deposit
  {
    type: 'function',
    name: 'deposit',
    inputs: [
      { name: 'id_hash', type: 'bytes32' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  // Send
  {
    type: 'function',
    name: 'send',
    inputs: [
      { name: 'from', type: 'bytes32' },
      { name: 'to', type: 'bytes32' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'nonpayable',
  },
  // Claim - now takes recipient_hash to redirect funds to the claimer's Telegram ID hash
  {
    type: 'function',
    name: 'claim',
    inputs: [
      { name: 'tid', type: 'bytes32' },
      { name: 'recipient_hash', type: 'bytes32' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  // Withdraw
  {
    type: 'function',
    name: 'withdraw',
    inputs: [
      { name: 'id_hash', type: 'bytes32' },
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  // Get Balance (view) - Stylus uses camelCase
  {
    type: 'function',
    name: 'getBalance',
    inputs: [{ name: 'id_hash', type: 'bytes32' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  // Get Transfer (view) - Stylus uses camelCase
  {
    type: 'function',
    name: 'getTransfer',
    inputs: [{ name: 'tid', type: 'bytes32' }],
    outputs: [
      { name: 'from_hash', type: 'bytes32' },
      { name: 'to_hash', type: 'bytes32' },
      { name: 'amount', type: 'uint256' },
      { name: 'claimed', type: 'bool' },
      { name: 'exists', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  // Get Relayer (view) - Stylus uses camelCase
  {
    type: 'function',
    name: 'getRelayer',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  // Get Owner (view) - Stylus uses camelCase
  {
    type: 'function',
    name: 'getOwner',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  // Events
  {
    type: 'event',
    name: 'Deposited',
    inputs: [
      { name: 'identifier_hash', type: 'bytes32', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'Sent',
    inputs: [
      { name: 'transfer_id', type: 'bytes32', indexed: true },
      { name: 'from_hash', type: 'bytes32', indexed: true },
      { name: 'to_hash', type: 'bytes32', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'Claimed',
    inputs: [{ name: 'transfer_id', type: 'bytes32', indexed: true }],
  },
  {
    type: 'event',
    name: 'Withdrawn',
    inputs: [
      { name: 'identifier_hash', type: 'bytes32', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  // Errors
  {
    type: 'error',
    name: 'Unauthorized',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InsufficientBalance',
    inputs: [],
  },
  {
    type: 'error',
    name: 'TransferNotFound',
    inputs: [],
  },
  {
    type: 'error',
    name: 'TransferAlreadyClaimed',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidAmount',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidAddress',
    inputs: [],
  },
] as const;

// Helper to convert USDC amount (6 decimals) to human-readable
export function formatUSDC(amount: bigint): string {
  const decimals = 6;
  const value = Number(amount) / Math.pow(10, decimals);
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Helper to convert human-readable amount to USDC wei (6 decimals)
export function parseUSDC(amount: string): bigint {
  const decimals = 6;
  const value = parseFloat(amount);
  if (isNaN(value)) return BigInt(0);
  return BigInt(Math.round(value * Math.pow(10, decimals)));
}

// Helper to generate identifier hash from Telegram username
export async function hashIdentifier(identifier: string): Promise<`0x${string}`> {
  const { keccak256, toBytes } = await import('viem');
  return keccak256(toBytes(identifier.toLowerCase()));
}
