import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
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
  CalendarEvent,
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
import { initialCalendarEvents } from '../data/initialCalendarEvents';

interface SchoolContextType {
  schoolInfo: SchoolInfo;
  updateSchoolInfo: (info: Partial<SchoolInfo>) => void;

  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;

  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
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
  updateCBTAttempt: (id: string, data: Partial<CBTAttempt>) => void;

  studentAttendance: StudentAttendanceRecord[];
  markStudentAttendance: (records: StudentAttendanceRecord[]) => void;

  staffAttendance: StaffAttendanceRecord[];
  markStaffAttendance: (record: Omit<StaffAttendanceRecord, 'id' | 'timestamp'>) => void;

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

  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (id: string) => void;

  isOffline: boolean;
  resetToDefaults: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEY = 'sharon_brain_school_data_v2';

// Known sample student identifiers that should never be shown
const SAMPLE_STUDENT_IDS = new Set(['std_1', 'std_2', 'std_3', 'std_4', 'std_5']);
const SAMPLE_STUDENT_NAMES = [
  'eseosa princess igbinoba',
  'osasumwen junior oviawe',
  'divine chinedu okeke',
  'nosa alexander igbinoba',
  'aisha aisha bello',
  'samuel okon',
];

export function isSampleStudent(item: { id?: string; fullName?: string; studentName?: string; name?: string }): boolean {
  if (!item) return false;
  if (item.id && SAMPLE_STUDENT_IDS.has(item.id)) return true;
  const name = (item.fullName || item.studentName || item.name || '').toLowerCase().trim();
  if (!name) return false;
  return SAMPLE_STUDENT_NAMES.some(s => name.includes(s) || s.includes(name));
}

// Automatic data sanitizer to upgrade any legacy DEN/ abbreviations and emails
function sanitizeSchoolRecord<T>(item: T): { sanitized: T; changed: boolean } {
  if (!item || typeof item !== 'object') {
    return { sanitized: item, changed: false };
  }
  const str = JSON.stringify(item);
  if (
    str.includes('DEN/') ||
    str.includes('STF/DEN') ||
    str.includes('denmin') ||
    str.includes('Denmin')
  ) {
    const updatedStr = str
      .replace(/DEN\/202/g, 'SBA/202')
      .replace(/DEN\//g, 'SBA/')
      .replace(/STF\/DEN\//g, 'STF/SBA/')
      .replace(/@denminacademy\.edu\.ng/g, '@sharonbrainacademy.edu.ng')
      .replace(/@denmin\.edu/g, '@sharonbrainacademy.edu.ng')
      .replace(/student\.denmin\.edu/g, 'student.sharonbrainacademy.edu.ng')
      .replace(/Denmin British Montessori Academy/g, 'Sharon Brain Academy')
      .replace(/Denmin British Academy/g, 'Sharon Brain Academy')
      .replace(/Denmin Academy/g, 'Sharon Brain Academy');
    if (updatedStr !== str) {
      try {
        const sanitized = JSON.parse(updatedStr) as T;
        return { sanitized, changed: true };
      } catch (e) {
        return { sanitized: item, changed: false };
      }
    }
  }
  return { sanitized: item, changed: false };
}

// Safe localStorage loader helper with automatic sample student purge
function loadInitialState<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (key === 'students' && Array.isArray(parsed)) {
        // Strip out any sample students completely
        const filtered = parsed.filter(s => !isSampleStudent(s));
        return filtered as unknown as T;
      }
      const { sanitized } = sanitizeSchoolRecord(parsed);
      return sanitized;
    }
    // Also clean up old storage key v1
    const v1Saved = localStorage.getItem(`sharon_brain_school_data_v1_${key}`);
    if (v1Saved) {
      const parsed = JSON.parse(v1Saved);
      if (key === 'students' && Array.isArray(parsed)) {
        const filtered = parsed.filter(s => !isSampleStudent(s));
        localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(filtered));
        return filtered as unknown as T;
      }
      const { sanitized } = sanitizeSchoolRecord(parsed);
      localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(sanitized));
      return sanitized;
    }
  } catch (e) {
    console.warn(`Failed reading ${key} from storage:`, e);
  }
  return fallback;
}

