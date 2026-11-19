import { useEffect, useState } from 'react';
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

export default function App() {
  const [appMode, setAppMode] = useState<
    'landing' | 'login' | 'dashboard'
  >('landing');

  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Detect OAuth callback or saved session
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');

    if (accessToken) {
      sessionStorage.setItem('spotify_access_token', accessToken);
      localStorage.setItem('spotify_access_token', accessToken);
      setAppMode('dashboard');
      return;
    }

    const savedToken =
      sessionStorage.getItem('spotify_access_token') ||
      localStorage.getItem('spotify_access_token');

    if (window.location.pathname === '/dashboard' || savedToken) {
      if (savedToken) {
        setAppMode('dashboard');
      } else {
        setAppMode('login');
      }
      return;
    }

    setAppMode('landing');
  }, []);

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
        onSwitchToLanding={() => {
          sessionStorage.removeItem('spotify_access_token');
          localStorage.removeItem('spotify_access_token');
          sessionStorage.removeItem('spotify_refresh_token');
          setAppMode('landing');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar onConnectSpotify={handleOpenLogin} />

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