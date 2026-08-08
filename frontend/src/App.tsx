import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DemoModal } from './components/DemoModal';
import { Features } from './components/Features';
import { DashboardPreviewSection } from './components/DashboardPreviewSection';
import { HowItWorks } from './components/HowItWorks';
import { TechStack } from './components/TechStack';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';

export function App() {
  const [appMode, setAppMode] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleOpenLogin = () => {
    setAppMode('login');
  };

  const handleLoginSuccess = () => {
    setAppMode('dashboard');
  };

  if (appMode === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToHome={() => setAppMode('landing')}
      />
    );
  }

  if (appMode === 'dashboard') {
    return (
      <DashboardLayout
        onSwitchToLanding={() => setAppMode('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <Hero
        onOpenDemo={() => setIsDemoOpen(true)}
        onConnectSpotify={handleOpenLogin}
      />

      <Features />

      <DashboardPreviewSection />

      <HowItWorks />

      <TechStack />

      <FAQ />

      <Footer />

      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onConnectSpotify={handleOpenLogin}
      />
    </div>
  );
}

export default App;