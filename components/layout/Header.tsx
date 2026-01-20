'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Wallet } from 'lucide-react';

export function Header() {
  const {
    isConnected,
    isConnecting,
    connectWallet,
    disconnect,
    shortenAddress,
    isCorrectChain,
    switchToArbitrumSepolia,
    isSwitchingChain,
  } = useWalletConnection();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/80 backdrop-blur-sm border-b-2 border-dashed border-pencil">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-heading text-2xl font-bold text-pencil">
          Payo
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isConnected ? (
            <>
              {/* Wrong Network Warning */}
              {!isCorrectChain && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={switchToArbitrumSepolia}
                  isLoading={isSwitchingChain}
                  className="bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
                >
                  Switch to Arbitrum
                </Button>
              )}

              {/* Navigation Links */}
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>

              {/* Address */}
              <span className="font-body text-sm text-pencil/60 hidden sm:inline">
                {shortenAddress}
              </span>

              {/* Disconnect */}
              <Button variant="ghost" size="sm" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button onClick={() => connectWallet()} isLoading={isConnecting} size="sm">
              <span className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
