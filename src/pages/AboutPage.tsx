import React from 'react';
import {
  GraduationCap,
  Award,
  Target,
  Compass,
  CheckCircle,
  Users,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const AboutPage: React.FC = () => {
  const { schoolInfo, teachers } = useSchool();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          About Sharon Brain Academy
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Nurturing Leaders of Substance, Character & Intellect
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Founded with a clear mandate to raise morally sound and academically exceptional boys and
          girls, Sharon Brain Academy stands as a model institution in Ugbowo, Benin City, Edo State.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white p-8 rounded-3xl shadow-lg space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Compass className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold">Our Vision</h2>
          <p className="text-slate-200 text-sm leading-relaxed">{schoolInfo.vision}</p>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-lg space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-teal-400" />
          </div>
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-slate-200 text-sm leading-relaxed">{schoolInfo.mission}</p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-900">Our Pillars of Excellence</h3>
          <p className="text-xs text-slate-500">What sets Sharon Brain Academy apart</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Academic Discipline',
              desc: 'Relentless commitment to rigorous inquiry, STEM foundation, and strong language skills.',
            },
            {
              title: 'Moral Integrity',
              desc: 'Instilling truthfulness, respect, humility, and positive civic responsibility in every pupil.',
            },
            {
              title: 'Technological Readiness',
              desc: 'Early digital literacy, computer coding, and online Computer-Based Testing systems.',
            },
            {
              title: 'Individual Focus',
              desc: 'Low student-teacher ratios ensuring no learner is left behind in any academic subject.',
            },
          ].map((v, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <CheckCircle className="w-6 h-6 text-emerald-600 mb-2" />
              <h4 className="font-bold text-slate-900 text-base">{v.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership Profile */}
      <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex justify-center">
            <div className="w-48 h-48 rounded-2xl overflow-hidden bg-slate-300 ring-4 ring-emerald-600 shadow-xl">
              <img
                src={schoolInfo.principalPhotoUrl}
                alt={schoolInfo.principalName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>
          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Executive Leadership
            </span>
            <h3 className="text-2xl font-bold text-slate-900">{schoolInfo.principalName}</h3>
            <p className="text-xs font-semibold text-emerald-700">{schoolInfo.principalTitle}</p>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "{schoolInfo.principalWelcomeMessage}"
            </p>
            <div className="pt-2 text-xs text-slate-500">
              <span>Campus: {schoolInfo.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
