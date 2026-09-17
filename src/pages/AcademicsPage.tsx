import React from 'react';
import {
  BookOpen,
  Brain,
  Calculator,
  Globe2,
  Palette,
  Bot,
  Music,
  Dumbbell,
  Sprout,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react';

export const AcademicsPage: React.FC = () => {
  const montessoriPillars = [
    {
      title: '1. Practical Life Exercises',
      desc: 'Developing fine motor coordination, independence, concentration, grace, and courtesy through pouring, lacing, buttoning, and environmental care.',
      icon: Brain,
    },
    {
      title: '2. Sensorial Education',
      desc: 'Refining the child’s visual, tactile, auditory, olfactory, and stereognostic senses using pink towers, cylinder blocks, and color tablets.',
      icon: Sparkles,
    },
    {
      title: '3. Mathematics & Logic',
      desc: 'From concrete golden bead materials to abstract arithmetic: addition, subtraction, place values, fractions, and multiplication concept boards.',
      icon: Calculator,
    },
    {
      title: '4. Language & Literacy',
      desc: 'Phonics sandpaper letters, movable alphabets, creative story composition, diction, and early speed reading fluency.',
      icon: BookOpen,
    },
    {
      title: '5. Cultural & Scientific Studies',
      desc: 'Exploring geography continents, botany leaf shapes, basic physics, history, and rich Nigerian cultural heritage.',
      icon: Globe2,
    },
  ];

  const coCurricularClubs = [
    { title: 'Robotics & STEAM Club', icon: Bot, desc: 'Introductory coding, Lego mechanical structures, and hands-on science experiments.' },
    { title: 'Chess & Logic Academy', icon: Award, desc: 'Enhancing strategic foresight, concentration, and mathematical problem-solving.' },
    { title: 'Taekwondo & Martial Arts', icon: Dumbbell, desc: 'Building physical agility, self-defense awareness, and respectful self-discipline.' },
    { title: 'Music & Choir Ensemble', icon: Music, desc: 'Piano basics, vocal training, rhythm percussion, and musical notation literacy.' },
    { title: 'Young Farmers & Nature Club', icon: Sprout, desc: 'Gardening, botany, environmental conservation, and organic farming practicals.' },
    { title: 'Diction, Drama & Debating', icon: Palette, desc: 'Elocution training, public speaking confidence, theatrical performance, and debates.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header Banner */}
      <div className="bg-[#0B3D27] text-white p-8 md:p-12 rounded-3xl border-2 border-[#D4AF37] shadow-xl text-center space-y-3">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
          Academic Rigor & Innovation
        </span>
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-[#F9F6EF]">
          Montessori Curriculum & Academics
        </h1>
        <p className="text-sm md:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
          Detailed breakdown of our learning areas, British primary subjects, co-curricular clubs, and academic term calendar.
        </p>
      </div>

      {/* Montessori Pillars Breakdown */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
            5 Core Montessori Areas
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#0B3D27]">
            Sensory-Driven Learning Curriculum
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {montessoriPillars.map((p, idx) => {
            const IconComponent = p.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-[#D4AF37] transition-colors">
                <div className="w-12 h-12 bg-emerald-50 text-[#0B3D27] rounded-xl flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold font-serif text-[#0B3D27]">{p.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Subjects Breakdown */}
      <div className="bg-[#0B3D27] text-white rounded-3xl p-8 md:p-12 border-2 border-[#D4AF37] space-y-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-serif">
            Primary School Academic Standards
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#F9F6EF]">
            Comprehensive Primary Subjects
          </h2>
          <p className="text-xs text-emerald-100 leading-relaxed">
            Our Primary pupils (Primary 1 - 6) receive rigorous instruction blending British National Primary Curriculum benchmarks with Nigerian Basic Education requirements:
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {[
            'Mathematics & Quantitative Reasoning',
            'English Language & Verbal Reasoning',
            'Phonics, Diction & Speech Drill',
            'Basic Science & Technology (STEAM)',
            'Computer Studies & CBT Literacy',
            'Social Studies & Civic Education',
            'Agricultural Science',
            'Home Economics & Life Skills',
            'French Language & Global Culture',
            'Edo Language & Cultural History',
            'Christian Religious Studies (CRS)',
            'Creative & Fine Arts',
          ].map((sub, i) => (
            <div key={i} className="p-3 bg-emerald-950/80 rounded-xl border border-[#D4AF37]/30 text-emerald-100 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
              <span>{sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Co-Curricular Activities */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
            Clubs & Societies
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#0B3D27]">
            Co-Curricular & Leadership Development
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coCurricularClubs.map((club, idx) => {
            const IconComponent = club.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-50 text-[#0B3D27] rounded-xl flex items-center justify-center shrink-0 border border-amber-200">
                  <IconComponent className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold font-serif text-[#0B3D27]">{club.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{club.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Term Dates & Academic Calendar */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <Calendar className="w-6 h-6 text-[#0B3D27]" />
          <div>
            <h3 className="text-xl font-bold font-serif text-[#0B3D27]">2024/2025 Academic Calendar Summary</h3>
            <p className="text-xs text-slate-500">Official Term Key Dates & Holidays</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <h4 className="font-bold text-[#0B3D27] text-sm">1st Term (Autumn)</h4>
            <p className="text-slate-600">Resumption: Sept 9, 2024</p>
            <p className="text-slate-600">Mid-Term Break: Oct 24 - Oct 28, 2024</p>
            <p className="text-slate-600">CBT Exams & Vacation: Dec 16, 2024</p>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
            <h4 className="font-bold text-[#0B3D27] text-sm">2nd Term (Spring)</h4>
            <p className="text-slate-600">Resumption: Jan 13, 2025</p>
            <p className="text-slate-600">Mid-Term Break: Feb 20 - Feb 24, 2025</p>
            <p className="text-slate-600">Inter-House Sports & Vacation: April 11, 2025</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-[#0B3D27] text-sm">3rd Term (Summer)</h4>
            <p className="text-slate-600">Resumption: May 5, 2025</p>
            <p className="text-slate-600">Mid-Term Break: June 12 - June 16, 2025</p>
            <p className="text-slate-600">Graduation & Award Day: July 25, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};
