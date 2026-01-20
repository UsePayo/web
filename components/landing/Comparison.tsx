'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, X, Minus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const comparisons = [
  {
    feature: 'Setup Required',
    payo: 'Just Telegram',
    venmo: 'App + Bank',
    paypal: 'Account + Verification',
    crypto: 'Wallet + Seed Phrase',
  },
  {
    feature: 'International',
    payo: 'Yes',
    venmo: 'No',
    paypal: 'Limited',
    crypto: 'Yes',
  },
  {
    feature: 'Fees',
    payo: '$0 to friends',
    venmo: '1.75% instant',
    paypal: '2.9% + fixed',
    crypto: 'Gas fees',
  },
  {
    feature: 'Speed',
    payo: '<1 second',
    venmo: '1-3 days',
    paypal: '1-5 days',
    crypto: 'Varies',
  },
  {
    feature: 'Custody',
    payo: 'Non-custodial',
    venmo: 'Custodial',
    paypal: 'Custodial',
    crypto: 'Non-custodial',
  },
  {
    feature: 'Recipient Needs',
    payo: 'Telegram + Wallet',
    venmo: 'Venmo account',
    paypal: 'PayPal account',
    crypto: 'Wallet address',
  },
];

function CheckIcon() {
  return <Check className="w-5 h-5 text-green-600" />;
}

function XIcon() {
  return <X className="w-5 h-5 text-red-500" />;
}

function PartialIcon() {
  return <Minus className="w-5 h-5 text-yellow-600" />;
}

export function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.from('.comparison-title', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.comparison-title',
        start: 'top 85%',
      },
    });

    gsap.from('.comparison-row', {
      x: -40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      scrollTrigger: {
        trigger: '.comparison-table',
        start: 'top 80%',
      },
    });
  }, { scope: sectionRef });

  const getCellStyle = (value: string) => {
    if (value === 'Yes' || value.includes('$0') || value.includes('<1')) {
      return 'bg-green-100 text-green-800';
    }
    if (value === 'No') {
      return 'bg-red-100 text-red-800';
    }
    if (value === 'Limited' || value === 'Varies') {
      return 'bg-yellow-100 text-yellow-800';
    }
    return '';
  };

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="comparison-title font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-pencil text-center mb-4">
          How we compare
        </h2>
        <p className="font-body text-lg sm:text-xl text-pencil/70 text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
          See why Payo is the best way to send money to friends
        </p>

        {/* Mobile view - cards */}
        <div className="lg:hidden space-y-4">
          {comparisons.map((row, index) => (
            <div
              key={row.feature}
              className={`comparison-row bg-paper border-2 border-pencil rounded-lg p-4 shadow-hard-sm`}
            >
              <h3 className="font-heading text-lg font-bold text-pencil mb-3 border-b-2 border-dashed border-pencil/30 pb-2">
                {row.feature}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-postit p-2 rounded border border-pencil">
                  <p className="font-heading font-bold text-pencil mb-1">Payo</p>
                  <p className={`font-body ${getCellStyle(row.payo)}`}>{row.payo}</p>
                </div>
                <div className="bg-paper p-2 rounded border border-pencil/50">
                  <p className="font-heading font-bold text-pencil/70 mb-1">Venmo</p>
                  <p className={`font-body ${getCellStyle(row.venmo)}`}>{row.venmo}</p>
                </div>
                <div className="bg-paper p-2 rounded border border-pencil/50">
                  <p className="font-heading font-bold text-pencil/70 mb-1">PayPal</p>
                  <p className={`font-body ${getCellStyle(row.paypal)}`}>{row.paypal}</p>
                </div>
                <div className="bg-paper p-2 rounded border border-pencil/50">
                  <p className="font-heading font-bold text-pencil/70 mb-1">Crypto Wallet</p>
                  <p className={`font-body ${getCellStyle(row.crypto)}`}>{row.crypto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop view - table */}
        <div className="comparison-table hidden lg:block overflow-hidden border-2 border-pencil rounded-lg shadow-hard bg-paper">
          <table className="w-full">
            <thead>
              <tr className="bg-pencil text-paper">
                <th className="font-heading text-left p-4 text-lg">Feature</th>
                <th className="font-heading text-center p-4 text-lg bg-postit text-pencil border-x-2 border-pencil">
                  Payo
                </th>
                <th className="font-heading text-center p-4 text-lg">Venmo</th>
                <th className="font-heading text-center p-4 text-lg">PayPal</th>
                <th className="font-heading text-center p-4 text-lg">Crypto Wallet</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, index) => (
                <tr
                  key={row.feature}
                  className={`comparison-row border-t-2 border-pencil/30 ${
                    index % 2 === 0 ? 'bg-paper' : 'bg-muted/20'
                  }`}
                >
                  <td className="font-heading font-bold p-4 text-pencil">
                    {row.feature}
                  </td>
                  <td className={`font-body text-center p-4 bg-postit/50 border-x-2 border-pencil/30 ${getCellStyle(row.payo)}`}>
                    {row.payo}
                  </td>
                  <td className={`font-body text-center p-4 ${getCellStyle(row.venmo)}`}>
                    {row.venmo}
                  </td>
                  <td className={`font-body text-center p-4 ${getCellStyle(row.paypal)}`}>
                    {row.paypal}
                  </td>
                  <td className={`font-body text-center p-4 ${getCellStyle(row.crypto)}`}>
                    {row.crypto}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
