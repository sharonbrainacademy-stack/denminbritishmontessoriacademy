import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LoginModal } from './components/auth/LoginModal';
import { PWAStatus } from './components/pwa/PWAStatus';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { SchoolCalendar } from './components/calendar/SchoolCalendar';
import { ResultsCBTPage } from './pages/ResultsCBTPage';
import { NewsEventsPage } from './pages/NewsEventsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { StaffPortalPage } from './pages/StaffPortalPage';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const { currentUser } = useSchool();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (role: string) => {
    if (role === 'admin') {
      setCurrentPage('admin');
    } else if (role === 'staff') {
      setCurrentPage('staff');
    } else {
      setCurrentPage('results-cbt');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Main Page Area */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'academics' && <AcademicsPage />}
        {currentPage === 'admissions' && <AdmissionsPage />}
        {currentPage === 'calendar' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <SchoolCalendar compact={false} />
          </div>
        )}
        {currentPage === 'results-cbt' && <ResultsCBTPage />}
        {currentPage === 'news' && <NewsEventsPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'admin' && <AdminDashboard />}
        {currentPage === 'staff' && <StaffPortalPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* PWA prompt */}
      <PWAStatus />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
};

export default App;
