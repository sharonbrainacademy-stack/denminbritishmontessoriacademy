import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  GraduationCap,
  Menu,
  X,
  User,
  ShieldCheck,
  BookOpen,
  LogOut,
  Award,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openLoginModal }) => {
  const { schoolInfo, currentUser, logout } = useSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'academics', label: 'Academics' },
    { id: 'resultscbt', label: 'Results & CBT Exams', highlight: true },
    { id: 'news', label: 'News & Events' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <header className="w-full sticky top-0 z-40 bg-white shadow-md">
      {/* Top Announcement & Quick Contact Bar */}
      <div className="bg-[#0B3D27] text-white text-xs py-2 px-4 border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="flex items-center gap-1 text-[#F9F6EF]">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="truncate max-w-xs md:max-w-md">72, 19th St, Opp UNIBEN Main Gate, Benin City</span>
            </span>
            <a href={`tel:${schoolInfo.phone}`} className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{schoolInfo.phone}</span>
            </a>
            <a href={`mailto:${schoolInfo.email}`} className="hidden sm:flex items-center gap-1 hover:text-[#D4AF37] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{schoolInfo.email}</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${schoolInfo.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 transition-all"
            >
              <MessageCircle className="w-3 h-3 fill-current" />
              <span>WhatsApp Us</span>
            </a>

            {currentUser ? (
              <div className="flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37] px-2 py-0.5 rounded-md">
                <span className="text-[11px] font-semibold text-[#D4AF37]">
                  {currentUser.role.toUpperCase()}: {currentUser.name.split(' ')[0]}
                </span>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="bg-[#D4AF37] text-[#0B3D27] text-[10px] font-bold px-1.5 py-0.5 rounded hover:bg-white transition-colors"
                  >
                    Admin
                  </button>
                )}
                {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
                  <button
                    onClick={() => setActiveTab('staff')}
                    className="bg-emerald-800 text-white border border-[#D4AF37] text-[10px] font-bold px-1.5 py-0.5 rounded hover:bg-emerald-700 transition-colors"
                  >
                    Staff Portal
                  </button>
                )}
                <button
                  onClick={logout}
                  title="Log out"
                  className="text-gray-300 hover:text-red-300 ml-1"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="bg-[#D4AF37] hover:bg-amber-400 text-[#0B3D27] font-bold px-2.5 py-0.5 rounded text-[11px] flex items-center gap-1 transition-all shadow-sm"
              >
                <User className="w-3 h-3" />
                <span>Portal Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* School Crest Logo & Title */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-12 h-12 bg-[#0B3D27] rounded-xl border-2 border-[#D4AF37] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform overflow-hidden">
            {schoolInfo.logoUrl ? (
              <img
                src={schoolInfo.logoUrl}
                alt={schoolInfo.name}
                className="w-full h-full object-contain p-0.5 bg-white"
              />
            ) : (
              <GraduationCap className="w-7 h-7 text-[#D4AF37]" />
            )}
            <div className="absolute -bottom-1 -right-1 bg-[#D4AF37] text-[#0B3D27] text-[9px] font-black px-1 rounded z-10">
              UK
            </div>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold font-serif text-[#0B3D27] leading-tight group-hover:text-amber-700 transition-colors">
              Denmin British
            </h1>
            <p className="text-xs font-bold text-[#D4AF37] tracking-wider uppercase font-serif">
              Montessori Academy
            </p>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-[#0B3D27] text-white shadow-sm'
                  : item.highlight
                  ? 'bg-amber-50 text-[#0B3D27] border border-[#D4AF37]/50 hover:bg-[#0B3D27] hover:text-white'
                  : 'text-slate-700 hover:bg-[#F9F6EF] hover:text-[#0B3D27]'
              }`}
            >
              {item.label}
            </button>
          ))}

          {currentUser?.role === 'admin' ? (
            <button
              onClick={() => setActiveTab('admin')}
              className={`ml-2 px-3.5 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all shadow-md ${
                activeTab === 'admin'
                  ? 'bg-[#D4AF37] text-[#0B3D27]'
                  : 'bg-[#0B3D27] text-[#D4AF37] hover:bg-emerald-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('admissions')}
              className="ml-2 bg-[#D4AF37] hover:bg-amber-400 text-[#0B3D27] font-bold px-4 py-2 rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Enroll Now</span>
            </button>
          )}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center lg:hidden gap-2">
          <button
            onClick={() => setActiveTab('admissions')}
            className="bg-[#D4AF37] text-[#0B3D27] font-bold px-3 py-1.5 rounded text-xs"
          >
            Enroll
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-800 hover:text-[#0B3D27] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-3 shadow-xl space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-between ${
                activeTab === item.id
                  ? 'bg-[#0B3D27] text-white font-bold'
                  : 'text-slate-800 hover:bg-[#F9F6EF]'
              }`}
            >
              <span>{item.label}</span>
              {item.highlight && (
                <span className="text-[10px] bg-[#D4AF37] text-[#0B3D27] font-bold px-2 py-0.5 rounded-full">
                  CBT Portal
                </span>
              )}
            </button>
          ))}

          {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
            <button
              onClick={() => {
                setActiveTab('staff');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold bg-[#0B3D27] text-[#D4AF37] border border-[#D4AF37] flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-[#D4AF37]" />
              <span>Staff & Educator Portal</span>
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold bg-[#D4AF37] text-[#0B3D27] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          )}

          {!currentUser && (
            <button
              onClick={() => {
                openLoginModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 bg-[#0B3D27] text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span>Login to Portal (Student / Parent / Staff)</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
