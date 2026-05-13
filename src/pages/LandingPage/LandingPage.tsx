import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyUse from './components/WhyUse';
import HowItWorks from './components/HowItWorks';
// import Benefits from './components/Benefits';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';

const landingPageCss = `
  /* Utilities usadas na LandingPage que antes vinham do tailwind.config.js */
  .gradient-text {
    background: linear-gradient(90deg, #1E3A8A 0%, #22C55E 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  @keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
  }

  .animate-fade-in-up {
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-pulse-slow {
    animation: pulse 3s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-fade-in-up,
    .animate-float,
    .animate-pulse-slow {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <style>{landingPageCss}</style>
      <Navbar />
      <Hero />
      <WhyUse />
      <HowItWorks />
      {/* <Benefits /> */}
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
