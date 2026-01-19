import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/80 backdrop-blur-sm border-b-2 border-dashed border-pencil">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-heading text-2xl font-bold text-pencil">
            Payo
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="font-heading text-pencil hover:text-pen transition-colors"
            >
              Dashboard
            </Link>
            <Button variant="outline" size="sm">
              Connect Wallet
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-pencil mb-6 leading-tight">
            Send USDC to anyone.{' '}
            <span className="underline-sketch">No wallet needed.</span>
          </h1>
          <p className="font-body text-xl md:text-2xl text-pencil/70 mb-10 max-w-2xl mx-auto">
            Pay friends, split bills, or send money globally through Telegram.
            Recipients can claim with just a phone number.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://t.me/PayoBot"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg">Open Telegram Bot</Button>
            </a>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg">
                Connect Wallet
              </Button>
            </Link>
          </div>

          {/* Decorative element */}
          <div className="mt-16 relative">
            <Card variant="postit" rotate="left" className="max-w-md mx-auto">
              <CardContent>
                <p className="font-body text-lg text-pencil">
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

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-4xl font-bold text-pencil text-center mb-16">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card hasTape rotate="right">
              <CardContent>
                <div className="font-heading text-6xl text-marker mb-4">1</div>
                <h3 className="font-heading text-2xl font-bold text-pencil mb-3">
                  Send USDC
                </h3>
                <p className="font-body text-lg text-pencil/70">
                  Enter your friend&apos;s Telegram username and the amount you
                  want to send. That&apos;s it!
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card variant="postit" rotate="left">
              <CardContent>
                <div className="font-heading text-6xl text-pen mb-4">2</div>
                <h3 className="font-heading text-2xl font-bold text-pencil mb-3">
                  They Get Notified
                </h3>
                <p className="font-body text-lg text-pencil/70">
                  Your friend receives a Telegram message with a link to claim
                  their USDC.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card hasTape rotate="right">
              <CardContent>
                <div className="font-heading text-6xl text-marker mb-4">3</div>
                <h3 className="font-heading text-2xl font-bold text-pencil mb-3">
                  Claim Easily
                </h3>
                <p className="font-body text-lg text-pencil/70">
                  They verify with their phone number or connect a wallet. USDC
                  goes directly to them.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-4xl font-bold text-pencil text-center mb-16">
            Why Payo?
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card variant="outlined" className="rotate-slight">
              <CardContent className="flex items-start gap-4">
                <span className="text-4xl">&#x26A1;</span>
                <div>
                  <h3 className="font-heading text-xl font-bold text-pencil mb-2">
                    Instant Settlement
                  </h3>
                  <p className="font-body text-pencil/70">
                    Built on Arbitrum for fast, low-cost transactions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card variant="outlined" className="rotate-slight-reverse">
              <CardContent className="flex items-start gap-4">
                <span className="text-4xl">&#x1F512;</span>
                <div>
                  <h3 className="font-heading text-xl font-bold text-pencil mb-2">
                    Non-Custodial
                  </h3>
                  <p className="font-body text-pencil/70">
                    Your funds stay in smart contracts until claimed.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card variant="outlined" className="rotate-slight">
              <CardContent className="flex items-start gap-4">
                <span className="text-4xl">&#x1F310;</span>
                <div>
                  <h3 className="font-heading text-xl font-bold text-pencil mb-2">
                    Global Reach
                  </h3>
                  <p className="font-body text-pencil/70">
                    Send to anyone with Telegram, anywhere in the world.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card variant="outlined" className="rotate-slight-reverse">
              <CardContent className="flex items-start gap-4">
                <span className="text-4xl">&#x1F4B0;</span>
                <div>
                  <h3 className="font-heading text-xl font-bold text-pencil mb-2">
                    Stable Value
                  </h3>
                  <p className="font-body text-pencil/70">
                    USDC is pegged to USD. No crypto volatility worries.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <Card variant="postit" className="max-w-2xl mx-auto text-center">
          <CardContent>
            <h2 className="font-heading text-3xl font-bold text-pencil mb-4">
              Ready to send money the easy way?
            </h2>
            <p className="font-body text-lg text-pencil/70 mb-8">
              Join thousands of users sending USDC through Telegram.
            </p>
            <a
              href="https://t.me/PayoBot"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg">Start Sending Now</Button>
            </a>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t-2 border-dashed border-pencil">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-heading text-pencil">
            Payo - Payments made simple
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://t.me/PayoBot"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-pen hover:underline"
            >
              Telegram
            </a>
            <a
              href="https://github.com/usepayo"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-pen hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://arbiscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-pen hover:underline"
            >
              Contract
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
