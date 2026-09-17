import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
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
} from '../types';
import {
  initialSchoolInfo,
  initialUsers,
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
  saveResultSlip: (result: ResultSlip) => void;
  deleteResultSlip: (id: string) => void;
  publishResultSlip: (id: string) => void;

  cbtExams: CBTExam[];
  saveCBTExam: (exam: CBTExam) => void;
  deleteCBTExam: (id: string) => void;

  cbtAttempts: CBTAttempt[];
  recordCBTAttempt: (attempt: Omit<CBTAttempt, 'id'>) => void;

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

  resetToDefaults: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEY = 'denmin_school_data_v1';

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(initialSchoolInfo);
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

  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [resultSlips, setResultSlips] = useState<ResultSlip[]>(initialResultSlips);
  const [cbtExams, setCbtExams] = useState<CBTExam[]>(initialCBTExams);
  const [cbtAttempts, setCbtAttempts] = useState<CBTAttempt[]>(initialCBTAttempts);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(initialFeeStructures);
  const [feePayments, setFeePayments] = useState<FeePayment[]>(initialFeePayments);
  const [admissionApplications, setAdmissionApplications] = useState<AdmissionApplication[]>(initialAdmissionApps);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(initialNewsArticles);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(initialGalleryPhotos);

  // Firestore Real-Time Subscriptions & Auto-Seeding
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

        if (needsUpdate) {
          setDoc(doc(db, 'school_info', 'main'), cleanedInfo, { merge: true }).catch(console.error);
        }
        setSchoolInfo(cleanedInfo);
      } else {
        setDoc(doc(db, 'school_info', 'main'), initialSchoolInfo).catch(console.error);
      }
    });

    // 2. Students
    const unsubStudents = onSnapshot(collection(db, 'students'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Student));
        setStudents(list);
      } else {
        // Seed initial students
        initialStudents.forEach(s => setDoc(doc(db, 'students', s.id), s));
      }
    });

    // 3. Teachers
    const unsubTeachers = onSnapshot(collection(db, 'teachers'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Teacher));
        setTeachers(list);
      } else {
        initialTeachers.forEach(t => setDoc(doc(db, 'teachers', t.id), t));
      }
    });

    // 4. Result Slips
    const unsubResults = onSnapshot(collection(db, 'result_slips'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as ResultSlip));
        setResultSlips(list);
      } else {
        initialResultSlips.forEach(r => setDoc(doc(db, 'result_slips', r.id), r));
      }
    });

    // 5. CBT Exams
    const unsubExams = onSnapshot(collection(db, 'cbt_exams'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as CBTExam));
        setCbtExams(list);
      } else {
        initialCBTExams.forEach(e => setDoc(doc(db, 'cbt_exams', e.id), e));
      }
    });

    // 6. CBT Attempts
    const unsubAttempts = onSnapshot(collection(db, 'cbt_attempts'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as CBTAttempt));
        setCbtAttempts(list);
      } else {
        initialCBTAttempts.forEach(a => setDoc(doc(db, 'cbt_attempts', a.id), a));
      }
    });

    // 7. Fee Payments
    const unsubPayments = onSnapshot(collection(db, 'fee_payments'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as FeePayment));
        setFeePayments(list);
      } else {
        initialFeePayments.forEach(p => setDoc(doc(db, 'fee_payments', p.id), p));
      }
    });

    // 8. News Articles
    const unsubNews = onSnapshot(collection(db, 'news_articles'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as NewsArticle));
        setNewsArticles(list);
      } else {
        initialNewsArticles.forEach(n => setDoc(doc(db, 'news_articles', n.id), n));
      }
    });

    return () => {
      unsubInfo();
      unsubStudents();
      unsubTeachers();
      unsubResults();
      unsubExams();
      unsubAttempts();
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
    setDoc(doc(db, 'school_info', 'main'), updated, { merge: true }).catch(console.error);
  };

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const id = `std_${Date.now()}`;
    const newStudent: Student = { ...studentData, id };
    setDoc(doc(db, 'students', id), newStudent).catch(console.error);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setDoc(doc(db, 'students', id), data, { merge: true }).catch(console.error);
  };

  const deleteStudent = (id: string) => {
    deleteDoc(doc(db, 'students', id)).catch(console.error);
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const id = `tch_${Date.now()}`;
    const newTeacher: Teacher = { ...teacherData, id };
    setDoc(doc(db, 'teachers', id), newTeacher).catch(console.error);
  };

  const updateTeacher = (id: string, data: Partial<Teacher>) => {
    setDoc(doc(db, 'teachers', id), data, { merge: true }).catch(console.error);
  };

  const deleteTeacher = (id: string) => {
    deleteDoc(doc(db, 'teachers', id)).catch(console.error);
  };

  const saveResultSlip = (result: ResultSlip) => {
    setDoc(doc(db, 'result_slips', result.id), result).catch(console.error);
  };

  const deleteResultSlip = (id: string) => {
    deleteDoc(doc(db, 'result_slips', id)).catch(console.error);
  };

  const publishResultSlip = (id: string) => {
    setDoc(doc(db, 'result_slips', id), {
      isPublished: true,
      publishedAt: new Date().toISOString().split('T')[0],
    }, { merge: true }).catch(console.error);
  };

  const saveCBTExam = (exam: CBTExam) => {
    setDoc(doc(db, 'cbt_exams', exam.id), exam).catch(console.error);
  };

  const deleteCBTExam = (id: string) => {
    deleteDoc(doc(db, 'cbt_exams', id)).catch(console.error);
  };

  const recordCBTAttempt = (attemptData: Omit<CBTAttempt, 'id'>) => {
    const id = `att_${Date.now()}`;
    const newAttempt: CBTAttempt = { ...attemptData, id };
    setDoc(doc(db, 'cbt_attempts', id), newAttempt).catch(console.error);
  };

  const updateFeeStructure = (structures: FeeStructure[]) => {
    setFeeStructures(structures);
  };

  const addFeePayment = (paymentData: Omit<FeePayment, 'id' | 'receiptNo'>) => {
    const id = `pay_${Date.now()}`;
    const newPayment: FeePayment = {
      ...paymentData,
      id,
      receiptNo: `REC/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
    };
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
    setDoc(doc(db, 'admission_apps', id), newApp).catch(console.error);
  };

  const updateAdmissionStatus = (id: string, status: AdmissionApplication['status']) => {
    setDoc(doc(db, 'admission_apps', id), { status }, { merge: true }).catch(console.error);
  };

  const addNewsArticle = (newsData: Omit<NewsArticle, 'id'>) => {
    const id = `news_${Date.now()}`;
    const newNews: NewsArticle = { ...newsData, id };
    setDoc(doc(db, 'news_articles', id), newNews).catch(console.error);
  };

  const deleteNewsArticle = (id: string) => {
    deleteDoc(doc(db, 'news_articles', id)).catch(console.error);
  };

  const addGalleryPhoto = (photoData: Omit<GalleryPhoto, 'id'>) => {
    const id = `gal_${Date.now()}`;
    const newPhoto: GalleryPhoto = { ...photoData, id };
    setGalleryPhotos(prev => [newPhoto, ...prev]);
  };

  const deleteGalleryPhoto = (id: string) => {
    setGalleryPhotos(prev => prev.filter(g => g.id !== id));
  };

  const resetToDefaults = () => {
    setSchoolInfo(initialSchoolInfo);
    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setResultSlips(initialResultSlips);
    setCbtExams(initialCBTExams);
    setCbtAttempts(initialCBTAttempts);
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
        saveResultSlip,
        deleteResultSlip,
        publishResultSlip,
        cbtExams,
        saveCBTExam,
        deleteCBTExam,
        cbtAttempts,
        recordCBTAttempt,
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
