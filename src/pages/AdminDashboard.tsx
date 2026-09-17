import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  FileText,
  Settings,
  Plus,
  Trash2,
  Edit,
  Upload,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Globe,
  Bell,
  Printer,
  X,
  Send,
  HelpCircle,
  LogOut,
  RefreshCw,
  Zap,
  Image as ImageIcon,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useSchool } from '../context/SchoolContext';
import { initialTeachers } from '../data/initialData';
import { Student, Teacher, ResultSlip, CBTExam, CBTQuestion, FeePayment, NewsArticle, GalleryPhoto } from '../types';
import { generateResultPDF, generateReceiptPDF } from '../utils/pdfHelpers';

export const AdminDashboard: React.FC = () => {
  const {
    schoolInfo,
    updateSchoolInfo,
    students,
    addStudent,
    deleteStudent,
    teachers,
    addTeacher,
    deleteTeacher,
    resultSlips,
    saveResultSlip,
    deleteResultSlip,
    publishResultSlip,
    cbtExams,
    saveCBTExam,
    deleteCBTExam,
    cbtAttempts,
    feeStructures,
    updateFeeStructure,
    feePayments,
    addFeePayment,
    admissionApplications,
    updateAdmissionStatus,
    newsArticles,
    addNewsArticle,
    deleteNewsArticle,
    galleryPhotos,
    addGalleryPhoto,
    deleteGalleryPhoto,
    currentUser,
    logout,
    resetToDefaults,
  } = useSchool();

  // Asset upload handlers for School Logo and Proprietor Photo
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image is too large. Please select an image file under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateSchoolInfo({ logoUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProprietorFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Photo is too large. Please select an image file under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateSchoolInfo({ principalPhotoUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'students' | 'staff' | 'results' | 'cbt' | 'fees' | 'cms' | 'users' | 'reports' | 'guide'
  >('overview');

  // Student Form Modal State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    admissionNo: `DEN/2024/${Math.floor(100 + Math.random() * 900)}`,
    fullName: '',
    gender: 'Male' as const,
    dateOfBirth: '2016-01-01',
    className: 'Primary 5',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: 'Benin City',
    status: 'Active' as const,
    enrollmentYear: '2024',
  });

  // Teacher Form Modal State
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    staffId: `STF/DEN/${Math.floor(100 + Math.random() * 900)}`,
    fullName: '',
    email: '',
    phone: '',
    role: 'Class Educator',
    selectedClasses: ['Primary 5', 'Primary 4'],
    subjectsInput: 'Mathematics, Basic Science, Quantitative Reasoning',
    qualification: 'B.Ed (UNIBEN), TRCN Certified',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
  });

  const handleAddTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.fullName.trim()) {
      alert('Please enter staff full name');
      return;
    }
    const assignedClassStr = newTeacher.selectedClasses.length > 0
      ? newTeacher.selectedClasses.join(', ')
      : 'All Classes';

    const subjectsArr = newTeacher.subjectsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    addTeacher({
      staffId: newTeacher.staffId || `STF/DEN/${Math.floor(100 + Math.random() * 900)}`,
      fullName: newTeacher.fullName,
      email: newTeacher.email || `${newTeacher.fullName.toLowerCase().replace(/\s+/g, '.')}@denminacademy.edu.ng`,
      phone: newTeacher.phone || '+234 803 000 0000',
      role: newTeacher.role,
      assignedClass: assignedClassStr,
      assignedClasses: newTeacher.selectedClasses,
      subjects: subjectsArr.length > 0 ? subjectsArr : ['General Studies'],
      qualification: newTeacher.qualification,
      photoUrl: newTeacher.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    });

    setShowAddTeacherModal(false);
    setNewTeacher({
      staffId: `STF/DEN/${Math.floor(100 + Math.random() * 900)}`,
      fullName: '',
      email: '',
      phone: '',
      role: 'Class Educator',
      selectedClasses: ['Primary 5'],
      subjectsInput: 'Mathematics, Basic Science',
      qualification: 'B.Ed (UNIBEN), TRCN Certified',
      photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    });
    alert(`New staff member "${newTeacher.fullName}" registered successfully with assigned classes: ${assignedClassStr}`);
  };

  // Result Slip Entry State
  const [showResultModal, setShowResultModal] = useState(false);
  const [editingResult, setEditingResult] = useState<ResultSlip>({
    id: `res_${Date.now()}`,
    studentId: students[0]?.id || 'std_1',
    studentName: students[0]?.fullName || 'Student',
    admissionNo: students[0]?.admissionNo || 'DEN/2024/001',
    className: 'Primary 5',
    academicSession: '2024/2025',
    term: '1st Term',
    subjects: [
      { subject: 'Mathematics', caScore: 25, examScore: 60, total: 85, grade: 'A', remark: 'Excellent' },
      { subject: 'English Language', caScore: 24, examScore: 58, total: 82, grade: 'A', remark: 'Very Good' },
      { subject: 'Science & Tech', caScore: 27, examScore: 62, total: 89, grade: 'A', remark: 'Outstanding' },
    ],
    totalObtained: 256,
    totalPossible: 300,
    average: 85.3,
    positionInClass: 1,
    totalStudentsInClass: 25,
    attendancePresent: 60,
    attendanceTotal: 65,
    classTeacherRemark: 'An outstanding pupil!',
    principalRemark: 'Keep up the high standard.',
    isPublished: true,
  });

  // CBT Exam Modal State
  const [showAddCBTModal, setShowAddCBTModal] = useState(false);
  const [newCBTExam, setNewCBTExam] = useState<CBTExam>({
    id: `cbt_${Date.now()}`,
    title: 'New CBT Term Examination',
    className: 'Primary 5',
    subject: 'General Knowledge',
    durationMinutes: 15,
    totalMarks: 20,
    passingScorePercent: 50,
    shuffleQuestions: true,
    preventTabSwitch: true,
    isPublished: true,
    instructions: 'Answer all questions carefully.',
    createdAt: new Date().toISOString().split('T')[0],
    questions: [
      {
        id: 'q_1',
        questionText: 'What is the capital city of Edo State, Nigeria?',
        options: [
          { id: 'a', text: 'Abuja' },
          { id: 'b', text: 'Benin City' },
          { id: 'c', text: 'Lagos' },
          { id: 'd', text: 'Port Harcourt' },
        ],
        correctOptionId: 'b',
        explanation: 'Benin City is the capital of Edo State.',
        marks: 10,
      },
    ],
  });

  // Fee Payment Record Modal State
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    studentId: students[0]?.id || 'std_1',
    studentName: students[0]?.fullName || 'Eseosa Princess Igbinoba',
    admissionNo: students[0]?.admissionNo || 'DEN/2024/001',
    className: 'Primary 5',
    term: '1st Term',
    session: '2024/2025',
    amountPaid: 225000,
    totalFee: 225000,
    balance: 0,
    paymentMethod: 'Bank Transfer' as const,
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'Full' as const,
  });

  // CMS News Modal State
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [newNews, setNewNews] = useState({
    title: '',
    category: 'Announcement' as const,
    date: new Date().toISOString().split('T')[0],
    author: 'Admin Office',
    summary: '',
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
  });

  // Bulk Excel Import Handler
  const handleBulkExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsName = wb.SheetNames[0];
      const ws = wb.Sheets[wsName];
      const data = XLSX.utils.sheet_to_json<any>(ws);

      data.forEach((row, idx) => {
        if (row.fullName || row.Name) {
          addStudent({
            admissionNo: row.admissionNo || row.AdmissionNo || `DEN/2024/${100 + idx}`,
            fullName: row.fullName || row.Name,
            gender: row.gender || 'Male',
            dateOfBirth: row.dob || '2016-01-01',
            className: row.className || row.Class || 'Primary 5',
            parentName: row.parentName || 'Parent',
            parentPhone: row.parentPhone || '+234 800 000 0000',
            parentEmail: row.parentEmail || 'parent@gmail.com',
            address: row.address || 'Benin City',
            status: 'Active',
            enrollmentYear: '2024',
          });
        }
      });
      alert(`Successfully imported ${data.length} students from Excel!`);
    };
    reader.readAsBinaryString(file);
  };

  const handleExportStudentsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, `Denmin_Students_List_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Header Bar */}
      <div className="bg-[#0B3D27] text-white p-6 rounded-3xl border-2 border-[#D4AF37] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-14 h-14 bg-[#D4AF37] text-[#0B3D27] rounded-2xl flex items-center justify-center font-bold shadow-md shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-serif text-[#F9F6EF]">
              School Admin Management Console
            </h1>
            <p className="text-xs text-emerald-200">
              Welcome, {currentUser?.name || 'Administrator'} • Denmin British Montessori Academy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSubTab('guide')}
            className="bg-[#D4AF37] hover:bg-amber-400 text-[#0B3D27] font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Zero-Code Staff Guide</span>
          </button>

          <button
            onClick={resetToDefaults}
            className="bg-emerald-900 hover:bg-emerald-800 text-emerald-100 font-semibold text-xs px-3 py-2 rounded-xl border border-emerald-700 transition-colors flex items-center gap-1"
            title="Reset All School Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: '1. Overview', icon: BarChart3 },
          { id: 'students', label: '2. Students', icon: GraduationCap },
          { id: 'staff', label: '3. Staff', icon: Users },
          { id: 'results', label: '4. Results Entry', icon: FileText },
          { id: 'cbt', label: '5. CBT Exams', icon: BookOpen },
          { id: 'fees', label: '6. Fees & Receipts', icon: CreditCard },
          { id: 'cms', label: '7. Website CMS', icon: Globe },
          { id: 'users', label: '8. User Accounts', icon: ShieldCheck },
          { id: 'reports', label: '9. Reports', icon: Download },
          { id: 'guide', label: '10. Deployment Guide', icon: HelpCircle },
        ].map(tab => {
          const IconComp = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 border ${
                isActive
                  ? 'bg-[#0B3D27] text-[#D4AF37] border-[#D4AF37] shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500">Total Enrolled Students</span>
              <p className="text-3xl font-bold font-serif text-[#0B3D27]">{students.length}</p>
              <p className="text-[11px] text-emerald-700">Active across Nursery & Primary</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500">Academic Staff & Teachers</span>
              <p className="text-3xl font-bold font-serif text-[#0B3D27]">{teachers.length}</p>
              <p className="text-[11px] text-emerald-700">MCI & TRCN Certified</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500">Pending Admission Apps</span>
              <p className="text-3xl font-bold font-serif text-amber-600">{admissionApplications.filter(a => a.status === 'Pending').length}</p>
              <p className="text-[11px] text-amber-700">Needs Principal Approval</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500">Published CBT Exams</span>
              <p className="text-3xl font-bold font-serif text-[#0B3D27]">{cbtExams.length}</p>
              <p className="text-[11px] text-emerald-700">{cbtAttempts.length} Completed Student Attempts</p>
            </div>
          </div>

          {/* Pending Admission Applications Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-base text-[#0B3D27] flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#D4AF37]" />
                <span>Recent Online Admission Applications</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-3 font-bold">Applicant Name</th>
                    <th className="p-3 font-bold">Proposed Class</th>
                    <th className="p-3 font-bold">Parent Name</th>
                    <th className="p-3 font-bold">Parent Phone</th>
                    <th className="p-3 font-bold">Status</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {admissionApplications.map(app => (
                    <tr key={app.id}>
                      <td className="p-3 font-bold text-[#0B3D27]">{app.applicantName}</td>
                      <td className="p-3">{app.proposedClass}</td>
                      <td className="p-3">{app.parentName}</td>
                      <td className="p-3 font-medium">{app.parentPhone}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {app.status === 'Pending' && (
                          <button
                            onClick={() => updateAdmissionStatus(app.id, 'Approved')}
                            className="bg-emerald-600 text-white font-bold px-3 py-1 rounded text-[11px] hover:bg-emerald-700"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: STUDENT MANAGEMENT */}
      {activeSubTab === 'students' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#0B3D27]">Student Directory & Profile Management</h3>
              <p className="text-xs text-slate-500">Manage student records, bulk import from Excel/CSV, or generate ID Cards</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="bg-emerald-50 hover:bg-emerald-100 text-[#0B3D27] border border-emerald-300 font-bold text-xs px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors">
                <Upload className="w-4 h-4 text-[#D4AF37]" />
                <span>Bulk Import CSV/Excel</span>
                <input type="file" accept=".csv, .xlsx, .xls" onChange={handleBulkExcelImport} className="hidden" />
              </label>

              <button
                onClick={handleExportStudentsExcel}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-300 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Excel</span>
              </button>

              <button
                onClick={() => setShowAddStudentModal(true)}
                className="bg-[#0B3D27] hover:bg-emerald-900 text-[#D4AF37] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Student</span>
              </button>
            </div>
          </div>

          {/* Students Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0B3D27] text-white">
                  <th className="p-3 font-bold">Admission No</th>
                  <th className="p-3 font-bold">Full Name</th>
                  <th className="p-3 font-bold">Class Level</th>
                  <th className="p-3 font-bold">Parent Name</th>
                  <th className="p-3 font-bold">Parent Phone</th>
                  <th className="p-3 font-bold text-center">Status</th>
                  <th className="p-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">{s.admissionNo}</td>
                    <td className="p-3 font-bold text-[#0B3D27]">{s.fullName}</td>
                    <td className="p-3">{s.className}</td>
                    <td className="p-3">{s.parentName}</td>
                    <td className="p-3">{s.parentPhone}</td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteStudent(s.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete Student Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: STAFF MANAGEMENT */}
      {activeSubTab === 'staff' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#0B3D27]">Staff & Teacher Directory</h3>
              <p className="text-xs text-slate-500">Manage academic staff, teachers, roles, and subject assignments</p>
            </div>

            <div className="flex items-center gap-2">
              {teachers.length === 0 && (
                <button
                  onClick={() => {
                    initialTeachers.forEach(t => addTeacher(t));
                    alert('Restored default school staff members to database successfully!');
                  }}
                  className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-amber-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Sample Staff</span>
                </button>
              )}

              <button
                onClick={() => setShowAddTeacherModal(true)}
                className="bg-[#0B3D27] text-[#D4AF37] hover:bg-emerald-900 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Teacher</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(teachers.length > 0 ? teachers : initialTeachers).map(t => (
              <div key={t.id} className="p-5 rounded-2xl border-2 border-slate-200 hover:border-[#D4AF37] transition-all bg-white shadow-sm space-y-4 relative group">
                <button
                  onClick={() => deleteTeacher(t.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                  title="Remove Staff Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow shrink-0">
                    <img src={t.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300'} alt={t.fullName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold font-serif text-sm text-[#0B3D27]">{t.fullName}</h4>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {t.role}
                    </span>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">ID: {t.staffId}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-700 space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <strong className="block text-slate-800 text-[11px] mb-1">Assigned Classes ({t.assignedClasses?.length || t.assignedClass.split(',').length}):</strong>
                    <div className="flex flex-wrap gap-1">
                      {(t.assignedClasses || t.assignedClass.split(',')).map((clsName, i) => (
                        <span key={i} className="text-[10px] font-extrabold bg-[#0B3D27] text-[#D4AF37] px-2 py-0.5 rounded-md shadow-xs">
                          {clsName.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p><strong>Subjects Taught:</strong> <span className="text-slate-600">{Array.isArray(t.subjects) ? t.subjects.join(', ') : t.subjects}</span></p>
                  <p><strong>Email:</strong> <span className="text-slate-600">{t.email}</span></p>
                  <p><strong>Phone:</strong> <span className="text-slate-600">{t.phone}</span></p>
                  <p className="text-[11px] text-slate-500 italic mt-1 pt-1 border-t border-slate-200">
                    {t.qualification}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: RESULTS MANAGEMENT */}
      {activeSubTab === 'results' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#0B3D27]">Termly Results & Score Entry</h3>
              <p className="text-xs text-slate-500">Enter Continuous Assessment (C.A) and Exam test scores for pupils & publish result slips live to the portal</p>
            </div>

            <button
              onClick={() => {
                const defaultStudent = students[0];
                setEditingResult({
                  id: `res_${Date.now()}`,
                  studentId: defaultStudent?.id || 'std_1',
                  studentName: defaultStudent?.fullName || 'Samuel Okon',
                  admissionNo: defaultStudent?.admissionNo || 'DEN/2024/001',
                  className: defaultStudent?.className || 'Primary 5',
                  academicSession: '2024/2025',
                  term: '1st Term',
                  subjects: [
                    { subject: 'Mathematics', caScore: 25, examScore: 60, total: 85, grade: 'A', remark: 'Excellent' },
                    { subject: 'English Language', caScore: 24, examScore: 58, total: 82, grade: 'A', remark: 'Very Good' },
                    { subject: 'Basic Science & Tech', caScore: 26, examScore: 61, total: 87, grade: 'A', remark: 'Outstanding' },
                    { subject: 'Social Studies & Civic', caScore: 22, examScore: 55, total: 77, grade: 'A', remark: 'Very Good' },
                    { subject: 'Agricultural Science', caScore: 23, examScore: 52, total: 75, grade: 'A', remark: 'Very Good' },
                    { subject: 'Computer Studies', caScore: 25, examScore: 60, total: 85, grade: 'A', remark: 'Excellent' },
                  ],
                  totalObtained: 491,
                  totalPossible: 600,
                  average: 81.8,
                  positionInClass: 1,
                  totalStudentsInClass: 25,
                  attendancePresent: 62,
                  attendanceTotal: 65,
                  classTeacherRemark: 'An exemplary, highly disciplined and intelligent pupil.',
                  principalRemark: 'Promoted to next level. Outstanding performance.',
                  isPublished: true,
                  publishedAt: new Date().toISOString().split('T')[0],
                });
                setShowResultModal(true);
              }}
              className="bg-[#0B3D27] hover:bg-emerald-900 text-[#D4AF37] font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Enter New Student Test Scores & Result</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0B3D27] text-white">
                  <th className="p-3 font-bold">Student Name</th>
                  <th className="p-3 font-bold">Admission No</th>
                  <th className="p-3 font-bold">Class Level</th>
                  <th className="p-3 font-bold">Term & Session</th>
                  <th className="p-3 font-bold">Average Score</th>
                  <th className="p-3 font-bold">Class Position</th>
                  <th className="p-3 font-bold text-center">Status</th>
                  <th className="p-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {resultSlips.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-[#0B3D27]">{res.studentName}</td>
                    <td className="p-3 font-mono">{res.admissionNo}</td>
                    <td className="p-3">{res.className}</td>
                    <td className="p-3">{res.term} ({res.academicSession})</td>
                    <td className="p-3 font-bold text-emerald-800">{res.average.toFixed(1)}%</td>
                    <td className="p-3 font-bold"># {res.positionInClass}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        res.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {res.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => {
                          setEditingResult(res);
                          setShowResultModal(true);
                        }}
                        className="bg-emerald-50 hover:bg-emerald-100 text-[#0B3D27] border border-emerald-300 px-2.5 py-1 rounded text-[11px] font-bold"
                      >
                        ✏️ Edit Scores
                      </button>
                      <button
                        onClick={() => generateResultPDF(res, schoolInfo)}
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-2.5 py-1 rounded text-[11px] font-bold"
                      >
                        📄 PDF Slip
                      </button>
                      <button
                        onClick={() => deleteResultSlip(res.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded"
                        title="Delete Result Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: CBT EXAM MANAGEMENT */}
      {activeSubTab === 'cbt' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#0B3D27]">Online CBT Exam Management</h3>
              <p className="text-xs text-slate-500">Create timed multiple-choice exams with anti-cheat tab switch prevention</p>
            </div>

            <button
              onClick={() => setShowAddCBTModal(true)}
              className="bg-[#0B3D27] text-[#D4AF37] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Create New CBT Exam</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cbtExams.map(exam => (
              <div key={exam.id} className="p-5 rounded-2xl border border-slate-200 space-y-3 bg-white hover:border-[#D4AF37] transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                      {exam.subject} — {exam.className}
                    </span>
                    <h4 className="font-bold text-base text-[#0B3D27] mt-1">{exam.title}</h4>
                  </div>
                  <button onClick={() => deleteCBTExam(exam.id)} className="text-slate-400 hover:text-red-600" title="Delete Exam">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-600 grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                  <p>⏱️ Duration: <strong>{exam.durationMinutes} mins</strong></p>
                  <p>❓ Questions: <strong>{exam.questions.length} items</strong></p>
                  <p>🎯 Passing Score: <strong>{exam.passingScorePercent}%</strong></p>
                  <p>🛡️ Anti-Cheat: <strong>{exam.preventTabSwitch ? 'Enabled' : 'Disabled'}</strong></p>
                  <p className="col-span-2 text-[11px] text-amber-900 bg-amber-50 p-1.5 rounded border border-amber-200 font-semibold">
                    📅 Schedule: {exam.scheduleStart ? `${exam.scheduleStart.replace('T', ' ')}` : 'Anytime'} {exam.scheduleEnd ? `to ${exam.scheduleEnd.replace('T', ' ')}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Student Submissions Log Table */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <h4 className="font-serif font-bold text-base text-[#0B3D27]">Submitted Student CBT Exam Records</h4>
            
            {cbtAttempts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                No student exam submissions recorded yet. When pupils complete an exam in the CBT portal, their submissions and scores will appear here automatically.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0B3D27] text-white">
                      <th className="p-3 font-bold">Student Name</th>
                      <th className="p-3 font-bold">Admission No</th>
                      <th className="p-3 font-bold">Exam Title</th>
                      <th className="p-3 font-bold">Score</th>
                      <th className="p-3 font-bold">Percentage</th>
                      <th className="p-3 font-bold">Tab Violations</th>
                      <th className="p-3 font-bold text-center">Outcome</th>
                      <th className="p-3 font-bold text-right">Date Taken</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {cbtAttempts.map(attempt => (
                      <tr key={attempt.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-[#0B3D27]">{attempt.studentName}</td>
                        <td className="p-3 font-mono">{attempt.admissionNo}</td>
                        <td className="p-3 font-semibold">{attempt.examTitle}</td>
                        <td className="p-3 font-bold">{attempt.score} / {attempt.totalMarks}</td>
                        <td className="p-3 font-bold text-emerald-800">{attempt.percentage.toFixed(1)}%</td>
                        <td className="p-3 text-amber-700 font-bold">{attempt.tabSwitchCount || 0} times</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            attempt.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {attempt.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </td>
                        <td className="p-3 text-right text-slate-500">{attempt.dateTaken}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: FEES & PAYMENTS */}
      {activeSubTab === 'fees' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#0B3D27]">Fees & Receipts Management</h3>
              <p className="text-xs text-slate-500">Record payments and issue official A5 fee receipts</p>
            </div>

            <button
              onClick={() => setShowAddPaymentModal(true)}
              className="bg-[#0B3D27] text-[#D4AF37] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Record Fee Payment</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0B3D27] text-white">
                  <th className="p-3 font-bold">Receipt No</th>
                  <th className="p-3 font-bold">Student Name</th>
                  <th className="p-3 font-bold">Class Level</th>
                  <th className="p-3 font-bold">Amount Paid</th>
                  <th className="p-3 font-bold">Balance</th>
                  <th className="p-3 font-bold">Payment Method</th>
                  <th className="p-3 font-bold text-right">Receipt PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {feePayments.map(pay => (
                  <tr key={pay.id}>
                    <td className="p-3 font-mono font-bold">{pay.receiptNo}</td>
                    <td className="p-3 font-bold text-[#0B3D27]">{pay.studentName}</td>
                    <td className="p-3">{pay.className}</td>
                    <td className="p-3 font-bold text-emerald-800">₦{pay.amountPaid.toLocaleString()}</td>
                    <td className="p-3">{pay.balance > 0 ? `₦${pay.balance.toLocaleString()}` : 'FULL'}</td>
                    <td className="p-3">{pay.paymentMethod}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => generateReceiptPDF(pay, schoolInfo)}
                        className="bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded text-[11px] font-bold text-slate-800"
                      >
                        Receipt PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: WEBSITE CMS */}
      {activeSubTab === 'cms' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#0B3D27]">Website Content & Asset Management (CMS)</h3>
              <p className="text-xs text-slate-500">Upload school logos, change proprietor picture, edit welcome message & post news live to Firestore</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Firebase Multi-Device Sync Active
              </span>
            </div>
          </div>

          {/* Section 1: School Logo & Proprietor Media Assets Upload */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="font-serif font-bold text-sm text-[#0B3D27] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                Branding & Asset Upload Manager (School Logo & Proprietor Photo)
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">Supports JPG, PNG, WEBP & SVG (Max 5MB)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. School Logo Box */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#0B3D27]" />
                    School Official Logo
                  </label>
                  {schoolInfo.logoUrl && (
                    <button
                      onClick={() => updateSchoolInfo({ logoUrl: '' })}
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 flex items-center gap-0.5"
                      title="Reset to default icon"
                    >
                      <Trash2 className="w-3 h-3" />
                      Reset
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-[#0B3D27] rounded-xl border-2 border-[#D4AF37] flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                    {schoolInfo.logoUrl ? (
                      <img
                        src={schoolInfo.logoUrl}
                        alt="School Logo"
                        className="w-full h-full object-contain p-1 bg-white"
                      />
                    ) : (
                      <div className="text-center p-1">
                        <GraduationCap className="w-8 h-8 text-[#D4AF37] mx-auto" />
                        <span className="text-[8px] text-amber-200 font-bold block">DEFAULT</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 bg-[#0B3D27] hover:bg-[#145a3b] text-[#D4AF37] text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Logo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-500">
                      Upload transparent PNG or JPG logo file from your device.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Or Paste Image URL / Path</label>
                  <input
                    type="text"
                    value={schoolInfo.logoUrl || ''}
                    onChange={e => updateSchoolInfo({ logoUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border text-xs font-mono text-slate-700 placeholder:text-slate-300"
                    placeholder="https://example.com/school-logo.png"
                  />
                </div>
              </div>

              {/* 2. Proprietor Photo Box */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#0B3D27]" />
                    Proprietor / Executive Picture
                  </label>
                  {schoolInfo.principalPhotoUrl && (
                    <button
                      onClick={() => updateSchoolInfo({ principalPhotoUrl: '/src/assets/images/proprietor_photo_1789616090083.jpg' })}
                      className="text-[10px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                      title="Reset photo"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reset Photo
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-xl border-2 border-[#D4AF37] overflow-hidden shrink-0 shadow-inner">
                    <img
                      src={schoolInfo.principalPhotoUrl || '/src/assets/images/proprietor_photo_1789616090083.jpg'}
                      alt="Proprietor Photo"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 bg-[#0B3D27] hover:bg-[#145a3b] text-[#D4AF37] text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Proprietor Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProprietorFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-500">
                      Select photo from your phone or camera roll. Un-cropped & un-altered.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Or Paste Photo URL / Path</label>
                  <input
                    type="text"
                    value={schoolInfo.principalPhotoUrl || ''}
                    onChange={e => updateSchoolInfo({ principalPhotoUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border text-xs font-mono text-slate-700 placeholder:text-slate-300"
                    placeholder="https://example.com/proprietor.jpg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Text Info & News Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#0B3D27]">Edit School Info & Executive Details</h4>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">School Motto</label>
                <input
                  type="text"
                  value={schoolInfo.motto}
                  onChange={e => updateSchoolInfo({ motto: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Proprietor Name</label>
                  <input
                    type="text"
                    value={schoolInfo.principalName}
                    onChange={e => updateSchoolInfo({ principalName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Proprietor Title</label>
                  <input
                    type="text"
                    value={schoolInfo.principalTitle}
                    onChange={e => updateSchoolInfo({ principalTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Principal Welcome Message</label>
                <textarea
                  rows={4}
                  value={schoolInfo.principalWelcomeMessage}
                  onChange={e => updateSchoolInfo({ principalWelcomeMessage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
            </div>

            <div className="p-5 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-sm text-[#0B3D27]">News & Announcements</h4>
                <button
                  onClick={() => setShowAddNewsModal(true)}
                  className="bg-[#0B3D27] text-[#D4AF37] font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-[#145a3b] transition-all"
                >
                  Post News
                </button>
              </div>
              <ul className="space-y-2 text-xs">
                {newsArticles.map(n => (
                  <li key={n.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-bold text-[#0B3D27] truncate max-w-xs">{n.title}</span>
                    <button onClick={() => deleteNewsArticle(n.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 10: DEPLOYMENT GUIDE */}
      {activeSubTab === 'guide' && (
        <div className="bg-white p-8 rounded-2xl border-2 border-[#D4AF37] shadow-lg space-y-6 animate-fade-in">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="font-serif font-bold text-xl text-[#0B3D27] flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#D4AF37]" />
              <span>Non-Developer Staff Operation & Deployment Guide</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Complete step-by-step instructions for managing Denmin British Montessori Academy without any technical help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <h4 className="font-bold text-[#0B3D27] text-sm">1. Routine Daily Tasks</h4>
              <p>• <strong>Adding Students:</strong> Go to Tab 2 (Students), click "Add New Student" or upload a CSV file.</p>
              <p>• <strong>Entering Results:</strong> Go to Tab 4 (Results Entry), enter subject scores out of 30 C.A and 70 Exam. Click Save & Publish!</p>
              <p>• <strong>Issuing Fee Receipts:</strong> Go to Tab 6 (Fees), enter payment details, and click "Receipt PDF" to print official A5 receipt.</p>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <h4 className="font-bold text-[#0B3D27] text-sm">2. Online CBT Exam Setup</h4>
              <p>• Go to Tab 5 (CBT Exams), click "Create New CBT Exam".</p>
              <p>• Enter question text, 4 options (A, B, C, D), and select the correct answer.</p>
              <p>• Enable "Anti-Cheat Tab Switch Prevention" to prevent students from searching answers during exams!</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD STUDENT */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#0B3D27]">Add New Student Record</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={newStudent.fullName}
                  onChange={e => setNewStudent({ ...newStudent, fullName: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. Osasumwen Oviawe"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Class Level</label>
                <select
                  value={newStudent.className}
                  onChange={e => setNewStudent({ ...newStudent, className: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="Pre-Nursery">Pre-Nursery</option>
                  <option value="Nursery 1">Nursery 1</option>
                  <option value="Nursery 2">Nursery 2</option>
                  <option value="Primary 1">Primary 1</option>
                  <option value="Primary 2">Primary 2</option>
                  <option value="Primary 3">Primary 3</option>
                  <option value="Primary 4">Primary 4</option>
                  <option value="Primary 5">Primary 5</option>
                  <option value="Primary 6">Primary 6</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Parent Name</label>
                <input
                  type="text"
                  value={newStudent.parentName}
                  onChange={e => setNewStudent({ ...newStudent, parentName: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Parent Phone</label>
                <input
                  type="text"
                  value={newStudent.parentPhone}
                  onChange={e => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddStudentModal(false)} className="px-4 py-2 text-xs border rounded">Cancel</button>
              <button
                onClick={() => {
                  addStudent(newStudent);
                  setShowAddStudentModal(false);
                }}
                className="px-4 py-2 text-xs bg-[#0B3D27] text-white font-bold rounded"
              >
                Save Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ENTER / EDIT STUDENT RESULT & TEST SCORES */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#D4AF37] max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Academic Evaluation Portal
                </span>
                <h3 className="text-xl font-bold font-serif text-[#0B3D27] mt-1">
                  Enter & Edit Student Test Scores (Result Slip)
                </h3>
              </div>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Student & Term Selection Section */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-[#0B3D27] mb-1">1. Filter by Class</label>
                  <select
                    value={editingResult.className || 'All Classes'}
                    onChange={e => {
                      const selectedClass = e.target.value;
                      const matchingStudents = selectedClass === 'All Classes' ? students : students.filter(s => s.className === selectedClass);
                      if (matchingStudents.length > 0) {
                        const st = matchingStudents[0];
                        setEditingResult({
                          ...editingResult,
                          studentId: st.id,
                          studentName: st.fullName,
                          admissionNo: st.admissionNo,
                          className: st.className,
                        });
                      }
                    }}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold text-slate-800"
                  >
                    <option value="All Classes">All Classes</option>
                    {['Pre-Nursery', 'Nursery 1', 'Nursery 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#0B3D27] mb-1">2. Select Admitted Student</label>
                  <select
                    value={editingResult.studentId}
                    onChange={e => {
                      const selectedSt = students.find(s => s.id === e.target.value);
                      if (selectedSt) {
                        setEditingResult({
                          ...editingResult,
                          studentId: selectedSt.id,
                          studentName: selectedSt.fullName,
                          admissionNo: selectedSt.admissionNo,
                          className: selectedSt.className,
                        });
                      }
                    }}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold text-slate-800"
                  >
                    {(editingResult.className && editingResult.className !== 'All Classes'
                      ? students.filter(s => s.className === editingResult.className)
                      : students
                    ).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.admissionNo}) — {s.className}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0B3D27] mb-1">Academic Term</label>
                  <select
                    value={editingResult.term}
                    onChange={e => setEditingResult({ ...editingResult, term: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
                  >
                    <option value="1st Term">1st Term</option>
                    <option value="2nd Term">2nd Term</option>
                    <option value="3rd Term">3rd Term</option>
                  </select>
                </div>
              </div>

              {/* AUTO POPUP: Admitted Student Information Card */}
              {(() => {
                const selectedSt = students.find(s => s.id === editingResult.studentId);
                if (!selectedSt) return null;
                return (
                  <div className="flex items-center gap-3 bg-emerald-100/70 p-3 rounded-xl border border-emerald-300 text-xs">
                    <img
                      src={selectedSt.passportPhotoUrl}
                      alt={selectedSt.fullName}
                      className="w-11 h-11 rounded-xl object-cover border border-[#D4AF37] shrink-0"
                    />
                    <div className="grow">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0B3D27] text-sm">{selectedSt.fullName}</span>
                        <span className="bg-emerald-800 text-[#D4AF37] font-bold text-[10px] px-2 py-0.5 rounded-full">
                          ✓ ADMITTED PUPIL RECORD
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-slate-700 text-[11px] mt-0.5">
                        <span>Admission No: <strong className="font-mono text-[#0B3D27]">{selectedSt.admissionNo}</strong></span>
                        <span>Class: <strong>{selectedSt.className}</strong></span>
                        <span>Parent / Guardian: <strong>{selectedSt.parentName} ({selectedSt.parentPhone})</strong></span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Academic Session</label>
                  <select
                    value={editingResult.academicSession}
                    onChange={e => setEditingResult({ ...editingResult, academicSession: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2025/2026">2025/2026</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class Position (#)</label>
                  <input
                    type="number"
                    min={1}
                    value={editingResult.positionInClass}
                    onChange={e => setEditingResult({ ...editingResult, positionInClass: Number(e.target.value) || 1 })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Pupils in Class</label>
                  <input
                    type="number"
                    min={1}
                    value={editingResult.totalStudentsInClass}
                    onChange={e => setEditingResult({ ...editingResult, totalStudentsInClass: Number(e.target.value) || 25 })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Attendance Present / Total</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      value={editingResult.attendancePresent}
                      onChange={e => setEditingResult({ ...editingResult, attendancePresent: Number(e.target.value) || 0 })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-center"
                      placeholder="Present"
                    />
                    <span>/</span>
                    <input
                      type="number"
                      min={1}
                      value={editingResult.attendanceTotal}
                      onChange={e => setEditingResult({ ...editingResult, attendanceTotal: Number(e.target.value) || 65 })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-center"
                      placeholder="Total"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SUBJECT TEST SCORES & C.A TABLE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#0B3D27]">
                    Subject Test Scores & Marks Entry
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    C.A (Continuous Assessment) is out of <strong>30 Marks</strong> • Exam Score is out of <strong>70 Marks</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Find student CBT attempts
                      const studentCbtAttempts = cbtAttempts.filter(
                        att => att.admissionNo.trim().toUpperCase() === editingResult.admissionNo.trim().toUpperCase() ||
                               att.studentName.trim().toLowerCase() === editingResult.studentName.trim().toLowerCase()
                      );

                      if (studentCbtAttempts.length === 0) {
                        alert(`No CBT submissions found for ${editingResult.studentName} (${editingResult.admissionNo}). You can enter scores manually below.`);
                        return;
                      }

                      let importedCount = 0;
                      const updatedSubs = [...editingResult.subjects];

                      studentCbtAttempts.forEach(att => {
                        const exam = cbtExams.find(e => e.id === att.examId);
                        const subjectName = exam?.subject || 'CBT Exam Subject';

                        // Convert CBT score percentage to 70-mark exam scale or C.A
                        const scaledExamScore = Math.round((att.percentage / 100) * 70);

                        const existingIdx = updatedSubs.findIndex(s => s.subject.toLowerCase() === subjectName.toLowerCase());
                        if (existingIdx >= 0) {
                          const ca = updatedSubs[existingIdx].caScore;
                          const total = ca + scaledExamScore;
                          let grade = 'F';
                          let remark = 'Needs Improvement';
                          if (total >= 70) { grade = 'A'; remark = 'Excellent'; }
                          else if (total >= 60) { grade = 'B'; remark = 'Very Good'; }
                          else if (total >= 50) { grade = 'C'; remark = 'Good'; }
                          else if (total >= 40) { grade = 'D'; remark = 'Pass'; }

                          updatedSubs[existingIdx] = {
                            ...updatedSubs[existingIdx],
                            examScore: scaledExamScore,
                            total,
                            grade,
                            remark,
                          };
                        } else {
                          const ca = 25; // default CA
                          const total = ca + scaledExamScore;
                          let grade = 'F';
                          let remark = 'Needs Improvement';
                          if (total >= 70) { grade = 'A'; remark = 'Excellent'; }
                          else if (total >= 60) { grade = 'B'; remark = 'Very Good'; }
                          else if (total >= 50) { grade = 'C'; remark = 'Good'; }
                          else if (total >= 40) { grade = 'D'; remark = 'Pass'; }

                          updatedSubs.push({
                            subject: subjectName,
                            caScore: ca,
                            examScore: scaledExamScore,
                            total,
                            grade,
                            remark,
                          });
                        }
                        importedCount++;
                      });

                      const totObtained = updatedSubs.reduce((acc, s) => acc + s.total, 0);
                      const totPossible = updatedSubs.length * 100;

                      setEditingResult({
                        ...editingResult,
                        subjects: updatedSubs,
                        totalObtained: totObtained,
                        totalPossible: totPossible,
                        average: totPossible > 0 ? (totObtained / totPossible) * 100 : 0,
                      });

                      alert(`Successfully imported ${importedCount} CBT exam score(s) into the termly result sheet!`);
                    }}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 border border-amber-300"
                    title="Automatically sync scores from student's completed CBT online exams"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-700 fill-current" />
                    <span>Auto-Import CBT Scores</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const newSub = {
                        subject: 'New Subject',
                        caScore: 20,
                        examScore: 50,
                        total: 70,
                        grade: 'A',
                        remark: 'Excellent',
                      };
                      const updatedSubs = [...editingResult.subjects, newSub];
                      const totObtained = updatedSubs.reduce((acc, s) => acc + s.total, 0);
                      const totPossible = updatedSubs.length * 100;
                      setEditingResult({
                        ...editingResult,
                        subjects: updatedSubs,
                        totalObtained: totObtained,
                        totalPossible: totPossible,
                        average: totPossible > 0 ? (totObtained / totPossible) * 100 : 0,
                      });
                    }}
                    className="bg-emerald-100 hover:bg-emerald-200 text-[#0B3D27] font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 border border-emerald-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Subject</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B3D27] text-white">
                    <tr>
                      <th className="p-3 font-bold">Subject Name</th>
                      <th className="p-3 font-bold text-center">C.A / Test (30)</th>
                      <th className="p-3 font-bold text-center">Exam Score (70)</th>
                      <th className="p-3 font-bold text-center">Total (100)</th>
                      <th className="p-3 font-bold text-center">Grade</th>
                      <th className="p-3 font-bold text-center">Remark</th>
                      <th className="p-3 font-bold text-right">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {editingResult.subjects.map((sub, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                        <td className="p-2.5">
                          <input
                            type="text"
                            value={sub.subject}
                            onChange={e => {
                              const updatedSubs = [...editingResult.subjects];
                              updatedSubs[idx].subject = e.target.value;
                              setEditingResult({ ...editingResult, subjects: updatedSubs });
                            }}
                            className="w-full p-1.5 border border-slate-300 rounded-lg text-xs font-bold text-[#0B3D27]"
                          />
                        </td>
                        <td className="p-2.5 text-center">
                          <input
                            type="number"
                            min={0}
                            max={30}
                            value={sub.caScore}
                            onChange={e => {
                              const ca = Math.min(30, Math.max(0, Number(e.target.value) || 0));
                              const updatedSubs = [...editingResult.subjects];
                              const total = ca + updatedSubs[idx].examScore;
                              let grade = 'F';
                              let remark = 'Needs Improvement';
                              if (total >= 70) { grade = 'A'; remark = 'Excellent'; }
                              else if (total >= 60) { grade = 'B'; remark = 'Very Good'; }
                              else if (total >= 50) { grade = 'C'; remark = 'Good'; }
                              else if (total >= 40) { grade = 'D'; remark = 'Pass'; }

                              updatedSubs[idx] = {
                                ...updatedSubs[idx],
                                caScore: ca,
                                total,
                                grade,
                                remark,
                              };
                              const totObtained = updatedSubs.reduce((acc, s) => acc + s.total, 0);
                              const totPossible = updatedSubs.length * 100;
                              setEditingResult({
                                ...editingResult,
                                subjects: updatedSubs,
                                totalObtained: totObtained,
                                totalPossible: totPossible,
                                average: totPossible > 0 ? (totObtained / totPossible) * 100 : 0,
                              });
                            }}
                            className="w-16 p-1.5 border border-slate-300 rounded-lg text-center text-xs font-bold bg-amber-50/80"
                          />
                        </td>
                        <td className="p-2.5 text-center">
                          <input
                            type="number"
                            min={0}
                            max={70}
                            value={sub.examScore}
                            onChange={e => {
                              const ex = Math.min(70, Math.max(0, Number(e.target.value) || 0));
                              const updatedSubs = [...editingResult.subjects];
                              const total = updatedSubs[idx].caScore + ex;
                              let grade = 'F';
                              let remark = 'Needs Improvement';
                              if (total >= 70) { grade = 'A'; remark = 'Excellent'; }
                              else if (total >= 60) { grade = 'B'; remark = 'Very Good'; }
                              else if (total >= 50) { grade = 'C'; remark = 'Good'; }
                              else if (total >= 40) { grade = 'D'; remark = 'Pass'; }

                              updatedSubs[idx] = {
                                ...updatedSubs[idx],
                                examScore: ex,
                                total,
                                grade,
                                remark,
                              };
                              const totObtained = updatedSubs.reduce((acc, s) => acc + s.total, 0);
                              const totPossible = updatedSubs.length * 100;
                              setEditingResult({
                                ...editingResult,
                                subjects: updatedSubs,
                                totalObtained: totObtained,
                                totalPossible: totPossible,
                                average: totPossible > 0 ? (totObtained / totPossible) * 100 : 0,
                              });
                            }}
                            className="w-16 p-1.5 border border-slate-300 rounded-lg text-center text-xs font-bold bg-blue-50/80"
                          />
                        </td>
                        <td className="p-2.5 text-center font-bold text-sm text-[#0B3D27]">
                          {sub.total}
                        </td>
                        <td className="p-2.5 text-center font-bold">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            sub.grade === 'A' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {sub.grade}
                          </span>
                        </td>
                        <td className="p-2.5 text-center italic text-slate-600 text-[11px]">
                          {sub.remark}
                        </td>
                        <td className="p-2.5 text-right">
                          {editingResult.subjects.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updatedSubs = editingResult.subjects.filter((_, i) => i !== idx);
                                const totObtained = updatedSubs.reduce((acc, s) => acc + s.total, 0);
                                const totPossible = updatedSubs.length * 100;
                                setEditingResult({
                                  ...editingResult,
                                  subjects: updatedSubs,
                                  totalObtained: totObtained,
                                  totalPossible: totPossible,
                                  average: totPossible > 0 ? (totObtained / totPossible) * 100 : 0,
                                });
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remove Subject"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Score Summary Badge Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                <div>
                  Total Score Obtained: <strong className="text-emerald-900 text-sm">{editingResult.totalObtained} / {editingResult.totalPossible}</strong>
                </div>
                <div>
                  Overall Term Percentage: <strong className="text-emerald-900 text-sm">{editingResult.average.toFixed(2)}%</strong>
                </div>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#0B3D27] mb-1">Class Teacher's Remark</label>
                <textarea
                  rows={2}
                  value={editingResult.classTeacherRemark}
                  onChange={e => setEditingResult({ ...editingResult, classTeacherRemark: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                  placeholder="e.g. An exemplary and disciplined pupil."
                />
              </div>

              <div>
                <label className="block font-bold text-[#0B3D27] mb-1">Principal / Proprietor Remark</label>
                <textarea
                  rows={2}
                  value={editingResult.principalRemark}
                  onChange={e => setEditingResult({ ...editingResult, principalRemark: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                  placeholder="e.g. Recommended for promotion."
                />
              </div>
            </div>

            {/* Publish Checkbox */}
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
              <input
                type="checkbox"
                id="publishResultToggle"
                checked={editingResult.isPublished}
                onChange={e => setEditingResult({ ...editingResult, isPublished: e.target.checked })}
                className="w-4 h-4 text-[#0B3D27] rounded focus:ring-[#0B3D27]"
              />
              <label htmlFor="publishResultToggle" className="text-xs font-bold text-[#0B3D27] cursor-pointer">
                Publish Result Live to Student Portal (Parents can search and print PDF)
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowResultModal(false)}
                className="px-5 py-2.5 text-xs font-bold border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  saveResultSlip(editingResult);
                  setShowResultModal(false);
                }}
                className="px-6 py-2.5 text-xs bg-[#0B3D27] hover:bg-emerald-900 text-[#D4AF37] font-bold rounded-xl shadow-md transition-all"
              >
                Save & Publish Result Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE CBT EXAM */}
      {showAddCBTModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-5 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#0B3D27]">Create CBT Examination</h3>
                <p className="text-xs text-slate-500">Configure exam settings and compose questions</p>
              </div>
              <button
                onClick={() => setShowAddCBTModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Exam Config Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Exam Title</label>
                <input
                  type="text"
                  value={newCBTExam.title}
                  onChange={e => setNewCBTExam({ ...newCBTExam, title: e.target.value })}
                  className="w-full p-2 border rounded bg-white"
                  placeholder="e.g. 1st Term Mathematics Exam"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Class Level</label>
                <select
                  value={newCBTExam.className}
                  onChange={e => setNewCBTExam({ ...newCBTExam, className: e.target.value })}
                  className="w-full p-2 border rounded bg-white"
                >
                  <option value="Pre-Nursery">Pre-Nursery</option>
                  <option value="Nursery 1">Nursery 1</option>
                  <option value="Nursery 2">Nursery 2</option>
                  <option value="Primary 1">Primary 1</option>
                  <option value="Primary 2">Primary 2</option>
                  <option value="Primary 3">Primary 3</option>
                  <option value="Primary 4">Primary 4</option>
                  <option value="Primary 5">Primary 5</option>
                  <option value="Primary 6">Primary 6</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={newCBTExam.subject}
                  onChange={e => setNewCBTExam({ ...newCBTExam, subject: e.target.value })}
                  className="w-full p-2 border rounded bg-white"
                  placeholder="e.g. Mathematics"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={newCBTExam.durationMinutes}
                  onChange={e => setNewCBTExam({ ...newCBTExam, durationMinutes: Number(e.target.value) })}
                  className="w-full p-2 border rounded bg-white"
                  min={1}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Passing Mark (%)</label>
                <input
                  type="number"
                  value={newCBTExam.passingScorePercent}
                  onChange={e => setNewCBTExam({ ...newCBTExam, passingScorePercent: Number(e.target.value) })}
                  className="w-full p-2 border rounded bg-white"
                  min={1}
                  max={100}
                />
              </div>

              <div className="col-span-1 sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/70 p-3 rounded-lg border border-amber-200 mt-1">
                <div>
                  <label className="block font-bold text-amber-900 mb-1">📅 Scheduled Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newCBTExam.scheduleStart || ''}
                    onChange={e => setNewCBTExam({ ...newCBTExam, scheduleStart: e.target.value })}
                    className="w-full p-2 border rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-amber-900 mb-1">⏰ Scheduled End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newCBTExam.scheduleEnd || ''}
                    onChange={e => setNewCBTExam({ ...newCBTExam, scheduleEnd: e.target.value })}
                    className="w-full p-2 border rounded bg-white text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 col-span-1 sm:col-span-3">
                <input
                  type="checkbox"
                  id="tabSwitchPrevent"
                  checked={newCBTExam.preventTabSwitch}
                  onChange={e => setNewCBTExam({ ...newCBTExam, preventTabSwitch: e.target.checked })}
                  className="w-4 h-4 text-[#0B3D27] rounded"
                />
                <label htmlFor="tabSwitchPrevent" className="font-bold text-slate-800 text-xs">
                  Enable Anti-Cheat Tab Switching Prevention
                </label>
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-sm text-[#0B3D27]">
                  Questions List ({newCBTExam.questions.length})
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    const nextQNum = newCBTExam.questions.length + 1;
                    const newQ = {
                      id: `q_${Date.now()}_${nextQNum}`,
                      questionText: `Question ${nextQNum}: `,
                      options: [
                        { id: 'a', text: 'Option A' },
                        { id: 'b', text: 'Option B' },
                        { id: 'c', text: 'Option C' },
                        { id: 'd', text: 'Option D' },
                      ],
                      correctOptionId: 'a',
                      explanation: '',
                      marks: 10,
                    };
                    setNewCBTExam({
                      ...newCBTExam,
                      questions: [...newCBTExam.questions, newQ],
                    });
                  }}
                  className="bg-emerald-100 hover:bg-emerald-200 text-[#0B3D27] font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              </div>

              <div className="space-y-4">
                {newCBTExam.questions.map((q, qIdx) => (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#0B3D27]">Question #{qIdx + 1}</span>
                      {newCBTExam.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewCBTExam({
                              ...newCBTExam,
                              questions: newCBTExam.questions.filter((_, idx) => idx !== qIdx),
                            });
                          }}
                          className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Question Statement</label>
                      <input
                        type="text"
                        value={q.questionText}
                        onChange={e => {
                          const updatedQs = [...newCBTExam.questions];
                          updatedQs[qIdx].questionText = e.target.value;
                          setNewCBTExam({ ...newCBTExam, questions: updatedQs });
                        }}
                        className="w-full p-2 border rounded text-xs bg-white"
                        placeholder="Type question here..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => (
                        <div key={opt.id} className="flex items-center gap-2 bg-white p-1.5 rounded border">
                          <input
                            type="radio"
                            name={`correct_${q.id}`}
                            checked={q.correctOptionId === opt.id}
                            onChange={() => {
                              const updatedQs = [...newCBTExam.questions];
                              updatedQs[qIdx].correctOptionId = opt.id;
                              setNewCBTExam({ ...newCBTExam, questions: updatedQs });
                            }}
                            className="text-[#0B3D27]"
                          />
                          <span className="font-bold uppercase text-slate-500 w-4">{opt.id}:</span>
                          <input
                            type="text"
                            value={opt.text}
                            onChange={e => {
                              const updatedQs = [...newCBTExam.questions];
                              updatedQs[qIdx].options[optIdx].text = e.target.value;
                              setNewCBTExam({ ...newCBTExam, questions: updatedQs });
                            }}
                            className="w-full p-1 text-xs border-b border-dashed focus:outline-none"
                            placeholder={`Option ${opt.id.toUpperCase()}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Correct Answer Explanation (Optional)</label>
                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={e => {
                          const updatedQs = [...newCBTExam.questions];
                          updatedQs[qIdx].explanation = e.target.value;
                          setNewCBTExam({ ...newCBTExam, questions: updatedQs });
                        }}
                        className="w-full p-1.5 border rounded text-xs bg-white"
                        placeholder="Explanation shown to student after exam..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowAddCBTModal(false)}
                className="px-4 py-2 text-xs border rounded-xl text-slate-600 hover:bg-slate-50 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  saveCBTExam({
                    ...newCBTExam,
                    id: `cbt_${Date.now()}`,
                    totalMarks: newCBTExam.questions.length * 10,
                  });
                  setShowAddCBTModal(false);
                }}
                className="px-5 py-2 text-xs bg-[#0B3D27] hover:bg-emerald-900 text-[#D4AF37] font-bold rounded-xl shadow"
              >
                Save & Publish CBT Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: POST NEWS */}
      {showAddNewsModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#0B3D27]">Post Announcement or News</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Title</label>
                <input
                  type="text"
                  value={newNews.title}
                  onChange={e => setNewNews({ ...newNews, title: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. Resumption Notice"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Summary</label>
                <textarea
                  rows={2}
                  value={newNews.summary}
                  onChange={e => setNewNews({ ...newNews, summary: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Full Content</label>
                <textarea
                  rows={4}
                  value={newNews.content}
                  onChange={e => setNewNews({ ...newNews, content: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddNewsModal(false)} className="px-4 py-2 text-xs border rounded">Cancel</button>
              <button
                onClick={() => {
                  addNewsArticle(newNews);
                  setShowAddNewsModal(false);
                }}
                className="px-4 py-2 text-xs bg-[#0B3D27] text-white font-bold rounded"
              >
                Publish to Website Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW STAFF MEMBER (MULTIPLE CLASSES SUPPORT) */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-5 border-2 border-[#D4AF37]/40 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#0B3D27]">Register New Staff Member</h3>
                <p className="text-xs text-slate-500">Assign multiple classes, roles, subjects, and qualifications</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTeacherModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeacherSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0B3D27] mb-1">
                    Staff Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTeacher.fullName}
                    onChange={e => setNewTeacher({ ...newTeacher, fullName: e.target.value })}
                    placeholder="e.g. Mr. David Osho"
                    className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#0B3D27]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0B3D27] mb-1">
                    Staff ID Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTeacher.staffId}
                    onChange={e => setNewTeacher({ ...newTeacher, staffId: e.target.value })}
                    placeholder="e.g. STF/DEN/025"
                    className="w-full p-3 border border-slate-300 rounded-xl font-mono uppercase outline-none focus:ring-2 focus:ring-[#0B3D27]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0B3D27] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newTeacher.email}
                    onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    placeholder="e.g. david.o@denminacademy.edu.ng"
                    className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#0B3D27]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0B3D27] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newTeacher.phone}
                    onChange={e => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                    placeholder="e.g. +234 803 123 4567"
                    className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#0B3D27]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0B3D27] mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={newTeacher.role}
                    onChange={e => setNewTeacher({ ...newTeacher, role: e.target.value })}
                    placeholder="e.g. Senior Montessori Lead & STEM Specialist"
                    className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#0B3D27]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0B3D27] mb-1">Qualifications & Certifications</label>
                  <input
                    type="text"
                    value={newTeacher.qualification}
                    onChange={e => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                    placeholder="e.g. B.Sc Ed Mathematics (UNIBEN), TRCN Certified"
                    className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#0B3D27]"
                  />
                </div>
              </div>

              {/* MULTI-CLASS SELECTION CHECKLIST */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[#0B3D27]">
                    Assign Multiple Classes to Teacher <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {newTeacher.selectedClasses.length} Classes Selected
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Select all class levels this teacher is authorized to instruct and manage:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2">
                  {['Pre-Nursery', 'Nursery 1', 'Nursery 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'].map(cls => {
                    const isChecked = newTeacher.selectedClasses.includes(cls);
                    return (
                      <label
                        key={cls}
                        className={`p-2.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all flex items-center gap-2 ${
                          isChecked
                            ? 'bg-[#0B3D27] text-white border-[#0B3D27] shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setNewTeacher({ ...newTeacher, selectedClasses: [...newTeacher.selectedClasses, cls] });
                            } else {
                              setNewTeacher({
                                ...newTeacher,
                                selectedClasses: newTeacher.selectedClasses.filter(c => c !== cls),
                              });
                            }
                          }}
                          className="rounded text-[#0B3D27] focus:ring-0"
                        />
                        <span className="truncate">{cls}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0B3D27] mb-1">Subjects Taught (Comma Separated)</label>
                <input
                  type="text"
                  value={newTeacher.subjectsInput}
                  onChange={e => setNewTeacher({ ...newTeacher, subjectsInput: e.target.value })}
                  placeholder="e.g. Mathematics, Quantitative Reasoning, Basic Science, Computer Studies"
                  className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#0B3D27]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0B3D27] mb-1">Passport Photo URL</label>
                <input
                  type="text"
                  value={newTeacher.photoUrl}
                  onChange={e => setNewTeacher({ ...newTeacher, photoUrl: e.target.value })}
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#0B3D27]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2.5 text-xs border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs bg-[#0B3D27] hover:bg-emerald-900 text-[#D4AF37] font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Staff Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
