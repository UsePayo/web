'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Counter } from '@/components/animations';
import { Card, CardContent } from '@/components/ui/card';
import { PartyPopper, Globe, Zap, Lock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    value: 0,
    suffix: '',
    prefix: '$',
    label: 'Fees to friends',
    description: 'Send to other Payo users for free',
    icon: PartyPopper,
  },
  {
    value: 2,
    suffix: 'B+',
    prefix: '',
    label: 'Telegram users',
    description: 'Potential recipients worldwide',
    icon: Globe,
  },
  {
    value: 1,
    suffix: 's',
    prefix: '<',
    label: 'Transfer time',
    description: 'Near-instant settlement on Arbitrum',
    icon: Zap,
  },
  {
    value: 100,
    suffix: '%',
    prefix: '',
    label: 'Non-custodial',
    description: 'Your funds, your control, always',
    icon: Lock,
  },
];

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.from('.stats-title', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.stats-title',
        start: 'top 85%',
      },
    });

    gsap.from('.stat-card', {
      y: 60,
      opacity: 0,
      stagger: 0.15,
      duration: 0.6,
      scrollTrigger: {
        trigger: '.stats-grid',
        start: 'top 80%',
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="stats-title font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-pencil text-center mb-12 sm:mb-16">
          The numbers speak
        </h2>

        <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                variant={index === 0 ? 'postit' : 'default'}
                rotate={index % 2 === 0 ? 'left' : 'right'}
                className="stat-card text-center"
              >
                <CardContent>
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-pen" />
                  <div className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-pencil mb-2">
                    {stat.prefix}
                    {stat.value === 0 ? (
                      '0'
                    ) : (
                      <Counter end={stat.value} duration={2} />
                    )}
                    {stat.suffix}
                  </div>
                  <p className="font-heading text-base sm:text-lg font-bold text-pencil mb-1">
                    {stat.label}
                  </p>
                  <p className="font-body text-xs sm:text-sm text-pencil/60">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
