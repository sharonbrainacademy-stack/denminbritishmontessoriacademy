import React from 'react';
import {
  BookOpen,
  Award,
  ShieldCheck,
  Heart,
  Target,
  Compass,
  Users,
  Building,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

import { initialTeachers } from '../data/initialData';

export const AboutPage: React.FC = () => {
  const { schoolInfo, teachers } = useSchool();
  const displayTeachers = teachers.length > 0 ? teachers : initialTeachers;

  const coreValues = [
    { title: 'Excellence', desc: 'Striving for the highest academic and moral standards in all endeavors.' },
    { title: 'Discipline & Character', desc: 'Cultivating self-control, respect for elders, and moral integrity.' },
    { title: 'Self-Discovery', desc: 'Empowering children through hands-on Montessori self-directed exploration.' },
    { title: 'Creativity & Innovation', desc: 'Encouraging problem-solving, digital literacy, and artistic expression.' },
    { title: 'Compassion & Respect', desc: 'Fostering empathy, teamwork, and pride in Nigerian cultural diversity.' },
  ];

  const facilities = [
    { name: 'Montessori Sensory Laboratory', desc: 'Fully equipped with authentic Montessori practical life and sensorial apparatus.' },
    { name: 'Air-Conditioned ICT & CBT Center', desc: 'High-speed internet desktop workstations for early coding and online exams.' },
    { name: 'Standard Science & STEM Lab', desc: 'Safe interactive science equipment for basic physics, chemistry, and botany.' },
    { name: 'School Library & Resource Room', desc: 'Rich collection of British curriculum storybooks, encyclopedia, and reference texts.' },
    { name: 'Child-Safe Playground Park', desc: 'Padded synthetic turf, slides, and outdoor sports court under active adult supervision.' },
    { name: '24/7 Monitored CCTV Security', desc: 'Gated premises with strict visitor sign-in logs and security personnel.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header Banner */}
      <div className="bg-[#0B3D27] text-white p-8 md:p-12 rounded-3xl border-2 border-[#D4AF37] shadow-xl text-center space-y-3">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
          About Our Institution
        </span>
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-[#F9F6EF]">
          Our Story, Vision & Philosophy
        </h1>
        <p className="text-sm md:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
          Established to bridge international educational standards with Nigerian moral and cultural values in Benin City.
        </p>
      </div>

      {/* Story & Philosophy Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase text-[#D4AF37]">
            <BookOpen className="w-4 h-4" />
            <span>Educational Philosophy</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#0B3D27]">
            Academic Rigor Meets Character Development
          </h2>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            At Sharon Brain Academy, we believe education is an empowering journey of intellectual discovery, moral fortitude, and self-actualization.
          </p>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            We combine inquiry-based learning and modern educational technology with the Nigerian educational curriculum guidelines. This ensures our pupils excel in common entrance examinations, digital computer-based assessments, and future academic leadership.
          </p>
        </div>

        <div className="relative">
          <div className="rounded-2xl overflow-hidden border-4 border-[#D4AF37] shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800"
              alt="Learning Environment"
              className="w-full h-80 object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-[#0B3D27] text-white p-4 rounded-2xl border-2 border-[#D4AF37] shadow-lg hidden sm:block">
            <p className="text-2xl font-bold text-[#D4AF37] font-serif">14+ Years</p>
            <p className="text-xs text-emerald-100">Of Academic Excellence in Benin City</p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Statements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-[#D4AF37]/30 space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-[#0B3D27] rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h3 className="text-xl font-bold font-serif text-[#0B3D27]">Our Mission Statement</h3>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            {schoolInfo.mission || "To provide a stimulating, student-centered learning environment where every learner develops intellectual agility, sound moral character, creative problem-solving skills, and a lifelong passion for excellence."}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-[#D4AF37]/30 space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-[#0B3D27] rounded-xl flex items-center justify-center">
            <Compass className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h3 className="text-xl font-bold font-serif text-[#0B3D27]">Our Vision Statement</h3>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            {schoolInfo.vision || "To be the premier citadel of learning in Edo State and Nigeria, recognized globally for producing visionary thinkers, scholars, and disciplined leaders equipped for 21st-century global challenges."}
          </p>
        </div>
      </div>

      {/* Core Values & School Anthem */}
      <div className="bg-[#0B3D27] text-white rounded-3xl p-8 md:p-12 border-2 border-[#D4AF37] space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-serif">
            Our Pillars
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#F9F6EF]">
            Core Values & School Anthem
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {coreValues.map((v, i) => (
            <div key={i} className="bg-emerald-950/80 p-4 rounded-xl border border-[#D4AF37]/30 space-y-2">
              <h4 className="text-sm font-bold font-serif text-[#D4AF37]">{v.title}</h4>
              <p className="text-xs text-emerald-100 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-emerald-900/60 p-6 rounded-2xl border border-[#D4AF37]/40 max-w-2xl mx-auto text-center space-y-3">
          <h4 className="text-base font-bold font-serif text-[#D4AF37] uppercase">The Sharon Brain School Anthem</h4>
          <p className="text-xs md:text-sm text-emerald-100 italic leading-relaxed">
            "Sharon Brain Academy, beacon of light,<br />
            Where minds are ignited and future is bright.<br />
            With discipline, virtue, and truth as our guide,<br />
            In excellence and wisdom we march side by side!"
          </p>
        </div>
      </div>

      {/* Facilities & Learning Environment */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
            World-Class Infrastructure
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#0B3D27]">
            Facilities Built for Safe & Creative Learning
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((f, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#0B3D27]">
                <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                <h4 className="text-sm font-bold font-serif text-[#0B3D27]">{f.name}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Proprietor & Executive Directorate */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-md border-2 border-[#D4AF37]/40 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 text-center">
            <div className="relative inline-block max-w-xs mx-auto">
              <div className="w-52 h-64 md:w-60 md:h-72 rounded-2xl overflow-hidden border-4 border-[#D4AF37] shadow-xl mx-auto bg-slate-100">
                <img
                  src={schoolInfo.principalPhotoUrl || "/src/assets/images/sharon_principal_photo_1792366303843.jpg"}
                  alt={schoolInfo.principalName}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute -bottom-3 inset-x-0 bg-[#0B3D27] text-[#D4AF37] text-xs font-bold py-1 px-4 rounded-full shadow-lg mx-auto w-max border border-[#D4AF37]">
                Executive Proprietor
              </div>
            </div>
            <h3 className="mt-4 text-xl font-bold font-serif text-[#0B3D27]">
              {schoolInfo.principalName?.replace(/Deborah/gi, 'Denyinye Minna') || 'Dr. Denyinye Minna Hitler'}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {schoolInfo.principalTitle?.replace(/proprietress/gi, 'Proprietor') || 'Proprietor & Executive Chairman'}
            </p>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
              <span>Proprietor's Address</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#0B3D27]">
              Nurturing Greatness from Early Years
            </h2>
            <blockquote className="text-slate-700 text-sm md:text-base italic leading-relaxed border-l-4 border-[#D4AF37] pl-4 py-1">
              "{schoolInfo.principalWelcomeMessage}"
            </blockquote>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              At Sharon Brain Academy, our visionary leadership is committed to fostering an inspiring educational atmosphere where each learner is guided to reach the pinnacle of their potential through disciplined study, high academic standards, and sound moral integrity.
            </p>
          </div>
        </div>
      </div>

      {/* Our Leadership & Key Staff */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
            Our Dedicated Team
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#0B3D27]">
            Meet Our School Educators & Leadership
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTeachers.map(t => (
            <div key={t.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm space-y-4 p-5 text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#D4AF37] mx-auto shadow-md">
                <img
                  src={t.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300'}
                  alt={t.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-base font-bold font-serif text-[#0B3D27]">{t.fullName}</h4>
                <p className="text-xs font-semibold text-[#D4AF37] mt-0.5">{t.role}</p>
                <p className="text-[11px] text-slate-500 mt-1">{t.qualification}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
