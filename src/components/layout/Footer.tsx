import React from 'react';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  Heart
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { schoolInfo } = useSchool();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Col 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-black text-lg text-white tracking-tight">
                  SHARON BRAIN
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
                  ACADEMY
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {schoolInfo.tagline}. Dedicated to nurturing academic excellence, disciplined character,
              and global readiness in Ugbowo, Benin City.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> TRCN Certified
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Award className="w-4 h-4" /> WAEC / NECO / BECE
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'About Our Citadel', page: 'about' },
                { label: 'Academic Curriculum', page: 'academics' },
                { label: 'Admission Enrollment', page: 'admissions' },
                { label: 'Term Calendar & Events', page: 'calendar' },
                { label: 'Online CBT & Examination', page: 'results-cbt' },
                { label: 'Termly Result Checker', page: 'results-cbt' },
                { label: 'School News & Gallery', page: 'news' },
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate(item.page)}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact & Campus */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Campus Location
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{schoolInfo.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${schoolInfo.phone}`} className="hover:text-white transition">
                  {schoolInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${schoolInfo.email}`} className="hover:text-white transition">
                  {schoolInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mon – Fri: 7:30 AM – 3:30 PM</span>
              </div>
            </div>
          </div>

          {/* Col 4: Principal / Proprietor Note */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              Leadership
            </h4>
            <p className="text-xs text-white font-semibold">{schoolInfo.principalName}</p>
            <p className="text-[11px] text-slate-400 mb-2">{schoolInfo.principalTitle}</p>
            <p className="text-[11px] text-slate-400 italic leading-relaxed">
              "{schoolInfo.motto}"
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {schoolInfo.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Academic Excellence in Benin City.
          </p>
        </div>
      </div>
    </footer>
  );
};
