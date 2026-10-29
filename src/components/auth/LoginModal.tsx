import React, { useState } from 'react';
import {
  X,
  LogIn,
  Shield,
  UserCheck,
  GraduationCap,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { initialUsers } from '../../data/initialData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [roleTab, setRoleTab] = useState<'admin' | 'staff' | 'student'>('admin');
  const [emailOrAdmNo, setEmailOrAdmNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, students } = useSchool();

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (roleTab === 'admin') {
      const adminUser = initialUsers.find((u) => u.role === 'admin');
      if (adminUser) {
        login(adminUser);
        onSuccess('admin');
        onClose();
        return;
      }
    }

    if (roleTab === 'staff') {
      const teacherUser = initialUsers.find((u) => u.role === 'teacher');
      if (teacherUser) {
        login(teacherUser);
        onSuccess('staff');
        onClose();
        return;
      }
    }

    if (roleTab === 'student') {
      const cleanInput = emailOrAdmNo.trim().toUpperCase();
      if (!cleanInput) {
        setError('Please enter your Admission Number or Student Email.');
        return;
      }

      // Find genuine student in context
      const match = students.find(
        (s) =>
          (s.admissionNumber || s.admissionNo || '').toUpperCase() === cleanInput ||
          (s.parentEmail || '').toUpperCase() === cleanInput
      );

      if (match) {
        const adm = match.admissionNumber || match.admissionNo || '';
        login({
          id: `usr_${match.id}`,
          name: match.fullName,
          email: `${adm.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.sharonbrainacademy.edu.ng`,
          role: 'student',
          studentId: match.id,
          admissionNumber: adm,
          avatarUrl: match.passportPhotoUrl || match.passportUrl,
        });
        onSuccess('student');
        onClose();
      } else {
        setError(`No active student found with Admission No: "${cleanInput}". Please check the spelling or contact the school office.`);
      }
    }
  };

  const handleQuickFill = (role: 'admin' | 'staff') => {
    setRoleTab(role);
    if (role === 'admin') {
      setEmailOrAdmNo('admin@sharonbrainacademy.edu.ng');
      setPassword('admin123');
    } else {
      setEmailOrAdmNo('teacher@sharonbrainacademy.edu.ng');
      setPassword('teacher123');
    }
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Portal Sign In</h3>
              <p className="text-xs text-slate-400">Sharon Brain Academy Management</p>
            </div>
          </div>
        </div>

        {/* Role tabs */}
        <div className="grid grid-cols-3 bg-slate-100 p-1 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setRoleTab('admin');
              setError('');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              roleTab === 'admin'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-rose-600" /> Admin
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleTab('staff');
              setError('');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              roleTab === 'staff'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Staff
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleTab('student');
              setError('');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              roleTab === 'student'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> Student
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {roleTab === 'student' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Student Admission Number
              </label>
              <input
                type="text"
                value={emailOrAdmNo}
                onChange={(e) => setEmailOrAdmNo(e.target.value)}
                placeholder="e.g. SBA/2024/001"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Enter the official Sharon Brain Academy admission number given on your admission letter.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={emailOrAdmNo}
                  onChange={(e) => setEmailOrAdmNo(e.target.value)}
                  placeholder={roleTab === 'admin' ? 'admin@sharonbrainacademy.edu.ng' : 'teacher@sharonbrainacademy.edu.ng'}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Quick login helpers for admin and staff */}
              <div className="pt-1">
                <span className="text-[11px] text-slate-500 block mb-1">Quick Login:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin')}
                    className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  >
                    Load Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('staff')}
                    className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  >
                    Load Staff
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow transition flex items-center justify-center gap-2 text-sm"
            >
              <LogIn className="w-4 h-4" />
              Sign In to {roleTab.toUpperCase()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
