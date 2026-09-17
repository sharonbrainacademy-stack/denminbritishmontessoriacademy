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
          Established to bridge international British Montessori methodology with Nigerian moral and cultural values in Benin City.
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
            The Montessori Method Meets British Curriculum Standards
          </h2>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            At Denmin British Montessori Academy, we adhere to Dr. Maria Montessori’s timeless insight: <i>"Education is a natural process carried out by the human individual, and is acquired not by listening to words, but by experiences upon the environment."</i>
          </p>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            We combine this hands-on, self-correcting apparatus approach with the British National Curriculum and the Nigerian Ministry of Education guidelines. This ensures our pupils excel in international assessments, common entrance examinations, and real-world problem-solving.
          </p>
        </div>

        <div className="relative">
          <div className="rounded-2xl overflow-hidden border-4 border-[#D4AF37] shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800"
              alt="Montessori Learning Environment"
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
            To provide a stimulating, child-centered educational environment where pupils develop independent thinking, academic competence, moral integrity, and lifelong passion for discovery using British Montessori standards.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-[#D4AF37]/30 space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-[#0B3D27] rounded-xl flex items-center justify-center">
            <Compass className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h3 className="text-xl font-bold font-serif text-[#0B3D27]">Our Vision Statement</h3>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            To be the premier early childhood and primary academy in Edo State and Nigeria, recognized globally for producing well-rounded leaders equipped for 21st-century global challenges.
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
          <h4 className="text-base font-bold font-serif text-[#D4AF37] uppercase">The Denmin School Anthem</h4>
          <p className="text-xs md:text-sm text-emerald-100 italic leading-relaxed">
            "Denmin Academy, beacon of light,<br />
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
