import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  HelpCircle,
  Sparkles,
  Send
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const AdmissionsPage: React.FC = () => {
  const { schoolInfo, submitAdmissionApp } = useSchool();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    childFullName: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female',
    applyingForClass: 'Primary 1',
    parentFullName: '',
    parentPhone: '',
    parentEmail: '',
    residentialAddress: '',
    previousSchool: '',
    specialNeedsOrAllergies: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAdmissionApp(formData);
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Admissions Portal
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Join the Sharon Brain Academy Family
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          We welcome applications for the {schoolInfo.academicSession} academic session into Creche,
          Nursery, Primary, and Junior Secondary classes.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-950">Application Successfully Submitted!</h2>
          <p className="text-xs text-emerald-800 max-w-lg mx-auto leading-relaxed">
            Thank you for choosing Sharon Brain Academy. Our admissions officer will review your application
            and contact you via phone ({formData.parentPhone}) and email to schedule the placement entrance assessment.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 transition"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base">Candidate Information</h3>
              <p className="text-xs text-slate-500">Details of the pupil/student applying</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Child's Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.childFullName}
                  onChange={(e) => setFormData({ ...formData, childFullName: e.target.value })}
                  placeholder="e.g. Osahon Emmanuel Osagie"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Class Applying For *
                </label>
                <select
                  value={formData.applyingForClass}
                  onChange={(e) => setFormData({ ...formData, applyingForClass: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Creche">Creche (3 months - 1.5 yrs)</option>
                  <option value="Nursery 1">Nursery 1</option>
                  <option value="Nursery 2">Nursery 2</option>
                  <option value="Kindergarten">Kindergarten</option>
                  <option value="Primary 1">Primary 1</option>
                  <option value="Primary 2">Primary 2</option>
                  <option value="Primary 3">Primary 3</option>
                  <option value="Primary 4">Primary 4</option>
                  <option value="Primary 5">Primary 5</option>
                  <option value="JSS 1">JSS 1</option>
                  <option value="JSS 2">JSS 2</option>
                  <option value="JSS 3">JSS 3</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="border-b border-slate-100 pb-4 pt-4">
              <h3 className="font-bold text-slate-900 text-base">Parent / Guardian Information</h3>
              <p className="text-xs text-slate-500">Contact details for admission updates</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Parent / Guardian Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.parentFullName}
                  onChange={(e) => setFormData({ ...formData, parentFullName: e.target.value })}
                  placeholder="e.g. Mr. & Mrs. Osagie"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  placeholder="e.g. +234 803 123 4567"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  placeholder="e.g. parent@gmail.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Residential Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.residentialAddress}
                  onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                  placeholder="e.g. Ugbowo, Benin City"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit Enrollment Application
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
