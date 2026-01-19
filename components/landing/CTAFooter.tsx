"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Users, Github, Twitter, Rocket } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  {
    name: "Telegram Bot",
    url: "https://t.me/PayoBot",
    icon: MessageCircle,
  },
  {
    name: "Community",
    url: "https://t.me/PayoCommunity",
    icon: Users,
  },
  {
    name: "GitHub",
    url: "https://github.com/usepayo",
    icon: Github,
  },
  {
    name: "Twitter",
    url: "https://twitter.com/usepayo",
    icon: Twitter,
  },
];

export function CTAFooter() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      gsap.from(".cta-card", {
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        scrollTrigger: {
          trigger: ".cta-card",
          start: "top 85%",
        },
      });

      gsap.from(".footer-content", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: ".footer-content",
          start: "top 90%",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        {/* Main CTA */}
        <Card variant="postit" className="cta-card text-center mb-16 sm:mb-20">
          <CardContent className="py-8 sm:py-12">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-pencil mb-4">
              Ready to send money the easy way?
            </h2>
            <p className="font-body text-base sm:text-lg text-pencil/70 mb-8 max-w-xl mx-auto">
              Join thousands of users sending USDC through Telegram. No
              complicated setup, no crypto knowledge needed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://t.me/PayoBot"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="w-full sm:w-auto">
                  Start Sending Now
                </Button>
              </a>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  View Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Social links */}
        <div className="footer-content">
          <p className="font-heading text-lg sm:text-xl font-bold text-pencil text-center mb-6">
            Connect with us
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-paper border-2 border-pencil rounded-lg shadow-hard-sm hover:bg-muted/30 transition-colors"
                >
                  <Icon className="w-4 h-4 text-pencil" />
                  <span className="font-body text-sm text-pencil">
                    {link.name}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-dashed border-pencil pt-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="font-heading text-xl sm:text-2xl font-bold text-pencil"
            >
              Payo
            </Link>
            <span className="hidden sm:inline text-pencil/40">|</span>
            <p className="font-body text-sm text-pencil/60 text-center sm:text-left">
              Payments made simple
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a
              href="https://arbiscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-pen hover:underline"
            >
              Smart Contract
            </a>
            <a
              href="https://docs.payo.link"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-pen hover:underline"
            >
              Documentation
            </a>
            <a
              href="mailto:hello@payo.link"
              className="font-body text-sm text-pen hover:underline"
            >
              Contact
            </a>
          </div>

          <p className="font-body text-xs text-pencil/50">
            Built with love for Arbitrum Hackathon
          </p>
        </div>
      </footer>
    </section>
  );
}
