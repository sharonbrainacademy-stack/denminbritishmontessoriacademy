import React from 'react';
import {
  GraduationCap,
  Award,
  ShieldCheck,
  BookOpen,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  PhoneCall,
  FileText,
  Star,
  Building2,
  Heart,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  openLoginModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, openLoginModal }) => {
  const { schoolInfo, newsArticles, galleryPhotos } = useSchool();

  const whyChooseUsPoints = [
    {
      title: 'British Montessori Methodology',
      desc: 'Hands-on sensory learning materials combined with British Early Years Foundation Stage (EYFS) and National Curriculum standards.',
      icon: GraduationCap,
    },
    {
      title: 'Certified & Passionate Educators',
      desc: 'UK Montessori-certified leads and TRCN-registered subject specialists dedicated to each child’s intellectual and moral growth.',
      icon: Award,
    },
    {
      title: 'Safe, Serene & Secure Campus',
      desc: '24/7 CCTV-monitored, gated premises with child-safe padded play facilities right opposite UNIBEN Main Gate, Ugbowo, Benin City.',
      icon: ShieldCheck,
    },
    {
      title: 'British Standards + Nigerian Values',
      desc: 'Fostering international academic competitiveness while instilling deep respect, Edo/Nigerian cultural identity, and moral integrity.',
      icon: Heart,
    },
    {
      title: 'Digital Literacy & Online CBT Exams',
      desc: 'Air-conditioned ICT centers, early robotics, computer studies, and a online CBT exam & result portal.',
      icon: Globe,
    },
    {
      title: 'Holistic Character & Co-Curricular',
      desc: 'Active clubs including Chess, Taekwondo, Diction & Public Speaking, Young Farmers, Choir, and STEAM Innovation.',
      icon: Sparkles,
    },
  ];

  const testimonials = [
    {
      name: 'Engr. & Mrs. Victor Igbinoba',
      parentOf: 'Eseosa (Primary 5) & Nosa (Nursery 2)',
      quote: 'Denmin British Montessori Academy has been a blessing to our family. The balance between British academic rigor and hands-on Montessori sensory learning transformed our daughter Eseosa into a top-scoring, confident student!',
      rating: 5,
    },
    {
      name: 'Dr. Osas Oviawe',
      parentOf: 'Osasumwen Jr. (Primary 5)',
      quote: 'As a university lecturer opposite the school gate, proximity and quality were paramount. Denmin exceeds expectations—the new CBT exam portal and instant PDF result slips make parent tracking effortless.',
      rating: 5,
    },
    {
      name: 'Alhaji & Hajia Ibrahim Bello',
      parentOf: 'Aisha (Primary 6)',
      quote: 'The emphasis on discipline, public speaking diction, and moral character is unmatched in Benin City. We are proud Denmin parents!',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-[#0B3D27] text-white overflow-hidden py-16 lg:py-24 border-b-4 border-[#D4AF37]">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#D4AF37]">
                <Award className="w-4 h-4" />
                <span>Premier Montessori Education in Benin City, Nigeria</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#F9F6EF] leading-tight">
                {schoolInfo.name}
              </h1>

              <p className="text-lg md:text-xl text-[#D4AF37] font-serif italic">
                "{schoolInfo.motto}"
              </p>

              <p className="text-sm md:text-base text-emerald-100 max-w-2xl leading-relaxed">
                {schoolInfo.tagline}. Located conveniently at 72, 19th Street, Opposite UNIBEN Main Gate, Ugbowo.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setActiveTab('admissions')}
                  className="bg-[#D4AF37] hover:bg-amber-400 text-[#0B3D27] font-bold px-7 py-3.5 rounded-xl text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <Award className="w-5 h-5" />
                  <span>Enroll Your Child Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('resultscbt')}
                  className="bg-emerald-900/90 hover:bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-xl text-base border border-[#D4AF37]/50 shadow-md transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                  <span>Access CBT & Results Portal</span>
                </button>

                <button
                  onClick={openLoginModal}
                  className="bg-white/10 hover:bg-white/20 text-emerald-100 font-semibold px-5 py-3.5 rounded-xl text-sm border border-white/20 transition-colors"
                >
                  Staff / Admin Login
                </button>
              </div>

              {/* Quick Info Badges */}
              <div className="pt-6 border-t border-emerald-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Pre-Nursery, Nursery & Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>MCI UK Montessori Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Opposite UNIBEN Main Gate</span>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl p-4 shadow-2xl border-4 border-[#D4AF37] text-slate-800 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="relative h-64 rounded-xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800"
                    alt="Denmin Montessori Classroom"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-[#0B3D27] text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Montessori Standard
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-lg text-[#0B3D27]">
                    Inspiring Young Minds Daily
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Our child-centered environment empowers young learners to explore mathematics, language, science, and practical life skills independently.
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0B3D27]">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      4.9/5 Parent Rating
                    </span>
                    <button
                      onClick={() => setActiveTab('about')}
                      className="text-[#0B3D27] hover:text-amber-700 underline font-serif"
                    >
                      Read Our Philosophy →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proprietor / Principal Welcome Message */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-md border border-[#D4AF37]/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 text-center">
              <div className="relative inline-block max-w-xs mx-auto">
                <div className="w-52 h-64 md:w-60 md:h-72 rounded-2xl overflow-hidden border-4 border-[#D4AF37] shadow-xl mx-auto bg-slate-100">
                  <img
                    src={schoolInfo.principalPhotoUrl || "/src/assets/images/proprietor_photo_1789616090083.jpg"}
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
                <span>Welcome Message</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#0B3D27]">
                Nurturing Greatness from Early Years
              </h2>
              <blockquote className="text-slate-700 text-sm md:text-base italic leading-relaxed border-l-4 border-[#D4AF37] pl-4 py-1">
                "{schoolInfo.principalWelcomeMessage}"
              </blockquote>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                At Denmin British Montessori Academy, we blend the world's finest self-directed Montessori apparatus with structured British National Curriculum outcomes. Whether your child is taking their first steps in Pre-Nursery or preparing for entrance examinations into top secondary institutions, we guarantee a safe, uplifting, and transformative educational experience.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('about')}
                  className="bg-[#0B3D27] hover:bg-emerald-900 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Learn More About Our Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-[#0B3D27] text-white py-12 border-y-2 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-bold font-serif text-[#D4AF37]">
                {schoolInfo.totalStudents}+
              </p>
              <p className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
                Happy Students
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-bold font-serif text-[#D4AF37]">
                {schoolInfo.totalTeachers}+
              </p>
              <p className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
                Certified Teachers
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-bold font-serif text-[#D4AF37]">
                {schoolInfo.yearsOfExcellence}+ Years
              </p>
              <p className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
                Academic Excellence
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-bold font-serif text-[#D4AF37]">
                {schoolInfo.passRatePercent}%
              </p>
              <p className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
                Exam Pass Rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
            Why Parents Trust Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#0B3D27]">
            The Denmin Standard of Educational Excellence
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We provide a world-class foundation designed to cultivate creative thinking, leadership, and sound moral character in every pupil.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseUsPoints.map((point, index) => {
            const IconComponent = point.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-200 hover:border-[#D4AF37] space-y-3 group"
              >
                <div className="w-12 h-12 bg-emerald-50 text-[#0B3D27] rounded-xl flex items-center justify-center group-hover:bg-[#0B3D27] group-hover:text-[#D4AF37] transition-colors">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-serif text-[#0B3D27]">
                  {point.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {point.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Parent Testimonials */}
      <section className="bg-gradient-to-b from-[#F9F6EF] to-emerald-50/50 py-16 border-y border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
              Parent Testimonials
            </span>
            <h2 className="text-3xl font-bold font-serif text-[#0B3D27]">
              Voices of Our School Community
            </h2>
            <p className="text-xs text-slate-600">
              Read what parents in Benin City say about our teachers, facilities, and academic results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-[#0B3D27] font-serif">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.parentOf}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B3D27] text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border-2 border-[#D4AF37]">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-serif">
              Admissions Open for 2024/2025 Academic Session
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#F9F6EF]">
              Give Your Child the Gift of a World-Class British Montessori Foundation
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Schedule a campus tour or apply online today. Visit us at 72, 19th Street, Opposite UNIBEN Main Gate, Ugbowo, Benin City.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveTab('admissions')}
                className="bg-[#D4AF37] hover:bg-amber-400 text-[#0B3D27] font-bold px-6 py-3 rounded-xl text-sm transition-all shadow"
              >
                Start Admission Process
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className="bg-emerald-900 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-xl text-sm border border-emerald-700 transition-colors"
              >
                Contact School Office
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
