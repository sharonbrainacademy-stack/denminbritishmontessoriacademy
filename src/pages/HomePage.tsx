import React from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Laptop,
  FileCheck,
  Calendar,
  PhoneCall,
  MapPin,
  Clock,
  Heart
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { SchoolCalendar } from '../components/calendar/SchoolCalendar';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { schoolInfo, newsArticles } = useSchool();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-16 pb-24">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Premier Citadel of Learning in Ugbowo, Benin City</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Empowering Curious Minds for a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                  Glorious Tomorrow
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {schoolInfo.tagline}. At <span className="text-white font-bold">{schoolInfo.name}</span>,
                we unite academic rigor, high moral character, and innovative Computer-Based Testing (CBT)
                to unlock every child's full potential.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('admissions')}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-700/30 transition flex items-center gap-2"
                >
                  Apply for Admission <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('results-cbt')}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition flex items-center gap-2"
                >
                  <Laptop className="w-4 h-4 text-emerald-400" /> Online CBT & Results
                </button>
              </div>

              {/* Highlights badge row */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800 text-left">
                <div>
                  <span className="block text-2xl font-black text-emerald-400">{schoolInfo.yearsOfExcellence}+</span>
                  <span className="text-xs text-slate-400">Years of Quality Education</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-teal-400">{schoolInfo.passRatePercent}%</span>
                  <span className="text-xs text-slate-400">BECE & WAEC Pass Rate</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-amber-400">100%</span>
                  <span className="text-xs text-slate-400">Moral & Character Focus</span>
                </div>
              </div>
            </div>

            {/* Principal Welcome Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-slate-800/90 to-slate-900/95 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-700 ring-2 ring-emerald-500 shrink-0">
                    <img
                      src={schoolInfo.principalPhotoUrl}
                      alt={schoolInfo.principalName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{schoolInfo.principalName}</h3>
                    <p className="text-xs text-emerald-400 font-medium">{schoolInfo.principalTitle}</p>
                    <p className="text-[11px] text-slate-400">Sharon Brain Academy</p>
                  </div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed italic space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                  <p>"{schoolInfo.principalWelcomeMessage}"</p>
                </div>

                <div className="mt-5 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800">
                  <span>Motto: <strong className="text-emerald-300">{schoolInfo.motto}</strong></span>
                  <button
                    onClick={() => onNavigate('about')}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Core Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Academic Rigor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standardized Nigerian-British infused curriculum focusing on STEM, literacy, mathematics,
              quantitative reasoning, and creative arts from early years to secondary levels.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Digital CBT System</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Modern Computer-Based Testing with support for 1st Test, 2nd Test, Terminal CBT Exams,
              objective multiple choice, and theory essay submissions with real-time analytics.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Moral Character</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dedicated mentorship and Christian moral foundation nurturing upright, empathetic,
              and well-behaved scholars who serve as role models in their communities.
            </p>
          </div>
        </section>

        {/* Calendar and CBT Highlight Row */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar Widget */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Term Schedule & Events</h3>
                <p className="text-xs text-slate-500">Official dates for tests, exams, holidays & meetings</p>
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                View Full Calendar <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <SchoolCalendar compact={true} />
          </div>

          {/* Quick CBT & Result Checker Portal Banner */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg space-y-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <FileCheck className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                Online Portal
              </span>
              <h3 className="text-xl font-bold text-white mt-1">CBT Examination & Result Checker</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Parents and students can check 1st Continuous Assessment Test, 2nd Test, and Terminal CBT
                Exam slips directly online using their Sharon Brain Academy admission number.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant CBT score computation & feedback</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Section A (Objective) & Section B (Theory) support</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Downloadable official PDF result slips</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('results-cbt')}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              Access Result & CBT Portal <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Call to action */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black">
            Enroll Your Child at Sharon Brain Academy Today
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Admissions are ongoing for Creche, Kindergarten, Nursery, Primary, and Junior Secondary classes.
            Give your child the lifelong advantage of a first-rate education in Benin City.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('admissions')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Start Admission Form
            </button>
            <a
              href={`tel:${schoolInfo.phone}`}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" /> Call Admissions Desk
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
