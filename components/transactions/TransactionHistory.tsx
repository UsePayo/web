'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction, useTransactionHistory } from '@/hooks/useTransactionHistory';

interface TransactionHistoryProps {
  walletAddress?: string;
  isLinked?: boolean;
}

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatCounterparty(counterparty: string, type: Transaction['type']): string {
  // For usernames, add @ prefix if not already present
  if (!counterparty.startsWith('0x') && !counterparty.startsWith('@')) {
    return `@${counterparty}`;
  }
  // For addresses, truncate
  if (counterparty.startsWith('0x') && counterparty.length > 12) {
    return `${counterparty.slice(0, 6)}...${counterparty.slice(-4)}`;
  }
  return counterparty;
}

function getTransactionIcon(type: Transaction['type']): string {
  switch (type) {
    case 'send':
      return '\u2191'; // Arrow up
    case 'receive':
      return '\u2193'; // Arrow down
    case 'withdraw':
      return '\u2192'; // Arrow right
    case 'deposit':
      return '\u2190'; // Arrow left
    default:
      return '\u2022'; // Bullet
  }
}

function getTransactionLabel(type: Transaction['type']): string {
  switch (type) {
    case 'send':
      return 'Sent';
    case 'receive':
      return 'Received';
    case 'withdraw':
      return 'Withdrew';
    case 'deposit':
      return 'Deposited';
    default:
      return type;
  }
}

function getStatusBadgeVariant(
  status: string
): 'default' | 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
    case 'pending_confirmation':
    case 'processing':
      return 'warning';
    case 'failed':
    case 'cancelled':
    case 'expired':
      return 'error';
    default:
      return 'default';
  }
}

function TransactionItem({ tx }: { tx: Transaction }) {
  const isSend = tx.type === 'send' || tx.type === 'withdraw';
  const icon = getTransactionIcon(tx.type);
  const label = getTransactionLabel(tx.type);

  return (
    <div className="flex items-center justify-between py-3 border-b-2 border-dashed border-pencil/20 last:border-b-0">
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className={`w-10 h-10 flex items-center justify-center font-heading text-xl font-bold wobbly-border border-2 ${
            isSend
              ? 'bg-red-50 border-marker text-marker'
              : 'bg-green-50 border-green-700 text-green-700'
          }`}
        >
          {icon}
        </div>

        {/* Details */}
        <div>
          <p className="font-heading font-bold text-pencil">
            {label}{' '}
            <span className="font-body font-normal text-pencil/70">
              {tx.type === 'withdraw' ? 'to' : tx.type === 'send' ? 'to' : 'from'}{' '}
              {formatCounterparty(tx.counterparty, tx.type)}
            </span>
          </p>
          <p className="font-body text-sm text-pencil/50">{formatTimeAgo(tx.timestamp)}</p>
        </div>
      </div>

      {/* Amount and Status */}
      <div className="text-right">
        <p
          className={`font-heading font-bold text-lg ${
            isSend ? 'text-marker' : 'text-green-700'
          }`}
        >
          {isSend ? '-' : '+'}${tx.amount}
        </p>
        {tx.status !== 'completed' && (
          <Badge variant={getStatusBadgeVariant(tx.status)} className="text-xs">
            {tx.status}
          </Badge>
        )}
      </div>
    </div>
  );
}

export function TransactionHistory({ walletAddress, isLinked }: TransactionHistoryProps) {
  const { transactions, isLoading, error, refetch } = useTransactionHistory(
    isLinked ? walletAddress : undefined,
    10
  );

  // Don't show if wallet is not linked
  if (!isLinked) {
    return null;
  }

  return (
    <Card variant="outlined" className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <button
            onClick={() => refetch()}
            className="font-body text-sm text-pen hover:underline"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && transactions.length === 0 ? (
          <div className="py-8 text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-pencil/10 rounded mb-3" />
              <div className="h-12 bg-pencil/10 rounded mb-3" />
              <div className="h-12 bg-pencil/10 rounded" />
            </div>
          </div>
        ) : error && transactions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-body text-pencil/50">Unable to load transaction history</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-heading text-2xl text-pencil/30 mb-2">No transactions yet</p>
            <p className="font-body text-pencil/50">
              Your transaction history will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y-0">
            {transactions.map((tx) => (
              <TransactionItem key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
