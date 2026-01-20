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

export default function LandingPage() {
  return (
    <main className="min-h-screen">
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
