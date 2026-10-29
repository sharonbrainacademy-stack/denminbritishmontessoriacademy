export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  admissionNo?: string;
  admissionNumber?: string;
  studentId?: string;
  assignedClass?: string;
  childrenAdmissionNos?: string[];
  avatarUrl?: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  admissionNumber?: string;
  fullName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  className: string;
  classLevel?: string;
  arm?: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address: string;
  residentialAddress?: string;
  status: 'Active' | 'Inactive' | 'Graduated' | 'active' | 'inactive';
  passportUrl?: string;
  passportPhotoUrl?: string;
  enrollmentYear?: string;
  enrollmentDate?: string;
  bloodGroup?: string;
  genotype?: string;
}

export interface Teacher {
  id: string;
  staffId: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  assignedClass: string;
  assignedClasses?: string[];
  subjects: string[];
  qualification: string;
  photoUrl?: string;
}

export interface SubjectScore {
  subject: string;
  subjectName?: string;
  caScore: number;
  firstTest?: number;
  secondTest?: number;
  examScore: number;
  total: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | string;
  remark: string;
}

export interface ResultSlip {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  admissionNumber?: string;
  className: string;
  classLevel?: string;
  academicSession: string;
  session?: string;
  term: '1st Term' | '2nd Term' | '3rd Term' | string;
  subjects: SubjectScore[];
  totalObtained: number;
  totalScore?: number;
  totalPossible: number;
  average: number;
  averageScore?: number;
  positionInClass?: number;
  position?: number | string;
  totalStudentsInClass?: number;
  attendancePresent: number;
  attendanceTotal: number;
  classTeacherRemark?: string;
  teacherRemarks?: string;
  principalRemark?: string;
  principalRemarks?: string;
  isPublished?: boolean;
  status?: 'published' | 'draft';
  publishedAt?: string;
  datePublished?: string;
  createdAt?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export type CBTAssessmentType = '1st_test' | '2nd_test' | 'exam' | 'first_test' | 'second_test';

export interface CBTQuestion {
  id: string;
  questionText: string;
  question?: string;
  options: any[]; // accepts QuestionOption[] or string[]
  correctOptionId?: string;
  correctAnswer?: number;
  explanation?: string;
  marks: number;
}

export interface CBTTheoryQuestion {
  id: string;
  questionText: string;
  question?: string;
  maxMarks: number;
  modelAnswer?: string;
  guidelines?: string;
}

export interface CBTExam {
  id: string;
  title: string;
  assessmentType: CBTAssessmentType;
  className?: string;
  classLevel?: string;
  subject: string;
  term?: string;
  academicSession?: string;
  session?: string;
  durationMinutes: number;
  totalMarks: number;
  objectiveMarks?: number;
  theoryMarks?: number;
  passMark?: number;
  passingScorePercent?: number;
  shuffleQuestions?: boolean;
  preventTabSwitch?: boolean;
  isPublished?: boolean;
  published?: boolean;
  instructions?: string;
  createdAt: string;
  createdBy?: string;
  questions: CBTQuestion[];
  theoryQuestions?: CBTTheoryQuestion[];
  scheduleStart?: string;
  scheduleEnd?: string;
}

export interface CBTAttempt {
  id: string;
  examId: string;
  examTitle: string;
  assessmentType: CBTAssessmentType;
  subject: string;
  term?: string;
  academicSession?: string;
  studentId: string;
  studentName: string;
  admissionNo?: string;
  admissionNumber?: string;
  className?: string;
  classLevel?: string;
  scoreObtained?: number;
  score?: number;
  totalMarks?: number;
  totalPossibleMarks?: number;
  objectiveScore?: number;
  objectiveTotalMarks?: number;
  theoryScore?: number;
  theoryScoreAwarded?: number;
  theoryTotalMarks?: number;
  theoryAnswers?: Record<string, string>;
  theoryScores?: Record<string, number>;
  theoryFeedback?: Record<string, string>;
  teacherFeedback?: string;
  theoryGraded?: boolean;
  theoryStatus?: 'pending_review' | 'reviewed' | 'not_applicable';
  teacherReviewNotes?: string;
  publishedToParents?: boolean;
  percentage: number;
  passed: boolean;
  startedAt?: string;
  submittedAt?: string;
  completedAt?: string;
  durationSpentMinutes?: number;
  tabSwitchCount?: number;
  answers: Record<string, any>;
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
  admissionNo?: string;
  admissionNumber?: string;
  className?: string;
  classLevel?: string;
  term: string;
  session: string;
  feeType?: string;
  amountExpected?: number;
  amountPaid: number;
  totalFee?: number;
  balance?: number;
  balanceRemaining?: number;
  paymentMethod: string;
  paymentDate: string;
  recordedBy?: string;
  notes?: string;
  status?: string;
}

export interface AdmissionApplication {
  id: string;
  applicantName?: string;
  childFullName?: string;
  gender: string;
  dateOfBirth: string;
  proposedClass?: string;
  applyingForClass?: string;
  parentName?: string;
  parentFullName?: string;
  parentPhone: string;
  parentEmail?: string;
  address?: string;
  residentialAddress?: string;
  previousSchool?: string;
  specialNeedsOrAllergies?: string;
  applicationDate: string;
  status: 'Pending' | 'Approved' | 'Interview Scheduled' | 'Rejected' | 'pending' | 'accepted' | 'rejected';
  notes?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date?: string;
  publishedDate?: string;
  author: string;
  summary: string;
  content?: string;
  imageUrl?: string;
  isFeatured?: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
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
  mission?: string;
  vision?: string;
}

export interface StudentAttendanceRecord {
  id: string;
  date: string;
  className?: string;
  classLevel?: string;
  studentId: string;
  studentName: string;
  admissionNo?: string;
  admissionNumber?: string;
  status: 'present' | 'absent' | 'late';
  recordedBy?: string;
  markedBy?: string;
  timestamp?: string;
}

export interface StaffAttendanceRecord {
  id: string;
  date: string;
  staffId: string;
  staffName: string;
  role: string;
  status: 'present' | 'absent' | 'late' | 'on-leave';
  timeIn?: string;
  timeOut?: string;
  notes?: string;
  timestamp: string;
}

export interface TeachingMaterial {
  id: string;
  title: string;
  subject: string;
  className: string;
  term: string;
  week: string;
  category: 'Scheme of Work' | 'Lesson Note' | 'Exercise Sheet' | 'Montessori Guide';
  topic: string;
  learningObjectives: string[];
  materialsNeeded: string[];
  keyConcepts: string;
  presentationSteps: string[];
  evaluationQuestions: string[];
  authorStaffName?: string;
  lastUpdated: string;
}

export type CalendarEventCategory = 'term_date' | 'holiday' | 'exam' | 'activity' | 'meeting' | 'resumption' | 'test' | 'pta';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  category?: CalendarEventCategory;
  type?: string;
  term: '1st Term' | '2nd Term' | '3rd Term' | 'All Year' | string;
  academicSession: string;
  targetAudience?: string;
  location?: string;
  time?: string;
  isKeyDate?: boolean;
}
