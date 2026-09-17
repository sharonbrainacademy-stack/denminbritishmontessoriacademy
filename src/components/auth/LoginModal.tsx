import React, { useState } from 'react';
import { X, ShieldCheck, GraduationCap, UserCheck, KeyRound, AlertCircle } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { initialUsers } from '../../data/initialData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login } = useSchool();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'teacher' | 'student' | 'parent'>('student');
  const [identifier, setIdentifier] = useState('DEN/2024/001');
  const [password, setPassword] = useState('student123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRoleSelect = (role: 'admin' | 'teacher' | 'student' | 'parent') => {
    setSelectedRole(role);
    setError('');
    if (role === 'admin') {
      setIdentifier('admin@denmin.edu');
      setPassword('admin123');
    } else if (role === 'teacher') {
      setIdentifier('teacher@denmin.edu');
      setPassword('teacher123');
    } else if (role === 'student') {
      setIdentifier('DEN/2024/001');
      setPassword('student123');
    } else if (role === 'parent') {
      setIdentifier('parent@denmin.edu');
      setPassword('parent123');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Find demo user or generate dynamic session
    const match = initialUsers.find(u => u.role === selectedRole);
    if (match) {
      login(match);
      onLoginSuccess(selectedRole);
      onClose();
    } else {
      // Fallback
      login({
        id: `usr_${Date.now()}`,
        name: selectedRole.toUpperCase() + ' User',
        email: identifier,
        role: selectedRole,
        admissionNo: selectedRole === 'student' ? identifier : undefined,
      });
      onLoginSuccess(selectedRole);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#D4AF37]/30 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0B3D27] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4AF37] text-[#0B3D27] rounded-xl flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-[#F9F6EF]">School Portal Login</h3>
              <p className="text-xs text-emerald-200">Denmin British Montessori Academy</p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Role Switcher Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Your User Type:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'student', label: 'Student CBT & Result', icon: GraduationCap },
                { id: 'parent', label: 'Parent Portal', icon: UserCheck },
                { id: 'teacher', label: 'Teacher / Staff', icon: KeyRound },
                { id: 'admin', label: 'School Admin', icon: ShieldCheck },
              ].map(r => {
                const IconComponent = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
                      isSelected
                        ? 'bg-[#0B3D27] text-white border-[#0B3D27] shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[#D4AF37]' : 'text-slate-500'}`} />
                    <span className="truncate">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {selectedRole === 'student' ? 'Admission Number' : 'Email or Username'}
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder={selectedRole === 'student' ? 'e.g. DEN/2024/001' : 'e.g. admin@denmin.edu'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D27]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D27]"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Demo Quick Auto-Fill Hint */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-snug">
              <span className="font-bold text-[#0B3D27]">Demo Mode Active:</span> Pre-filled with credentials for instant access. Click Login below to proceed!
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0B3D27] hover:bg-emerald-900 text-[#D4AF37] font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Log In to {selectedRole.toUpperCase()} Dashboard</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
