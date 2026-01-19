'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bell, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: 1,
    title: 'Send USDC',
    description: "Enter your friend's Telegram username and the amount. That's it!",
    color: 'marker',
    icon: Send,
  },
  {
    number: 2,
    title: 'They Get Notified',
    description: 'Your friend receives a Telegram message with a link to claim their USDC.',
    color: 'pen',
    icon: Bell,
  },
  {
    number: 3,
    title: 'Claim Easily',
    description: 'They verify with their phone number or connect a wallet. USDC goes directly to them.',
    color: 'marker',
    icon: CheckCircle,
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Animate title
    gsap.from('.how-title', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.how-title',
        start: 'top 85%',
      },
    });

    // Animate steps from alternating sides
    gsap.from('.step-card-0', {
      x: -100,
      opacity: 0,
      duration: 0.7,
      scrollTrigger: {
        trigger: '.step-card-0',
        start: 'top 80%',
      },
    });

    gsap.from('.step-card-1', {
      x: 100,
      opacity: 0,
      duration: 0.7,
      scrollTrigger: {
        trigger: '.step-card-1',
        start: 'top 80%',
      },
    });

    gsap.from('.step-card-2', {
      x: -100,
      opacity: 0,
      duration: 0.7,
      scrollTrigger: {
        trigger: '.step-card-2',
        start: 'top 80%',
      },
    });

    // Animate connecting lines
    gsap.from('.connecting-line', {
      scaleX: 0,
      transformOrigin: 'left',
      duration: 0.6,
      stagger: 0.3,
      scrollTrigger: {
        trigger: '.steps-container',
        start: 'top 70%',
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="how-title font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-pencil text-center mb-12 sm:mb-16">
          How it works
        </h2>

        <div className="steps-container relative">
          {/* Desktop connecting lines */}
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] -translate-y-1/2 z-0">
            <div className="connecting-line h-1 bg-pencil/30 border-t-2 border-dashed border-pencil/50" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className={`step-card-${index}`}>
                  <Card
                    variant={index === 1 ? 'postit' : 'default'}
                    hasTape={index !== 1}
                    rotate={index % 2 === 0 ? 'right' : 'left'}
                    className="h-full"
                  >
                    <CardContent>
                      {/* Step number with icon */}
                      <div className="flex items-center gap-3 sm:gap-4 mb-4">
                        <div
                          className={`font-heading text-5xl sm:text-6xl ${
                            step.color === 'marker' ? 'text-marker' : 'text-pen'
                          }`}
                        >
                          {step.number}
                        </div>
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-pencil" />
                      </div>

                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-pencil mb-3">
                        {step.title}
                      </h3>
                      <p className="font-body text-base sm:text-lg text-pencil/70">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Mobile connecting line */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center my-4">
                      <div className="w-1 h-8 border-l-2 border-dashed border-pencil/50" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
