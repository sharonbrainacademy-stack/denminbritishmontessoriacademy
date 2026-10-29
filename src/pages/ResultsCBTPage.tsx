import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Search,
  Download,
  Printer,
  Clock,
  CheckCircle2,
  Play,
  FileText,
  User,
  AlertCircle,
  Sparkles,
  BarChart3,
  Calendar,
  ShieldCheck,
  Eye,
  Check,
  X,
  FileCheck,
  Layers,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { CBTExamRunner } from '../components/cbt/CBTExamRunner';
import { generateResultPDF } from '../utils/pdfHelpers';
import { CBTExam, Student, ResultSlip, CBTAttempt, CBTTheoryQuestion } from '../types';

export const ResultsCBTPage: React.FC = () => {
  const { schoolInfo, students, resultSlips, cbtExams, cbtAttempts, currentUser } = useSchool();

  const [activeTab, setActiveTab] = useState<'results' | 'cbt'>('results');
  const [selectedTerm, setSelectedTerm] = useState('1st Term');
  const [selectedSession, setSelectedSession] = useState('2024/2025');

  // Result Search by Class & Admitted Student List
  const [selectedClassFilter, setSelectedClassFilter] = useState('Primary 5');
  const [selectedStudentId, setSelectedStudentId] = useState(
    students.find(s => s.className === 'Primary 5')?.id || students[0]?.id || ''
  );

  const [searchedStudent, setSearchedStudent] = useState<Student | null>(
    students.find(s => s.id === selectedStudentId) || students[0] || null
  );
  const [searchedResult, setSearchedResult] = useState<ResultSlip | null>(
    resultSlips.find(r => r.admissionNo === searchedStudent?.admissionNo) || resultSlips[0] || null
  );

  const [activeExamToRun, setActiveExamToRun] = useState<CBTExam | null>(null);
  const [inspectingAttempt, setInspectingAttempt] = useState<CBTAttempt | null>(null);

  // CBT Student Selection Gate State (Strictly Admitted Students List)
  const [cbtSelectedClass, setCbtSelectedClass] = useState('Primary 5');
  const [cbtSelectedStudentId, setCbtSelectedStudentId] = useState(
    students.find(s => s.className === 'Primary 5')?.id || students[0]?.id || ''
  );

  const selectedCbtStudent = students.find(s => s.id === cbtSelectedStudentId) || students[0] || null;

  const [verifiedCBTStudent, setVerifiedCBTStudent] = useState<{
    fullName: string;
    admissionNo: string;
    className: string;
  } | null>(null);

  // Handle Result Slip Search by Admitted Student
  const handleSelectResultStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    const st = students.find(s => s.id === studentId);
    if (st) {
      setSearchedStudent(st);
      const res = resultSlips.find(
        r => r.admissionNo.trim().toUpperCase() === st.admissionNo.toUpperCase() &&
             r.term === selectedTerm &&
             r.academicSession === selectedSession
      );
      setSearchedResult(res || null);
    } else {
      setSearchedStudent(null);
      setSearchedResult(null);
    }
  };

  const handlePrintResult = () => {
    if (searchedResult) {
      generateResultPDF(searchedResult, schoolInfo);
    }
  };

  const handleCBTStudentVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCbtStudent) {
      alert('Please select an officially admitted student from the school list.');
      return;
    }
    setVerifiedCBTStudent({
      fullName: selectedCbtStudent.fullName,
      admissionNo: selectedCbtStudent.admissionNo.toUpperCase(),
      className: selectedCbtStudent.className,
    });
  };

  // Class CBT Exams for verified student
  const classExams = cbtExams.filter(
    e => e.isPublished && verifiedCBTStudent && (e.className === verifiedCBTStudent.className || e.className === 'All Classes')
  );

  const now = new Date();

  // Active Scheduled Exams
  const activeScheduledExams = classExams.filter(e => {
    if (!e.scheduleStart && !e.scheduleEnd) return true;
    const start = e.scheduleStart ? new Date(e.scheduleStart) : null;
    const end = e.scheduleEnd ? new Date(e.scheduleEnd) : null;
    if (start && now < start) return false;
    if (end && now > end) return false;
    return true;
  });

  // Upcoming Scheduled Exams
  const upcomingScheduledExams = classExams.filter(e => {
    if (!e.scheduleStart) return false;
    const start = new Date(e.scheduleStart);
    return now < start;
  }).sort((a, b) => new Date(a.scheduleStart!).getTime() - new Date(b.scheduleStart!).getTime());

  // Attempts for verified student
  const studentAttempts = cbtAttempts.filter(
    a => verifiedCBTStudent && a.admissionNo.toUpperCase() === verifiedCBTStudent.admissionNo.toUpperCase()
  );

  const studentToRun: Student | null = searchedStudent || (verifiedCBTStudent ? {
    id: `std_${verifiedCBTStudent.admissionNo.replace(/[^a-zA-Z0-9]/g, '_')}`,
    fullName: verifiedCBTStudent.fullName,
    admissionNo: verifiedCBTStudent.admissionNo,
    className: verifiedCBTStudent.className,
    gender: 'Male',
    dateOfBirth: '2015-01-01',
    parentName: 'Guardian',
    parentPhone: '08000000000',
    parentEmail: 'parent@sharonbrainacademy.edu.ng',
    enrollmentYear: '2024',
    guardianName: 'Guardian',
    guardianPhone: '08000000000',
    address: 'Benin City, Edo State',
    passportPhotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300',
    academicSession: '2024/2025',
    status: 'Active'
  } as Student : null);

  if (activeExamToRun && studentToRun) {
    return (
      <div className="py-10 px-4">
        <CBTExamRunner
          exam={activeExamToRun}
          student={studentToRun}
          onClose={() => setActiveExamToRun(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Banner */}
      <div className="bg-[#0B3D27] text-white p-8 md:p-12 rounded-3xl border-2 border-[#D4AF37] shadow-xl text-center space-y-3">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
          Academic Verification & CBT System
        </span>
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-[#F9F6EF]">
          Student Results & Online CBT Portal
        </h1>
        <p className="text-sm md:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
          Search pupil result slips, download official verified PDF transcripts, or participate in online CBT evaluation exams.
        </p>
      </div>

      {/* Main Switcher Bar */}
      <div className="flex justify-center">
        <div className="bg-white p-1.5 rounded-2xl border-2 border-[#D4AF37]/50 shadow-md inline-flex gap-2">
          <button
            onClick={() => setActiveTab('results')}
            className={`px-6 py-2.5 rounded-xl font-serif text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'results'
                ? 'bg-[#0B3D27] text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileText className={`w-4 h-4 ${activeTab === 'results' ? 'text-[#D4AF37]' : 'text-slate-500'}`} />
            <span>Student Results Slip Portal</span>
          </button>

          <button
            onClick={() => setActiveTab('cbt')}
            className={`px-6 py-2.5 rounded-xl font-serif text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'cbt'
                ? 'bg-[#0B3D27] text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${activeTab === 'cbt' ? 'text-[#D4AF37]' : 'text-slate-500'}`} />
            <span>Online CBT Exam Module</span>
            <span className="bg-[#D4AF37] text-[#0B3D27] text-[10px] font-black px-1.5 py-0.5 rounded-md">
              LIVE
            </span>
          </button>
        </div>
      </div>

      {/* Search Bar for Class & Admitted Student Selection */}
      <div className="bg-white p-6 rounded-3xl border-2 border-[#D4AF37] shadow-lg max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <h3 className="font-serif font-bold text-sm text-[#0B3D27]">
              Admitted Pupil Verification & Selection
            </h3>
            <p className="text-[11px] text-slate-500">
              Only officially admitted students registered in the school database are accessible. Select class and pupil name below.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          {/* Class Filter Dropdown */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-[#0B3D27] mb-1">
              1. Select Class
            </label>
            <select
              value={selectedClassFilter}
              onChange={e => {
                const newClass = e.target.value;
                setSelectedClassFilter(newClass);
                const firstInClass = students.find(s => s.className === newClass);
                if (firstInClass) {
                  handleSelectResultStudent(firstInClass.id);
                } else {
                  setSearchedStudent(null);
                  setSearchedResult(null);
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-xs font-bold text-[#0B3D27] focus:ring-2 focus:ring-[#0B3D27] outline-none bg-slate-50"
            >
              {['Pre-Nursery', 'Nursery 1', 'Nursery 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'].map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Admitted Student Dropdown */}
          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-[#0B3D27] mb-1">
              2. Select Admitted Pupil
            </label>
            <select
              value={searchedStudent?.id || ''}
              onChange={e => handleSelectResultStudent(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0B3D27] outline-none bg-slate-50"
            >
              {students
                .filter(s => s.className === selectedClassFilter)
                .map(s => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.admissionNo})
                  </option>
                ))}
              {students.filter(s => s.className === selectedClassFilter).length === 0 && (
                <option value="">No registered pupils in {selectedClassFilter}</option>
              )}
            </select>
          </div>

          {/* Term Selection */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-[#0B3D27] mb-1">3. Term</label>
            <select
              value={selectedTerm}
              onChange={e => {
                const t = e.target.value;
                setSelectedTerm(t);
                if (searchedStudent) {
                  const res = resultSlips.find(
                    r => r.admissionNo.trim().toUpperCase() === searchedStudent.admissionNo.toUpperCase() &&
                         r.term === t &&
                         r.academicSession === selectedSession
                  );
                  setSearchedResult(res || null);
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0B3D27] outline-none bg-slate-50"
            >
              <option value="1st Term">1st Term</option>
              <option value="2nd Term">2nd Term</option>
              <option value="3rd Term">3rd Term</option>
            </select>
          </div>
        </div>

        {/* Selected Pupil Banner Card */}
        {searchedStudent && (
          <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-900 mt-2">
            <img
              src={searchedStudent.passportPhotoUrl}
              alt={searchedStudent.fullName}
              className="w-10 h-10 rounded-full object-cover border border-[#D4AF37] shrink-0"
            />
            <div className="grow">
              <span className="font-bold text-[#0B3D27] block text-sm">{searchedStudent.fullName}</span>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                <span>Admission No: <strong className="font-mono text-[#0B3D27]">{searchedStudent.admissionNo}</strong></span>
                <span>Class: <strong>{searchedStudent.className}</strong></span>
                <span>Status: <strong className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">ACTIVE ADMITTED PUPIL</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student Result View Tab */}
      {activeTab === 'results' && (
        <div className="space-y-8">
          {searchedStudent ? (
            <div className="space-y-8">
              {/* SECTION 1: CONTINUOUS ASSESSMENT TRACKER (1ST TEST, 2ND TEST & EXAMS) - AVAILABLE BEFORE MAIN RESULT */}
              {(() => {
                const studentAssessments = cbtAttempts.filter(
                  a =>
                    a.publishedToParents !== false &&
                    (a.admissionNo.trim().toUpperCase() === searchedStudent.admissionNo.trim().toUpperCase() ||
                      a.studentName.trim().toLowerCase() === searchedStudent.fullName.trim().toLowerCase())
                );

                return (
                  <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#D4AF37] shadow-lg max-w-4xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-[#0B3D27] border border-emerald-300 shrink-0">
                          <Layers className="w-6 h-6 text-[#0B3D27]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif font-bold text-lg text-[#0B3D27]">
                              Continuous Assessment & CBT Test Records
                            </h3>
                            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                              PARENT LIVE VIEW
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            1st Test, 2nd Test, and Terminal CBT examination records are accessible here immediately prior to terminal report card release.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                          {studentAssessments.length} Test Records Recorded
                        </span>
                      </div>
                    </div>

                    {studentAssessments.length === 0 ? (
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                        <FileCheck className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-xs font-bold text-slate-700">
                          No continuous assessment test records submitted yet for {searchedStudent.fullName}.
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Once the pupil completes their 1st Test, 2nd Test, or CBT exams, scores and written theory scripts will appear here immediately for parental review.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {studentAssessments.map(att => {
                          const isFirst = att.assessmentType === '1st_test';
                          const isSecond = att.assessmentType === '2nd_test';
                          const typeBadge = isFirst
                            ? { title: '1st Continuous Assessment (1st Test)', tag: '1st Test', bg: 'bg-emerald-50 border-emerald-300 text-emerald-900', pill: 'bg-emerald-700 text-white' }
                            : isSecond
                            ? { title: '2nd Continuous Assessment (2nd Test)', tag: '2nd Test', bg: 'bg-blue-50 border-blue-300 text-blue-900', pill: 'bg-blue-700 text-white' }
                            : { title: 'Terminal Examination (Main Exam)', tag: 'Terminal Exam', bg: 'bg-purple-50 border-purple-300 text-purple-900', pill: 'bg-purple-700 text-white' };

                          const hasTheory = (att.theoryTotalMarks ?? 0) > 0 || (att.theoryAnswers && Object.keys(att.theoryAnswers).length > 0);
                          const isTheoryGraded = att.theoryGraded || false;

                          return (
                            <div
                              key={att.id}
                              className={`rounded-2xl p-4 border space-y-3 flex flex-col justify-between ${typeBadge.bg} shadow-sm`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${typeBadge.pill}`}>
                                    {typeBadge.tag}
                                  </span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    att.passed ? 'bg-emerald-200 text-emerald-900' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {att.passed ? 'PASSED' : 'RETEST'}
                                  </span>
                                </div>

                                <h4 className="font-bold text-sm text-[#0B3D27] line-clamp-1">{att.examTitle}</h4>
                                <p className="text-[11px] text-slate-600 font-medium">{att.subject || 'CBT Assessment'}</p>

                                <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/60 space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Section A (Objective):</span>
                                    <span className="font-bold text-slate-800">{att.objectiveScore ?? 0} / {att.objectiveTotalMarks ?? 10}</span>
                                  </div>

                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Section B (Theory):</span>
                                    {hasTheory ? (
                                      isTheoryGraded ? (
                                        <span className="font-bold text-emerald-800">{att.theoryScore ?? 0} / {att.theoryTotalMarks ?? 10}</span>
                                      ) : (
                                        <span className="font-semibold text-amber-800 text-[10px]">Under Marking</span>
                                      )
                                    ) : (
                                      <span className="text-slate-400">N/A</span>
                                    )}
                                  </div>

                                  <div className="flex justify-between pt-1 border-t border-slate-100">
                                    <span className="font-bold text-[#0B3D27]">Total Marks:</span>
                                    <span className="font-bold text-[#0B3D27]">{att.scoreObtained} / {att.totalMarks} ({(att.percentage ?? 0).toFixed(1)}%)</span>
                                  </div>
                                </div>

                                {att.teacherReviewNotes && (
                                  <p className="text-[11px] italic text-slate-600 bg-white/60 p-2 rounded-lg border border-slate-200/40">
                                    <strong>Teacher Note:</strong> "{att.teacherReviewNotes}"
                                  </p>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => setInspectingAttempt(att)}
                                className="w-full py-2 bg-[#0B3D27] hover:bg-emerald-900 text-[#D4AF37] font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition-all mt-2"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect Full Script & Answers</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* SECTION 2: OFFICIAL TERMINAL RESULT SLIP (PUBLISHED OR PENDING) */}
              {searchedResult && searchedResult.isPublished ? (
                <div id="printable-area" className="bg-white rounded-3xl p-6 md:p-10 border-2 border-[#D4AF37] shadow-xl max-w-4xl mx-auto space-y-8">
                  {/* Result Slip Header */}
                  <div className="border-b-2 border-[#D4AF37] pb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-[#0B3D27] rounded-2xl border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold shrink-0 shadow-md">
                        <Award className="w-10 h-10" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold font-serif text-[#0B3D27]">
                          {schoolInfo.name}
                        </h2>
                        <p className="text-xs font-serif text-[#D4AF37] italic font-bold">"{schoolInfo.motto}"</p>
                        <p className="text-[11px] text-slate-600 max-w-md mt-1">{schoolInfo.address}</p>
                      </div>
                    </div>

                    <div className="no-print">
                      <button
                        onClick={handlePrintResult}
                        className="bg-[#0B3D27] hover:bg-emerald-900 text-[#D4AF37] font-bold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PDF Result Slip</span>
                      </button>
                    </div>
                  </div>

                  {/* Banner Label */}
                  <div className="bg-[#F9F6EF] p-3 rounded-xl border border-[#D4AF37] text-center">
                    <h3 className="text-sm font-bold font-serif text-[#0B3D27] uppercase tracking-wider">
                      OFFICIAL PERFORMANCE REPORT — {searchedResult.term} ({searchedResult.academicSession})
                    </h3>
                  </div>

                  {/* Student Info Box */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Pupil Name:</span>
                      <span className="font-bold text-[#0B3D27] text-sm">{searchedResult.studentName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Admission No:</span>
                      <span className="font-bold text-slate-800">{searchedResult.admissionNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Class Level:</span>
                      <span className="font-bold text-slate-800">{searchedResult.className}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Class Position:</span>
                      <span className="font-bold text-emerald-800 text-sm">
                        {searchedResult.positionInClass} / {searchedResult.totalStudentsInClass} Pupils
                      </span>
                    </div>
                  </div>

                  {/* Subjects Scores Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#0B3D27] text-white">
                          <th className="p-3 font-bold">Subject</th>
                          <th className="p-3 font-bold text-center">C.A (30)</th>
                          <th className="p-3 font-bold text-center">Exam (70)</th>
                          <th className="p-3 font-bold text-center">Total (100)</th>
                          <th className="p-3 font-bold text-center">Grade</th>
                          <th className="p-3 font-bold text-center">Remark</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {searchedResult.subjects.map((sub, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}>
                            <td className="p-3 font-bold text-slate-800">{sub.subject}</td>
                            <td className="p-3 text-center">{sub.caScore}</td>
                            <td className="p-3 text-center">{sub.examScore}</td>
                            <td className="p-3 text-center font-bold text-[#0B3D27]">{sub.total}</td>
                            <td className="p-3 text-center font-bold">
                              <span className={`px-2 py-0.5 rounded text-[11px] ${
                                sub.grade === 'A' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {sub.grade}
                              </span>
                            </td>
                            <td className="p-3 text-center italic text-slate-600">{sub.remark}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary & Remarks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-2 text-xs">
                      <h4 className="font-bold font-serif text-[#0B3D27] text-sm">Academic Summary</h4>
                      <p>Total Obtained: <strong>{searchedResult.totalObtained} / {searchedResult.totalPossible}</strong></p>
                      <p>Overall Percentage: <strong>{searchedResult.average.toFixed(2)}%</strong></p>
                      <p>Attendance Record: <strong>{searchedResult.attendancePresent} / {searchedResult.attendanceTotal} Days</strong></p>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2 text-xs">
                      <h4 className="font-bold font-serif text-[#0B3D27] text-sm">Teacher & Principal Remarks</h4>
                      <p><strong>Class Teacher:</strong> "{searchedResult.classTeacherRemark}"</p>
                      <p><strong>Principal:</strong> "{searchedResult.principalRemark}"</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl text-center space-y-2 max-w-4xl mx-auto shadow-sm">
                  <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                  <h3 className="font-bold text-[#0B3D27] text-base">Terminal Result Slip Pending Final Compilation</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Final end-of-term composite result slips for <strong>{searchedStudent.fullName}</strong> are undergoing compilation. However, your child's <strong>Continuous Assessment test & exam records</strong> are available above.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 max-w-md mx-auto space-y-2">
              <User className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-xs font-bold">No student record selected or found in {selectedClassFilter}.</p>
              <p className="text-[11px]">Please select an admitted student from the drop-down list above.</p>
            </div>
          )}
        </div>
      )}

      {/* SCRIPT INSPECTION MODAL FOR PARENTS & STUDENTS */}
      {inspectingAttempt && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#D4AF37] max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Official CBT Assessment Script & Breakdown
                </span>
                <h3 className="text-xl font-bold font-serif text-[#0B3D27] mt-1">
                  {inspectingAttempt.examTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  Pupil: <strong>{inspectingAttempt.studentName}</strong> ({inspectingAttempt.admissionNo}) • Subject: {inspectingAttempt.subject}
                </p>
              </div>
              <button
                onClick={() => setInspectingAttempt(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Score Summary Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-center">
              <div>
                <span className="text-slate-500 block text-[10px]">Section A (Obj)</span>
                <span className="font-bold text-slate-800 text-sm">
                  {inspectingAttempt.objectiveScore ?? 0} / {inspectingAttempt.objectiveTotalMarks ?? 10}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Section B (Theory)</span>
                <span className="font-bold text-emerald-800 text-sm">
                  {inspectingAttempt.theoryScore ?? 0} / {inspectingAttempt.theoryTotalMarks ?? 0}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Total Score</span>
                <span className="font-bold text-[#0B3D27] text-sm">
                  {inspectingAttempt.scoreObtained} / {inspectingAttempt.totalMarks} ({(inspectingAttempt.percentage ?? 0).toFixed(1)}%)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Assessment Status</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${
                  inspectingAttempt.passed ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                }`}>
                  {inspectingAttempt.passed ? 'PASSED' : 'RETEST RECOMMENDED'}
                </span>
              </div>
            </div>

            {inspectingAttempt.teacherReviewNotes && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                <strong>Educator Review Comment:</strong> "{inspectingAttempt.teacherReviewNotes}"
              </div>
            )}

            {/* SECTION A: OBJECTIVE QUESTIONS BREAKDOWN */}
            {(() => {
              const exam = cbtExams.find(e => e.id === inspectingAttempt.examId);
              const questions = exam?.questions || [];

              return (
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-sm text-[#0B3D27] flex items-center gap-2 border-b pb-2">
                    <span>Section A: Objective Questions ({questions.length} Items)</span>
                  </h4>

                  {questions.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No objective questions logged.</p>
                  ) : (
                    <div className="space-y-3">
                      {questions.map((q, qIdx) => {
                        const studentSelected = (inspectingAttempt.selectedOptions || {})[q.id];
                        const isCorrect = studentSelected === q.correctOptionId;

                        return (
                          <div key={q.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#0B3D27]">Question #{qIdx + 1}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {isCorrect ? '✓ Correct (+10 pts)' : '✗ Incorrect (0 pts)'}
                              </span>
                            </div>

                            <p className="font-semibold text-slate-800">{q.questionText}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                              {q.options.map(opt => {
                                const wasSelected = studentSelected === opt.id;
                                const isTheCorrectOne = q.correctOptionId === opt.id;

                                let optClass = 'bg-white border-slate-200 text-slate-700';
                                if (isTheCorrectOne) {
                                  optClass = 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold';
                                } else if (wasSelected && !isCorrect) {
                                  optClass = 'bg-red-100 border-red-300 text-red-900 line-through';
                                }

                                return (
                                  <div key={opt.id} className={`p-2 rounded-lg border text-[11px] flex items-center gap-2 ${optClass}`}>
                                    <span className="font-bold uppercase w-4">{opt.id}:</span>
                                    <span>{opt.text}</span>
                                    {wasSelected && (
                                      <span className="ml-auto text-[9px] font-black uppercase bg-slate-800 text-white px-1.5 py-0.2 rounded">
                                        Pupil Choice
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {q.explanation && (
                              <p className="text-[11px] text-slate-500 italic pt-1">
                                💡 <strong>Explanation:</strong> {q.explanation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* SECTION B: THEORY QUESTIONS BREAKDOWN */}
            {(() => {
              const exam = cbtExams.find(e => e.id === inspectingAttempt.examId);
              const theoryQuestions = exam?.theoryQuestions || [];

              if (theoryQuestions.length === 0) return null;

              return (
                <div className="space-y-4 pt-2">
                  <h4 className="font-serif font-bold text-sm text-[#0B3D27] flex items-center gap-2 border-b pb-2">
                    <span>Section B: Theory & Working Answers ({theoryQuestions.length} Items)</span>
                  </h4>

                  <div className="space-y-4">
                    {theoryQuestions.map((tq, tIdx) => {
                      const studentText = (inspectingAttempt.theoryAnswers || {})[tq.id] || 'No written response submitted.';
                      const scoredMarks = (inspectingAttempt.theoryScores || {})[tq.id] ?? (inspectingAttempt.theoryGraded ? inspectingAttempt.theoryScore : 0);
                      const feedback = (inspectingAttempt.theoryFeedback || {})[tq.id];

                      return (
                        <div key={tq.id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-900">Theory Question #{tIdx + 1}</span>
                            <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                              Score: {scoredMarks} / {tq.maxMarks} Marks
                            </span>
                          </div>

                          <p className="font-semibold text-slate-800">{tq.questionText}</p>

                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                              Pupil's Submitted Written Workings:
                            </span>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                              {studentText}
                            </div>
                          </div>

                          {feedback && (
                            <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-[11px]">
                              <strong>Teacher Correction & Feedback:</strong> {feedback}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setInspectingAttempt(null)}
                className="px-5 py-2 text-xs bg-[#0B3D27] hover:bg-emerald-900 text-[#D4AF37] font-bold rounded-xl shadow"
              >
                Close Script Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CBT Exam Module Tab */}
      {activeTab === 'cbt' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          {!verifiedCBTStudent ? (
            /* --- STEP 1: STUDENT CREDENTIAL ENTRY GATE --- */
            <div className="bg-white p-8 md:p-10 rounded-3xl border-2 border-[#D4AF37] shadow-xl space-y-6">
              <div className="text-center space-y-2 border-b border-slate-100 pb-6">
                <div className="w-14 h-14 bg-[#0B3D27]/10 text-[#0B3D27] rounded-full flex items-center justify-center mx-auto mb-2 border border-[#D4AF37]">
                  <User className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-[#0B3D27]">
                  Student CBT Portal Verification
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Select your Class and your Pupil Name from the official admitted student registry to access your scheduled CBT examinations.
                </p>
              </div>

              <form onSubmit={handleCBTStudentVerification} className="space-y-5 max-w-lg mx-auto">
                <div>
                  <label className="block text-xs font-bold text-[#0B3D27] mb-1">
                    1. Select Class Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={cbtSelectedClass}
                    onChange={e => {
                      const newClass = e.target.value;
                      setCbtSelectedClass(newClass);
                      const firstInClass = students.find(s => s.className === newClass);
                      if (firstInClass) {
                        setCbtSelectedStudentId(firstInClass.id);
                      } else {
                        setCbtSelectedStudentId('');
                      }
                    }}
                    className="w-full p-3 text-sm font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B3D27] focus:border-transparent outline-none bg-slate-50 text-[#0B3D27]"
                  >
                    {['Pre-Nursery', 'Nursery 1', 'Nursery 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'].map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B3D27] mb-1">
                    2. Select Admitted Student <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={cbtSelectedStudentId}
                    onChange={e => setCbtSelectedStudentId(e.target.value)}
                    className="w-full p-3 text-sm font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B3D27] focus:border-transparent outline-none bg-slate-50 text-slate-800"
                  >
                    {students
                      .filter(s => s.className === cbtSelectedClass)
                      .map(s => (
                        <option key={s.id} value={s.id}>
                          {s.fullName} ({s.admissionNo})
                        </option>
                      ))}
                    {students.filter(s => s.className === cbtSelectedClass).length === 0 && (
                      <option value="">No registered pupils found in {cbtSelectedClass}</option>
                    )}
                  </select>
                </div>

                {/* AUTO POPUP: Verified Student Details */}
                {selectedCbtStudent && (
                  <div className="bg-emerald-50 border-2 border-[#D4AF37] p-4 rounded-2xl flex items-center gap-4 animate-fadeIn shadow-sm">
                    <img
                      src={selectedCbtStudent.passportPhotoUrl}
                      alt={selectedCbtStudent.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-md shrink-0"
                    />
                    <div className="grow space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0B3D27] text-sm font-serif">
                          {selectedCbtStudent.fullName}
                        </span>
                        <span className="bg-emerald-200 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          ✓ ADMITTED
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-mono">
                        Admission No: <strong className="text-[#0B3D27]">{selectedCbtStudent.admissionNo}</strong>
                      </p>
                      <p className="text-xs text-slate-600">
                        Class: <strong>{selectedCbtStudent.className}</strong> • Parent: {selectedCbtStudent.parentName} ({selectedCbtStudent.parentPhone})
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedCbtStudent}
                  className="w-full py-3.5 bg-[#0B3D27] hover:bg-emerald-900 disabled:opacity-50 text-[#D4AF37] font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                  <span>Access Scheduled Examination Portal</span>
                </button>
              </form>
            </div>
          ) : (
            /* --- STEP 2: VERIFIED STUDENT CBT EXAMINATION PORTAL --- */
            <div className="space-y-6">
              {/* Verified Student Information Header Bar */}
              <div className="bg-[#0B3D27] text-white p-5 rounded-2xl border border-[#D4AF37] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full flex items-center justify-center font-bold text-[#D4AF37]">
                    {verifiedCBTStudent.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-base text-[#F9F6EF]">
                        {verifiedCBTStudent.fullName}
                      </span>
                      <span className="text-[10px] font-bold bg-[#D4AF37] text-[#0B3D27] px-2 py-0.5 rounded-full uppercase">
                        {verifiedCBTStudent.className}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200 font-mono">
                      Admission No: {verifiedCBTStudent.admissionNo}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setVerifiedCBTStudent(null)}
                  className="text-xs font-bold text-[#D4AF37] hover:underline bg-[#0B3D27] hover:bg-emerald-900 px-3 py-1.5 rounded-lg border border-[#D4AF37]/40 transition-colors"
                >
                  ✏️ Switch Student / Re-enter Details
                </button>
              </div>

              {/* SCHEDULED EXAM STATES DISPLAY */}

              {/* STATE 1: ACTIVE SCHEDULED EXAM NOW */}
              {activeScheduledExams.length > 0 ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-xl font-bold font-serif text-[#0B3D27] flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Active Scheduled CBT Examination</span>
                    </h3>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                      🟢 Live Now
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {activeScheduledExams.map(exam => (
                      <div
                        key={exam.id}
                        className="bg-white p-6 rounded-3xl border-2 border-[#D4AF37] shadow-xl space-y-5 hover:border-emerald-700 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                              {exam.subject} • {exam.className}
                            </span>
                            <h4 className="text-xl font-bold font-serif text-[#0B3D27] mt-1">{exam.title}</h4>
                          </div>
                          {exam.scheduleEnd && (
                            <div className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-amber-600" />
                              <span>Closes: {new Date(exam.scheduleEnd).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                          <strong>Instructions:</strong> {exam.instructions}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                          <div>⏱️ Duration: <strong className="block text-sm text-[#0B3D27]">{exam.durationMinutes} Mins</strong></div>
                          <div>❓ Questions: <strong className="block text-sm text-[#0B3D27]">{exam.questions.length} Items</strong></div>
                          <div>💯 Total Marks: <strong className="block text-sm text-[#0B3D27]">{exam.totalMarks} Points</strong></div>
                          <div>🎯 Pass Score: <strong className="block text-sm text-[#0B3D27]">{exam.passingScorePercent}%</strong></div>
                        </div>

                        <button
                          onClick={() => setActiveExamToRun(exam)}
                          className="w-full py-4 bg-[#0B3D27] hover:bg-emerald-900 text-[#D4AF37] font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Play className="w-5 h-5 fill-current text-[#D4AF37]" />
                          <span>Start Scheduled Examination Now</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : upcomingScheduledExams.length > 0 ? (
                /* STATE 2: NO EXAM NOW, BUT NEXT UPCOMING SCHEDULED EXAM EXISTS */
                <div className="bg-white p-8 rounded-3xl border-2 border-[#D4AF37]/60 shadow-lg space-y-6 animate-fade-in text-center">
                  <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full text-xs font-bold border border-amber-300">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span>Next Examination Scheduled</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {upcomingScheduledExams[0].subject} — {upcomingScheduledExams[0].className}
                    </span>
                    <h3 className="text-2xl font-bold font-serif text-[#0B3D27]">
                      {upcomingScheduledExams[0].title}
                    </h3>
                  </div>

                  <div className="bg-gradient-to-r from-[#0B3D27] to-emerald-900 text-white p-6 rounded-2xl border border-[#D4AF37] max-w-xl mx-auto space-y-2 shadow-inner">
                    <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-widest">
                      📅 Scheduled Date & Time
                    </p>
                    <p className="text-xl md:text-2xl font-serif font-bold text-white">
                      {new Date(upcomingScheduledExams[0].scheduleStart!).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-base font-bold text-emerald-200">
                      ⏰ {new Date(upcomingScheduledExams[0].scheduleStart!).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600">
                    <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold">
                      ⏱️ Duration: <strong>{upcomingScheduledExams[0].durationMinutes} mins</strong>
                    </span>
                    <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold">
                      ❓ Questions: <strong>{upcomingScheduledExams[0].questions.length} items</strong>
                    </span>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 max-w-lg mx-auto leading-relaxed font-medium">
                    ⏳ The exam portal is locked. Your exam will pop up automatically at the scheduled date and time above.
                  </div>
                </div>
              ) : (
                /* STATE 3: NO EXAM SCHEDULED AT ALL */
                <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4 max-w-lg mx-auto animate-fade-in">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 border border-slate-200">
                    <Calendar className="w-8 h-8 text-slate-500" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold font-serif text-[#0B3D27]">
                      No Exam Scheduled
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      There are currently no online CBT examinations scheduled for <strong>{verifiedCBTStudent.fullName}</strong> in <strong>{verifiedCBTStudent.className}</strong>.
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    Please check back according to your school exam timetable or contact the Academic Directorate for further updates.
                  </p>
                </div>
              )}

              {/* Past Exam Attempts History Table */}
              {studentAttempts.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <h3 className="text-lg font-bold font-serif text-[#0B3D27] flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
                    <span>Your Previous CBT Examination Records</span>
                  </h3>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0B3D27] text-white">
                        <tr>
                          <th className="p-3 font-bold">Exam Title</th>
                          <th className="p-3 font-bold">Assessment Type</th>
                          <th className="p-3 font-bold">Score</th>
                          <th className="p-3 font-bold">Percentage</th>
                          <th className="p-3 font-bold">Status</th>
                          <th className="p-3 font-bold">Date Taken</th>
                          <th className="p-3 font-bold text-right">Script</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {studentAttempts.map(att => {
                          const typeTag = att.assessmentType === '1st_test'
                            ? '1st Test'
                            : att.assessmentType === '2nd_test'
                            ? '2nd Test'
                            : 'Exam';
                          return (
                            <tr key={att.id}>
                              <td className="p-3 font-bold text-slate-800">{att.examTitle}</td>
                              <td className="p-3">
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border">
                                  {typeTag}
                                </span>
                              </td>
                              <td className="p-3 font-semibold">{att.scoreObtained} / {att.totalMarks}</td>
                              <td className="p-3 font-bold text-emerald-800">{att.percentage.toFixed(1)}%</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                  att.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {att.passed ? 'PASSED' : 'FAILED'}
                                </span>
                              </td>
                              <td className="p-3 text-slate-500">{new Date(att.submittedAt).toLocaleDateString()}</td>
                              <td className="p-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => setInspectingAttempt(att)}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-[#0B3D27] border border-emerald-300 px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 ml-auto"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>View Script</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
