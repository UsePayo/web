"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Wallet, ChevronDown, LayoutDashboard, Droplets, LogOut, Home, MessageCircle, X } from "lucide-react";

export function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const connectRef = useRef<HTMLDivElement>(null);
  const {
    isConnected,
    isConnecting,
    connectWallet,
    connectors,
    disconnect,
    shortenAddress,
    isCorrectChain,
    switchToArbitrumSepolia,
    isSwitchingChain,
  } = useWalletConnection();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (connectRef.current && !connectRef.current.contains(event.target as Node)) {
        setShowConnectModal(false);
      }
    }

    if (showDropdown || showConnectModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showConnectModal]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/80 backdrop-blur-sm border-b-2 border-dashed border-pencil">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Payo"
            width={40}
            height={40}
            className="w-9 h-9 sm:w-10 sm:h-10"
          />
          <span className="font-heading text-xl sm:text-2xl font-bold text-pencil">
            Payo
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Telegram Bot Link - mobile only */}
          <a
            href="https://t.me/usepayo_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden"
          >
            <Button size="sm" variant="ghost">
              <MessageCircle className="w-4 h-4" />
            </Button>
          </a>

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
                  Switch Network
                </Button>
              )}

              {/* Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">{shortenAddress}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </Button>

                {showDropdown && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDropdown(false)}
                    />

                    {/* Dropdown menu */}
                    <div className="absolute top-full right-0 mt-2 min-w-[180px] z-50 bg-paper border-2 border-pencil rounded-lg shadow-hard p-2">
                      <Link
                        href="/"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-3 py-2 font-body text-pencil hover:bg-muted rounded-md transition-colors"
                      >
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-3 py-2 font-body text-pencil hover:bg-muted rounded-md transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/faucet"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-3 py-2 font-body text-pencil hover:bg-muted rounded-md transition-colors"
                      >
                        <Droplets className="w-4 h-4" />
                        <span>Faucet</span>
                      </Link>
                      <a
                        href="https://t.me/usepayo_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-3 py-2 font-body text-pencil hover:bg-muted rounded-md transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Telegram Bot</span>
                      </a>
                      <div className="my-1 border-t border-pencil/20" />
                      <button
                        onClick={() => {
                          disconnect();
                          setShowDropdown(false);
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
            </>
          ) : (
            <div className="relative" ref={connectRef}>
              <Button
                onClick={() => setShowConnectModal(!showConnectModal)}
                isLoading={isConnecting}
                size="sm"
              >
                <Wallet className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
              </Button>

              {showConnectModal && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 bg-pencil/20 z-40"
                    onClick={() => setShowConnectModal(false)}
                  />

                  {/* Connect wallet modal */}
                  <div className="absolute top-full right-0 mt-2 min-w-[280px] z-50 bg-paper border-2 border-pencil rounded-lg shadow-hard p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-dashed border-pencil">
                      <h3 className="font-heading text-lg font-bold text-pencil">
                        Select Wallet
                      </h3>
                      <button
                        onClick={() => setShowConnectModal(false)}
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
                            setShowConnectModal(false);
                          }}
                          disabled={isConnecting}
                          className="w-full flex items-center gap-3 px-4 py-3 font-body text-pencil bg-paper border-2 border-pencil rounded-lg hover:bg-muted hover:shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          )}
        </div>
      </div>
    </nav>
  );
}
