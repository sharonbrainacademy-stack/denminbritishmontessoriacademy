import React, { useState } from 'react';
import {
  Shield,
  Users,
  GraduationCap,
  CreditCard,
  Calendar,
  FileCheck,
  Laptop,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Search,
  Settings,
  Layers,
  FileSpreadsheet,
  FileText,
  UserCheck,
  Check,
  X
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { BulkQuestionUploadModal } from '../components/cbt/BulkQuestionUploadModal';
import { generateResultSlipPDF, generatePaymentReceiptPDF } from '../utils/pdfHelpers';
import {
  Student,
  CBTExam,
  CBTQuestion,
  CBTTheoryQuestion,
  FeePayment,
  ResultSlip,
  Teacher,
  AdmissionApplication
} from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    schoolInfo,
    updateSchoolInfo,
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    teachers,
    addTeacher,
    deleteTeacher,
    cbtExams,
    saveCBTExam,
    deleteCBTExam,
    cbtAttempts,
    updateCBTAttempt,
    feePayments,
    addFeePayment,
    resultSlips,
    saveResultSlip,
    publishResultSlip,
    admissionApplications,
    updateAdmissionStatus,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'students' | 'cbt' | 'fees' | 'results' | 'teachers' | 'admissions' | 'settings'>('students');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk Question Upload Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedExamForBulk, setSelectedExamForBulk] = useState<CBTExam | null>(null);

  // Student Add / Edit Modal
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    admissionNumber: '',
    classLevel: 'Primary 1',
    arm: 'A',
    gender: 'Male' as 'Male' | 'Female',
    dateOfBirth: '2016-01-01',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    residentialAddress: 'Benin City, Edo State',
    bloodGroup: 'O+',
    genotype: 'AA',
  });

  // CBT Exam Modal
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examForm, setExamForm] = useState({
    title: '',
    assessmentType: 'first_test' as 'first_test' | 'second_test' | 'exam',
    subject: 'Mathematics',
    classLevel: 'Primary 1',
    term: schoolInfo.currentTerm || '1st Term',
    session: schoolInfo.academicSession || '2024/2025',
    durationMinutes: 40,
    passMark: 50,
  });

  // Fee Payment Modal
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [feeForm, setFeeForm] = useState({
    studentId: '',
    classLevel: 'Primary 1',
    session: schoolInfo.academicSession || '2024/2025',
    term: schoolInfo.currentTerm || '1st Term',
    feeType: 'Tuition Fee' as any,
    amountExpected: 45000,
    amountPaid: 45000,
    paymentMethod: 'bank_transfer' as any,
    notes: '',
  });

  // Generate admission number helper: SBA/YYYY/001
  const generateAdmissionNumber = () => {
    const year = new Date().getFullYear();
    const count = students.length + 1;
    return `SBA/${year}/${count.toString().padStart(3, '0')}`;
  };

  const handleOpenAddStudent = () => {
    setEditingStudentId(null);
    setStudentForm({
      fullName: '',
      admissionNumber: generateAdmissionNumber(),
      classLevel: 'Primary 1',
      arm: 'A',
      gender: 'Male',
      dateOfBirth: '2016-01-01',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      residentialAddress: 'Benin City, Edo State',
      bloodGroup: 'O+',
      genotype: 'AA',
    });
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudent = (s: Student) => {
    setEditingStudentId(s.id);
    setStudentForm({
      fullName: s.fullName,
      admissionNumber: s.admissionNumber || s.admissionNo || '',
      classLevel: s.classLevel || s.className || 'Primary 1',
      arm: s.arm || 'A',
      gender: s.gender,
      dateOfBirth: s.dateOfBirth,
      parentName: s.parentName,
      parentPhone: s.parentPhone,
      parentEmail: s.parentEmail || '',
      residentialAddress: s.residentialAddress || s.address || '',
      bloodGroup: s.bloodGroup || 'O+',
      genotype: s.genotype || 'AA',
    });
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudentId) {
      updateStudent(editingStudentId, {
        ...studentForm,
        admissionNo: studentForm.admissionNumber,
        className: studentForm.classLevel,
        address: studentForm.residentialAddress,
      });
    } else {
      await addStudent({
        ...studentForm,
        admissionNo: studentForm.admissionNumber,
        className: studentForm.classLevel,
        address: studentForm.residentialAddress,
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'active',
      });
    }
    setIsStudentModalOpen(false);
  };

  // Create new CBT exam
  const handleSaveExam = (e: React.FormEvent) => {
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
      createdBy: 'Administrator',
      createdAt: new Date().toISOString(),
    };

    saveCBTExam(newExam);
    setIsExamModalOpen(false);
    // Directly open Bulk Question Upload so admin can load questions easily!
    setSelectedExamForBulk(newExam);
    setIsBulkModalOpen(true);
  };

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

  // Handle Fee Payment submission
  const handleSaveFee = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s: Student) => s.id === feeForm.studentId);
    if (!st) return;

    const balance = Math.max(0, feeForm.amountExpected - feeForm.amountPaid);
    addFeePayment({
      studentId: st.id,
      studentName: st.fullName,
      admissionNumber: st.admissionNumber || st.admissionNo,
      classLevel: st.classLevel || st.className,
      session: feeForm.session,
      term: feeForm.term,
      feeType: feeForm.feeType,
      amountExpected: feeForm.amountExpected,
      amountPaid: feeForm.amountPaid,
      balanceRemaining: balance,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: feeForm.paymentMethod,
      recordedBy: 'Admin Bursar',
      notes: feeForm.notes,
    });
    setIsFeeModalOpen(false);
  };

  // Filter students by search
  const filteredStudents = students.filter(
    (s: Student) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.admissionNumber || s.admissionNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.classLevel || s.className || '').toLowerCase().includes(searchQuery.toLowerCase())
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

      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30">
            <Shield className="w-3.5 h-3.5" /> Sharon Brain Academy Central Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Executive Admin Dashboard</h1>
          <p className="text-xs text-slate-400">
            Proprietor: <strong className="text-white">{schoolInfo.principalName}</strong> &bull; Session: <strong className="text-emerald-400">{schoolInfo.academicSession} ({schoolInfo.currentTerm})</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAddStudent}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add New Student
          </button>
          <button
            onClick={() => setIsExamModalOpen(true)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Test / Exam
          </button>
        </div>
      </div>

      {/* Quick Stat Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Enrolled Students</span>
          <p className="text-2xl font-black text-slate-900">{students.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Real active learners</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">CBT Tests & Exams</span>
          <p className="text-2xl font-black text-slate-900">{cbtExams.length}</p>
          <span className="text-[11px] text-teal-600 font-medium">Objective & Theory</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Candidate Attempts</span>
          <p className="text-2xl font-black text-slate-900">{cbtAttempts.length}</p>
          <span className="text-[11px] text-blue-600 font-medium">Continuous assessments</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Academic Staff</span>
          <p className="text-2xl font-black text-slate-900">{teachers.length}</p>
          <span className="text-[11px] text-purple-600 font-medium">Certified instructors</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'students', label: `Student Roster (${students.length})`, icon: GraduationCap },
          { id: 'cbt', label: `CBT Assessments & Bulk Upload (${cbtExams.length})`, icon: Laptop },
          { id: 'fees', label: `School Fees & Receipts (${feePayments.length})`, icon: CreditCard },
          { id: 'results', label: `Term Result Sheets (${resultSlips.length})`, icon: FileCheck },
          { id: 'teachers', label: `Faculty Staff (${teachers.length})`, icon: Users },
          { id: 'admissions', label: `Online Applications (${admissionApplications.length})`, icon: FileText },
          { id: 'settings', label: 'School Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
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

      {/* TAB 1: STUDENT ROSTER (ZERO SAMPLE STUDENTS) */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Enrolled Students Roster</h3>
              <p className="text-xs text-slate-500">
                All sample students have been removed. Only genuine students added by you appear here.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student or Adm No..."
                  className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                onClick={handleOpenAddStudent}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Add Student
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Admission No</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Parent Name & Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st: Student) => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-emerald-800">{st.admissionNumber || st.admissionNo}</td>
                    <td className="p-3 font-semibold text-slate-900">{st.fullName}</td>
                    <td className="p-3">{st.classLevel || st.className} {st.arm ? `(${st.arm})` : ''}</td>
                    <td className="p-3">{st.gender}</td>
                    <td className="p-3 text-slate-600">
                      {st.parentName} &bull; {st.parentPhone}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {st.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditStudent(st)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 rounded hover:bg-slate-100"
                          title="Edit Student"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete student "${st.fullName}" (${st.admissionNumber})?`)) {
                              deleteStudent(st.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-600 rounded hover:bg-slate-100"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-600 text-sm">No students currently on the roster</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Click "Add New Student" above to enroll your students into Sharon Brain Academy.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CBT ASSESSMENTS & BULK QUESTION UPLOAD */}
      {activeTab === 'cbt' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                CBT Examination & Continuous Assessment Question Bank
              </h3>
              <p className="text-xs text-slate-500">
                Create 1st Test, 2nd Test, and Terminal CBT Exams. Bulk upload Objective & Theory questions via Excel or paste text.
              </p>
            </div>

            <button
              onClick={() => setIsExamModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Test / Exam
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
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {exam.assessmentType?.toUpperCase().replace('_', ' ') || 'EXAM'}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {exam.classLevel}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base">{exam.title}</h4>
                  <p className="text-xs text-slate-500">
                    Subject: <strong className="text-slate-800">{exam.subject}</strong> &bull; {exam.durationMinutes} Mins &bull; Total Marks: {exam.totalMarks}
                  </p>

                  <div className="pt-2 text-xs text-slate-600 flex items-center gap-3">
                    <span className="bg-slate-100 px-2.5 py-1 rounded font-medium">
                      {exam.questions.length} Section A (Objective)
                    </span>
                    <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded font-medium">
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
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow flex items-center justify-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5" /> Bulk Upload Questions
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete exam "${exam.title}"?`)) {
                        deleteCBTExam(exam.id);
                      }
                    }}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Exam"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {cbtExams.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              <Laptop className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-600 text-sm">No CBT Assessments configured yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Click "Create Test / Exam" above to add 1st continuous assessment test, 2nd test, or terminal exams.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FEES & RECEIPTS */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">School Fees & Payment Bursary</h3>
              <p className="text-xs text-slate-500">Record school fee payments and generate printable official receipts.</p>
            </div>
            <button
              onClick={() => setIsFeeModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Record New Payment
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                <tr>
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Student Name (Adm No)</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Fee Type</th>
                  <th className="p-3">Amount Paid</th>
                  <th className="p-3">Balance</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feePayments.map((p: FeePayment) => {
                  const st = students.find((s: Student) => s.id === p.studentId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-emerald-800">{p.receiptNo}</td>
                      <td className="p-3 font-semibold text-slate-900">
                        {p.studentName} ({p.admissionNumber})
                      </td>
                      <td className="p-3">{p.classLevel}</td>
                      <td className="p-3">{p.feeType}</td>
                      <td className="p-3 font-bold text-emerald-700">NGN {p.amountPaid.toLocaleString()}</td>
                      <td className="p-3">
                        {(p.balanceRemaining ?? p.balance ?? 0) > 0 ? (
                          <span className="text-rose-600 font-bold">NGN {(p.balanceRemaining ?? p.balance ?? 0).toLocaleString()}</span>
                        ) : (
                          <span className="text-emerald-700 font-bold">Cleared</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-400">{p.paymentDate}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => generatePaymentReceiptPDF(p, st, schoolInfo)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded flex items-center gap-1 ml-auto"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-600" /> PDF Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {feePayments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No fee payment records recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RESULTS */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Termly Result Management</h3>
            <p className="text-xs text-slate-500">
              View, edit, and publish termly composite result slips for students.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Admission No</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Term & Session</th>
                  <th className="p-3">Average %</th>
                  <th className="p-3">Position</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resultSlips.map((res: ResultSlip) => {
                  const st = students.find((s: Student) => s.id === res.studentId);
                  return (
                    <tr key={res.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{res.studentName}</td>
                      <td className="p-3 font-mono font-bold text-emerald-800">{res.admissionNumber || res.admissionNo}</td>
                      <td className="p-3">{res.classLevel || res.className}</td>
                      <td className="p-3">{res.session || res.academicSession} - {res.term}</td>
                      <td className="p-3 font-bold text-emerald-700">{(res.averageScore ?? res.average ?? 0).toFixed(1)}%</td>
                      <td className="p-3">{res.position || 'N/A'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          (res.status === 'published' || res.isPublished)
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {(res.status || (res.isPublished ? 'published' : 'draft')).toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!res.isPublished && res.status !== 'published' && (
                            <button
                              onClick={() => publishResultSlip(res.id)}
                              className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded hover:bg-emerald-700"
                            >
                              Publish
                            </button>
                          )}
                          <button
                            onClick={() => generateResultSlipPDF(res, st, schoolInfo)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {resultSlips.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No result slips generated yet for this term.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: TEACHERS */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Faculty & Academic Staff</h3>
            <p className="text-xs text-slate-500">TRCN-certified teachers and subject specialists</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((tch: Teacher) => (
              <div key={tch.id} className="p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={tch.photoUrl}
                    alt={tch.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{tch.fullName}</h4>
                  <p className="text-[11px] text-emerald-700 font-semibold">{tch.role}</p>
                  <p className="text-[11px] text-slate-500">Class: <strong>{tch.assignedClass}</strong></p>
                  <p className="text-[11px] text-slate-400">{tch.qualification}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ONLINE ADMISSIONS */}
      {activeTab === 'admissions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Online Admission Applications</h3>
            <p className="text-xs text-slate-500">Applications submitted from the public admissions form</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                <tr>
                  <th className="p-3">Child Name</th>
                  <th className="p-3">Class Applying</th>
                  <th className="p-3">Parent Name & Phone</th>
                  <th className="p-3">Application Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admissionApplications.map((app: AdmissionApplication) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">{app.childFullName}</td>
                    <td className="p-3">{app.applyingForClass}</td>
                    <td className="p-3">{app.parentFullName} ({app.parentPhone})</td>
                    <td className="p-3 text-slate-400">{new Date(app.applicationDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        app.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-700'
                          : app.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updateAdmissionStatus(app.id, 'accepted')}
                          className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateAdmissionStatus(app.id, 'rejected')}
                          className="px-2 py-1 bg-rose-600 text-white text-[10px] font-bold rounded"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {admissionApplications.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No new admission applications submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 max-w-2xl">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">School Institutional Settings</h3>
            <p className="text-xs text-slate-500">Configure school name, address, current session, and term</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">School Name</label>
              <input
                type="text"
                value={schoolInfo.name}
                onChange={(e) => updateSchoolInfo({ name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Campus Address</label>
              <input
                type="text"
                value={schoolInfo.address}
                onChange={(e) => updateSchoolInfo({ address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Academic Session</label>
                <input
                  type="text"
                  value={schoolInfo.academicSession}
                  onChange={(e) => updateSchoolInfo({ academicSession: e.target.value })}
                  placeholder="e.g. 2024/2025"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Current Term</label>
                <select
                  value={schoolInfo.currentTerm}
                  onChange={(e) => updateSchoolInfo({ currentTerm: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="1st Term">1st Term</option>
                  <option value="2nd Term">2nd Term</option>
                  <option value="3rd Term">3rd Term</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  value={schoolInfo.phone}
                  onChange={(e) => updateSchoolInfo({ phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={schoolInfo.email}
                  onChange={(e) => updateSchoolInfo({ email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Proprietor / Principal Name</label>
              <input
                type="text"
                value={schoolInfo.principalName}
                onChange={(e) => updateSchoolInfo({ principalName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT STUDENT */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingStudentId ? 'Edit Student Details' : 'Enroll New Genuine Student'}
              </h3>
              <button onClick={() => setIsStudentModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.fullName}
                    onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                    placeholder="e.g. Osahon Emmanuel"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Admission Number *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.admissionNumber}
                    onChange={(e) => setStudentForm({ ...studentForm, admissionNumber: e.target.value })}
                    placeholder="SBA/2024/001"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Class Level *</label>
                  <select
                    value={studentForm.classLevel}
                    onChange={(e) => setStudentForm({ ...studentForm, classLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Creche">Creche</option>
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
                  <label className="block font-bold text-slate-700 uppercase mb-1">Gender *</label>
                  <select
                    value={studentForm.gender}
                    onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={studentForm.dateOfBirth}
                    onChange={(e) => setStudentForm({ ...studentForm, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Parent Phone *</label>
                  <input
                    type="tel"
                    required
                    value={studentForm.parentPhone}
                    onChange={(e) => setStudentForm({ ...studentForm, parentPhone: e.target.value })}
                    placeholder="e.g. +234 803 123 4567"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Parent / Guardian Full Name *</label>
                <input
                  type="text"
                  required
                  value={studentForm.parentName}
                  onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })}
                  placeholder="e.g. Mr. Osagie"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  {editingStudentId ? 'Save Changes' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE TEST / EXAM */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Create CBT Test or Examination</h3>
              <button onClick={() => setIsExamModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Assessment Title *</label>
                <input
                  type="text"
                  required
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  placeholder="e.g. 1st Continuous Assessment Test - Basic Science"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
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
                  Create & Launch Bulk Upload Questions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD FEE PAYMENT */}
      {isFeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Record Fee Payment</h3>
              <button onClick={() => setIsFeeModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveFee} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Select Student *</label>
                <select
                  required
                  value={feeForm.studentId}
                  onChange={(e) => setFeeForm({ ...feeForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((st: Student) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.admissionNumber || st.admissionNo}) - {st.classLevel || st.className}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Amount Expected (NGN)</label>
                  <input
                    type="number"
                    value={feeForm.amountExpected}
                    onChange={(e) => setFeeForm({ ...feeForm, amountExpected: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Amount Paid (NGN) *</label>
                  <input
                    type="number"
                    required
                    value={feeForm.amountPaid}
                    onChange={(e) => setFeeForm({ ...feeForm, amountPaid: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Payment Method</label>
                <select
                  value={feeForm.paymentMethod}
                  onChange={(e) => setFeeForm({ ...feeForm, paymentMethod: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="pos">POS Terminal</option>
                  <option value="cash">Cash Payment</option>
                </select>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={!feeForm.studentId}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow disabled:opacity-50"
                >
                  Save & Issue Official Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
