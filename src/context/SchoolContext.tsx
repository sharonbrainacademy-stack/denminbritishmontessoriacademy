import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  SchoolInfo,
  Student,
  Teacher,
  ResultSlip,
  CBTExam,
  CBTAttempt,
  FeeStructure,
  FeePayment,
  AdmissionApplication,
  NewsArticle,
  GalleryPhoto,
  User,
  StudentAttendanceRecord,
  StaffAttendanceRecord,
  TeachingMaterial,
} from '../types';
import {
  initialSchoolInfo,
  initialStudents,
  initialTeachers,
  initialResultSlips,
  initialCBTExams,
  initialCBTAttempts,
  initialFeeStructures,
  initialFeePayments,
  initialAdmissionApps,
  initialNewsArticles,
  initialGalleryPhotos,
  initialStudentAttendance,
  initialStaffAttendance,
  initialTeachingMaterials,
} from '../data/initialData';

interface SchoolContextType {
  schoolInfo: SchoolInfo;
  updateSchoolInfo: (info: Partial<SchoolInfo>) => void;
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, data: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  resultSlips: ResultSlip[];
  setResultSlips: React.Dispatch<React.SetStateAction<ResultSlip[]>>;
  saveResultSlip: (result: ResultSlip) => void;
  deleteResultSlip: (id: string) => void;
  publishResultSlip: (id: string) => void;

  cbtExams: CBTExam[];
  setCbtExams: React.Dispatch<React.SetStateAction<CBTExam[]>>;
  saveCBTExam: (exam: CBTExam) => void;
  deleteCBTExam: (id: string) => void;

  cbtAttempts: CBTAttempt[];
  recordCBTAttempt: (attempt: Omit<CBTAttempt, 'id'>) => void;

  // Attendance (Student & Staff)
  studentAttendance: StudentAttendanceRecord[];
  markStudentAttendance: (records: StudentAttendanceRecord[]) => void;

  staffAttendance: StaffAttendanceRecord[];
  markStaffAttendance: (record: Omit<StaffAttendanceRecord, 'id' | 'timestamp'>) => void;

  // Teaching Materials & Scheme of Work
  teachingMaterials: TeachingMaterial[];
  saveTeachingMaterial: (material: Omit<TeachingMaterial, 'id' | 'lastUpdated'>) => void;
  deleteTeachingMaterial: (id: string) => void;

  feeStructures: FeeStructure[];
  updateFeeStructure: (structures: FeeStructure[]) => void;

  feePayments: FeePayment[];
  addFeePayment: (payment: Omit<FeePayment, 'id' | 'receiptNo'>) => void;

  admissionApplications: AdmissionApplication[];
  submitAdmissionApp: (app: Omit<AdmissionApplication, 'id' | 'applicationDate' | 'status'>) => void;
  updateAdmissionStatus: (id: string, status: AdmissionApplication['status']) => void;

  newsArticles: NewsArticle[];
  addNewsArticle: (news: Omit<NewsArticle, 'id'>) => void;
  deleteNewsArticle: (id: string) => void;

  galleryPhotos: GalleryPhoto[];
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  deleteGalleryPhoto: (id: string) => void;

