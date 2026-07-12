import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Metrics from './components/Metrics';
import FeatureGrid from './components/FeatureGrid';
import DashboardShowcase from './components/DashboardShowcase';
import Workflow from './components/Workflow';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Auth from './components/Auth';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'login' | 'signup'

  const handleAuthSuccess = (userData) => {
    console.log('TransitOps Authentication Success:', userData);
    // Return back to landing after successful simulation
    setView('landing');
  };

  if (view === 'login' || view === 'signup') {
    return (
      <Auth
        initialView={view}
        onBack={() => setView('landing')}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-secondary selection:bg-primary/10 selection:text-primary">
      {/* Dynamic Background Blob elements */}
      <div className="absolute top-[20%] left-[-100px] w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[120px] pointer-events-none" />
      <div className="absolute top-[60%] right-[-100px] w-[600px] h-[600px] rounded-full bg-accent/5 filter blur-[140px] pointer-events-none" />

      {/* Global Navigation Header */}
      <Navbar onNavigate={setView} />

      {/* Main Sections Content */}
      <main>
        <Hero onNavigate={setView} />
        <Metrics />
        <FeatureGrid />
        <DashboardShowcase />
        <Workflow />
        <Benefits />
        <Testimonials />
        <Pricing onNavigate={setView} />
        <FAQ />
      </main>

      {/* Global Premium Footer */}
      <Footer onNavigate={setView} />
    </div>
  );
}

export default App;
