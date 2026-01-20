'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Wallet, X, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';

interface ConnectWalletProps {
  onConnect?: () => void;
  showDashboardLink?: boolean;
}

export function ConnectWallet({ onConnect, showDashboardLink = true }: ConnectWalletProps) {
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    isConnected,
    isConnecting,
    connectWallet,
    connectors,
    disconnect,
    isCorrectChain,
    switchToArbitrumSepolia,
    isSwitchingChain,
    shortenAddress,
  } = useWalletConnection();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    }

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  if (isConnected && !isCorrectChain) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-body text-sm text-marker">Wrong Network</span>
        <Button
          variant="secondary"
          size="sm"
          onClick={switchToArbitrumSepolia}
          isLoading={isSwitchingChain}
        >
          Switch to Arbitrum Sepolia
        </Button>
      </div>
    );
  }

  // Connected state - show dropdown with Dashboard and Disconnect
  if (isConnected) {
    return (
      <div className="relative inline-block" ref={dropdownRef}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">{shortenAddress}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showOptions ? 'rotate-180' : ''}`} />
        </Button>

        {showOptions && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowOptions(false)}
            />

            {/* Dropdown menu */}
            <div className="absolute top-full right-0 mt-2 min-w-[180px] z-50 bg-paper border-2 border-pencil rounded-lg shadow-hard p-2">
              {showDashboardLink && (
                <Link
                  href="/dashboard"
                  onClick={() => setShowOptions(false)}
                  className="flex items-center gap-3 px-3 py-2 font-body text-pencil hover:bg-muted rounded-md transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              )}
              <button
                onClick={() => {
                  disconnect();
                  setShowOptions(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 font-body text-marker hover:bg-muted rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Not connected - show connect wallet options
  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <Button
        onClick={() => setShowOptions(!showOptions)}
        isLoading={isConnecting}
        size="sm"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>

      {showOptions && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-pencil/20 z-40"
            onClick={() => setShowOptions(false)}
          />

          {/* Dropdown - centered on mobile, right-aligned on larger screens */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-2 min-w-[280px] max-w-[90vw] z-50 bg-paper border-2 border-pencil wobbly-border hard-shadow p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-dashed border-pencil">
              <h3 className="font-heading text-lg font-bold text-pencil">
                Select Wallet
              </h3>
              <button
                onClick={() => setShowOptions(false)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-pencil" />
              </button>
            </div>

            {/* Wallet Options */}
            <div className="space-y-2">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => {
                    connectWallet(connector.id);
                    setShowOptions(false);
                    onConnect?.();
                  }}
                  disabled={isConnecting}
                  className="w-full flex items-center gap-3 px-4 py-3 font-body text-pencil bg-paper border-2 border-pencil wobbly-border-alt hover:bg-muted hover:shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wallet className="w-5 h-5 text-pen" />
                  <span className="font-heading font-bold">{connector.name}</span>
                </button>
              ))}
            </div>

            {/* Footer hint */}
            <p className="mt-4 pt-3 border-t-2 border-dashed border-pencil font-body text-xs text-pencil/60 text-center">
              Connect to Arbitrum Sepolia
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// Simplified button for inline use
export function ConnectWalletButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { isConnected, isConnecting, connectWallet } = useWalletConnection();

  if (isConnected) return null;

  return (
    <Button
      onClick={() => connectWallet()}
      isLoading={isConnecting}
      className={className}
      {...props}
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  );
}