  isOffline: boolean;
  resetToDefaults: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEY = 'denmin_school_data_v1';

// Safe localStorage loader helper for full offline resilience
function loadInitialState<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn(`Failed reading ${key} from storage:`, e);
  }
  return fallback;
}

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() =>
    loadInitialState('school_info', initialSchoolInfo)
  );

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.name.includes('Deborah')) {
          parsed.name = 'Dr. Denyinye Minna Hitler';
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [students, setStudents] = useState<Student[]>(() =>
    loadInitialState('students', initialStudents)
  );
  const [teachers, setTeachers] = useState<Teacher[]>(() =>
    loadInitialState('teachers', initialTeachers)
  );
  const [resultSlips, setResultSlips] = useState<ResultSlip[]>(() =>
    loadInitialState('result_slips', initialResultSlips)
  );
  const [cbtExams, setCbtExams] = useState<CBTExam[]>(() =>
    loadInitialState('cbt_exams', initialCBTExams)
  );
  const [cbtAttempts, setCbtAttempts] = useState<CBTAttempt[]>(() =>
    loadInitialState('cbt_attempts', initialCBTAttempts)
  );
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendanceRecord[]>(() =>
    loadInitialState('student_attendance', initialStudentAttendance)
  );
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendanceRecord[]>(() =>
    loadInitialState('staff_attendance', initialStaffAttendance)
  );
  const [teachingMaterials, setTeachingMaterials] = useState<TeachingMaterial[]>(() =>
    loadInitialState('teaching_materials', initialTeachingMaterials)
  );
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(() =>
    loadInitialState('fee_structures', initialFeeStructures)
  );
  const [feePayments, setFeePayments] = useState<FeePayment[]>(() =>
    loadInitialState('fee_payments', initialFeePayments)
  );
  const [admissionApplications, setAdmissionApplications] = useState<AdmissionApplication[]>(() =>
    loadInitialState('admission_apps', initialAdmissionApps)
  );
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(() =>
    loadInitialState('news_articles', initialNewsArticles)
  );
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(() =>
    loadInitialState('gallery_photos', initialGalleryPhotos)
  );

  // Firestore Real-Time Subscriptions & Two-Way Sync
  useEffect(() => {
    // 1. School Info
    const unsubInfo = onSnapshot(doc(db, 'school_info', 'main'), docSnap => {
      if (docSnap.exists()) {
        const rawInfo = docSnap.data() as SchoolInfo;
        let needsUpdate = false;
        const cleanedInfo = { ...rawInfo };

        if (cleanedInfo.principalName?.includes('Deborah')) {
          cleanedInfo.principalName = 'Dr. Denyinye Minna Hitler';
          needsUpdate = true;
        }
        if (cleanedInfo.principalTitle && /proprietress/i.test(cleanedInfo.principalTitle)) {
          cleanedInfo.principalTitle = cleanedInfo.principalTitle.replace(/proprietress/gi, 'Proprietor');
          needsUpdate = true;
        }
        if (!cleanedInfo.logoUrl) {
          cleanedInfo.logoUrl = '/icon-192.png';
          needsUpdate = true;
        }

        if (needsUpdate) {
          setDoc(doc(db, 'school_info', 'main'), cleanedInfo, { merge: true }).catch(console.error);
        }
        setSchoolInfo(cleanedInfo);
        localStorage.setItem(`${STORAGE_KEY}_school_info`, JSON.stringify(cleanedInfo));
      } else {
        setDoc(doc(db, 'school_info', 'main'), initialSchoolInfo).catch(console.error);
      }
    }, err => console.warn('Offline mode: Using cached school info', err));

    // 2. Students
    const unsubStudents = onSnapshot(collection(db, 'students'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Student));
        setStudents(list);
        localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(list));
      } else {
        initialStudents.forEach(s => setDoc(doc(db, 'students', s.id), s).catch(console.error));
      }
    }, err => console.warn('Offline mode: Using local students data', err));

    // 3. Teachers
    const unsubTeachers = onSnapshot(collection(db, 'teachers'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Teacher));
        setTeachers(list);
        localStorage.setItem(`${STORAGE_KEY}_teachers`, JSON.stringify(list));
      } else {
        initialTeachers.forEach(t => setDoc(doc(db, 'teachers', t.id), t).catch(console.error));
      }
    }, err => console.warn('Offline mode: Using local teachers data', err));

    // 4. Result Slips
    const unsubResults = onSnapshot(collection(db, 'result_slips'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as ResultSlip));
        setResultSlips(list);
        localStorage.setItem(`${STORAGE_KEY}_result_slips`, JSON.stringify(list));
      } else {
        initialResultSlips.forEach(r => setDoc(doc(db, 'result_slips', r.id), r).catch(console.error));
      }
    }, err => console.warn('Offline mode: Using local result slips data', err));

    // 5. CBT Exams
    const unsubExams = onSnapshot(collection(db, 'cbt_exams'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as CBTExam));
        setCbtExams(list);
        localStorage.setItem(`${STORAGE_KEY}_cbt_exams`, JSON.stringify(list));
      } else {
        initialCBTExams.forEach(e => setDoc(doc(db, 'cbt_exams', e.id), e).catch(console.error));
      }
    }, err => console.warn('Offline mode: Using local CBT exams data', err));

    // 6. CBT Attempts
    const unsubAttempts = onSnapshot(collection(db, 'cbt_attempts'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as CBTAttempt));
        setCbtAttempts(list);
        localStorage.setItem(`${STORAGE_KEY}_cbt_attempts`, JSON.stringify(list));
      } else {
        initialCBTAttempts.forEach(a => setDoc(doc(db, 'cbt_attempts', a.id), a).catch(console.error));
      }
    }, err => console.warn('Offline mode: Using local CBT attempts data', err));

    // 7. Student Attendance
    const unsubStudentAtt = onSnapshot(collection(db, 'student_attendance'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as StudentAttendanceRecord));
        setStudentAttendance(list);
        localStorage.setItem(`${STORAGE_KEY}_student_attendance`, JSON.stringify(list));
      } else {
        initialStudentAttendance.forEach(a => setDoc(doc(db, 'student_attendance', a.id), a).catch(console.error));
      }
    }, err => console.warn('Offline mode: Using local student attendance', err));

    // 8. Staff Attendance
    const unsubStaffAtt = onSnapshot(collection(db, 'staff_attendance'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as StaffAttendanceRecord));
        setStaffAttendance(list);
        localStorage.setItem(`${STORAGE_KEY}_staff_attendance`, JSON.stringify(list));
      } else {
        initialStaffAttendance.forEach(a => setDoc(doc(db, 'staff_attendance', a.id), a).catch(console.error));
      }
    }, err => console.warn('Offline mode: Using local staff attendance', err));

    // 9. Teaching Materials
    const unsubMaterials = onSnapshot(collection(db, 'teaching_materials'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as TeachingMaterial));
        setTeachingMaterials(list);
        localStorage.setItem(`${STORAGE_KEY}_teaching_materials`, JSON.stringify(list));
      } else {
        initialTeachingMaterials.forEach(m => setDoc(doc(db, 'teaching_materials', m.id), m).catch(console.error));
      }
    }, err => console.warn('Offline mode: Using local teaching materials', err));

    // 10. Fee Payments
    const unsubPayments = onSnapshot(collection(db, 'fee_payments'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as FeePayment));
        setFeePayments(list);
        localStorage.setItem(`${STORAGE_KEY}_fee_payments`, JSON.stringify(list));
      } else {
        initialFeePayments.forEach(p => setDoc(doc(db, 'fee_payments', p.id), p).catch(console.error));
      }
    }, err => console.warn('Offline mode: Using local fee payments data', err));

    // 11. News Articles
    const unsubNews = onSnapshot(collection(db, 'news_articles'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as NewsArticle));
        setNewsArticles(list);
        localStorage.setItem(`${STORAGE_KEY}_news_articles`, JSON.stringify(list));
      } else {
        initialNewsArticles.forEach(n => setDoc(doc(db, 'news_articles', n.id), n).catch(console.error));
      }
    }, err => console.warn('Offline mode: Using local news articles data', err));

    return () => {
      unsubInfo();
      unsubStudents();
      unsubTeachers();
      unsubResults();
      unsubExams();
      unsubAttempts();
      unsubStudentAtt();
      unsubStaffAtt();
      unsubMaterials();
      unsubPayments();
      unsubNews();
    };
  }, []);

  // Save Current Login State
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_user`);
    }
  }, [currentUser]);

  const updateSchoolInfo = (info: Partial<SchoolInfo>) => {
    const updated = { ...schoolInfo, ...info };
    setSchoolInfo(updated);
    localStorage.setItem(`${STORAGE_KEY}_school_info`, JSON.stringify(updated));
    setDoc(doc(db, 'school_info', 'main'), updated, { merge: true }).catch(console.error);
  };

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Student Actions with Optimistic Local Update & Offline Sync
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const id = `std_${Date.now()}`;
    const newStudent: Student = { ...studentData, id };
    setStudents(prev => {
      const next = [newStudent, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'students', id), newStudent).catch(err => {
      console.warn('Student registered offline, queued in local cache:', err);
    });
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(prev => {
      const next = prev.map(s => (s.id === id ? { ...s, ...data } : s));
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'students', id), data, { merge: true }).catch(console.error);
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(next));
      return next;
    });
    deleteDoc(doc(db, 'students', id)).catch(console.error);
  };

  // Teacher Actions
  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const id = `tch_${Date.now()}`;
    const newTeacher: Teacher = { ...teacherData, id };
    setTeachers(prev => {
      const next = [newTeacher, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_teachers`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'teachers', id), newTeacher).catch(console.error);
  };

  const updateTeacher = (id: string, data: Partial<Teacher>) => {
    setTeachers(prev => {
      const next = prev.map(t => (t.id === id ? { ...t, ...data } : t));
      localStorage.setItem(`${STORAGE_KEY}_teachers`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'teachers', id), data, { merge: true }).catch(console.error);
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => {
      const next = prev.filter(t => t.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_teachers`, JSON.stringify(next));
      return next;
    });
    deleteDoc(doc(db, 'teachers', id)).catch(console.error);
  };

  // Result Slip Actions
  const saveResultSlip = (result: ResultSlip) => {
    setResultSlips(prev => {
      const next = [result, ...prev.filter(r => r.id !== result.id)];
      localStorage.setItem(`${STORAGE_KEY}_result_slips`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'result_slips', result.id), result).catch(console.error);
  };

  const deleteResultSlip = (id: string) => {
    setResultSlips(prev => {
      const next = prev.filter(r => r.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_result_slips`, JSON.stringify(next));
      return next;
    });
    deleteDoc(doc(db, 'result_slips', id)).catch(console.error);
  };

  const publishResultSlip = (id: string) => {
    setResultSlips(prev => {
      const next = prev.map(r =>
        r.id === id
          ? { ...r, isPublished: true, publishedAt: new Date().toISOString().split('T')[0] }
          : r
      );
      localStorage.setItem(`${STORAGE_KEY}_result_slips`, JSON.stringify(next));
      return next;
    });
    setDoc(
      doc(db, 'result_slips', id),
      {
        isPublished: true,
        publishedAt: new Date().toISOString().split('T')[0],
      },
      { merge: true }
    ).catch(console.error);
  };

  // CBT Exam Actions
  const saveCBTExam = (exam: CBTExam) => {
    setCbtExams(prev => {
      const next = [exam, ...prev.filter(e => e.id !== exam.id)];
      localStorage.setItem(`${STORAGE_KEY}_cbt_exams`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'cbt_exams', exam.id), exam).catch(console.error);
  };

  const deleteCBTExam = (id: string) => {
    setCbtExams(prev => {
      const next = prev.filter(e => e.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_cbt_exams`, JSON.stringify(next));
      return next;
    });
    deleteDoc(doc(db, 'cbt_exams', id)).catch(console.error);
  };

  // Record CBT Attempt with Full Offline Resilience
  const recordCBTAttempt = (attemptData: Omit<CBTAttempt, 'id'>) => {
    const id = `att_${Date.now()}`;
    const newAttempt: CBTAttempt = { ...attemptData, id };
    setCbtAttempts(prev => {
      const next = [newAttempt, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_cbt_attempts`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'cbt_attempts', id), newAttempt).catch(err => {
      console.warn('CBT attempt stored offline in local cache:', err);
    });
  };

  // Attendance Functions (Students & Staff)
  const markStudentAttendance = (newRecords: StudentAttendanceRecord[]) => {
    setStudentAttendance(prev => {
      const recordMap = new Map<string, StudentAttendanceRecord>();
      // Keep existing
      prev.forEach(r => recordMap.set(`${r.date}_${r.studentId}`, r));
      // Overwrite/insert new
      newRecords.forEach(r => recordMap.set(`${r.date}_${r.studentId}`, r));
      const next = Array.from(recordMap.values());
      localStorage.setItem(`${STORAGE_KEY}_student_attendance`, JSON.stringify(next));
      return next;
    });
    newRecords.forEach(rec => {
      setDoc(doc(db, 'student_attendance', rec.id), rec).catch(err => {
        console.warn('Student attendance stored offline:', err);
      });
    });
  };

  const markStaffAttendance = (recordData: Omit<StaffAttendanceRecord, 'id' | 'timestamp'>) => {
    const id = `stf_att_${Date.now()}`;
    const newRecord: StaffAttendanceRecord = {
      ...recordData,
      id,
      timestamp: new Date().toISOString(),
    };
    setStaffAttendance(prev => {
      const filtered = prev.filter(r => !(r.date === newRecord.date && r.staffId === newRecord.staffId));
      const next = [newRecord, ...filtered];
      localStorage.setItem(`${STORAGE_KEY}_staff_attendance`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'staff_attendance', id), newRecord).catch(err => {
      console.warn('Staff attendance stored offline:', err);
    });
  };

  // Teaching Materials Actions
  const saveTeachingMaterial = (materialData: Omit<TeachingMaterial, 'id' | 'lastUpdated'>) => {
    const id = `mat_${Date.now()}`;
    const newMaterial: TeachingMaterial = {
      ...materialData,
      id,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setTeachingMaterials(prev => {
      const next = [newMaterial, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_teaching_materials`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'teaching_materials', id), newMaterial).catch(err => {
      console.warn('Teaching material stored offline:', err);
    });
  };

  const deleteTeachingMaterial = (id: string) => {
    setTeachingMaterials(prev => {
      const next = prev.filter(m => m.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_teaching_materials`, JSON.stringify(next));
      return next;
    });
    deleteDoc(doc(db, 'teaching_materials', id)).catch(console.error);
  };

  const updateFeeStructure = (structures: FeeStructure[]) => {
    setFeeStructures(structures);
    localStorage.setItem(`${STORAGE_KEY}_fee_structures`, JSON.stringify(structures));
  };

  const addFeePayment = (paymentData: Omit<FeePayment, 'id' | 'receiptNo'>) => {
    const id = `pay_${Date.now()}`;
    const newPayment: FeePayment = {
      ...paymentData,
      id,
      receiptNo: `REC/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setFeePayments(prev => {
      const next = [newPayment, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_fee_payments`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'fee_payments', id), newPayment).catch(console.error);
  };

  const submitAdmissionApp = (appData: Omit<AdmissionApplication, 'id' | 'applicationDate' | 'status'>) => {
    const id = `app_${Date.now()}`;
    const newApp: AdmissionApplication = {
      ...appData,
      id,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setAdmissionApplications(prev => {
      const next = [newApp, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_admission_apps`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'admission_apps', id), newApp).catch(console.error);
  };

  const updateAdmissionStatus = (id: string, status: AdmissionApplication['status']) => {
    setAdmissionApplications(prev => {
      const next = prev.map(a => (a.id === id ? { ...a, status } : a));
      localStorage.setItem(`${STORAGE_KEY}_admission_apps`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'admission_apps', id), { status }, { merge: true }).catch(console.error);
  };

  const addNewsArticle = (newsData: Omit<NewsArticle, 'id'>) => {
    const id = `news_${Date.now()}`;
    const newNews: NewsArticle = { ...newsData, id };
    setNewsArticles(prev => {
      const next = [newNews, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_news_articles`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'news_articles', id), newNews).catch(console.error);
  };

  const deleteNewsArticle = (id: string) => {
    setNewsArticles(prev => {
      const next = prev.filter(n => n.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_news_articles`, JSON.stringify(next));
      return next;
    });
    deleteDoc(doc(db, 'news_articles', id)).catch(console.error);
  };

  const addGalleryPhoto = (photoData: Omit<GalleryPhoto, 'id'>) => {
    const id = `gal_${Date.now()}`;
    const newPhoto: GalleryPhoto = { ...photoData, id };
    setGalleryPhotos(prev => {
      const next = [newPhoto, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_gallery_photos`, JSON.stringify(next));
      return next;
    });
  };

  const deleteGalleryPhoto = (id: string) => {
    setGalleryPhotos(prev => {
      const next = prev.filter(g => g.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_gallery_photos`, JSON.stringify(next));
      return next;
    });
  };

  const resetToDefaults = () => {
    setSchoolInfo(initialSchoolInfo);
    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setResultSlips(initialResultSlips);
    setCbtExams(initialCBTExams);
    setCbtAttempts(initialCBTAttempts);
    setStudentAttendance(initialStudentAttendance);
    setStaffAttendance(initialStaffAttendance);
    setTeachingMaterials(initialTeachingMaterials);
    setFeeStructures(initialFeeStructures);
    setFeePayments(initialFeePayments);
    setAdmissionApplications(initialAdmissionApps);
    setNewsArticles(initialNewsArticles);
    setGalleryPhotos(initialGalleryPhotos);
    localStorage.clear();
  };

  return (
    <SchoolContext.Provider
      value={{
        schoolInfo,
        updateSchoolInfo,
        currentUser,
        login,
        logout,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        resultSlips,
        setResultSlips,
        saveResultSlip,
        deleteResultSlip,
        publishResultSlip,
        cbtExams,
        setCbtExams,
        saveCBTExam,
        deleteCBTExam,
        cbtAttempts,
        recordCBTAttempt,
        studentAttendance,
        markStudentAttendance,
        staffAttendance,
        markStaffAttendance,
        teachingMaterials,
        saveTeachingMaterial,
        deleteTeachingMaterial,
        feeStructures,
        updateFeeStructure,
        feePayments,
        addFeePayment,
        admissionApplications,
        submitAdmissionApp,
        updateAdmissionStatus,
        newsArticles,
        addNewsArticle,
        deleteNewsArticle,
        galleryPhotos,
        addGalleryPhoto,
        deleteGalleryPhoto,
        isOffline,
        resetToDefaults,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
