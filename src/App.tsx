import React, { useState } from 'react';
import { SchoolProvider } from './context/SchoolContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LoginModal } from './components/auth/LoginModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { ResultsCBTPage } from './pages/ResultsCBTPage';
import { NewsEventsPage } from './pages/NewsEventsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { StaffPortalPage } from './pages/StaffPortalPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginSuccess = (role: string) => {
    if (role === 'admin') {
      setActiveTab('admin');
    } else if (role === 'teacher') {
      setActiveTab('staff');
    } else {
      setActiveTab('resultscbt');
    }
  };

  const isKnownTab = ['home', 'about', 'admissions', 'academics', 'resultscbt', 'news', 'contact', 'admin', 'staff', 'teacher', 'staffportal'].includes(activeTab);

  return (
    <SchoolProvider>
      <div className="min-h-screen flex flex-col bg-[#F9F6EF] text-slate-800 selection:bg-[#D4AF37] selection:text-[#0B3D27]">
        {/* Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openLoginModal={() => setIsLoginModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-grow">
          {activeTab === 'home' && (
            <HomePage
              setActiveTab={setActiveTab}
              openLoginModal={() => setIsLoginModalOpen(true)}
            />
          )}

          {activeTab === 'about' && <AboutPage />}

          {activeTab === 'admissions' && <AdmissionsPage />}

          {activeTab === 'academics' && <AcademicsPage />}

          {activeTab === 'resultscbt' && <ResultsCBTPage />}

          {activeTab === 'news' && <NewsEventsPage />}

          {activeTab === 'contact' && <ContactPage />}

          {activeTab === 'admin' && <AdminDashboard />}

          {(activeTab === 'staff' || activeTab === 'teacher' || activeTab === 'staffportal') && <StaffPortalPage />}

          {!isKnownTab && (
            <HomePage
              setActiveTab={setActiveTab}
              openLoginModal={() => setIsLoginModalOpen(true)}
            />
          )}
        </main>

        {/* Footer */}
        <Footer
          setActiveTab={setActiveTab}
          openLoginModal={() => setIsLoginModalOpen(true)}
        />

        {/* Auth Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </SchoolProvider>
  );
}
