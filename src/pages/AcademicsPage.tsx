import React from 'react';
import {
  BookOpen,
  Award,
  CheckCircle,
  Laptop,
  Music,
  Dna,
  Calculator,
  Languages
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const AcademicsPage: React.FC = () => {
  const { schoolInfo } = useSchool();

  const cadres = [
    {
      level: 'Early Childhood / Creche & Kindergarten',
      ages: '3 months – 5 years',
      description: 'Montessori-inspired sensory learning, phonetics, foundational literacy, and social habits in a warm, nurturing environment.',
      subjects: ['Phonics & Pre-reading', 'Numeracy & Shapes', 'Sensory Play', 'Creative Arts', 'Rhymes & Moral Stories'],
    },
    {
      level: 'Primary Cadre (Basic 1 – 6)',
      ages: '5 – 11 years',
      description: 'Comprehensive Nigerian and international curriculum preparing pupils for common entrance examinations and lifelong academic agility.',
      subjects: [
        'Mathematics & Quantitative Reasoning',
        'English Language & Verbal Reasoning',
        'Basic Science & Technology',
        'Social Studies & Civic Education',
        'Computer Studies & ICT',
        'Agricultural Science',
        'Christian Religious Studies',
        'Cultural & Creative Arts',
      ],
    },
    {
      level: 'Junior Secondary (JSS 1 – 3)',
      ages: '11 – 14 years',
      description: 'Rigorously preparing young scholars for the Basic Education Certificate Examination (BECE) and state junior examinations with STEM laboratories.',
      subjects: [
        'Mathematics & Basic Science',
        'English Language & Literature',
        'Business Studies & Commerce',
        'Computer Science & Programming',
        'Basic Technology & Technical Drawing',
        'Civic Education & Social Studies',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Academic Framework
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Curriculum Designed for World-Class Success
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          At Sharon Brain Academy, our balanced academic curriculum stimulates critical thinking,
          computational fluency, and moral clarity at every grade stage.
        </p>
      </div>

      <div className="space-y-8">
        {cadres.map((cadre, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                Age: {cadre.ages}
              </span>
              <h2 className="text-2xl font-bold text-slate-900">{cadre.level}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{cadre.description}</p>
            </div>

            <div className="lg:col-span-7 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Key Subject Offerings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {cadre.subjects.map((subj, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{subj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
