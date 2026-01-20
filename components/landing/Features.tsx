'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent } from '@/components/ui/card';
import {
  WalletCards,
  Zap,
  CircleDollarSign,
  Shield,
  Smartphone,
  Globe
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Zap,
    title: 'Instant Transfers',
    description: 'Money moves in seconds, not days. Send to anyone, anywhere, anytime.',
  },
  {
    icon: CircleDollarSign,
    title: 'Low Fees (Arbitrum)',
    description: 'Built on Arbitrum for pennies in transaction fees. More money for your friends.',
  },
  {
    icon: Shield,
    title: 'Non-Custodial',
    description: 'Funds stay in smart contracts until claimed. We never hold your money.',
  },
  {
    icon: WalletCards,
    title: 'Easy Wallet Claims',
    description: 'Recipients connect any wallet to claim. Works with MetaMask, WalletConnect, and more.',
  },
  {
    icon: Smartphone,
    title: 'Telegram-First',
    description: 'Send via Telegram bot commands. No app downloads, just chat and send.',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Works wherever Telegram works. Send money across borders effortlessly.',
  },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Title animation
    gsap.from('.features-title', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.features-title',
        start: 'top 85%',
      },
    });

    // Staggered card animation
    gsap.from('.feature-card', {
      y: 60,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.features-grid',
        start: 'top 80%',
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="features-title font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-pencil text-center mb-12 sm:mb-16">
          Why Payo?
        </h2>

        <div className="features-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                variant="outlined"
                className={`feature-card hover:bg-muted/30 transition-colors duration-300 ${
                  index % 2 === 0 ? 'rotate-slight' : 'rotate-slight-reverse'
                }`}
              >
                <CardContent className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-pen shrink-0" />
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-pencil mb-2">
                      {feature.title}
                    </h3>
                    <p className="font-body text-sm sm:text-base text-pencil/70">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
