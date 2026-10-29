import React, { useState } from 'react';
import {
  GraduationCap,
  Menu,
  X,
  Phone,
  Mail,
  LogIn,
  LogOut,
  UserCheck,
  Shield,
  BookOpen,
  Calendar,
  FileText,
  Home,
  Info,
  PhoneCall,
  UserPlus
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { schoolInfo, currentUser, logout } = useSchool();

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'academics', label: 'Academics', icon: BookOpen },
    { id: 'admissions', label: 'Admissions', icon: UserPlus },
    { id: 'calendar', label: 'Term Calendar', icon: Calendar },
    { id: 'results-cbt', label: 'CBT & Results', icon: FileText },
    { id: 'news', label: 'News & Events', icon: BookOpen },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
      {/* Top micro banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <a href={`tel:${schoolInfo.phone}`} className="hover:text-white transition">
                {schoolInfo.phone}
              </a>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <a href={`mailto:${schoolInfo.email}`} className="hover:text-white transition">
                {schoolInfo.email}
              </a>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-medium">
              Session: {schoolInfo.academicSession} ({schoolInfo.currentTerm})
            </span>
            {currentUser ? (
              <div className="flex items-center gap-2 text-white">
                <span className="font-medium text-xs">
                  {currentUser.name.split(' ')[0]} ({currentUser.role.toUpperCase()})
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-xs text-rose-300 hover:text-rose-200 ml-1"
                >
                  <LogOut className="w-3 h-3" /> Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
              >
                <LogIn className="w-3.5 h-3.5" /> Portal Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & School Name */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-black text-lg sm:text-xl text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition">
                SHARON BRAIN
              </span>
              <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase">
                ACADEMY &bull; BENIN CITY
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  currentPage === link.id
                    ? 'text-emerald-700 bg-emerald-50 font-bold'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`ml-2 px-3.5 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition ${
                  currentPage === 'admin'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                <Shield className="w-4 h-4" /> Admin Portal
              </button>
            )}

            {currentUser?.role === 'teacher' && (
              <button
                onClick={() => onNavigate('staff')}
                className={`ml-2 px-3.5 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition ${
                  currentPage === 'staff'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <UserCheck className="w-4 h-4" /> Staff Portal
              </button>
            )}
          </nav>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {currentUser && (
              <button
                onClick={() => onNavigate(currentUser.role === 'admin' ? 'admin' : 'staff')}
                className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800"
              >
                Dashboard
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1 pb-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition ${
                    currentPage === link.id
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  {link.label}
                </button>
              );
            })}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold bg-rose-50 text-rose-700 mt-2"
              >
                <Shield className="w-4 h-4 text-rose-600" /> Admin Management Portal
              </button>
            )}

            {currentUser?.role === 'teacher' && (
              <button
                onClick={() => {
                  onNavigate('staff');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold bg-blue-50 text-blue-700 mt-2"
              >
                <UserCheck className="w-4 h-4 text-blue-600" /> Staff Portal
              </button>
            )}

            {!currentUser && (
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-emerald-600 text-white mt-3"
              >
                <LogIn className="w-4 h-4" /> Portal Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