// Bi-directional merge helper: preserves both Firestore and local data, pushes missing local data to Firestore
function mergeAndSyncWithFirestore<T extends { id: string }>(
  remoteList: T[],
  collectionName: string,
  storageKey: string,
  initialFallback: T[]
): T[] {
  const localList = loadInitialState<T[]>(storageKey, initialFallback);
  const map = new Map<string, T>();
  const toUpdateInFirestore: T[] = [];

  // 1. Process remote docs
  remoteList.forEach(rawItem => {
    // If this is students collection, discard any sample students
    if (collectionName === 'students' && isSampleStudent(rawItem as any)) {
      deleteDoc(doc(db, 'students', rawItem.id)).catch(() => {});
      return;
    }
    const { sanitized, changed } = sanitizeSchoolRecord(rawItem);
    map.set(sanitized.id, sanitized);
    if (changed) {
      toUpdateInFirestore.push(sanitized);
    }
  });

  // 2. Process local docs
  localList.forEach(rawItem => {
    if (collectionName === 'students' && isSampleStudent(rawItem as any)) {
      return;
    }
    const { sanitized, changed } = sanitizeSchoolRecord(rawItem);
    if (!map.has(sanitized.id)) {
      map.set(sanitized.id, sanitized);
      toUpdateInFirestore.push(sanitized);
    } else if (changed) {
      map.set(sanitized.id, sanitized);
      toUpdateInFirestore.push(sanitized);
    }
  });

  // 3. Immediately persist missing and sanitized items to Firestore
  if (toUpdateInFirestore.length > 0) {
    toUpdateInFirestore.forEach(item => {
      setDoc(doc(db, collectionName, item.id), item as any, { merge: true })
        .then(() => console.log(`[Storage Sync] Synced ${collectionName} item to Firestore:`, item.id))
        .catch(err => console.warn(`[Storage Sync] Queued ${collectionName} item for sync:`, err));
    });
  }

  return Array.from(map.values());
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

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    const loaded = loadInitialState('school_info', initialSchoolInfo);
    return {
      ...loaded,
      name: 'Sharon Brain Academy',
      phone: '+2347066851455',
      whatsapp: '+2347066851455',
      address: 'No 2, 2nd Otakhiogbogie Street, Ugbowo Benin City, Edo State Nigeria.',
      principalName: 'Mr Imhoenegamhe Stephen Moses',
      principalPhotoUrl: '/src/assets/images/sharon_principal_photo_1792366303843.jpg',
    };
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name && (parsed.name.includes('Deborah') || parsed.name.includes('Denyinye') || parsed.name.includes('Hitler'))) {
          parsed.name = 'Mr Imhoenegamhe Stephen Moses';
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
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() =>
    loadInitialState('calendar_events', initialCalendarEvents)
  );

  // Firestore Real-Time Subscriptions & Two-Way Sync
  useEffect(() => {
    // 1. School Info
    const unsubInfo = onSnapshot(doc(db, 'school_info', 'main'), docSnap => {
      if (docSnap.exists()) {
        const rawInfo = docSnap.data() as SchoolInfo;
        let needsUpdate = false;
        const cleanedInfo = { ...rawInfo };

        if (cleanedInfo.name !== 'Sharon Brain Academy') {
          cleanedInfo.name = 'Sharon Brain Academy';
          needsUpdate = true;
        }
        if (cleanedInfo.phone !== '+2347066851455') {
          cleanedInfo.phone = '+2347066851455';
          cleanedInfo.whatsapp = '+2347066851455';
          needsUpdate = true;
        }
        if (cleanedInfo.address !== 'No 2, 2nd Otakhiogbogie Street, Ugbowo Benin City, Edo State Nigeria.') {
          cleanedInfo.address = 'No 2, 2nd Otakhiogbogie Street, Ugbowo Benin City, Edo State Nigeria.';
          needsUpdate = true;
        }
        if (cleanedInfo.principalName !== 'Mr Imhoenegamhe Stephen Moses') {
          cleanedInfo.principalName = 'Mr Imhoenegamhe Stephen Moses';
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
        if (cleanedInfo.principalPhotoUrl?.includes('proprietor_photo_1789616090083') || !cleanedInfo.principalPhotoUrl) {
          cleanedInfo.principalPhotoUrl = '/src/assets/images/sharon_principal_photo_1792366303843.jpg';
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

    // 2. Students — ONLY students added by the user; actively purge any sample students
    const unsubStudents = onSnapshot(collection(db, 'students'), snapshot => {
      const rawList = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Student));
      
      // Actively purge any sample students from cloud database
      rawList.forEach(s => {
        if (isSampleStudent(s)) {
          deleteDoc(doc(db, 'students', s.id)).catch(() => {});
        }
      });

      const realRemoteList = rawList.filter(s => !isSampleStudent(s));
      const merged = mergeAndSyncWithFirestore(realRemoteList, 'students', 'students', []);
      const finalRealStudents = merged.filter(s => !isSampleStudent(s));
      setStudents(finalRealStudents);
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(finalRealStudents));
    }, err => console.warn('Offline mode: Using local students data', err));

    // 3. Teachers
    const unsubTeachers = onSnapshot(collection(db, 'teachers'), snapshot => {
      const remoteList = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Teacher));
      if (remoteList.length === 0) {
        initialTeachers.forEach(t => setDoc(doc(db, 'teachers', t.id), t).catch(console.error));
      }
      const merged = mergeAndSyncWithFirestore(remoteList, 'teachers', 'teachers', initialTeachers);
      setTeachers(merged);
      localStorage.setItem(`${STORAGE_KEY}_teachers`, JSON.stringify(merged));
    }, err => console.warn('Offline mode: Using local teachers data', err));

    // 4. Result Slips
    const unsubResults = onSnapshot(collection(db, 'result_slips'), snapshot => {
      const remoteList = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as ResultSlip));
      // Purge any results belonging to sample students
      remoteList.forEach(r => {
        if (isSampleStudent(r as any)) {
          deleteDoc(doc(db, 'result_slips', r.id)).catch(() => {});
        }
      });
      const realResults = remoteList.filter(r => !isSampleStudent(r as any));
      const merged = mergeAndSyncWithFirestore(realResults, 'result_slips', 'result_slips', []);
      setResultSlips(merged);
      localStorage.setItem(`${STORAGE_KEY}_result_slips`, JSON.stringify(merged));
    }, err => console.warn('Offline mode: Using local result slips data', err));

    // 5. CBT Exams
    const unsubExams = onSnapshot(collection(db, 'cbt_exams'), snapshot => {
      const remoteList = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as CBTExam));
      if (remoteList.length === 0) {
        initialCBTExams.forEach(e => setDoc(doc(db, 'cbt_exams', e.id), e).catch(console.error));
      }
      const merged = mergeAndSyncWithFirestore(remoteList, 'cbt_exams', 'cbt_exams', initialCBTExams);
      setCbtExams(merged);
      localStorage.setItem(`${STORAGE_KEY}_cbt_exams`, JSON.stringify(merged));
    }, err => console.warn('Offline mode: Using local CBT exams data', err));

    // 6. CBT Attempts
    const unsubAttempts = onSnapshot(collection(db, 'cbt_attempts'), snapshot => {
      const remoteList = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as CBTAttempt));
      // Purge sample attempts
      remoteList.forEach(a => {
        if (isSampleStudent(a as any)) {
          deleteDoc(doc(db, 'cbt_attempts', a.id)).catch(() => {});
        }
      });
      const realAttempts = remoteList.filter(a => !isSampleStudent(a as any));
      const merged = mergeAndSyncWithFirestore(realAttempts, 'cbt_attempts', 'cbt_attempts', []);
      setCbtAttempts(merged);
      localStorage.setItem(`${STORAGE_KEY}_cbt_attempts`, JSON.stringify(merged));
    }, err => console.warn('Offline mode: Using local CBT attempts data', err));

    // 7. Student Attendance
    const unsubStudentAtt = onSnapshot(collection(db, 'student_attendance'), snapshot => {
      const remoteList = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as StudentAttendanceRecord));
      remoteList.forEach(a => {
        if (isSampleStudent(a as any)) {
          deleteDoc(doc(db, 'student_attendance', a.id)).catch(() => {});
        }
      });
      const realAtt = remoteList.filter(a => !isSampleStudent(a as any));
      const merged = mergeAndSyncWithFirestore(realAtt, 'student_attendance', 'student_attendance', []);
      setStudentAttendance(merged);
      localStorage.setItem(`${STORAGE_KEY}_student_attendance`, JSON.stringify(merged));
    }, err => console.warn('Offline mode: Using local student attendance', err));

    // 8. Staff Attendance
    const unsubStaffAtt = onSnapshot(collection(db, 'staff_attendance'), snapshot => {
      const remoteList = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as StaffAttendanceRecord));
      if (remoteList.length === 0) {
        initialStaffAttendance.forEach(a => setDoc(doc(db, 'staff_attendance', a.id), a).catch(console.error));
      }
      const merged = mergeAndSyncWithFirestore(remoteList, 'staff_attendance', 'staff_attendance', initialStaffAttendance);
      setStaffAttendance(merged);
      localStorage.setItem(`${STORAGE_KEY}_staff_attendance`, JSON.stringify(merged));
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
      const remoteList = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as FeePayment));
      remoteList.forEach(p => {
        if (isSampleStudent(p as any)) {
          deleteDoc(doc(db, 'fee_payments', p.id)).catch(() => {});
        }
      });
      const realPayments = remoteList.filter(p => !isSampleStudent(p as any));
      const merged = mergeAndSyncWithFirestore(realPayments, 'fee_payments', 'fee_payments', []);
      setFeePayments(merged);
      localStorage.setItem(`${STORAGE_KEY}_fee_payments`, JSON.stringify(merged));
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

    // 12. Calendar Events
    const unsubCalendar = onSnapshot(collection(db, 'calendar_events'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as CalendarEvent));
        setCalendarEvents(list);
        localStorage.setItem(`${STORAGE_KEY}_calendar_events`, JSON.stringify(list));
      } else {
        initialCalendarEvents.forEach(c => setDoc(doc(db, 'calendar_events', c.id), c).catch(console.error));
      }
    }, err => console.warn('Offline mode: Using local calendar events data', err));

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
      unsubCalendar();
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
  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    let cleanAdmissionNo = studentData.admissionNo || `SBA/2024/${Math.floor(100 + Math.random() * 900)}`;
    if (cleanAdmissionNo.startsWith('DEN/')) {
      cleanAdmissionNo = cleanAdmissionNo.replace(/^DEN\//, 'SBA/');
    }
    const id = `std_${Date.now()}`;
    const newStudent: Student = { ...studentData, admissionNo: cleanAdmissionNo, id };
    setStudents(prev => {
      const next = [newStudent, ...prev.filter(s => s.id !== id && !isSampleStudent(s))];
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(next));
      return next;
    });
    try {
      await setDoc(doc(db, 'students', id), newStudent);
      console.log('[Storage Success] Student written to cloud Firestore:', id);
    } catch (err) {
      console.warn('[Storage Notice] Student saved in local storage, queued for sync:', err);
    }
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    const cleanData = { ...data };
    if (cleanData.admissionNo && cleanData.admissionNo.startsWith('DEN/')) {
      cleanData.admissionNo = cleanData.admissionNo.replace(/^DEN\//, 'SBA/');
    }
    setStudents(prev => {
      const next = prev.map(s => (s.id === id ? { ...s, ...cleanData } : s));
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'students', id), cleanData, { merge: true }).catch(console.error);
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
    let cleanStaffId = teacherData.staffId || `STF/SBA/${Math.floor(100 + Math.random() * 900)}`;
    if (cleanStaffId.startsWith('STF/DEN/')) {
      cleanStaffId = cleanStaffId.replace(/^STF\/DEN\//, 'STF/SBA/');
    }
    let cleanEmail = teacherData.email;
    if (cleanEmail && cleanEmail.includes('@denmin')) {
      cleanEmail = cleanEmail
        .replace(/@denminacademy\.edu\.ng/g, '@sharonbrainacademy.edu.ng')
        .replace(/@denmin\.edu/g, '@sharonbrainacademy.edu.ng');
    }
    const id = `tch_${Date.now()}`;
    const newTeacher: Teacher = { ...teacherData, staffId: cleanStaffId, email: cleanEmail, id };
    setTeachers(prev => {
      const next = [newTeacher, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_teachers`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'teachers', id), newTeacher).catch(console.error);
  };

  const updateTeacher = (id: string, data: Partial<Teacher>) => {
    const cleanData = { ...data };
    if (cleanData.staffId && cleanData.staffId.startsWith('STF/DEN/')) {
      cleanData.staffId = cleanData.staffId.replace(/^STF\/DEN\//, 'STF/SBA/');
    }
    if (cleanData.email && cleanData.email.includes('@denmin')) {
      cleanData.email = cleanData.email
        .replace(/@denminacademy\.edu\.ng/g, '@sharonbrainacademy.edu.ng')
        .replace(/@denmin\.edu/g, '@sharonbrainacademy.edu.ng');
    }
    setTeachers(prev => {
      const next = prev.map(t => (t.id === id ? { ...t, ...cleanData } : t));
      localStorage.setItem(`${STORAGE_KEY}_teachers`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'teachers', id), cleanData, { merge: true }).catch(console.error);
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
    const cleanAdmissionNo = result.admissionNo?.startsWith('DEN/')
      ? result.admissionNo.replace(/^DEN\//, 'SBA/')
      : result.admissionNo;
    const cleanResult = { ...result, admissionNo: cleanAdmissionNo };
    setResultSlips(prev => {
      const next = [cleanResult, ...prev.filter(r => r.id !== cleanResult.id)];
      localStorage.setItem(`${STORAGE_KEY}_result_slips`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'result_slips', cleanResult.id), cleanResult).catch(console.error);
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

  const updateCBTAttempt = (id: string, data: Partial<CBTAttempt>) => {
    setCbtAttempts(prev => {
      const next = prev.map(a => (a.id === id ? { ...a, ...data } : a));
      localStorage.setItem(`${STORAGE_KEY}_cbt_attempts`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'cbt_attempts', id), data as any, { merge: true }).catch(console.error);
  };

  // Attendance Functions (Students & Staff)
  const markStudentAttendance = (newRecords: StudentAttendanceRecord[]) => {
    setStudentAttendance(prev => {
      const recordMap = new Map<string, StudentAttendanceRecord>();
      prev.forEach(r => recordMap.set(`${r.date}_${r.studentId}`, r));
      newRecords.forEach(r => recordMap.set(`${r.date}_${r.studentId}`, r));
      const next = Array.from(recordMap.values()).filter(r => !isSampleStudent(r as any));
      localStorage.setItem(`${STORAGE_KEY}_student_attendance`, JSON.stringify(next));
      return next;
    });
    newRecords.forEach(rec => {
      if (!isSampleStudent(rec as any)) {
        setDoc(doc(db, 'student_attendance', rec.id), rec).catch(err => {
          console.warn('Student attendance stored offline:', err);
        });
      }
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
      const next = [newRecord, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_staff_attendance`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'staff_attendance', id), newRecord).catch(console.error);
  };

  // Teaching Materials
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
    setDoc(doc(db, 'teaching_materials', id), newMaterial).catch(console.error);
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
    const cleanAdmissionNo = paymentData.admissionNo?.startsWith('DEN/')
      ? paymentData.admissionNo.replace(/^DEN\//, 'SBA/')
      : paymentData.admissionNo;
    const id = `pay_${Date.now()}`;
    const newPayment: FeePayment = {
      ...paymentData,
      admissionNo: cleanAdmissionNo,
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
    setDoc(doc(db, 'gallery_photos', id), newPhoto).catch(console.error);
  };

  const deleteGalleryPhoto = (id: string) => {
    setGalleryPhotos(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_gallery_photos`, JSON.stringify(next));
      return next;
    });
    deleteDoc(doc(db, 'gallery_photos', id)).catch(console.error);
  };

  const addCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const id = `cal_${Date.now()}`;
    const newEv: CalendarEvent = { ...eventData, id };
    setCalendarEvents(prev => {
      const next = [...prev, newEv];
      localStorage.setItem(`${STORAGE_KEY}_calendar_events`, JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'calendar_events', id), newEv).catch(console.error);
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => {
      const next = prev.filter(c => c.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_calendar_events`, JSON.stringify(next));
      return next;
    });
    deleteDoc(doc(db, 'calendar_events', id)).catch(console.error);
  };

  const resetToDefaults = () => {
    setSchoolInfo(initialSchoolInfo);
    setStudents([]);
    setTeachers(initialTeachers);
    setResultSlips([]);
    setCbtExams(initialCBTExams);
    setCbtAttempts([]);
    setStudentAttendance([]);
    setStaffAttendance(initialStaffAttendance);
    setTeachingMaterials(initialTeachingMaterials);
    setFeeStructures(initialFeeStructures);
    setFeePayments([]);
    setAdmissionApplications(initialAdmissionApps);
    setNewsArticles(initialNewsArticles);
    setGalleryPhotos(initialGalleryPhotos);
    setCalendarEvents(initialCalendarEvents);
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
        updateCBTAttempt,
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
        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,
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
