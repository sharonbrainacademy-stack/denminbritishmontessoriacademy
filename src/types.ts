export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  admissionNo?: string;
  assignedClass?: string;
  childrenAdmissionNos?: string[]; // For parents
  avatarUrl?: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  fullName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  className: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  passportUrl?: string;
  enrollmentYear: string;
}

export interface Teacher {
  id: string;
  staffId: string;
  fullName: string;
  email: string;
  phone: string;
  role: string; // e.g. "Senior Montessori Lead", "Math Specialist"
  assignedClass: string; // Comma-separated or display string e.g. "Primary 4, Primary 5"
  assignedClasses?: string[]; // Array of assigned classes e.g. ["Primary 4", "Primary 5"]
  subjects: string[];
  qualification: string;
  photoUrl?: string;
}

export interface SubjectScore {
  subject: string;
  caScore: number; // Max 30
  examScore: number; // Max 70
  total: number; // caScore + examScore
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  remark: string;
}

export interface ResultSlip {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  academicSession: string; // e.g. "2024/2025"
  term: '1st Term' | '2nd Term' | '3rd Term';
  subjects: SubjectScore[];
  totalObtained: number;
  totalPossible: number;
  average: number;
  positionInClass: number;
  totalStudentsInClass: number;
  attendancePresent: number;
  attendanceTotal: number;
  classTeacherRemark: string;
  principalRemark: string;
  isPublished: boolean;
  publishedAt?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface CBTQuestion {
  id: string;
  questionText: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation?: string;
  marks: number;
}

export interface CBTExam {
  id: string;
  title: string;
  className: string;
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  passingScorePercent: number;
  shuffleQuestions: boolean;
  preventTabSwitch: boolean;
  isPublished: boolean;
  instructions: string;
  createdAt: string;
  questions: CBTQuestion[];
  scheduleStart?: string; // YYYY-MM-DDTHH:mm or ISO date
  scheduleEnd?: string;   // YYYY-MM-DDTHH:mm or ISO date
}

export interface CBTAttempt {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  scoreObtained: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  submittedAt: string;
  tabSwitchCount: number;
  answers: Record<string, string>; // questionId -> selectedOptionId
}

export interface FeeStructure {
  id: string;
  className: string;
  term: string;
  tuition: number;
  learningMaterials: number;
  uniformAndBadge: number;
  ictAndCbtLevy: number;
  extracurricular: number;
  totalFee: number;
}

export interface FeePayment {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  term: string;
  session: string;
  amountPaid: number;
  totalFee: number;
  balance: number;
  paymentMethod: 'Bank Transfer' | 'Card Online' | 'Cash' | 'Bank Draft';
  paymentDate: string;
  status: 'Full' | 'Partial' | 'Pending';
}

export interface AdmissionApplication {
  id: string;
  applicantName: string;
  gender: string;
  dateOfBirth: string;
  proposedClass: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  previousSchool?: string;
  applicationDate: string;
  status: 'Pending' | 'Approved' | 'Interview Scheduled' | 'Rejected';
  notes?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Announcement' | 'Event' | 'Newsletter' | 'Academic Notice';
  date: string;
  author: string;
  summary: string;
  content: string;
  imageUrl?: string;
  isFeatured?: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'Montessori Labs' | 'Sports Day' | 'Cultural Celebrations' | 'Classrooms' | 'Events';
  imageUrl: string;
  caption?: string;
}

export interface SchoolInfo {
  name: string;
  motto: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  logoUrl?: string;
  principalName: string;
  principalTitle: string;
  principalPhotoUrl?: string;
  principalWelcomeMessage: string;
  academicSession: string;
  currentTerm: string;
  totalStudents: number;
  totalTeachers: number;
  yearsOfExcellence: number;
  passRatePercent: number;
}
