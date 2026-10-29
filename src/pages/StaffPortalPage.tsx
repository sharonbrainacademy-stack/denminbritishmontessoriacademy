import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  FileCheck,
  Laptop,
  CheckCircle,
  AlertCircle,
  Upload,
  Layers,
  FileSpreadsheet,
  Download,
  BookOpen,
  Plus,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { BulkQuestionUploadModal } from '../components/cbt/BulkQuestionUploadModal';
import { CBTExam, CBTQuestion, CBTTheoryQuestion, StudentAttendanceRecord, Student, CBTAttempt } from '../types';

export const StaffPortalPage: React.FC = () => {
  const {
    currentUser,
    students,
    cbtExams,
    saveCBTExam,
    cbtAttempts,
    updateCBTAttempt,
    markStudentAttendance,
    studentAttendance,
    resultSlips,
    saveResultSlip,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'attendance' | 'cbt' | 'theory-grading' | 'results'>('cbt');

  // CBT Exam creation & Bulk Upload modal state
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedExamForBulk, setSelectedExamForBulk] = useState<CBTExam | null>(null);

  // New exam form
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [examForm, setExamForm] = useState({
    title: '',
    assessmentType: 'first_test' as 'first_test' | 'second_test' | 'exam',
    subject: 'Mathematics',
    classLevel: 'Primary 5',
    term: '1st Term',
    session: '2024/2025',
    durationMinutes: 45,
    passMark: 50,
    questions: [] as CBTQuestion[],
    theoryQuestions: [] as CBTTheoryQuestion[],
  });

  // Theory grading modal
  const [gradingAttemptId, setGradingAttemptId] = useState<string | null>(null);
  const [theoryAwardMarks, setTheoryAwardMarks] = useState<number>(0);
  const [theoryFeedback, setTheoryFeedback] = useState<string>('');

  // Daily attendance state
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Filter students for teacher's class
  const assignedClass = currentUser?.assignedClass || 'Primary 5';
  const classStudents = students.filter((s: Student) => (s.classLevel || s.className) === assignedClass);

  // Bulk questions apply handler
  const handleApplyQuestions = (
    objectiveQuestions?: CBTQuestion[],
    theoryQuestions?: CBTTheoryQuestion[],
    mode: 'append' | 'replace' = 'append'
  ) => {
    if (!selectedExamForBulk) return;

    let updatedObj = [...selectedExamForBulk.questions];
    let updatedTheory = [...(selectedExamForBulk.theoryQuestions || [])];

    if (mode === 'replace') {
      if (objectiveQuestions) updatedObj = objectiveQuestions;
      if (theoryQuestions) updatedTheory = theoryQuestions;
    } else {
      if (objectiveQuestions) updatedObj = [...updatedObj, ...objectiveQuestions];
      if (theoryQuestions) updatedTheory = [...updatedTheory, ...theoryQuestions];
    }

    // Recompute total marks
    const objMarks = updatedObj.reduce((sum, q) => sum + (q.marks || 1), 0);
    const theoryMarks = updatedTheory.reduce((sum, q) => sum + (q.maxMarks || 5), 0);

    const updatedExam: CBTExam = {
      ...selectedExamForBulk,
      questions: updatedObj,
      theoryQuestions: updatedTheory,
      totalMarks: objMarks + theoryMarks,
    };

    saveCBTExam(updatedExam);
    setSelectedExamForBulk(null);
    setIsBulkModalOpen(false);
  };

  // Create new exam
  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const newExam: CBTExam = {
      id: `cbt_${Date.now()}`,
      title: examForm.title,
      assessmentType: examForm.assessmentType,
      subject: examForm.subject,
      classLevel: examForm.classLevel,
      term: examForm.term,
      session: examForm.session,
      durationMinutes: Number(examForm.durationMinutes),
      totalMarks: 0,
      passMark: Number(examForm.passMark),
      published: true,
      questions: [],
      theoryQuestions: [],
      createdBy: currentUser?.name || 'Teacher',
      createdAt: new Date().toISOString(),
    };

    saveCBTExam(newExam);
    setShowCreateExamModal(false);
    // Open bulk upload immediately so teacher can load questions!
    setSelectedExamForBulk(newExam);
    setIsBulkModalOpen(true);
  };

  // Grade Theory Submission
  const handleSaveTheoryGrade = (attemptId: string) => {
    updateCBTAttempt(attemptId, {
      theoryScoreAwarded: Number(theoryAwardMarks),
      teacherFeedback: theoryFeedback,
      theoryGraded: true,
      theoryStatus: 'reviewed',
    });
    setGradingAttemptId(null);
  };

  // Save Attendance
  const handleSaveAttendance = () => {
    const records: StudentAttendanceRecord[] = classStudents.map((s: Student) => ({
      id: `att_${s.id}_${attendanceDate}`,
      studentId: s.id,
      studentName: s.fullName,
      admissionNumber: s.admissionNumber || s.admissionNo,
      classLevel: s.classLevel || s.className,
      date: attendanceDate,
      status: attendanceMap[s.id] || 'present',
      recordedBy: currentUser?.name || 'Staff',
    }));

    markStudentAttendance(records);
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  // Attempts waiting for review
  const pendingTheoryAttempts = cbtAttempts.filter(
    (a: CBTAttempt) => a.theoryStatus === 'pending_review'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Bulk Upload Modal */}
      {isBulkModalOpen && selectedExamForBulk && (
        <BulkQuestionUploadModal
          isOpen={isBulkModalOpen}
          onClose={() => {
            setIsBulkModalOpen(false);
            setSelectedExamForBulk(null);
          }}
          examTitle={selectedExamForBulk.title}
          subject={selectedExamForBulk.subject}
          onApplyQuestions={handleApplyQuestions}
        />
      )}

      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
            Sharon Brain Academy Staff Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">Academic Staff Portal</h1>
          <p className="text-xs text-slate-400">
            Logged in as: <strong className="text-white">{currentUser?.name || 'Teacher'}</strong> &bull; Class: <strong className="text-emerald-400">{assignedClass}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateExamModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Test / Exam
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'cbt', label: 'CBT Assessments & Bulk Upload', icon: Laptop },
          { id: 'theory-grading', label: `Theory Submissions Review (${pendingTheoryAttempts.length})`, icon: FileCheck },
          { id: 'attendance', label: 'Daily Student Attendance', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: CBT Assessments & Bulk Upload */}
      {activeTab === 'cbt' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Continuous Assessment Tests & CBT Exams
              </h3>
              <p className="text-xs text-slate-500">
                Create 1st Test, 2nd Test, or Terminal Exam papers and bulk upload questions from Excel or text.
              </p>
            </div>
            <button
              onClick={() => setShowCreateExamModal(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> New Assessment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cbtExams.map((exam: CBTExam) => (
              <div
                key={exam.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {exam.assessmentType?.toUpperCase().replace('_', ' ') || 'EXAM'}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {exam.classLevel}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{exam.title}</h4>
                  <p className="text-xs text-slate-500">
                    Subject: <strong>{exam.subject}</strong> &bull; {exam.durationMinutes} Mins &bull; Total: {exam.totalMarks} mks
                  </p>

                  <div className="pt-2 text-xs text-slate-600 flex items-center gap-3">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                      {exam.questions.length} Section A (Objective)
                    </span>
                    <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-medium">
                      {exam.theoryQuestions?.length || 0} Section B (Theory)
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedExamForBulk(exam);
                      setIsBulkModalOpen(true);
                    }}
                    className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-200 flex items-center justify-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5" /> Bulk Upload Qs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Theory Grading Submissions */}
      {activeTab === 'theory-grading' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Theory / Essay Question Submissions
            </h3>
            <p className="text-xs text-slate-500">
              Review and award marks for written theory answers submitted during CBT exams.
            </p>
          </div>

          <div className="space-y-4">
            {pendingTheoryAttempts.map((att: CBTAttempt) => {
              const exam = cbtExams.find((e: CBTExam) => e.id === att.examId);
              const isGradingThis = gradingAttemptId === att.id;

              return (
                <div key={att.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {att.studentName} ({att.admissionNumber || att.admissionNo}) &bull; {att.classLevel || att.className}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Exam: <strong>{att.examTitle}</strong> &bull; Completed: {new Date(att.completedAt || new Date().toISOString()).toLocaleString()}
                      </p>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      Pending Teacher Review
                    </span>
                  </div>

                  {/* Student written answers */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Student Theory Answers:
                    </h5>
                    {exam?.theoryQuestions?.map((tq: CBTTheoryQuestion, idx: number) => (
                      <div key={tq.id} className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <strong className="text-slate-800">Q{idx + 1}: {tq.question}</strong>
                          <span className="text-slate-500 font-semibold">(Max: {tq.maxMarks} mks)</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded text-xs text-slate-800 font-mono whitespace-pre-wrap">
                          {att.theoryAnswers?.[tq.id] || '(No written answer provided)'}
                        </div>
                        {tq.modelAnswer && (
                          <p className="text-[11px] text-emerald-700 italic">
                            Marking Guideline: {tq.modelAnswer}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {isGradingThis ? (
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Award Theory Marks (Max Marks):
                          </label>
                          <input
                            type="number"
                            value={theoryAwardMarks}
                            onChange={(e) => setTheoryAwardMarks(Number(e.target.value))}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Teacher Feedback:
                          </label>
                          <input
                            type="text"
                            value={theoryFeedback}
                            onChange={(e) => setTheoryFeedback(e.target.value)}
                            placeholder="e.g. Good analysis with clear steps"
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveTheoryGrade(att.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Save Theory Marks
                        </button>
                        <button
                          onClick={() => setGradingAttemptId(null)}
                          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setGradingAttemptId(att.id);
                        setTheoryAwardMarks(att.theoryScoreAwarded || 0);
                        setTheoryFeedback(att.teacherFeedback || '');
                      }}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg"
                    >
                      Award Marks for This Student
                    </button>
                  )}
                </div>
              );
            })}

            {pendingTheoryAttempts.length === 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs">
                No theory submissions currently waiting for review.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Daily Student Attendance */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Daily Attendance Roll Call &bull; {assignedClass}
                </h3>
                <p className="text-xs text-slate-500">
                  {classStudents.length} students enrolled in this class
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
                <button
                  onClick={handleSaveAttendance}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Save Attendance
                </button>
              </div>
            </div>

            {attendanceSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Attendance saved successfully for {attendanceDate}.</span>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                  <tr>
                    <th className="p-3">Admission No</th>
                    <th className="p-3">Student Full Name</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map((s: Student) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-emerald-800">{s.admissionNumber}</td>
                      <td className="p-3 font-semibold text-slate-900">{s.fullName}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {(['present', 'absent', 'late'] as const).map((status) => (
                            <button
                              key={status}
                              onClick={() => setAttendanceMap({ ...attendanceMap, [s.id]: status })}
                              className={`px-3 py-1 rounded-lg font-bold uppercase text-[10px] transition ${
                                (attendanceMap[s.id] || 'present') === status
                                  ? status === 'present'
                                    ? 'bg-emerald-600 text-white'
                                    : status === 'absent'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-amber-600 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {classStudents.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-400">
                        No students enrolled in {assignedClass} yet. Add students via the Admin Dashboard.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {showCreateExamModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Create CBT Test or Examination</h3>
              <button onClick={() => setShowCreateExamModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Assessment Title *</label>
                <input
                  type="text"
                  required
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  placeholder="e.g. 1st Continuous Assessment Test - Mathematics"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Assessment Type *</label>
                  <select
                    value={examForm.assessmentType}
                    onChange={(e) => setExamForm({ ...examForm, assessmentType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="first_test">1st Test (Continuous Assessment)</option>
                    <option value="second_test">2nd Test (Continuous Assessment)</option>
                    <option value="exam">Terminal Examination</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={examForm.subject}
                    onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Class Level *</label>
                  <select
                    value={examForm.classLevel}
                    onChange={(e) => setExamForm({ ...examForm, classLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
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
                  <label className="block font-bold text-slate-700 uppercase mb-1">Duration (Minutes) *</label>
                  <input
                    type="number"
                    required
                    value={examForm.durationMinutes}
                    onChange={(e) => setExamForm({ ...examForm, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Create & Proceed to Bulk Upload Questions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
