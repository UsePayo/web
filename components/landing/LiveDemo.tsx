'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TypeWriter } from '@/components/animations';
import { ArrowRight, ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const messages = [
  { type: 'user', text: '/send @alice 25' },
  { type: 'bot', text: 'Creating payment of 25 USDC to @alice...', delay: 1500 },
  { type: 'bot', text: 'Payment created! Transaction hash: 0x7fa2...b3d1', delay: 2500, isSuccess: true },
  { type: 'bot', text: '@alice has been notified via Telegram!', delay: 3500, isSuccess: true },
];

const claimMessages = [
  { type: 'bot', text: 'Hey @alice! You have 25 USDC waiting for you from @bob' },
  { type: 'user', text: '/claim', delay: 1500 },
  { type: 'bot', text: 'Verify your phone number to claim:', delay: 2500 },
  { type: 'bot', text: 'Code sent to +1 (555) ***-**89', delay: 3000 },
  { type: 'user', text: '123456', delay: 4000 },
  { type: 'bot', text: '25 USDC claimed successfully! Sent to your wallet.', delay: 5000, isSuccess: true },
];

function PhoneUI({ title, messages: msgList, startDelay = 0 }: { title: string; messages: typeof messages; startDelay?: number }) {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [currentTyping, setCurrentTyping] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 80%',
      onEnter: () => {
        // Start the message sequence
        msgList.forEach((msg, index) => {
          const delay = (msg.delay || 0) + startDelay;
          setTimeout(() => {
            setVisibleMessages(prev => Math.max(prev, index + 1));
            setCurrentTyping(index);
          }, delay);
        });
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-[280px] sm:w-[300px] md:w-[320px]">
      {/* Phone frame */}
      <div className="bg-pencil rounded-[30px] p-2 shadow-hard-lg">
        <div className="bg-paper rounded-[24px] overflow-hidden">
          {/* Header */}
          <div className="bg-pen text-white p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">P</span>
              </div>
              <div>
                <p className="font-heading font-bold text-sm">{title}</p>
                <p className="text-xs opacity-75">online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="p-3 space-y-2 min-h-[280px] sm:min-h-[300px] bg-paper">
            {msgList.slice(0, visibleMessages).map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.type === 'user'
                    ? 'ml-auto bg-pen/10'
                    : msg.isSuccess
                    ? 'bg-green-100'
                    : 'bg-muted/50'
                } rounded-lg p-2 max-w-[85%] ${msg.type === 'user' ? 'text-right' : ''}`}
              >
                <p className={`font-body text-xs sm:text-sm ${msg.isSuccess ? 'text-green-800' : 'text-pencil'}`}>
                  {index === currentTyping && index === visibleMessages - 1 ? (
                    <TypeWriter text={msg.text} speed={30} cursor={false} />
                  ) : (
                    msg.text
                  )}
                </p>
              </div>
            ))}

            {/* Typing indicator */}
            {visibleMessages > 0 && visibleMessages < msgList.length && (
              <div className="bg-muted/50 rounded-lg p-2 max-w-[60px]">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-pencil/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-pencil/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-pencil/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-muted p-2">
            <div className="bg-muted/30 rounded-full px-3 py-2 flex items-center gap-2">
              <span className="text-pencil/50 font-body text-xs sm:text-sm">Type a command...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LiveDemo() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.from('.demo-title', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.demo-title',
        start: 'top 85%',
      },
    });

    gsap.from('.demo-subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: '.demo-subtitle',
        start: 'top 85%',
      },
    });

    gsap.from('.demo-phone-left', {
      x: -60,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.demo-phones',
        start: 'top 80%',
      },
    });

    gsap.from('.demo-phone-right', {
      x: 60,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      scrollTrigger: {
        trigger: '.demo-phones',
        start: 'top 80%',
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="demo-title font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-pencil text-center mb-4">
          See it in action
        </h2>
        <p className="demo-subtitle font-body text-lg sm:text-xl text-pencil/70 text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
          Watch how easy it is to send and claim USDC through Telegram
        </p>

        <div className="demo-phones flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Sender phone */}
          <div className="demo-phone-left w-[280px] sm:w-[300px] md:w-[320px]">
            <p className="font-heading text-lg sm:text-xl font-bold text-pencil text-center mb-4">
              Sender (@bob)
            </p>
            <PhoneUI title="Payo Bot" messages={messages} startDelay={500} />
          </div>

          {/* Arrow */}
          <div className="hidden lg:flex flex-col items-center gap-2">
            <ArrowRight className="w-10 h-10 text-pencil" />
            <p className="font-body text-sm text-pencil/60">instant</p>
          </div>
          <div className="lg:hidden flex items-center gap-2 py-2">
            <ArrowDown className="w-6 h-6 text-pencil" />
          </div>

          {/* Recipient phone */}
          <div className="demo-phone-right w-[280px] sm:w-[300px] md:w-[320px]">
            <p className="font-heading text-lg sm:text-xl font-bold text-pencil text-center mb-4">
              Recipient (@alice)
            </p>
            <PhoneUI title="Payo Bot" messages={claimMessages} startDelay={4500} />
          </div>
        </div>
      </div>
    </section>
  );
}
