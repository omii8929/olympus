import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AnnouncementBanner } from './components/common/AnnouncementBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { FullStackDetailPage } from './pages/FullStackDetailPage';
import { EngineersGotTalentPage } from './pages/EngineersGotTalentPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { PassViewPage } from './pages/PassViewPage';
import { ParticipantDashboardPage } from './pages/ParticipantDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { RulesPage } from './pages/RulesPage';
import { FAQPage } from './pages/FAQPage';
import { ResultsPage } from './pages/ResultsPage';
import { GalleryPage } from './pages/GalleryPage';
import { SchedulePage } from './pages/SchedulePage';
import { LoginPage } from './pages/LoginPage';
import { ContactPage } from './pages/ContactPage';
import { QRPortalPage } from './pages/QRPortalPage';
import { QRScannerPage } from './pages/QRScannerPage';

// Scroll Restoration
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminPlatform = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen bg-olympus-bg text-slate-100 selection:bg-olympus-cyan selection:text-olympus-bg">
      {!isAdminPlatform && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <AnnouncementBanner />
          <Navbar />
        </div>
      )}

      <main className="flex-grow">
        <Routes>
          {/* Public Participant Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/full-stack-ai" element={<FullStackDetailPage />} />
          <Route path="/events/engineers-got-talent" element={<EngineersGotTalentPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/pass/:code" element={<PassViewPage />} />
          <Route path="/dashboard" element={<ParticipantDashboardPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/qr" element={<QRPortalPage />} />
          <Route path="/scanner" element={<QRScannerPage />} />

          {/* Completely Separate Admin Platform Routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Catch-all */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {!isAdminPlatform && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
