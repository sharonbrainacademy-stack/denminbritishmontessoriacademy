import React, { useState } from 'react';
import {
  UserCheck,
  BookOpen,
  Laptop,
  FileText,
  Calendar,
  Bell,
  CheckCircle,
  Plus,
  Save,
  Award,
  Clock,
  ShieldCheck,
  LogOut,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const StaffPortalPage: React.FC = () => {
  const { currentUser, logout, students, teachers, resultSlips, setResultSlips, cbtExams, setCbtExams } = useSchool();
  const [activeTab, setActiveTab] = useState<'scores' | 'cbt' | 'lessons' | 'attendance' | 'notices'>('scores');

  // Find logged-in teacher details or fallback to primary teacher
  const loggedInTeacher = teachers.find(t => t.email === currentUser?.email) || teachers[0];

  // Score Entry state for staff
  const [selectedClass, setSelectedClass] = useState<string>(loggedInTeacher?.assignedClass || 'Primary 5');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [term, setTerm] = useState('1st Term');
  const [session, setSession] = useState('2024/2025');

  const classStudents = students.filter(s => s.className === selectedClass);
  const currentStudent = students.find(s => s.id === selectedStudentId) || classStudents[0];

  // Score entry inputs
  const [scores, setScores] = useState<{ subject: string; caScore: number; examScore: number }[]>([
    { subject: 'Mathematics', caScore: 25, examScore: 60 },
    { subject: 'English Language', caScore: 24, examScore: 58 },
    { subject: 'Basic Science & Technology', caScore: 26, examScore: 62 },
    { subject: 'Social Studies & Civic', caScore: 22, examScore: 55 },
    { subject: 'Computer Studies & CBT', caScore: 28, examScore: 65 },
  ]);

  // Attendance logging
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [markedAttendance, setMarkedAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  // Lesson note submission
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonWeek, setLessonWeek] = useState('Week 1');
  const [lessonSubject, setLessonSubject] = useState('Mathematics');
  const [submittedLessons, setSubmittedLessons] = useState([
    { id: '1', title: 'Fraction & Decimal Conversions', subject: 'Mathematics', week: 'Week 1', status: 'Approved', date: '2026-09-10' },
    { id: '2', title: 'Parts of Speech & Diction Exercises', subject: 'English Language', week: 'Week 2', status: 'Pending Review', date: '2026-09-15' },
  ]);

  const handleScoreChange = (index: number, field: 'caScore' | 'examScore', val: number) => {
    const updated = [...scores];
    updated[index][field] = Math.max(0, field === 'caScore' ? Math.min(30, val) : Math.min(70, val));
    setScores(updated);
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const formattedSubjects = scores.map(s => {
      const total = (Number(s.caScore) || 0) + (Number(s.examScore) || 0);
      let grade = 'F';
      let remark = 'Needs Improvement';
      if (total >= 70) { grade = 'A'; remark = 'Excellent'; }
      else if (total >= 60) { grade = 'B'; remark = 'Very Good'; }
      else if (total >= 50) { grade = 'C'; remark = 'Credit'; }
      else if (total >= 40) { grade = 'P'; remark = 'Pass'; }

      return {
        subject: s.subject,
        caScore: Number(s.caScore) || 0,
        examScore: Number(s.examScore) || 0,
        total,
        grade,
        remark,
      };
    });

    const totalObtained = formattedSubjects.reduce((acc, curr) => acc + curr.total, 0);
    const totalPossible = formattedSubjects.length * 100;
    const average = Number((totalObtained / formattedSubjects.length).toFixed(1));

    const newSlip = {
      id: `res_${Date.now()}`,
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      admissionNo: currentStudent.admissionNo,
      className: currentStudent.className,
      academicSession: session,
      term,
      subjects: formattedSubjects,
      totalObtained,
      totalPossible,
      average,
      positionInClass: 1,
      totalStudentsInClass: classStudents.length || 20,
      teacherRemark: 'Hardworking pupil showing remarkable interest in STEM and Languages.',
      principalRemark: 'Promising academic performance. Approved by Executive Management.',
      published: true,
      attendancePresent: 62,
      attendanceTotal: 65,
      cognitiveSkills: {
        attentiveness: 5,
        honesty: 5,
        neatness: 4,
        politeness: 5,
        leadership: 4,
        cooperation: 5,
      },
    };

    const updatedResults = [newSlip, ...resultSlips.filter(r => r.studentId !== currentStudent.id || r.term !== term)];
    setResultSlips(updatedResults);
    alert(`Result slip for ${currentStudent.fullName} saved and published successfully!`);
  };

  const handleAddLessonNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle) return;

    setSubmittedLessons([
      {
        id: Date.now().toString(),
        title: lessonTitle,
        subject: lessonSubject,
        week: lessonWeek,
        status: 'Submitted for Review',
        date: new Date().toISOString().split('T')[0],
      },
      ...submittedLessons,
    ]);
    setLessonTitle('');
    alert('Lesson Plan submitted to Head Teacher for review!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner: Staff Profile & Identity Badge */}
      <div className="bg-[#0B3D27] text-white p-6 md:p-8 rounded-3xl border-2 border-[#D4AF37] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-lg shrink-0">
            <img
              src={loggedInTeacher?.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300'}
              alt={loggedInTeacher?.fullName || 'Staff Member'}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl font-bold font-serif text-[#F9F6EF]">
                Welcome, {loggedInTeacher?.fullName || 'Educator'}
              </h1>
              <span className="bg-[#D4AF37] text-[#0B3D27] text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Staff Portal
              </span>
            </div>
            <p className="text-xs text-emerald-200 font-semibold">
              {loggedInTeacher?.role || 'Senior Primary Educator'} • Staff ID: <strong className="text-white font-mono">{loggedInTeacher?.staffId || 'STF/DEN/012'}</strong>
            </p>
            <p className="text-xs text-emerald-100 flex flex-wrap items-center gap-1.5 pt-0.5">
              <span>Assigned Classes:</span>
              <strong className="text-[#D4AF37] bg-emerald-950/80 px-2 py-0.5 rounded-md border border-[#D4AF37]/30">
                {loggedInTeacher?.assignedClass || 'Primary 5'}
              </strong>
              <span>• Contact: {loggedInTeacher?.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => logout()}
            className="bg-emerald-900 hover:bg-emerald-800 text-emerald-100 font-bold text-xs px-4 py-2.5 rounded-xl border border-emerald-700 transition-all flex items-center gap-2 shadow"
          >
            <LogOut className="w-4 h-4 text-[#D4AF37]" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Staff Workspace Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'scores', label: '1. Score Entry (C.A. & Exams)', icon: Award },
          { id: 'cbt', label: '2. CBT Question Bank', icon: Laptop },
          { id: 'lessons', label: '3. Weekly Lesson Plans', icon: FileText },
          { id: 'attendance', label: '4. Pupil Daily Attendance', icon: UserCheck },
          { id: 'notices', label: '5. Management Circulars', icon: Bell },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-[#0B3D27] text-[#D4AF37] border-[#0B3D27] shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#D4AF37]' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SCORE ENTRY & C.A. ASSESSMENT */}
      {activeTab === 'scores' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#0B3D27]">Pupil Termly Score Entry</h2>
              <p className="text-xs text-slate-600">Enter Continuous Assessment (30%) & Exam (70%) test scores for pupils</p>
            </div>
            <div className="flex items-center gap-2 text-xs bg-emerald-50 text-[#0B3D27] font-bold p-3 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Direct Sync to Verified Student Result Slips</span>
            </div>
          </div>

          <form onSubmit={handleSaveResult} className="space-y-6">
            {/* Student & Term Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <label className="block font-bold text-[#0B3D27] mb-1">Select Class Cadre</label>
                <select
                  value={selectedClass}
                  onChange={e => {
                    const newClass = e.target.value;
                    setSelectedClass(newClass);
                    const firstInClass = students.find(s => s.className === newClass);
                    if (firstInClass) setSelectedStudentId(firstInClass.id);
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold text-[#0B3D27]"
                >
                  {['Pre-Nursery', 'Nursery 1', 'Nursery 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#0B3D27] mb-1">Select Admitted Pupil</label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-800"
                >
                  {classStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.admissionNo}) — {s.className}
                    </option>
                  ))}
                  {classStudents.length === 0 && (
                    <option value="">No registered pupils in {selectedClass}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0B3D27] mb-1">Academic Term</label>
                <select
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
                >
                  <option value="1st Term">1st Term</option>
                  <option value="2nd Term">2nd Term</option>
                  <option value="3rd Term">3rd Term</option>
                </select>
              </div>
            </div>

            {/* Selected Student Card */}
            {currentStudent && (
              <div className="bg-emerald-50 border-2 border-[#D4AF37] p-4 rounded-2xl flex items-center gap-4">
                <img
                  src={currentStudent.passportPhotoUrl}
                  alt={currentStudent.fullName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-md shrink-0"
                />
                <div className="grow space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0B3D27] text-sm font-serif">{currentStudent.fullName}</span>
                    <span className="bg-emerald-200 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      ✓ ADMITTED PUPIL
                    </span>
                  </div>
                  <p className="text-slate-600 font-mono">
                    Admission No: <strong className="text-[#0B3D27]">{currentStudent.admissionNo}</strong> | Class: <strong>{currentStudent.className}</strong>
                  </p>
                  <p className="text-slate-600">
                    Parent / Guardian: {currentStudent.parentName} ({currentStudent.parentPhone})
                  </p>
                </div>
              </div>
            )}

            {/* Subject Marks Entry Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B3D27] text-white font-serif uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Subject</th>
                    <th className="p-3.5 w-32 text-center">C.A. Score (Max 30)</th>
                    <th className="p-3.5 w-32 text-center">Exam Score (Max 70)</th>
                    <th className="p-3.5 w-28 text-center">Total (100)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {scores.map((sc, idx) => {
                    const total = (Number(sc.caScore) || 0) + (Number(sc.examScore) || 0);
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-[#0B3D27]">{sc.subject}</td>
                        <td className="p-3.5 text-center">
                          <input
                            type="number"
                            min={0}
                            max={30}
                            value={sc.caScore}
                            onChange={e => handleScoreChange(idx, 'caScore', Number(e.target.value))}
                            className="w-20 p-2 text-center font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B3D27] outline-none"
                          />
                        </td>
                        <td className="p-3.5 text-center">
                          <input
                            type="number"
                            min={0}
                            max={70}
                            value={sc.examScore}
                            onChange={e => handleScoreChange(idx, 'examScore', Number(e.target.value))}
                            className="w-20 p-2 text-center font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B3D27] outline-none"
                          />
                        </td>
                        <td className="p-3.5 text-center font-bold text-sm text-[#0B3D27]">
                          {total}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#0B3D27] hover:bg-emerald-900 text-[#D4AF37] font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5 text-[#D4AF37]" />
              <span>Save & Publish Pupil Result Slip</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: CBT QUESTION BANK & EXAMS */}
      {activeTab === 'cbt' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#0B3D27]">CBT Examination Portal Manager</h2>
              <p className="text-xs text-slate-600">Review scheduled online CBT exams and questions for your assigned subjects</p>
            </div>
            <div className="bg-amber-100 text-amber-900 font-bold text-xs px-3.5 py-2 rounded-xl">
              Active CBT Session: {cbtExams.length} Scheduled Exams
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cbtExams.map(ex => (
              <div key={ex.id} className="p-5 rounded-2xl border-2 border-slate-200 space-y-3 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B3D27] bg-emerald-100 px-3 py-1 rounded-full font-serif">
                    {ex.className} • {ex.subject}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {ex.durationMinutes} Mins
                  </span>
                </div>
                <h3 className="font-bold font-serif text-base text-slate-900">{ex.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ex.instructions}</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700 font-bold">
                  <span>Questions: {ex.questions.length} Items</span>
                  <span>Pass Mark: {ex.passMarkPercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LESSON PLAN & SCHEME OF WORK */}
      {activeTab === 'lessons' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold font-serif text-[#0B3D27]">Weekly Lesson Plans & Scheme of Work</h2>
            <p className="text-xs text-slate-600">Submit weekly teaching plans for administrative approval</p>
          </div>

          <form onSubmit={handleAddLessonNote} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-[#0B3D27] font-serif">Submit New Lesson Note</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Week</label>
                <select
                  value={lessonWeek}
                  onChange={e => setLessonWeek(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
                >
                  {['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10'].map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={lessonSubject}
                  onChange={e => setLessonSubject(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="English Language">English Language</option>
                  <option value="Basic Science">Basic Science</option>
                  <option value="Computer Studies">Computer Studies</option>
                  <option value="Social Studies">Social Studies</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Topic / Title</label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={e => setLessonTitle(e.target.value)}
                  placeholder="e.g. Long Division & Algebraic Equations"
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0B3D27] text-[#D4AF37] font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Lesson Note</span>
            </button>
          </form>

          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[#0B3D27] font-serif">Submitted Lesson Plans</h3>
            <div className="space-y-2">
              {submittedLessons.map(les => (
                <div key={les.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs bg-white">
                  <div>
                    <h4 className="font-bold text-[#0B3D27] text-sm">{les.title}</h4>
                    <p className="text-slate-500">{les.subject} • {les.week} • Submitted on {les.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                    les.status === 'Approved' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {les.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PUPIL DAILY ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#0B3D27]">Classroom Attendance Register</h2>
              <p className="text-xs text-slate-600">Mark daily attendance for pupils in {selectedClass}</p>
            </div>
            <input
              type="date"
              value={attendanceDate}
              onChange={e => setAttendanceDate(e.target.value)}
              className="p-2.5 border border-slate-300 rounded-xl font-bold text-xs text-[#0B3D27] bg-slate-50"
            />
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B3D27] text-white font-serif uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Pupil Name</th>
                  <th className="p-3.5">Admission No</th>
                  <th className="p-3.5 text-center">Status Marker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {classStudents.map(s => {
                  const status = markedAttendance[s.id] || 'present';
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-[#0B3D27]">{s.fullName}</td>
                      <td className="p-3.5 font-mono text-slate-600">{s.admissionNo}</td>
                      <td className="p-3.5 text-center">
                        <div className="inline-flex items-center gap-2">
                          {(['present', 'absent', 'late'] as const).map(st => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setMarkedAttendance({ ...markedAttendance, [s.id]: st })}
                              className={`px-3 py-1 rounded-lg text-[11px] font-bold capitalize transition-all border ${
                                status === st
                                  ? st === 'present' ? 'bg-emerald-800 text-white border-emerald-800' : st === 'absent' ? 'bg-red-700 text-white border-red-700' : 'bg-amber-600 text-white border-amber-600'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => alert(`Attendance for ${classStudents.length} pupils saved for ${attendanceDate}!`)}
            className="w-full py-3.5 bg-[#0B3D27] text-[#D4AF37] font-bold text-sm rounded-2xl shadow-md"
          >
            Save Classroom Register
          </button>
        </div>
      )}

      {/* TAB 5: MANAGEMENT CIRCULARS */}
      {activeTab === 'notices' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold font-serif text-[#0B3D27]">Management Circulars & Staff Directives</h2>
            <p className="text-xs text-slate-600">Official directives from the School Proprietress and Academic Directorate</p>
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0B3D27] text-sm font-serif">1st Term Examination Schedule & C.A. Deadline</span>
                <span className="text-[10px] bg-[#0B3D27] text-[#D4AF37] font-bold px-2.5 py-0.5 rounded-full">
                  HIGH PRIORITY
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                All class teachers and subject educators are requested to finalize continuous assessment score entries by Friday. CBT exams will commence on Monday for primary cadres.
              </p>
              <p className="text-[11px] text-emerald-800 font-semibold pt-1">
                Issued by: Executive Directorate • Date: 2026-09-14
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0B3D27] text-sm font-serif">Montessori Practical Training Workshop</span>
                <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2.5 py-0.5 rounded-full">
                  GENERAL NOTICE
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                All early years and nursery teachers are invited to the Montessori Practical Life workshop in the Sensory Lab on Saturday morning.
              </p>
              <p className="text-[11px] text-slate-500 font-semibold pt-1">
                Issued by: Head of Early Years • Date: 2026-09-12
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
