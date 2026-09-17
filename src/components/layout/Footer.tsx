import React from 'react';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Shield,
  Award,
  ExternalLink,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  openLoginModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, openLoginModal }) => {
  const { schoolInfo } = useSchool();

  return (
    <footer className="bg-[#0B3D27] text-white pt-16 pb-8 border-t-4 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center text-[#0B3D27] font-bold shadow-lg overflow-hidden">
                {schoolInfo.logoUrl ? (
                  <img
                    src={schoolInfo.logoUrl}
                    alt={schoolInfo.name}
                    className="w-full h-full object-contain p-0.5 bg-white"
                  />
                ) : (
                  <GraduationCap className="w-7 h-7" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-white leading-tight">
                  Denmin British
                </h3>
                <p className="text-xs font-bold text-[#D4AF37] tracking-wider uppercase font-serif">
                  Montessori Academy
                </p>
              </div>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              {schoolInfo.tagline}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-900/80 border border-[#D4AF37]/40 px-2.5 py-1 rounded text-[#D4AF37]">
                <Award className="w-3 h-3" />
                MCI London Certified
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-900/80 border border-[#D4AF37]/40 px-2.5 py-1 rounded text-emerald-200">
                <Shield className="w-3 h-3" />
                APEN Accredited
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="text-sm font-bold font-serif uppercase tracking-wider text-[#D4AF37] mb-4 border-b border-emerald-800 pb-2">
              Explore Pages
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100">
              {[
                { id: 'home', label: 'Home Page' },
                { id: 'about', label: 'About Our Philosophy' },
                { id: 'admissions', label: 'Admissions & Entry' },
                { id: 'academics', label: 'Montessori Curriculum' },
                { id: 'resultscbt', label: 'Student Results & CBT Portal' },
                { id: 'news', label: 'News & Announcements' },
                { id: 'contact', label: 'Contact Us & Location' },
              ].map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold font-serif uppercase tracking-wider text-[#D4AF37] mb-4 border-b border-emerald-800 pb-2">
              Visit or Contact Us
            </h4>
            <ul className="space-y-3 text-xs text-emerald-100">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{schoolInfo.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`tel:${schoolInfo.phone}`} className="hover:text-[#D4AF37]">
                  {schoolInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${schoolInfo.email}`} className="hover:text-[#D4AF37]">
                  {schoolInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Mon - Fri: 7:30 AM - 4:00 PM</span>
              </li>
            </ul>

            <div className="mt-4">
              <a
                href={`https://wa.me/${schoolInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-all shadow"
              >
                <MessageCircle className="w-4 h-4 fill-current text-white" />
                <span>Chat via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Portal & Staff Login Box */}
          <div className="bg-emerald-950/70 border border-[#D4AF37]/30 p-5 rounded-xl space-y-3">
            <h4 className="text-sm font-bold font-serif text-[#D4AF37] flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>School Portals</span>
            </h4>
            <p className="text-xs text-emerald-200 leading-relaxed">
              Access the Online CBT Exam module, view student result slips, or log in to the School Admin Management System.
            </p>

            <button
              onClick={() => {
                setActiveTab('resultscbt');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full bg-[#D4AF37] hover:bg-amber-400 text-[#0B3D27] font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Student CBT & Results</span>
            </button>

            <button
              onClick={openLoginModal}
              className="w-full bg-emerald-900 hover:bg-emerald-800 text-emerald-100 font-semibold text-xs py-2 rounded-lg border border-emerald-700 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Staff / Admin / Parent Login</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300">
          <p>© {new Date().getFullYear()} Denmin British Montessori Academy, Benin City, Nigeria. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setActiveTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#D4AF37] transition-colors"
            >
              Admin System
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#D4AF37] transition-colors"
            >
              Location Map
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
