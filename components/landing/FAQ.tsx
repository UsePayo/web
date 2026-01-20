'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: 'Do I need a crypto wallet to send money?',
    answer:
      'Yes, senders need a wallet with USDC to deposit funds. Recipients also connect a wallet to claim - any EVM wallet works (MetaMask, WalletConnect, Coinbase Wallet, etc.).',
  },
  {
    question: 'What is USDC?',
    answer:
      "USDC is a stablecoin pegged 1:1 to the US Dollar. It's backed by cash and cash equivalents held in regulated financial institutions. 1 USDC = $1 USD, always.",
  },
  {
    question: 'How do recipients claim their USDC?',
    answer:
      'Recipients receive a Telegram notification when you send them USDC. When they start using the Payo bot (type /start or /balance), funds are automatically credited to their account.',
  },
  {
    question: 'What are the fees?',
    answer:
      'Sending to other Payo users is free! You only pay minimal Arbitrum network gas fees (usually less than $0.01). No hidden fees, no percentage cuts.',
  },
  {
    question: 'Is my money safe?',
    answer:
      "Payo is non-custodial. Your funds are held in audited smart contracts on Arbitrum until claimed by the recipient. We never have access to your money. If unclaimed, senders can always refund.",
  },
  {
    question: 'What happens if the recipient never claims?',
    answer:
      'Unclaimed payments can be refunded by the sender at any time. Your money is never stuck - you can always get it back if the recipient doesn\'t claim within your preferred timeframe.',
  },
  {
    question: 'Which countries are supported?',
    answer:
      'Payo works anywhere Telegram works! Since we use blockchain technology, there are no geographic restrictions. Send money across borders instantly.',
  },
  {
    question: 'Can I use Payo for business payments?',
    answer:
      "Currently, Payo is designed for peer-to-peer payments. We're working on business features - stay tuned! Join our Telegram group for updates.",
  },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof faqs[0]; isOpen: boolean; onToggle: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!contentRef.current || !answerRef.current) return;

    if (isOpen) {
      gsap.to(contentRef.current, {
        height: answerRef.current.offsetHeight,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(answerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        delay: 0.1,
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
      gsap.to(answerRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
      });
    }
  }, [isOpen]);

  return (
    <div className="border-2 border-pencil rounded-lg bg-paper shadow-hard-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-heading text-base sm:text-lg font-bold text-pencil pr-4">
          {faq.question}
        </span>
        <span
          className={`text-2xl text-marker transition-transform duration-300 shrink-0 ${
            isOpen ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>
      <div ref={contentRef} className="h-0 overflow-hidden">
        <div
          ref={answerRef}
          className="px-4 sm:px-5 pb-4 sm:pb-5 opacity-0 -translate-y-2"
        >
          <p className="font-body text-sm sm:text-base text-pencil/70 border-t-2 border-dashed border-pencil/20 pt-4">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.from('.faq-title', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.faq-title',
        start: 'top 85%',
      },
    });

    gsap.from('.faq-item', {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      scrollTrigger: {
        trigger: '.faq-list',
        start: 'top 80%',
      },
    });
  }, { scope: sectionRef });

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="faq-title font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-pencil text-center mb-4">
          Common questions
        </h2>
        <p className="font-body text-lg sm:text-xl text-pencil/70 text-center mb-12 sm:mb-16">
          Everything you need to know about Payo
        </p>

        <div className="faq-list space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <FAQItem
                faq={faq}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
