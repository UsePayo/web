'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data - replace with real data from API/blockchain
const mockBalance = 1234.56;
const mockPendingClaims = [
  {
    id: 'claim-1',
    recipient: '@alice_crypto',
    amount: 50.0,
    createdAt: '2024-01-15',
    status: 'pending',
  },
  {
    id: 'claim-2',
    recipient: '@bob_dev',
    amount: 25.0,
    createdAt: '2024-01-14',
    status: 'pending',
  },
];

const mockTransactions = [
  {
    id: 'tx-1',
    type: 'sent',
    recipient: '@charlie_moon',
    amount: 100.0,
    date: '2024-01-13',
    status: 'completed',
  },
  {
    id: 'tx-2',
    type: 'received',
    sender: '@dave_builder',
    amount: 200.0,
    date: '2024-01-12',
    status: 'completed',
  },
  {
    id: 'tx-3',
    type: 'deposit',
    amount: 500.0,
    date: '2024-01-10',
    status: 'completed',
  },
  {
    id: 'tx-4',
    type: 'sent',
    recipient: '@eve_trader',
    amount: 75.0,
    date: '2024-01-09',
    status: 'completed',
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/80 backdrop-blur-sm border-b-2 border-dashed border-pencil">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-heading text-2xl font-bold text-pencil">
            Payo
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-body text-sm text-pencil/60">
              0x1234...5678
            </span>
            <Button variant="ghost" size="sm">
              Disconnect
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-24">
        {/* Balance Card */}
        <Card variant="postit" className="mb-8 text-center" rotate="left">
          <CardContent>
            <p className="font-body text-lg text-pencil/60 mb-2">
              Your Balance
            </p>
            <p className="font-heading text-6xl font-bold text-pencil mb-6">
              ${mockBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="font-body text-sm text-pencil/50 mb-6">USDC</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="secondary">Deposit USDC</Button>
              <Link href="/send">
                <Button>Send USDC</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Pending Claims */}
        {mockPendingClaims.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-pencil mb-4">
              Pending Claims
            </h2>
            <div className="space-y-4">
              {mockPendingClaims.map((claim) => (
                <Card key={claim.id} variant="outlined" className="rotate-slight">
                  <CardContent className="flex items-center justify-between">
                    <div>
                      <p className="font-heading text-lg font-bold text-pencil">
                        {claim.recipient}
                      </p>
                      <p className="font-body text-sm text-pencil/60">
                        Sent on {claim.createdAt}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-xl font-bold text-marker">
                        ${claim.amount.toFixed(2)}
                      </p>
                      <Badge variant="warning">Pending</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Recent Transactions */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-pencil mb-4">
            Recent Transactions
          </h2>
          <div className="space-y-4">
            {mockTransactions.map((tx) => (
              <Card key={tx.id} className="rotate-slight-reverse">
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 flex items-center justify-center font-heading text-xl border-2 border-pencil wobbly-border ${
                        tx.type === 'received' || tx.type === 'deposit'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      {tx.type === 'received' || tx.type === 'deposit'
                        ? '+'
                        : '-'}
                    </div>
                    <div>
                      <p className="font-heading text-lg font-bold text-pencil">
                        {tx.type === 'sent' && `Sent to ${tx.recipient}`}
                        {tx.type === 'received' && `Received from ${tx.sender}`}
                        {tx.type === 'deposit' && 'Deposited'}
                      </p>
                      <p className="font-body text-sm text-pencil/60">
                        {tx.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-heading text-xl font-bold ${
                        tx.type === 'received' || tx.type === 'deposit'
                          ? 'text-green-600'
                          : 'text-marker'
                      }`}
                    >
                      {tx.type === 'received' || tx.type === 'deposit'
                        ? '+'
                        : '-'}
                      ${tx.amount.toFixed(2)}
                    </p>
                    <Badge variant="success">Completed</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
