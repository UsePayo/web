'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link2 } from 'lucide-react';

export default function LinkIndexPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmedCode = code.trim().toUpperCase();

    if (!trimmedCode) {
      setError('Please enter a verification code');
      return;
    }

    if (trimmedCode.length !== 6) {
      setError('Verification codes are 6 characters long');
      return;
    }

    // Navigate to the code-specific page
    router.push(`/link/${trimmedCode}`);
  };

  return (
    <main className="min-h-screen pb-20 pt-20">
      <div className="max-w-xl mx-auto px-4 pt-4">
        {/* Instructions Card */}
        <Card variant="postit" className="mb-8 text-center" rotate="left">
          <CardContent>
            <Link2 className="w-12 h-12 text-pencil mx-auto mb-4" />
            <p className="font-heading text-2xl font-bold text-pencil mb-2">
              Link Your Wallet
            </p>
            <p className="font-body text-pencil/70">
              Enter the 6-character code from the Telegram bot to link your wallet
            </p>
          </CardContent>
        </Card>

        {/* Code Entry Card */}
        <Card variant="outlined" rotate="right">
          <CardHeader>
            <CardTitle>Enter Verification Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              label="Verification Code"
              placeholder="ABC123"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              error={error}
              hint="Get this code by typing /link in the Telegram bot"
              maxLength={6}
              className="text-center text-2xl tracking-widest uppercase"
            />
            <Button onClick={handleSubmit} className="w-full">
              Continue
            </Button>
          </CardContent>
        </Card>

        {/* How to get code */}
        <Card variant="outlined" className="mt-8">
          <CardHeader>
            <CardTitle>Don&apos;t have a code?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="font-body text-pencil/70 list-decimal list-inside space-y-2">
              <li>
                Open the{' '}
                <a
                  href="https://t.me/usepayo_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pen underline"
                >
                  Payo Telegram Bot
                </a>
              </li>
              <li>
                Type <code className="bg-muted px-1 rounded">/link</code> in the chat
              </li>
              <li>Copy the 6-character code or click the link</li>
              <li>Come back here and enter the code</li>
            </ol>
            <div className="pt-4">
              <a
                href="https://t.me/usepayo_bot"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" className="w-full">
                  Open Telegram Bot
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
