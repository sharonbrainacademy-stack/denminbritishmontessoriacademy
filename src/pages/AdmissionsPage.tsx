import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  Download,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const AdmissionsPage: React.FC = () => {
  const { schoolInfo, submitAdmissionApp } = useSchool();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    applicantName: '',
    gender: 'Male',
    dateOfBirth: '',
    proposedClass: 'Primary 1',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    previousSchool: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAdmissionApp(formData);
    setFormSubmitted(true);
  };

  const handleDownloadFormPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Admission Application Form — Sharon Brain Academy</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #0B3D27; }
            .header { text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 15px; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 20px; color: #0B3D27; }
            .header p { margin: 3px 0; font-size: 12px; }
            .field { margin-bottom: 15px; }
            .field label { font-weight: bold; font-size: 12px; display: block; margin-bottom: 4px; }
            .box { border: 1px solid #ccc; height: 30px; border-radius: 4px; }
            .footer { margin-top: 40px; font-size: 11px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SHARON BRAIN ACADEMY</h1>
            <p>No 2, 2nd Otakhiogbogie Street, Ugbowo Benin City, Edo State Nigeria</p>
            <p><strong>OFFICIAL ADMISSION APPLICATION FORM (2024/2025 SESSION)</strong></p>
          </div>
          <div class="field"><label>Pupil's Full Name:</label><div class="box"></div></div>
          <div class="field"><label>Date of Birth & Gender:</label><div class="box"></div></div>
          <div class="field"><label>Proposed Class Level (Pre-Nursery / Nursery / Primary):</label><div class="box"></div></div>
          <div class="field"><label>Parent / Guardian Full Name:</label><div class="box"></div></div>
          <div class="field"><label>Parent Phone & Email:</label><div class="box"></div></div>
          <div class="field"><label>Home Address in Benin City:</label><div class="box"></div></div>
          <div class="field"><label>Previous School Attended (if any):</label><div class="box"></div></div>
          <br/><br/>
          <p style="font-size:12px;">Parent's Signature: _______________________ Date: _______________</p>
          <div class="footer">Please return filled form with 2 passport photographs and birth certificate to the School Admin Office.</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Page Header */}
      <div className="bg-[#0B3D27] text-white p-8 md:p-12 rounded-3xl border-2 border-[#D4AF37] shadow-xl text-center space-y-3">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
          Join Our School Family
        </span>
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-[#F9F6EF]">
          Admissions & Enrollment
        </h1>
        <p className="text-sm md:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
          Discover our simple 4-step enrollment process, entry requirements, and online application portal.
        </p>
      </div>

      {/* Step-by-Step Process */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
            4 Simple Steps
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#0B3D27]">
            How to Enroll Your Child
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Submit Application', desc: 'Fill out the online application form below or visit our admin office at No 2, 2nd Otakhiogbogie Street, Ugbowo, Benin City.' },
            { step: '02', title: 'Interactive Readiness Test', desc: 'A friendly Montessori assessment designed to gauge your child’s cognitive and social development level.' },
            { step: '03', title: 'Admission Offer', desc: 'Successful candidates receive an official admission offer letter along with parent orientation guidelines.' },
            { step: '04', title: 'Registration & Resumption', desc: 'Complete admission confirmation, collect uniform & learning materials, and welcome your child to class!' },
          ].map((s, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
              <span className="text-4xl font-bold font-serif text-[#D4AF37]/30 absolute top-2 right-4">
                {s.step}
              </span>
              <h3 className="text-base font-bold font-serif text-[#0B3D27]">{s.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Entry Requirements & Downloads */}
      <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
              Enrollment Guidelines
            </span>
            <h3 className="text-xl md:text-2xl font-bold font-serif text-[#0B3D27] flex items-center gap-2 mt-1">
              <CheckCircle className="w-6 h-6 text-[#D4AF37]" />
              <span>Entry Requirements by Level</span>
            </h3>
          </div>
          <button
            onClick={handleDownloadFormPDF}
            className="py-3 px-5 bg-[#0B3D27] hover:bg-emerald-900 text-[#D4AF37] font-bold text-xs rounded-xl transition-all shadow flex items-center justify-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Print Blank Admission Form (PDF)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
          <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-2">
            <div className="inline-block px-2.5 py-1 bg-[#0B3D27] text-white rounded-md text-[10px] font-bold uppercase tracking-wider">
              Early Years
            </div>
            <h4 className="font-bold text-[#0B3D27] text-base font-serif">Pre-Nursery (Ages 1 - 3 yrs)</h4>
            <p className="leading-relaxed text-slate-600">Toilet readiness encouragement, copy of child’s birth certificate, immunisation record, and 2 recent passport photographs.</p>
          </div>

          <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-100 space-y-2">
            <div className="inline-block px-2.5 py-1 bg-amber-700 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">
              Foundation
            </div>
            <h4 className="font-bold text-[#0B3D27] text-base font-serif">Nursery 1 - 3 (Ages 3 - 5 yrs)</h4>
            <p className="leading-relaxed text-slate-600">Basic language and cognitive readiness, birth certificate copy, 2 recent passport photographs, and previous school report if applicable.</p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="inline-block px-2.5 py-1 bg-slate-700 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">
              Primary Level
            </div>
            <h4 className="font-bold text-[#0B3D27] text-base font-serif">Primary 1 - 6 (Ages 5+ yrs)</h4>
            <p className="leading-relaxed text-slate-600">Interactive entrance assessment in Mathematics and English, previous academic transfer report slip, and 2 recent passport photographs.</p>
          </div>
        </div>
      </div>

      {/* Online Admission Application Form */}
      <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-[#D4AF37] shadow-xl max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
            Apply Online
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#0B3D27]">
            Direct Online Student Registration
          </h2>
          <p className="text-xs text-slate-600">
            Submit your child's details directly to our Admissions Officer for immediate processing.
          </p>
        </div>

        {formSubmitted ? (
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-8 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-serif text-[#0B3D27]">Application Submitted Successfully!</h3>
            <p className="text-xs text-slate-700 max-w-md mx-auto">
              Thank you, <strong>{formData.parentName}</strong>. Your application for <strong>{formData.applicantName}</strong> ({formData.proposedClass}) has been logged in our system. Our Admissions Officer will call you shortly at <strong>{formData.parentPhone}</strong> to schedule an assessment visit.
            </p>
            <button
              onClick={() => setFormSubmitted(false)}
              className="mt-4 bg-[#0B3D27] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-900 transition-colors"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pupil's Full Name *</label>
              <input
                type="text"
                required
                value={formData.applicantName}
                onChange={e => setFormData({ ...formData, applicantName: e.target.value })}
                placeholder="e.g. Osayande David Igbinoba"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D27] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D27] outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D27] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Proposed Class Level *</label>
              <select
                value={formData.proposedClass}
                onChange={e => setFormData({ ...formData, proposedClass: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D27] outline-none"
              >
                <option value="Pre-Nursery">Pre-Nursery (1-3 yrs)</option>
                <option value="Nursery 1">Nursery 1</option>
                <option value="Nursery 2">Nursery 2</option>
                <option value="Primary 1">Primary 1</option>
                <option value="Primary 2">Primary 2</option>
                <option value="Primary 3">Primary 3</option>
                <option value="Primary 4">Primary 4</option>
                <option value="Primary 5">Primary 5</option>
                <option value="Primary 6">Primary 6</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Name *</label>
              <input
                type="text"
                required
                value={formData.parentName}
                onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="e.g. Dr. & Mrs. Igbinoba"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D27] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parent Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.parentPhone}
                onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                placeholder="e.g. +234 803 123 4567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D27] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parent Email Address *</label>
              <input
                type="email"
                required
                value={formData.parentEmail}
                onChange={e => setFormData({ ...formData, parentEmail: e.target.value })}
                placeholder="e.g. parent@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D27] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="Address in Benin City"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D27] outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#0B3D27] hover:bg-emerald-900 text-[#D4AF37] font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Online Admission Application</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
