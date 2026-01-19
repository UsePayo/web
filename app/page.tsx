'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import {
  Hero,
  HowItWorks,
  Features,
  LiveDemo,
  Stats,
  Comparison,
  FAQ,
  CTAFooter,
} from '@/components/landing';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function LandingPage() {
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!navRef.current) return;

    // Navbar animation on load
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });

    // Navbar background change on scroll
    ScrollTrigger.create({
      start: 'top -80',
      onUpdate: (self) => {
        if (navRef.current) {
          if (self.progress > 0) {
            navRef.current.classList.add('shadow-hard-sm');
            navRef.current.style.backgroundColor = 'rgba(253, 251, 247, 0.95)';
          } else {
            navRef.current.classList.remove('shadow-hard-sm');
            navRef.current.style.backgroundColor = 'rgba(253, 251, 247, 0.8)';
          }
        }
      },
    });
  }, { scope: navRef });

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-paper/80 backdrop-blur-sm border-b-2 border-dashed border-pencil transition-all duration-300"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="font-heading text-xl sm:text-2xl font-bold text-pencil">
            Payo
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/dashboard"
              className="hidden sm:block font-heading text-pencil hover:text-pen transition-colors"
            >
              Dashboard
            </Link>
            <a
              href="https://t.me/PayoBot"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden"
            >
              <Button size="sm">
                <MessageCircle className="w-4 h-4 mr-1" />
                Bot
              </Button>
            </a>
            <Link href="/dashboard" className="hidden sm:block">
              <Button variant="outline" size="sm">
                Connect Wallet
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Features Section */}
      <Features />

      {/* Live Demo Section */}
      <LiveDemo />

      {/* Stats Section */}
      <Stats />

      {/* Comparison Section */}
      <Comparison />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Footer Section */}
      <CTAFooter />
    </main>
  );
}
