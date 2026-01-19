'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Sparkles } from 'lucide-react';

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Stagger text animation
    tl.from('.hero-word', {
      y: 100,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
    })
    .from('.hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.6,
    }, '-=0.3')
    .from('.hero-buttons', {
      y: 30,
      opacity: 0,
      duration: 0.6,
    }, '-=0.3')
    .from('.hero-testimonial', {
      y: 40,
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
    }, '-=0.2');

    // Floating phone animation
    if (phoneRef.current) {
      gsap.to(phoneRef.current, {
        y: -15,
        duration: 2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });
    }

    // Background dots animation
    gsap.to('.hero-dot', {
      y: 'random(-20, 20)',
      x: 'random(-20, 20)',
      opacity: 'random(0.3, 1)',
      duration: 'random(2, 4)',
      stagger: {
        each: 0.1,
        repeat: -1,
        yoyo: true,
      },
      ease: 'sine.inOut',
    });
  }, { scope: containerRef });

  const headlineWords = ['Send', 'USDC', 'to', 'anyone.'];
  const subtitleWords = ['No', 'wallet', 'needed.'];

  return (
    <section ref={containerRef} className="relative pt-32 sm:pt-36 md:pt-40 pb-16 md:pb-20 px-4 min-h-[90vh] flex items-center">
      {/* Animated background dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="hero-dot absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-marker/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        {[...Array(15)].map((_, i) => (
          <div
            key={`pen-${i}`}
            className="hero-dot absolute w-2 h-2 rounded-full bg-pen/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-pencil mb-4 sm:mb-6 leading-tight overflow-hidden">
              <span className="block overflow-hidden">
                {headlineWords.map((word, i) => (
                  <span key={i} className="hero-word inline-block mr-2 sm:mr-4">
                    {word}
                  </span>
                ))}
              </span>
              <span className="block overflow-hidden mt-2">
                {subtitleWords.map((word, i) => (
                  <span
                    key={i}
                    className={`hero-word inline-block mr-2 sm:mr-4 ${i === 1 || i === 2 ? 'underline-sketch' : ''}`}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </h1>

            <p className="hero-subtitle font-body text-lg sm:text-xl md:text-2xl text-pencil/70 mb-8 sm:mb-10 max-w-xl mx-auto lg:mx-0">
              Pay friends, split bills, or send money globally through Telegram.
              Recipients claim with just a phone number.
            </p>

            <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="https://t.me/PayoBot"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg">
                  Open Telegram Bot
                </Button>
              </a>
              <Link href="/dashboard">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base sm:text-lg">
                  Connect Wallet
                </Button>
              </Link>
            </div>
          </div>

          {/* Right content - Phone mockup */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div ref={phoneRef} className="relative">
              {/* Phone frame */}
              <div className="relative w-[260px] sm:w-[280px] md:w-[300px] h-[520px] sm:h-[560px] md:h-[600px] bg-pencil rounded-[40px] p-3 shadow-hard-lg">
                {/* Dynamic Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-pencil rounded-full z-10" />
                <div className="w-full h-full bg-paper rounded-[32px] overflow-hidden relative">
                  {/* Telegram-like UI */}
                  <div className="bg-pen text-white pt-8 pb-3 px-3 sm:pt-8 sm:pb-4 sm:px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-lg sm:text-xl">P</span>
                      </div>
                      <div>
                        <p className="font-heading font-bold text-sm sm:text-base">Payo Bot</p>
                        <p className="text-xs opacity-75">online</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {/* Bot message */}
                    <div className="bg-muted/50 rounded-lg p-2 sm:p-3 max-w-[85%]">
                      <p className="font-body text-xs sm:text-sm text-pencil">
                        Welcome to Payo! Send USDC to anyone on Telegram.
                      </p>
                    </div>

                    {/* User message */}
                    <div className="bg-pen/10 rounded-lg p-2 sm:p-3 max-w-[85%] ml-auto">
                      <p className="font-body text-xs sm:text-sm text-pencil">
                        /send @alice 50
                      </p>
                    </div>

                    {/* Bot response */}
                    <div className="bg-muted/50 rounded-lg p-2 sm:p-3 max-w-[85%]">
                      <p className="font-body text-xs sm:text-sm text-pencil">
                        Sending 50 USDC to @alice...
                      </p>
                      <div className="mt-2 bg-postit rounded p-2">
                        <p className="font-heading text-xs text-pencil font-bold">
                          Confirm transaction
                        </p>
                        <p className="font-body text-xs text-pencil/70">
                          Amount: 50 USDC
                        </p>
                      </div>
                    </div>

                    {/* Success message */}
                    <div className="bg-green-100 rounded-lg p-2 sm:p-3 max-w-[85%]">
                      <p className="font-body text-xs sm:text-sm text-green-800">
                        Sent! @alice can claim at payo.link/claim/abc123
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-12 h-12 sm:w-16 sm:h-16 bg-postit rounded-lg rotate-12 border-2 border-pencil shadow-hard flex items-center justify-center">
                <Send className="w-5 h-5 sm:w-6 sm:h-6 text-pencil" />
              </div>
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-12 h-12 sm:w-16 sm:h-16 bg-marker rounded-lg -rotate-12 border-2 border-pencil shadow-hard flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-pencil" />
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="hero-testimonial mt-12 sm:mt-16 flex justify-center">
          <Card variant="postit" rotate="left" className="max-w-md">
            <CardContent>
              <p className="font-body text-base sm:text-lg text-pencil">
                &quot;Just sent $50 to my friend who doesn&apos;t even have a
                crypto wallet. Magic!&quot;
              </p>
              <p className="font-heading text-sm text-pencil/60 mt-2">
                - @happy_user
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
