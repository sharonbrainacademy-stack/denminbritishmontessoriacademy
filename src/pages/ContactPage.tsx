import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  Building,
  Navigation,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const ContactPage: React.FC = () => {
  const { schoolInfo } = useSchool();
  const [formSent, setFormSent] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Page Header */}
      <div className="bg-[#0B3D27] text-white p-8 md:p-12 rounded-3xl border-2 border-[#D4AF37] shadow-xl text-center space-y-3">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
          We Would Love to Hear From You
        </span>
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-[#F9F6EF]">
          Contact Us & Visit Campus
        </h1>
        <p className="text-sm md:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
          Located opposite UNIBEN Main Gate in Ugbowo, Benin City. Drop by for a guided tour or send us an inquiry online.
        </p>
      </div>

      {/* Main Grid: Contact Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-[#0B3D27] text-white p-8 rounded-3xl border-2 border-[#D4AF37] shadow-lg space-y-6">
          <div>
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-serif">
              Official Details
            </span>
            <h3 className="text-2xl font-bold font-serif text-[#F9F6EF] mt-1">
              Denmin British Montessori Academy
            </h3>
          </div>

          <ul className="space-y-4 text-xs text-emerald-100">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#D4AF37] text-[#0B3D27] rounded-lg flex items-center justify-center shrink-0 font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-[#D4AF37] text-sm font-serif">Campus Address</strong>
                <span>72, 19th Street, Opposite UNIBEN Main Gate, Ugbowo, Benin City, Edo State, Nigeria.</span>
              </div>
            </li>

            <li className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#D4AF37] text-[#0B3D27] rounded-lg flex items-center justify-center shrink-0 font-bold">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-[#D4AF37] text-sm font-serif">Phone Number</strong>
                <a href={`tel:${schoolInfo.phone}`} className="hover:text-white">{schoolInfo.phone}</a>
              </div>
            </li>

            <li className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#D4AF37] text-[#0B3D27] rounded-lg flex items-center justify-center shrink-0 font-bold">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-[#D4AF37] text-sm font-serif">Email Address</strong>
                <a href={`mailto:${schoolInfo.email}`} className="hover:text-white">{schoolInfo.email}</a>
              </div>
            </li>

            <li className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#D4AF37] text-[#0B3D27] rounded-lg flex items-center justify-center shrink-0 font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-[#D4AF37] text-sm font-serif">Office Hours</strong>
                <span>Monday - Friday: 7:30 AM - 4:00 PM</span>
              </div>
            </li>
          </ul>

          <div className="pt-4 border-t border-emerald-800">
            <a
              href={`https://wa.me/${schoolInfo.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Instant WhatsApp Chat</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
              Inquiry Form
            </span>
            <h3 className="text-2xl font-bold font-serif text-[#0B3D27]">
              Send Us a Message
            </h3>
            <p className="text-xs text-slate-600">
              Our administrative staff will respond to your email or call within 24 hours.
            </p>
          </div>

          {formSent ? (
            <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-[#0B3D27] text-base">Message Sent Successfully!</h4>
              <p className="text-xs text-slate-600">
                Thank you for contacting Denmin British Montessori Academy. We will be in touch shortly.
              </p>
              <button
                onClick={() => setFormSent(false)}
                className="mt-3 text-xs font-bold text-[#0B3D27] underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={contactData.name}
                    onChange={e => setContactData({ ...contactData, name: e.target.value })}
                    placeholder="e.g. Engr. Osaigbovo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D27] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={contactData.email}
                    onChange={e => setContactData({ ...contactData, email: e.target.value })}
                    placeholder="e.g. parent@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D27] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={contactData.phone}
                    onChange={e => setContactData({ ...contactData, phone: e.target.value })}
                    placeholder="e.g. +234 803 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D27] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={contactData.subject}
                    onChange={e => setContactData({ ...contactData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D27] outline-none"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Admission Inquiry">Admission Inquiry</option>
                    <option value="School Tour Schedule">Schedule Campus Tour</option>
                    <option value="CBT & Result Portal Support">CBT & Portal Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Message / Inquiry *</label>
                <textarea
                  required
                  rows={4}
                  value={contactData.message}
                  onChange={e => setContactData({ ...contactData, message: e.target.value })}
                  placeholder="How can we assist you?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D27] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0B3D27] hover:bg-emerald-900 text-[#D4AF37] font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Embedded Google Map Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#0B3D27]" />
            <h3 className="font-serif font-bold text-base text-[#0B3D27]">
              Interactive Location Map — Benin City, Edo State
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Opposite UNIBEN Main Gate</span>
        </div>

        <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
          <iframe
            title="Denmin British Montessori Academy Location Map"
            src="https://maps.google.com/maps?q=Benin%20City%20UNIBEN%20Main%20Gate%20Ugbowo&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
