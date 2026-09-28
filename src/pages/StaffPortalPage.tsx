import React, { useState, useEffect } from 'react';
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
  ClipboardList,
  WifiOff,
  Wifi,
  Search,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { StudentAttendanceRecord, StaffAttendanceRecord, TeachingMaterial } from '../types';

export const StaffPortalPage: React.FC = () => {
  const {
    currentUser,
    logout,
    students,
    teachers,
    resultSlips,
    saveResultSlip,
    cbtExams,
    studentAttendance,
    markStudentAttendance,
    staffAttendance,
    markStaffAttendance,
    teachingMaterials,
    saveTeachingMaterial,
    isOffline,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'scores' | 'cbt' | 'lessons' | 'pupil_attendance' | 'staff_attendance' | 'notices'>('scores');

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

  // Attendance logging (Pupils)
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [markedAttendance, setMarkedAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [attendanceSaveMessage, setAttendanceSaveMessage] = useState<string | null>(null);

  // Load existing pupil attendance for selected date & class
  useEffect(() => {
    const existingForDay = studentAttendance.filter(
      r => r.date === attendanceDate && r.className === selectedClass
    );
    const initialMap: Record<string, 'present' | 'absent' | 'late'> = {};
    if (existingForDay.length > 0) {
      existingForDay.forEach(r => {
        initialMap[r.studentId] = r.status;
      });
    } else {
      classStudents.forEach(s => {
        initialMap[s.id] = 'present';
      });
    }
    setMarkedAttendance(initialMap);
  }, [attendanceDate, selectedClass, studentAttendance.length]);

  // Staff Attendance Logging
  const [staffClockInNotes, setStaffClockInNotes] = useState('');
  const [staffClockInMessage, setStaffClockInMessage] = useState<string | null>(null);

  // Teaching materials search & filter
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');
  const [searchMaterialQuery, setSearchMaterialQuery] = useState('');
  const [activeMaterialModal, setActiveMaterialModal] = useState<TeachingMaterial | null>(null);

  // New Teaching Material / Lesson Note Form
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    subject: 'Mathematics',
    className: selectedClass || 'Primary 5',
    term: '1st Term',
    week: 'Week 1',
    category: 'Lesson Note' as const,
    topic: '',
    learningObjectivesText: '1. Understand foundational principles.\n2. Execute practice exercises accurately.\n3. Demonstrate practical application.',
    materialsNeededText: 'Whiteboard, student workbooks, tactile Montessori learning aids.',
    keyConcepts: '',
    presentationStepsText: 'Step 1: Introduction and previous knowledge recall.\nStep 2: Demonstration of core lesson concept.\nStep 3: Guided classroom activity in small groups.\nStep 4: Independent evaluation and summary.',
    evaluationQuestionsText: '1. Define the primary concept discussed.\n2. Solve exercise problem #1.',
  });

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
      let grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' = 'F';
      let remark = 'Needs Improvement';
      if (total >= 70) { grade = 'A'; remark = 'Excellent'; }
      else if (total >= 60) { grade = 'B'; remark = 'Very Good'; }
      else if (total >= 50) { grade = 'C'; remark = 'Credit'; }
      else if (total >= 40) { grade = 'D'; remark = 'Pass'; }

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
      term: term as '1st Term' | '2nd Term' | '3rd Term',
      subjects: formattedSubjects,
      totalObtained,
      totalPossible,
      average,
      positionInClass: 1,
      totalStudentsInClass: classStudents.length || 20,
      classTeacherRemark: 'Hardworking pupil showing remarkable interest in STEM and Languages.',
      principalRemark: 'Promising academic performance. Approved by Executive Management.',
      isPublished: true,
      publishedAt: new Date().toISOString().split('T')[0],
      attendancePresent: 62,
      attendanceTotal: 65,
    };

    saveResultSlip(newSlip);
    alert(`Result slip for ${currentStudent.fullName} saved and published! (Stored safely offline & queued for cloud sync)`);
  };

  // Save Pupil Attendance
  const handleSavePupilAttendance = () => {
    if (classStudents.length === 0) return;

    const records: StudentAttendanceRecord[] = classStudents.map(s => ({
      id: `att_std_${attendanceDate}_${s.id}`,
      date: attendanceDate,
      className: selectedClass,
      studentId: s.id,
      studentName: s.fullName,
      admissionNo: s.admissionNo,
      status: markedAttendance[s.id] || 'present',
      markedBy: loggedInTeacher?.fullName || 'Class Teacher',
      timestamp: new Date().toISOString(),
    }));

    markStudentAttendance(records);
    const presentCount = records.filter(r => r.status === 'present').length;
    const absentCount = records.filter(r => r.status === 'absent').length;
    const lateCount = records.filter(r => r.status === 'late').length;

    setAttendanceSaveMessage(
      `✓ Attendance for ${records.length} pupils saved! (${presentCount} Present, ${absentCount} Absent, ${lateCount} Late). Saved offline and will sync to school database.`
    );
    setTimeout(() => setAttendanceSaveMessage(null), 6000);
  };

  // Staff Clock-In Handler
  const handleStaffClockIn = (status: 'present' | 'late' | 'on-leave') => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    markStaffAttendance({
      date: attendanceDate,
      staffId: loggedInTeacher?.staffId || 'STF/DEN/012',
      staffName: loggedInTeacher?.fullName || 'Staff Member',
      role: loggedInTeacher?.role || 'Educator',
      status,
      timeIn: timeNow,
      notes: staffClockInNotes || (status === 'present' ? 'Signed in on time.' : status === 'late' ? 'Signed in late.' : 'On approved leave.'),
    });

    setStaffClockInMessage(`✓ You have clocked in as "${status.toUpperCase()}" at ${timeNow}! (Stored offline and active on school records).`);
    setStaffClockInNotes('');
    setTimeout(() => setStaffClockInMessage(null), 6000);
  };

  // Submit New Teaching Material / Lesson Note
  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.title || !newMaterial.topic) return;

    saveTeachingMaterial({
      title: newMaterial.title,
      subject: newMaterial.subject,
      className: newMaterial.className,
      term: newMaterial.term,
      week: newMaterial.week,
      category: newMaterial.category,
      topic: newMaterial.topic,
      learningObjectives: newMaterial.learningObjectivesText.split('\n').filter(Boolean),
      materialsNeeded: newMaterial.materialsNeededText.split('\n').filter(Boolean),
      keyConcepts: newMaterial.keyConcepts || newMaterial.topic,
      presentationSteps: newMaterial.presentationStepsText.split('\n').filter(Boolean),
      evaluationQuestions: newMaterial.evaluationQuestionsText.split('\n').filter(Boolean),
      authorStaffName: loggedInTeacher?.fullName || 'Educator',
    });

    setShowAddMaterialModal(false);
    alert('Lesson Material created and saved! Fully available offline for lesson delivery.');
  };

  // Filtered Teaching Materials
  const filteredMaterials = teachingMaterials.filter(m => {
    if (selectedSubjectFilter !== 'All' && m.subject !== selectedSubjectFilter) return false;
    if (searchMaterialQuery.trim()) {
      const q = searchMaterialQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.topic.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.className.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Offline Status Badge Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 text-xs font-semibold ${
        isOffline
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-900'
          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900'
      }`}>
        <div className="flex items-center gap-2.5">
          {isOffline ? (
            <WifiOff className="w-5 h-5 text-amber-600 shrink-0" />
          ) : (
            <Wifi className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <div>
            <p className="font-bold">
              {isOffline ? 'Offline Operating Mode Active' : 'Online & Synchronized with Cloud Database'}
            </p>
            <p className="text-[11px] text-slate-600">
              {isOffline
                ? 'All operations (marking pupil & staff attendance, conducting CBT, scoring, lesson notes) work 100% offline. Data is saved on this device and syncs when reconnected.'
                : 'All changes are instantly saved locally and synced to Firebase Firestore.'}
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
          isOffline ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
        }`}>
          {isOffline ? 'OFFLINE READY' : 'ONLINE SYNC'}
        </span>
      </div>

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
              <span>Assigned Class:</span>
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
          { id: 'lessons', label: '3. Lesson Plans & Teaching Materials', icon: FileText },
          { id: 'pupil_attendance', label: '4. Pupil Daily Attendance', icon: UserCheck },
          { id: 'staff_attendance', label: '5. Staff Clock-In / Register', icon: Clock },
          { id: 'notices', label: '6. Directives', icon: Bell },
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
              <span>Direct Sync to Verified Student Result Slips (Offline Capable)</span>
            </div>
          </div>

          <form onSubmit={handleSaveResult} className="space-y-6">
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

              <div>
                <label className="block font-bold text-[#0B3D27] mb-1">Select Pupil</label>
                <select
                  value={selectedStudentId || currentStudent?.id || ''}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold text-[#0B3D27]"
                >
                  {classStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.admissionNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0B3D27] mb-1">Academic Session</label>
                <select
                  value={session}
                  onChange={e => setSession(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold text-[#0B3D27]"
                >
                  <option value="2024/2025">2024/2025</option>
                  <option value="2025/2026">2025/2026</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0B3D27] mb-1">Academic Term</label>
                <select
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold text-[#0B3D27]"
                >
                  <option value="1st Term">1st Term</option>
                  <option value="2nd Term">2nd Term</option>
                  <option value="3rd Term">3rd Term</option>
                </select>
              </div>
            </div>

            {/* Scores Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B3D27] text-white font-serif uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Subject</th>
                    <th className="p-3.5 text-center">C.A (Max 30)</th>
                    <th className="p-3.5 text-center">Exam (Max 70)</th>
                    <th className="p-3.5 text-center">Total (100)</th>
                    <th className="p-3.5 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {scores.map((s, idx) => {
                    const total = s.caScore + s.examScore;
                    let grade = 'F';
                    if (total >= 70) grade = 'A';
                    else if (total >= 60) grade = 'B';
                    else if (total >= 50) grade = 'C';
                    else if (total >= 40) grade = 'D';

                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-[#0B3D27]">{s.subject}</td>
                        <td className="p-3.5 text-center">
                          <input
                            type="number"
                            min={0}
                            max={30}
                            value={s.caScore}
                            onChange={e => handleScoreChange(idx, 'caScore', Number(e.target.value))}
                            className="w-16 p-1.5 border border-slate-300 rounded-lg text-center font-bold"
                          />
                        </td>
                        <td className="p-3.5 text-center">
                          <input
                            type="number"
                            min={0}
                            max={70}
                            value={s.examScore}
                            onChange={e => handleScoreChange(idx, 'examScore', Number(e.target.value))}
                            className="w-16 p-1.5 border border-slate-300 rounded-lg text-center font-bold"
                          />
                        </td>
                        <td className="p-3.5 text-center font-mono font-bold text-[#0B3D27]">{total}</td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            grade === 'A' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0B3D27] text-[#D4AF37] font-bold text-sm rounded-2xl shadow-md hover:bg-emerald-950 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Pupil Result Slip</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: CBT QUESTION BANK */}
      {activeTab === 'cbt' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#0B3D27]">CBT Question Bank & Active Exams</h2>
              <p className="text-xs text-slate-600">Review computer-based tests scheduled for offline or online evaluation</p>
            </div>
            <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-bold">
              {cbtExams.length} Available CBT Exams
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
                  <span>Pass Mark: {ex.passingScorePercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LESSON PLANS & OFFLINE TEACHING MATERIALS */}
      {activeTab === 'lessons' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#0B3D27]">Teaching Materials & Schemes of Work Library</h2>
              <p className="text-xs text-slate-600">Curriculum guides, weekly lesson notes, and instructional materials accessible 100% offline</p>
            </div>
            <button
              onClick={() => setShowAddMaterialModal(true)}
              className="bg-[#0B3D27] text-[#D4AF37] hover:bg-emerald-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Lesson Note / Material</span>
            </button>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchMaterialQuery}
                onChange={e => setSearchMaterialQuery(e.target.value)}
                placeholder="Search offline materials by topic, subject, or keyword..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl outline-none"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedSubjectFilter}
                onChange={e => setSelectedSubjectFilter(e.target.value)}
                className="text-xs p-2 border border-slate-300 rounded-xl bg-slate-50 font-semibold"
              >
                <option value="All">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English Language">English Language</option>
                <option value="Computer Studies">Computer Studies</option>
                <option value="Montessori Curriculum">Montessori Curriculum</option>
              </select>
            </div>
          </div>

          {/* Material Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMaterials.map(mat => (
              <div
                key={mat.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#D4AF37] transition-all space-y-3 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 uppercase">
                      {mat.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">{mat.week} • {mat.term}</span>
                  </div>
                  <h3 className="font-bold text-[#0B3D27] font-serif text-sm leading-snug">{mat.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{mat.topic} — {mat.keyConcepts}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-semibold">{mat.subject} ({mat.className})</span>
                  <button
                    onClick={() => setActiveMaterialModal(mat)}
                    className="text-[#0B3D27] hover:text-emerald-700 font-bold flex items-center gap-1 underline"
                  >
                    <span>View Lesson Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PUPIL DAILY ATTENDANCE REGISTER */}
      {activeTab === 'pupil_attendance' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#0B3D27]">Classroom Attendance Register</h2>
              <p className="text-xs text-slate-600">Mark daily attendance for pupils in {selectedClass} (Offline Enabled)</p>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Register Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={e => setAttendanceDate(e.target.value)}
                  className="p-2 border border-slate-300 rounded-xl font-bold text-xs text-[#0B3D27] bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Class</label>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="p-2 border border-slate-300 rounded-xl font-bold text-xs text-[#0B3D27] bg-slate-50"
                >
                  {['Pre-Nursery', 'Nursery 1', 'Nursery 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JSS 1', 'JSS 2', 'JSS 3'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {attendanceSaveMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{attendanceSaveMessage}</span>
            </div>
          )}

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-800">Present</span>
              <p className="text-lg font-bold text-emerald-900">
                {classStudents.filter(s => (markedAttendance[s.id] || 'present') === 'present').length}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-xl border border-red-200">
              <span className="text-[11px] font-bold text-red-800">Absent</span>
              <p className="text-lg font-bold text-red-900">
                {classStudents.filter(s => markedAttendance[s.id] === 'absent').length}
              </p>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <span className="text-[11px] font-bold text-amber-800">Late</span>
              <p className="text-lg font-bold text-amber-900">
                {classStudents.filter(s => markedAttendance[s.id] === 'late').length}
              </p>
            </div>
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
                        <div className="inline-flex items-center gap-1.5">
                          {(['present', 'absent', 'late'] as const).map(st => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setMarkedAttendance({ ...markedAttendance, [s.id]: st })}
                              className={`px-3 py-1 rounded-lg text-[11px] font-bold capitalize transition-all border ${
                                status === st
                                  ? st === 'present'
                                    ? 'bg-emerald-800 text-white border-emerald-800'
                                    : st === 'absent'
                                    ? 'bg-red-700 text-white border-red-700'
                                    : 'bg-amber-600 text-white border-amber-600'
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
            onClick={handleSavePupilAttendance}
            className="w-full py-3.5 bg-[#0B3D27] text-[#D4AF37] font-bold text-sm rounded-2xl shadow-md hover:bg-emerald-950 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Classroom Register (Offline & Sync)</span>
          </button>
        </div>
      )}

      {/* TAB 5: STAFF CLOCK-IN & DAILY STAFF REGISTER */}
      {activeTab === 'staff_attendance' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold font-serif text-[#0B3D27]">Staff Attendance & Daily Clock-In</h2>
            <p className="text-xs text-slate-600">Mark staff daily clock-in offline or review school-wide staff roster</p>
          </div>

          {staffClockInMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{staffClockInMessage}</span>
            </div>
          )}

          {/* Clock In Action Card */}
          <div className="bg-emerald-950 text-white p-6 rounded-2xl border-2 border-[#D4AF37] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                  Self Clock-In Terminal
                </span>
                <h3 className="text-lg font-bold font-serif">{loggedInTeacher?.fullName}</h3>
                <p className="text-xs text-emerald-200 font-mono">Staff ID: {loggedInTeacher?.staffId} • Date: {attendanceDate}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-[#D4AF37]">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Duty Notes / Special Remarks (Optional)</label>
              <input
                type="text"
                value={staffClockInNotes}
                onChange={e => setStaffClockInNotes(e.target.value)}
                placeholder="e.g. Conducted morning assembly, prepared Montessori classroom."
                className="w-full p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-white text-xs outline-none placeholder:text-emerald-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleStaffClockIn('present')}
                className="bg-[#D4AF37] hover:bg-amber-400 text-[#0B3D27] font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Clock In (Present)</span>
              </button>
              <button
                onClick={() => handleStaffClockIn('late')}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
              >
                <span>Clock In (Late Arrival)</span>
              </button>
              <button
                onClick={() => handleStaffClockIn('on-leave')}
                className="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-emerald-700 transition-all"
              >
                <span>Record Approved Leave</span>
              </button>
            </div>
          </div>

          {/* Today's Staff Attendance Logs */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-[#0B3D27]">Today's Recorded Staff Register</h3>
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B3D27] text-white">
                  <tr>
                    <th className="p-3">Staff Name</th>
                    <th className="p-3">Staff ID</th>
                    <th className="p-3">Time In</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {staffAttendance.map(stf => (
                    <tr key={stf.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-[#0B3D27]">{stf.staffName}</td>
                      <td className="p-3 font-mono text-slate-600">{stf.staffId}</td>
                      <td className="p-3 font-mono text-slate-700">{stf.timeIn || '—'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          stf.status === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {stf.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{stf.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MANAGEMENT CIRCULARS */}
      {activeTab === 'notices' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold font-serif text-[#0B3D27]">Management Circulars & Staff Directives</h2>
            <p className="text-xs text-slate-600">Official directives from the School Proprietor and Academic Directorate</p>
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0B3D27] text-sm font-serif">1st Term Examination Schedule & Offline CBT Readiness</span>
                <span className="text-[10px] bg-[#0B3D27] text-[#D4AF37] font-bold px-2.5 py-0.5 rounded-full">
                  HIGH PRIORITY
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                All class teachers and subject educators are advised that CBT tests can be conducted seamlessly offline across all computer lab terminals. Attendance and results should be logged on the portal for instant offline recording and cloud synchronization.
              </p>
              <p className="text-[11px] text-emerald-800 font-semibold pt-1">
                Issued by: Executive Directorate • Date: 2026-09-14
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW DETAILED TEACHING MATERIAL / LESSON NOTE */}
      {activeMaterialModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#D4AF37] max-h-[90vh] overflow-y-auto my-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full uppercase">
                  {activeMaterialModal.category} • {activeMaterialModal.week}
                </span>
                <h3 className="text-lg font-bold font-serif text-[#0B3D27] mt-1">
                  {activeMaterialModal.title}
                </h3>
                <p className="text-slate-500">{activeMaterialModal.subject} — {activeMaterialModal.className} ({activeMaterialModal.term})</p>
              </div>
              <button
                onClick={() => setActiveMaterialModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-slate-700">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-[#0B3D27]">Topic & Key Concept</span>
                <p className="font-semibold text-slate-900">{activeMaterialModal.topic}</p>
                <p className="text-slate-600">{activeMaterialModal.keyConcepts}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#0B3D27] mb-1.5">Learning Objectives</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {activeMaterialModal.learningObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#0B3D27] mb-1.5">Teaching Aids & Materials Needed</h4>
                <div className="flex flex-wrap gap-2">
                  {activeMaterialModal.materialsNeeded.map((mat, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#0B3D27] mb-1.5">Classroom Presentation & Delivery Steps</h4>
                <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {activeMaterialModal.presentationSteps.map((step, i) => (
                    <p key={i} className="text-slate-700 leading-relaxed font-medium">{step}</p>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#0B3D27] mb-1.5">Evaluation & Assessment Questions</h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  {activeMaterialModal.evaluationQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setActiveMaterialModal(null)}
                className="px-4 py-2 border rounded-xl font-bold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#0B3D27] text-[#D4AF37] rounded-xl font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Lesson Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW TEACHING MATERIAL */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border-2 border-[#D4AF37] max-h-[90vh] overflow-y-auto my-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold font-serif text-[#0B3D27]">Create Teaching Material / Lesson Plan</h3>
                <p className="text-slate-500">Stored safely offline and available for all classroom teachers</p>
              </div>
              <button onClick={() => setShowAddMaterialModal(false)} className="text-slate-400 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleCreateMaterial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <select
                    value={newMaterial.category}
                    onChange={e => setNewMaterial({ ...newMaterial, category: e.target.value as any })}
                    className="w-full p-2 border rounded-xl"
                  >
                    <option value="Lesson Note">Lesson Note</option>
                    <option value="Scheme of Work">Scheme of Work</option>
                    <option value="Montessori Guide">Montessori Guide</option>
                    <option value="Exercise Sheet">Exercise Sheet</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Subject</label>
                  <select
                    value={newMaterial.subject}
                    onChange={e => setNewMaterial({ ...newMaterial, subject: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="English Language">English Language</option>
                    <option value="Computer Studies">Computer Studies</option>
                    <option value="Basic Science">Basic Science</option>
                    <option value="Montessori Curriculum">Montessori Curriculum</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Class</label>
                  <select
                    value={newMaterial.className}
                    onChange={e => setNewMaterial({ ...newMaterial, className: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  >
                    {['Pre-Nursery', 'Nursery 1', 'Nursery 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={newMaterial.title}
                  onChange={e => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  placeholder="e.g. Long Division & Algebraic Equations"
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Topic</label>
                <input
                  type="text"
                  required
                  value={newMaterial.topic}
                  onChange={e => setNewMaterial({ ...newMaterial, topic: e.target.value })}
                  placeholder="e.g. Dividing 3-digit numbers with remainders"
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Learning Objectives (One per line)</label>
                <textarea
                  rows={3}
                  value={newMaterial.learningObjectivesText}
                  onChange={e => setNewMaterial({ ...newMaterial, learningObjectivesText: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Instructional Materials Needed</label>
                <input
                  type="text"
                  value={newMaterial.materialsNeededText}
                  onChange={e => setNewMaterial({ ...newMaterial, materialsNeededText: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Classroom Presentation Steps (One per line)</label>
                <textarea
                  rows={4}
                  value={newMaterial.presentationStepsText}
                  onChange={e => setNewMaterial({ ...newMaterial, presentationStepsText: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button type="button" onClick={() => setShowAddMaterialModal(false)} className="px-4 py-2 border rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#0B3D27] text-[#D4AF37] font-bold rounded-xl shadow">
                  Save Teaching Material Offline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
