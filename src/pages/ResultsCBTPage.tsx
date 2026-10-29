import React, { useState } from 'react';
import {
  FileText,
  Search,
  Award,
  CheckCircle,
  Clock,
  Download,
  AlertCircle,
  Laptop,
  Layers,
  ChevronRight,
  BookOpen,
  Calendar,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { CBTExamRunner } from '../components/cbt/CBTExamRunner';
import { generateResultSlipPDF } from '../utils/pdfHelpers';
import { CBTExam, CBTAttempt, Student, ResultSlip } from '../types';

export const ResultsCBTPage: React.FC = () => {
  const {
    schoolInfo,
    students,
    cbtExams,
    cbtAttempts,
    recordCBTAttempt,
    resultSlips,
    currentUser,
  } = useSchool();

  const [admissionNoInput, setAdmissionNoInput] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchError, setSearchError] = useState('');

  // Active CBT exam session
  const [activeExam, setActiveExam] = useState<CBTExam | null>(null);

  // Active tab: 'cbt' or 'records'
  const [activeTab, setActiveTab] = useState<'assessments' | 'records'>('assessments');

  // Handle student search
  const handleSearchStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const cleanNo = admissionNoInput.trim().toUpperCase();

    if (!cleanNo) {
      setSearchError('Please enter your admission number.');
      return;
    }

    const found = students.find(
      (s: Student) =>
        (s.admissionNumber || s.admissionNo || '').toUpperCase() === cleanNo ||
        s.id.toUpperCase() === cleanNo
    );

    if (found) {
      setSelectedStudent(found);
      setSearchError('');
    } else {
      setSelectedStudent(null);
      setSearchError(
        `No enrolled student found with Admission No: "${cleanNo}". Please verify your admission number or contact the school office.`
      );
    }
  };

  // If logged in as student, auto-select
  React.useEffect(() => {
    if (currentUser?.role === 'student' && currentUser.studentId) {
      const match = students.find((s: Student) => s.id === currentUser.studentId);
      if (match) setSelectedStudent(match);
    }
  }, [currentUser, students]);

  // Attempts for current selected student
  const studentAdm = (selectedStudent?.admissionNumber || selectedStudent?.admissionNo || '').toUpperCase();
  const studentAttempts = selectedStudent
    ? cbtAttempts.filter(
        (att: CBTAttempt) =>
          att.studentId === selectedStudent.id ||
          (att.admissionNumber || att.admissionNo || '').toUpperCase() === studentAdm
      )
    : [];

  // Result slips for current selected student
  const studentResultSlips = selectedStudent
    ? resultSlips.filter(
        (rs: ResultSlip) =>
          rs.studentId === selectedStudent.id ||
          (rs.admissionNumber || rs.admissionNo || '').toUpperCase() === studentAdm
      )
    : [];

  // Available CBT exams for student's class
  const stClass = selectedStudent?.classLevel || selectedStudent?.className;
  const availableExams = selectedStudent
    ? cbtExams.filter((ex: CBTExam) => (ex.published || ex.isPublished) && (ex.classLevel === stClass || ex.className === stClass))
    : cbtExams.filter((ex: CBTExam) => ex.published || ex.isPublished);

  const handleStartExam = (exam: CBTExam) => {
    if (!selectedStudent) {
      setSearchError('Please look up and select your student admission number first.');
      return;
    }
    setActiveExam(exam);
  };

  const handleFinishExam = (attemptData: Omit<CBTAttempt, 'id'>) => {
    recordCBTAttempt(attemptData);
    setActiveExam(null);
    setActiveTab('records');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Active CBT Exam Runner overlay */}
      {activeExam && selectedStudent && (
        <CBTExamRunner
          exam={activeExam}
          student={selectedStudent}
          onComplete={handleFinishExam}
          onCancel={() => setActiveExam(null)}
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Laptop className="w-3.5 h-3.5" /> Sharon Brain Academy CBT & Assessment Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Online CBT Exams & Continuous Assessment Records
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Take 1st continuous assessment test, 2nd test, and terminal examination papers.
            Parents and guardians can view test breakdowns and final term result cards.
          </p>
        </div>
      </div>

      {/* Student Lookup Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Student Identity Verification</h2>
            <p className="text-xs text-slate-500">
              Enter the student's Sharon Brain Academy admission number to access test sessions and scores.
            </p>
          </div>
          {selectedStudent && (
            <button
              onClick={() => {
                setSelectedStudent(null);
                setAdmissionNoInput('');
              }}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Switch Student
            </button>
          )}
        </div>

        {!selectedStudent ? (
          <form onSubmit={handleSearchStudent} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={admissionNoInput}
                onChange={(e) => setAdmissionNoInput(e.target.value)}
                placeholder="Enter Admission No (e.g. SBA/2024/001)"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Verify Student
            </button>
          </form>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-lg shadow">
                {selectedStudent.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {selectedStudent.fullName}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-0.5">
                  <span className="font-mono font-bold text-emerald-800">
                    {selectedStudent.admissionNumber}
                  </span>
                  <span>&bull;</span>
                  <span>Class: <strong className="text-slate-800">{selectedStudent.classLevel}</strong></span>
                  {selectedStudent.arm && <span>({selectedStudent.arm})</span>}
                </div>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 bg-white text-emerald-700 rounded-lg border border-emerald-300 shadow-sm">
              Verified Candidate
            </span>
          </div>
        )}

        {searchError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('assessments')}
          className={`pb-2 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'assessments'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Laptop className="w-4 h-4" />
          Active CBT Assessments ({availableExams.length})
        </button>

        <button
          onClick={() => setActiveTab('records')}
          className={`pb-2 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'records'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Continuous Assessment & Result Slips
        </button>
      </div>

      {/* Tab 1: Active CBT Assessments */}
      {activeTab === 'assessments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              {selectedStudent ? `CBT Assessments for ${selectedStudent.classLevel}` : 'All Published CBT Papers'}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Objective Multiple-Choice + Theory Writing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableExams.map((exam: CBTExam) => {
              const previousAttempt = studentAttempts.find((att: CBTAttempt) => att.examId === exam.id);

              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {exam.assessmentType?.toUpperCase().replace('_', ' ') || 'EXAM'}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {exam.durationMinutes} Mins
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">{exam.title}</h3>
                    <p className="text-xs text-slate-500">
                      Subject: <strong className="text-slate-700">{exam.subject}</strong> &bull; Class: <strong className="text-slate-700">{exam.classLevel}</strong>
                    </p>

                    <div className="pt-2 flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100">
                      <span>{exam.questions.length} Objective Qs</span>
                      <span>&bull;</span>
                      <span>{exam.theoryQuestions?.length || 0} Theory Qs</span>
                      <span>&bull;</span>
                      <span>Total: {exam.totalMarks} mks</span>
                    </div>
                  </div>

                  <div className="pt-6">
                    {previousAttempt ? (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Completed
                        </span>
                        <p className="text-xs text-slate-700 font-semibold">
                          Score: {previousAttempt.score} / {previousAttempt.totalPossibleMarks} ({previousAttempt.percentage}%)
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartExam(exam)}
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                      >
                        <Laptop className="w-4 h-4" /> Start CBT Assessment
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {availableExams.length === 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs">
              No CBT assessments currently scheduled for this class.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Continuous Assessment (1st Test, 2nd Test, Exam) Records & Result Slips */}
      {activeTab === 'records' && (
        <div className="space-y-8">
          {!selectedStudent ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center text-amber-900 text-xs space-y-2">
              <p className="font-bold text-sm">Please Enter Student Admission Number Above</p>
              <p>Continuous assessment test scores and terminal result cards are protected per student.</p>
            </div>
          ) : (
            <>
              {/* Continuous Assessment Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Continuous Assessment (CA) CBT Records
                    </h3>
                    <p className="text-xs text-slate-500">
                      Available to parents and students ahead of the comprehensive term result
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Assessment Title</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Objective Score</th>
                        <th className="p-3">Theory Status</th>
                        <th className="p-3">Total / %</th>
                        <th className="p-3">Date Completed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentAttempts.map((att: CBTAttempt) => (
                        <tr key={att.id} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-900">{att.examTitle}</td>
                          <td className="p-3">
                            <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {att.assessmentType?.toUpperCase().replace('_', ' ') || 'EXAM'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600">{att.subject}</td>
                          <td className="p-3 font-bold text-slate-900">
                            {att.score} / {att.totalPossibleMarks || att.totalMarks}
                          </td>
                          <td className="p-3">
                            {att.theoryStatus === 'pending_review' ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Pending Teacher Review
                              </span>
                            ) : att.theoryStatus === 'reviewed' ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Reviewed (+{att.theoryScoreAwarded || 0} mks)
                              </span>
                            ) : (
                              <span className="text-slate-400">N/A (Objective Only)</span>
                            )}
                          </td>
                          <td className="p-3 font-bold text-emerald-700">{att.percentage}%</td>
                          <td className="p-3 text-slate-400">
                            {new Date(att.completedAt || new Date().toISOString()).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}

                      {studentAttempts.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-slate-400">
                            No CBT test or exam records found for this candidate yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Published Termly Result Slips */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Official Termly Result Sheets
                    </h3>
                    <p className="text-xs text-slate-500">
                      Approved and published by Sharon Brain Academy Academic Board
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {studentResultSlips.map((res: ResultSlip) => (
                    <div
                      key={res.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                            {res.session} - {res.term}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">{res.classLevel}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          Total Score: {res.totalScore ?? res.totalObtained ?? 0} &bull; Average: {(res.averageScore ?? res.average ?? 0).toFixed(1)}% &bull; Position: {res.position || 'N/A'}
                        </h4>
                        <p className="text-xs text-slate-500 italic">
                          Teacher's Remark: "{res.teacherRemarks}"
                        </p>
                      </div>

                      <button
                        onClick={() => generateResultSlipPDF(res, selectedStudent, schoolInfo)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 shrink-0"
                      >
                        <Download className="w-4 h-4 text-emerald-400" /> Download Official PDF Slip
                      </button>
                    </div>
                  ))}

                  {studentResultSlips.length === 0 && (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No published result slips available for this session yet. Terminal slips are released at the end of term.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
