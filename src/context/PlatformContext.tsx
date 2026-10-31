import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  PlatformDatabase,
  StudentAccount,
  AdminAccount,
  Lesson,
  Book,
  AccessCode,
  Quiz,
  StudentGrade,
  ActivityLog,
  AccountStatus,
} from '../types/platform';
import { INITIAL_DATABASE, SAMPLE_DEMO_DATABASE, DEFAULT_ADMINS } from '../data/initialData';

const DB_STORAGE_KEY = 'dr_ahmed_sanad_platform_db_v2';
const CURRENT_STUDENT_KEY = 'dr_sanad_active_student_session';
const CURRENT_ADMIN_KEY = 'dr_sanad_active_admin_session';
const DEVICE_ID_KEY = 'dr_sanad_device_fingerprint';

// Helper to get or create unique device ID
function getOrCreateDeviceId(): string {
  let devId = localStorage.getItem(DEVICE_ID_KEY);
  if (!devId) {
    devId = 'dev-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
    localStorage.setItem(DEVICE_ID_KEY, devId);
  }
  return devId;
}

// Format Arabic Date & Time
export function formatArabicDateTime(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  let hh = date.getHours();
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  const ampm = hh >= 12 ? 'م' : 'ص';
  hh = hh % 12 || 12;
  return `${yyyy}-${mm}-${dd} ${String(hh).padStart(2, '0')}:${min}:${ss} ${ampm}`;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'whatsapp';
  title: string;
  message: string;
  duration?: number;
}

interface PlatformContextType {
  db: PlatformDatabase;
  currentStudent: StudentAccount | null;
  currentAdmin: AdminAccount | null;
  deviceId: string;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Active views / modals
  activeTab: 'home' | 'content' | 'my-grades' | 'admin';
  setActiveTab: (tab: 'home' | 'content' | 'my-grades' | 'admin') => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (val: boolean) => void;
  isRegisterOpen: boolean;
  setIsRegisterOpen: (val: boolean) => void;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (val: boolean) => void;
  isAddLessonModalOpen: boolean;
  setIsAddLessonModalOpen: (val: boolean) => void;
  isAddBookModalOpen: boolean;
  setIsAddBookModalOpen: (val: boolean) => void;

  // Media modals
  activeVideoLesson: Lesson | null;
  setActiveVideoLesson: (lesson: Lesson | null) => void;
  activePdfBook: Book | null;
  setActivePdfBook: (book: Book | null) => void;
  activeQuiz: Quiz | null;
  setActiveQuiz: (quiz: Quiz | null) => void;
  activeQuizLesson: Lesson | null;
  setActiveQuizLesson: (lesson: Lesson | null) => void;

  // Auth
  loginStudent: (phone: string, pass: string) => { success: boolean; error?: string };
  registerStudent: (data: {
    fullName: string;
    phone: string;
    nationalId: string;
    division: string;
    section: string;
    rosterNumber: string;
    password: string;
  }) => { success: boolean; error?: string };
  loginAdmin: (username: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;

  // Student actions
  redeemLessonCode: (
    code: string,
    tripleNumber: string,
    division: string
  ) => { success: boolean; lesson?: Lesson; error?: string };
  redeemBookCode: (
    code: string,
    tripleNumber: string,
    division: string
  ) => { success: boolean; book?: Book; error?: string };
  submitQuizResult: (gradeData: Omit<StudentGrade, 'id' | 'submittedAt'>) => void;

  // Admin actions
  activateStudent: (studentId: string) => void;
  suspendStudent: (studentId: string) => void;
  unsuspendStudent: (studentId: string) => void;
  deleteStudent: (studentId: string) => void;
  updateStudent: (studentId: string, data: Partial<StudentAccount>) => void;
  toggleAllowOtherDevices: (studentId: string, allow: boolean) => void;
  approveDeviceForStudent: (studentId: string, deviceId: string) => void;

  addLesson: (lesson: Omit<Lesson, 'id' | 'createdAt'>) => void;
  deleteLesson: (lessonId: string) => void;
  addBook: (book: Omit<Book, 'id' | 'createdAt'>) => void;
  deleteBook: (bookId: string) => void;

  saveQuiz: (quiz: Quiz) => void;
  deleteQuiz: (quizId: string) => void;

  createCode: (codeData: Omit<AccessCode, 'id' | 'isUsed' | 'createdAt'>) => void;
  deleteCode: (codeId: string) => void;

  addAdmin: (adminData: Omit<AdminAccount, 'id' | 'createdAt'>) => void;
  deleteAdmin: (adminId: string) => void;
  updateAdmin: (adminId: string, data: Partial<AdminAccount>) => void;

  clearLogs: () => void;
  exportDatabaseJson: () => string;
  importDatabaseJson: (json: string) => { success: boolean; error?: string };
  resetToDefaultData: () => void;
  clearAllDatabaseData: () => void;
  loadSampleDemoData: () => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deviceId] = useState<string>(getOrCreateDeviceId);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals and tabs
  const [activeTab, setActiveTab] = useState<'home' | 'content' | 'my-grades' | 'admin'>('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  // Active players
  const [activeVideoLesson, setActiveVideoLesson] = useState<Lesson | null>(null);
  const [activePdfBook, setActivePdfBook] = useState<Book | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeQuizLesson, setActiveQuizLesson] = useState<Lesson | null>(null);

  // Initialize DB from localStorage or seed
  const [db, setDb] = useState<PlatformDatabase>(() => {
    try {
      const saved = localStorage.getItem(DB_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved DB:', e);
    }
    return INITIAL_DATABASE;
  });

  // Current logged in identities
  const [currentStudent, setCurrentStudent] = useState<StudentAccount | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_STUDENT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_ADMIN_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Save DB to localStorage and central server on changes
  useEffect(() => {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Failed to save DB to localStorage', e);
    }

    // Save to central server API for multi-device cross-browser access
    fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ db }),
    }).catch(() => {
      // offline / quiet fallback
    });
  }, [db]);

  // Sync state from central server periodically and across browser tabs
  useEffect(() => {
    let isMounted = true;

    const fetchCentralDb = async () => {
      try {
        const res = await fetch('/api/db');
        if (!res.ok) return;
        const json = await res.json();
        if (json.success && json.data && isMounted) {
          const serverDb = json.data;
          setDb((prev) => {
            if (!serverDb || !serverDb.version) return prev;
            // Sync if server timestamp is different or local is empty
            if (serverDb.lastUpdated && serverDb.lastUpdated !== prev.lastUpdated) {
              return serverDb;
            }
            return prev;
          });
        }
      } catch {
        // Fallback to local
      }
    };

    fetchCentralDb();
    const interval = setInterval(fetchCentralDb, 4000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === DB_STORAGE_KEY && e.newValue) {
        try {
          setDb(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Update currentStudent when db.students changes
  useEffect(() => {
    if (currentStudent) {
      const fresh = db.students.find((s) => s.id === currentStudent.id);
      if (fresh) {
        setCurrentStudent(fresh);
        localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(fresh));
      }
    }
  }, [db.students]);

  // Toast helper
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    const duration = toast.duration ?? (toast.type === 'info' || toast.type === 'whatsapp' ? 12000 : 5000);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to add activity log
  const logEvent = (
    action: string,
    actor: string,
    category: ActivityLog['category'],
    details: string
  ) => {
    const newLog: ActivityLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      timestamp: formatArabicDateTime(),
      action,
      actor,
      category,
      details,
    };
    setDb((prev) => ({
      ...prev,
      logs: [newLog, ...prev.logs],
      lastUpdated: new Date().toISOString(),
    }));
  };

  // ===================== AUTH METHODS =====================

  const loginStudent = (phone: string, pass: string) => {
    const cleanPhone = phone.trim();
    const student = db.students.find((s) => s.phone === cleanPhone);

    if (!student) {
      return { success: false, error: 'رقم الهاتف غير مسجل في المنصة. يرجى إنشاء حساب جديد أولاً.' };
    }

    if (student.password !== pass) {
      return { success: false, error: 'كلمة المرور غير صحيحة. يرجى التأكد من كلمة المرور والمحاولة ثانيةً.' };
    }

    // Check account status
    if (student.status === 'suspended') {
      logEvent('محاولة دخول لحساب موقوف', student.fullName, 'security', `حاول الطالب الدخول برقم ${cleanPhone} ولكن الحساب معطل.`);
      return {
        success: false,
        error: 'عذراً! هذا الحساب موقوف حالياً من قِبل إدارة المنصة. يرجى التواصل مع الدعم الفني أو السكرتارية.',
      };
    }

    if (student.status === 'pending') {
      return {
        success: false,
        error: 'الحساب قيد المراجعة! يرجى الانتظار (حتى 12 ساعة) حتى يتم تفعيل حسابك من الإدارة وإشعارك عبر واتساب.',
      };
    }

    // Device check: check if logging in from same device or if multi-device is allowed
    const isOriginalDevice = student.deviceId === deviceId;
    const isApprovedDevice =
      student.deviceLogs?.some((d) => d.deviceId === deviceId && d.approved) || student.allowOtherDevices;

    if (!isOriginalDevice && !isApprovedDevice) {
      // Record attempt in deviceLogs
      const updatedLogs = [
        ...(student.deviceLogs || []),
        {
          deviceId,
          userAgent: navigator.userAgent,
          timestamp: formatArabicDateTime(),
          approved: false,
        },
      ];

      setDb((prev) => ({
        ...prev,
        students: prev.students.map((s) =>
          s.id === student.id ? { ...s, deviceLogs: updatedLogs } : s
        ),
      }));

      logEvent(
        'محاولة دخول من جهاز جديد غير مصرح',
        student.fullName,
        'security',
        `حاول الطالب الدخول من جهاز غير مسجل (${deviceId.slice(0, 8)}). يتطلب موافقة المشرف من لوحة الإدارة.`
      );

      return {
        success: false,
        error: 'تم اكتشاف جهاز جديد! تنص سياسة المنصة على تثبيت الحساب على جهاز واحد. تم إرسال طلب اعتماد الجهاز للإدارة للموافقة عليه.',
      };
    }

    // Successful login
    setCurrentStudent(student);
    setCurrentAdmin(null);
    localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(student));
    localStorage.removeItem(CURRENT_ADMIN_KEY);

    logEvent('تسجيل دخول طالب', student.fullName, 'auth', `تم تسجيل الدخول بنجاح من الشعبة (${student.division}) والسكشن (${student.section}).`);

    addToast({
      type: 'success',
      title: `مرحباً بك يا ${student.fullName.split(' ')[0]}!`,
      message: 'تم تسجيل دخولك بنجاح إلى منصة الدكتور أحمد سند للفيزياء.',
    });

    setIsLoginOpen(false);
    return { success: true };
  };

  const registerStudent = (data: {
    fullName: string;
    phone: string;
    nationalId: string;
    division: string;
    section: string;
    rosterNumber: string;
    password: string;
  }) => {
    // Validation
    const cleanPhone = data.phone.trim();
    const cleanNationalId = data.nationalId.trim();

    if (db.students.some((s) => s.phone === cleanPhone)) {
      return { success: false, error: 'رقم الهاتف مسجل بالفعل مسبقاً في المنصة!' };
    }
    if (db.students.some((s) => s.nationalId === cleanNationalId)) {
      return { success: false, error: 'الرقم القومي مسجل بالفعل في حساب آخر!' };
    }
    if (data.password.length < 8) {
      return { success: false, error: 'كلمة المرور يجب ألا تقل عن 8 حروف أو أرقام أو رموز.' };
    }

    const newStudent: StudentAccount = {
      id: 'std-' + Date.now(),
      fullName: data.fullName.trim(),
      phone: cleanPhone,
      nationalId: cleanNationalId,
      division: data.division.trim(),
      section: data.section.trim(),
      rosterNumber: data.rosterNumber.trim(),
      password: data.password,
      status: 'pending', // Account is pending review!
      createdAt: formatArabicDateTime(),
      deviceId,
      allowOtherDevices: false,
      deviceLogs: [
        {
          deviceId,
          userAgent: navigator.userAgent,
          timestamp: formatArabicDateTime(),
          approved: false,
        },
      ],
      unlockedLessons: [],
      unlockedBooks: [],
      unlockedCodes: [],
    };

    setDb((prev) => ({
      ...prev,
      students: [newStudent, ...prev.students],
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'إنشاء حساب طالب جديد قيد المراجعة',
      newStudent.fullName,
      'auth',
      `سجل الطالب برقم هاتف ${cleanPhone} والشعبة (${newStudent.division}) ورقم الكشف (${newStudent.rosterNumber}). بانتظار موافقة الإدارة.`
    );

    // Prompt 12-hour review banner toast as required by user prompt
    addToast({
      type: 'info',
      title: 'تم استلام طلب التسجيل بنجاح! ⏱️',
      message:
        'انتظر 12 ساعة الحساب يكون غير مفعّل حتى يتم مراجعة طلبك للانضمام لمنصة دكتور سند، وبعد الانتهاء من مراجعة طلبك سيتم إرسال لك رسالة واتساب تعرّفك أن تم انتهاء مراجعة طلبك وتفعيله.',
      duration: 16000,
    });

    // Simulated WhatsApp toast
    setTimeout(() => {
      addToast({
        type: 'whatsapp',
        title: 'إشعار واتساب التلقائي (محاكاة)',
        message: `تم توجيه بياناتك (${newStudent.fullName}) إلى رقم الإدارة عبر واتساب للتحقق من الشعبة والكشف. سيصلك إشعار القبول قريباً!`,
        duration: 10000,
      });
    }, 2000);

    setIsRegisterOpen(false);
    return { success: true };
  };

  const loginAdmin = (username: string, pass: string) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    const adminsList = (db.admins && db.admins.length > 0) ? db.admins : DEFAULT_ADMINS;
    const foundAdmin = adminsList.find(
      (a) => a.username.trim().toLowerCase() === cleanUser && a.password.trim() === cleanPass
    );

    if (foundAdmin) {
      setCurrentAdmin(foundAdmin);
      setCurrentStudent(null);
      localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(foundAdmin));
      localStorage.removeItem(CURRENT_STUDENT_KEY);

      logEvent('تسجيل دخول المشرف', foundAdmin.name, 'admin', `دخل المشرف إلى لوحة التحكم الإدارية الكاملة.`);

      addToast({
        type: 'success',
        title: `أهلاً بك ${foundAdmin.name}`,
        message: 'تم فتح لوحة الإدارة للتحكم في الحسابات والأكواد والحصص والاختبارات.',
      });

      setIsAdminLoginOpen(false);
      setActiveTab('admin');
      return { success: true };
    }

    return {
      success: false,
      error: 'اسم المشرف أو كلمة المرور غير صحيحة! يرجى التأكد من البيانات والمحاولة ثانيةً.',
    };
  };

  const logout = () => {
    const name = currentStudent?.fullName || currentAdmin?.name || 'مستخدم';
    logEvent('تسجيل خروج', name, 'auth', 'تم تسجيل الخروج من الجلسة.');
    setCurrentStudent(null);
    setCurrentAdmin(null);
    localStorage.removeItem(CURRENT_STUDENT_KEY);
    localStorage.removeItem(CURRENT_ADMIN_KEY);
    setActiveTab('home');

    addToast({
      type: 'info',
      title: 'تم تسجيل الخروج',
      message: 'نتمنى لك التوفيق والدرجات النهائية دائماً مع د. سند.',
    });
  };

  // ===================== STUDENT CODE REDEMPTION =====================

  const redeemLessonCode = (code: string, tripleNumber: string, division: string) => {
    if (!currentStudent) {
      return { success: false, error: 'يرجى تسجيل الدخول أولاً كطالب لتفعيل الحصة!' };
    }

    const cleanCode = code.trim().toUpperCase();
    const cleanTriple = tripleNumber.trim();
    const cleanDiv = division.trim();

    // Find the code in the DB
    const foundCode = db.codes.find(
      (c) =>
        c.code.toUpperCase() === cleanCode &&
        c.targetType === 'lesson'
    );

    if (!foundCode) {
      return { success: false, error: 'رقم الكود غير موجود أو غير مخصص للحصص. تأكد من إدخال الكود بصورة صحيحة.' };
    }

    if (foundCode.isUsed) {
      return {
        success: false,
        error: `هذا الكود مستخدم بالفعل (اشتغل سابقاً) بواسطة ${foundCode.usedBy?.studentName || 'طالب آخر'} ولا يمكن استخدامه مرة أخرى!`,
      };
    }

    if (foundCode.tripleNumber && cleanTriple && foundCode.tripleNumber !== cleanTriple) {
      return {
        success: false,
        error: `الرقم الثلاثي المدخل (${cleanTriple}) غير متطابق مع الرقم الثلاثي المسجل في لوحة الإدارة لهذا الكود!`,
      };
    }

    // Find lesson
    const lesson = db.lessons.find((l) => l.id === foundCode.targetId || l.code.toUpperCase() === cleanCode);
    if (!lesson) {
      return { success: false, error: 'لم يتم العثور على الحصة المرتبطة بهذا الكود في قاعدة البيانات!' };
    }

    // Mark code as used (اشتغل - أحمر)
    const updatedCodes = db.codes.map((c) =>
      c.id === foundCode.id
        ? {
            ...c,
            isUsed: true,
            usedBy: {
              studentId: currentStudent.id,
              studentName: currentStudent.fullName,
              studentPhone: currentStudent.phone,
              usedAt: formatArabicDateTime(),
            },
          }
        : c
    );

    // Add lesson to student unlockedLessons
    const updatedStudents = db.students.map((s) => {
      if (s.id === currentStudent.id) {
        const lessonsSet = new Set([...s.unlockedLessons, lesson.id]);
        const codesSet = new Set([...s.unlockedCodes, cleanCode]);
        return {
          ...s,
          unlockedLessons: Array.from(lessonsSet),
          unlockedCodes: Array.from(codesSet),
        };
      }
      return s;
    });

    setDb((prev) => ({
      ...prev,
      codes: updatedCodes,
      students: updatedStudents,
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'تفعيل كود حصة بنجاح',
      currentStudent.fullName,
      'code',
      `تم تفعيل الحصة (${lesson.title}) بالكود [${cleanCode}] والرقم الثلاثي [${cleanTriple}].`
    );

    addToast({
      type: 'success',
      title: 'مبروك! تم فتح الحصة بنجاح 🎓',
      message: `تم إضافة "${lesson.title}" إلى قائمة حصصك المفعلة. يمكنك مشاهدتها الآن أو بدء الاختبار.`,
    });

    return { success: true, lesson };
  };

  const redeemBookCode = (code: string, tripleNumber: string, division: string) => {
    if (!currentStudent) {
      return { success: false, error: 'يرجى تسجيل الدخول أولاً كطالب لتفعيل كتاب PDF!' };
    }

    const cleanCode = code.trim().toUpperCase();
    const cleanTriple = tripleNumber.trim();
    const cleanDiv = division.trim();

    const foundCode = db.codes.find(
      (c) =>
        c.code.toUpperCase() === cleanCode &&
        c.targetType === 'book'
    );

    if (!foundCode) {
      return { success: false, error: 'رقم الكود غير موجود أو غير مخصص للكتب. يرجى مراجعة الكود.' };
    }

    if (foundCode.isUsed) {
      return {
        success: false,
        error: `هذا الكود مستخدم بالفعل (اشتغل سابقاً) بواسطة ${foundCode.usedBy?.studentName || 'طالب آخر'}.`,
      };
    }

    if (foundCode.tripleNumber && cleanTriple && foundCode.tripleNumber !== cleanTriple) {
      return {
        success: false,
        error: `الرقم الثلاثي المدخل (${cleanTriple}) غير متطابق مع كود الكتاب المسجل في لوحة الإدارة!`,
      };
    }

    const book = db.books.find((b) => b.id === foundCode.targetId || b.code.toUpperCase() === cleanCode);
    if (!book) {
      return { success: false, error: 'لم يتم العثور على الكتاب المرتبط بهذا الكود!' };
    }

    const updatedCodes = db.codes.map((c) =>
      c.id === foundCode.id
        ? {
            ...c,
            isUsed: true,
            usedBy: {
              studentId: currentStudent.id,
              studentName: currentStudent.fullName,
              studentPhone: currentStudent.phone,
              usedAt: formatArabicDateTime(),
            },
          }
        : c
    );

    const updatedStudents = db.students.map((s) => {
      if (s.id === currentStudent.id) {
        const booksSet = new Set([...s.unlockedBooks, book.id]);
        const codesSet = new Set([...s.unlockedCodes, cleanCode]);
        return {
          ...s,
          unlockedBooks: Array.from(booksSet),
          unlockedCodes: Array.from(codesSet),
        };
      }
      return s;
    });

    setDb((prev) => ({
      ...prev,
      codes: updatedCodes,
      students: updatedStudents,
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'تفعيل كود كتاب بنجاح',
      currentStudent.fullName,
      'code',
      `تم تفعيل كتاب (${book.title}) بالكود [${cleanCode}] والرقم الثلاثي [${cleanTriple}].`
    );

    addToast({
      type: 'success',
      title: 'تم إضافة الكتاب بنجاح! 📚',
      message: `تم فتح "${book.title}". متاح الآن في قسم مذكراتك وكتبك بصيغة PDF.`,
    });

    return { success: true, book };
  };

  const submitQuizResult = (gradeData: Omit<StudentGrade, 'id' | 'submittedAt'>) => {
    const newGrade: StudentGrade = {
      ...gradeData,
      id: 'grd-' + Date.now(),
      submittedAt: formatArabicDateTime(),
    };

    setDb((prev) => ({
      ...prev,
      grades: [newGrade, ...prev.grades],
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'تسليم إجابات اختبار',
      gradeData.studentName,
      'quiz',
      `أنهى الطالب اختبار "${gradeData.quizTitle}" بنتيجة ${gradeData.score}/${gradeData.totalPoints} (${gradeData.percentage}%).`
    );

    addToast({
      type: gradeData.percentage >= 60 ? 'success' : 'warning',
      title: `انتهى الاختبار! درجتك: ${gradeData.score} من ${gradeData.totalPoints}`,
      message: `النسبة المئوية: ${gradeData.percentage}% - تم حفظ النتيجة في لوحة الإدارة وسجل درجاتك.`,
    });
  };

  // ===================== ADMIN ACTIONS =====================

  const activateStudent = (studentId: string) => {
    const student = db.students.find((s) => s.id === studentId);
    if (!student) return;

    setDb((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: 'active',
              approvedAt: formatArabicDateTime(),
            }
          : s
      ),
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'تفعيل حساب طالب',
      currentAdmin?.name || 'الإدارة',
      'admin',
      `تم تفعيل حساب الطالب (${student.fullName}) - رقم الهاتف: ${student.phone}.`
    );

    addToast({
      type: 'success',
      title: 'تم تفعيل الحساب بنجاح',
      message: `تم تفعيل حساب ${student.fullName}. يمكنه الآن تسجيل الدخول وحضور الحصص.`,
    });

    // Simulated WhatsApp notification triggered by admin activation
    setTimeout(() => {
      addToast({
        type: 'whatsapp',
        title: 'تم إرسال رسالة واتساب للطالب ✅',
        message: `تم إشعار الطالب ${student.fullName} على رقمه (${student.phone}): "أهلاً بك في منصة د. أحمد سند، تم قبول وتفعيل حسابك بنجاح!"`,
      });
    }, 1500);
  };

  const suspendStudent = (studentId: string) => {
    const student = db.students.find((s) => s.id === studentId);
    if (!student) return;

    setDb((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, status: 'suspended' } : s
      ),
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'إيقاف حساب طالب',
      currentAdmin?.name || 'الإدارة',
      'admin',
      `تم إيقاف حساب الطالب (${student.fullName}) مؤقتاً.`
    );

    addToast({
      type: 'warning',
      title: 'تم إيقاف الحساب',
      message: `تم تحويل حساب ${student.fullName} إلى موقوف (باللون الأحمر). لن يستطيع تسجيل الدخول.`,
    });
  };

  const unsuspendStudent = (studentId: string) => {
    const student = db.students.find((s) => s.id === studentId);
    if (!student) return;

    setDb((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, status: 'active' } : s
      ),
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'إعادة تنشيط حساب طالب',
      currentAdmin?.name || 'الإدارة',
      'admin',
      `تم تنشيط حساب الطالب (${student.fullName}) باللون الأخضر.`
    );

    addToast({
      type: 'success',
      title: 'تم تنشيط الحساب',
      message: `تم تنشيط حساب ${student.fullName} بنجاح.`,
    });
  };

  const deleteStudent = (studentId: string) => {
    const student = db.students.find((s) => s.id === studentId);
    if (!student) return;

    setDb((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== studentId),
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'حذف حساب طالب نهائياً',
      currentAdmin?.name || 'الإدارة',
      'admin',
      `تم حذف الطالب (${student.fullName}) من المنصة.`
    );

    addToast({
      type: 'info',
      title: 'تم حذف الحساب',
      message: `تم حذف بيانات الطالب ${student.fullName} نهائياً.`,
    });
  };

  const updateStudent = (studentId: string, data: Partial<StudentAccount>) => {
    setDb((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === studentId ? { ...s, ...data } : s)),
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'تعديل بيانات حساب طالب',
      currentAdmin?.name || 'الإدارة',
      'admin',
      `تم تحديث بيانات الطالب رقم (${studentId}).`
    );

    addToast({
      type: 'success',
      title: 'تم تحديث البيانات',
      message: 'تم حفظ التعديلات بنجاح في قاعدة البيانات.',
    });
  };

  const toggleAllowOtherDevices = (studentId: string, allow: boolean) => {
    setDb((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, allowOtherDevices: allow } : s
      ),
    }));

    logEvent(
      'تعديل صلاحية الأجهزة',
      currentAdmin?.name || 'الإدارة',
      'security',
      `تم ${allow ? 'تفعيل' : 'تعطيل'} السماح بالدخول من أجهزة متعددة للطالب (${studentId}).`
    );

    addToast({
      type: 'info',
      title: 'صلاحية الأجهزة',
      message: allow
        ? 'تم السماح للطالب بتسجيل الدخول من أجهزة متعددة.'
        : 'تم قصر الدخول على الجهاز الأصلي فقط.',
    });
  };

  const approveDeviceForStudent = (studentId: string, targetDeviceId: string) => {
    setDb((prev) => ({
      ...prev,
      students: prev.students.map((s) => {
        if (s.id === studentId) {
          const updatedLogs = s.deviceLogs.map((log) =>
            log.deviceId === targetDeviceId ? { ...log, approved: true } : log
          );
          return { ...s, deviceLogs: updatedLogs };
        }
        return s;
      }),
    }));

    logEvent(
      'اعتماد جهاز جديد لطالب',
      currentAdmin?.name || 'الإدارة',
      'security',
      `تمت الموافقة على الجهاز (${targetDeviceId.slice(0, 8)}) للطالب (${studentId}).`
    );

    addToast({
      type: 'success',
      title: 'تم اعتماد الجهاز',
      message: 'تمت الموافقة على تسجيل دخول الطالب من هذا الجهاز بنجاح.',
    });
  };

  const addLesson = (lessonData: Omit<Lesson, 'id' | 'createdAt'>) => {
    const lessonId = 'les-' + Date.now();
    const newLesson: Lesson = {
      ...lessonData,
      id: lessonId,
      createdAt: formatArabicDateTime(),
    };

    // Auto-create matching access code entry in Codes table
    const newCode: AccessCode = {
      id: 'cd-' + Date.now(),
      code: lessonData.code.trim().toUpperCase(),
      targetType: 'lesson',
      targetId: lessonId,
      targetTitle: lessonData.title,
      tripleNumber: lessonData.tripleNumber.trim(),
      division: lessonData.division.trim(),
      isUsed: false, // Starts as Available (لم يشتغل - أخضر)
      createdAt: formatArabicDateTime(),
    };

    setDb((prev) => ({
      ...prev,
      lessons: [newLesson, ...prev.lessons],
      codes: [newCode, ...prev.codes],
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'إضافة حصة جديدة وكودها',
      currentAdmin?.name || 'الإدارة',
      'content',
      `تمت إضافة حصة (${newLesson.title}) بكود [${newCode.code}] ورقم ثلاثي [${newCode.tripleNumber}] لشعبة (${newLesson.division}).`
    );

    addToast({
      type: 'success',
      title: 'تمت إضافة الحصة بنجاح 🎬',
      message: `تم ربط الحصة وتوليد الكود (${newCode.code}) وحالته "لم يشتغل" (باللون الأخضر).`,
    });
  };

  const deleteLesson = (lessonId: string) => {
    const lesson = db.lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    setDb((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((l) => l.id !== lessonId),
      codes: prev.codes.filter((c) => c.targetId !== lessonId),
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'حذف حصة',
      currentAdmin?.name || 'الإدارة',
      'content',
      `تم حذف الحصة (${lesson.title}) والأكواد المرتبطة بها.`
    );

    addToast({
      type: 'info',
      title: 'تم حذف الحصة',
      message: `تم حذف "${lesson.title}" بنجاح.`,
    });
  };

  const addBook = (bookData: Omit<Book, 'id' | 'createdAt'>) => {
    const bookId = 'bk-' + Date.now();
    const newBook: Book = {
      ...bookData,
      id: bookId,
      createdAt: formatArabicDateTime(),
    };

    const newCode: AccessCode = {
      id: 'cd-' + Date.now(),
      code: bookData.code.trim().toUpperCase(),
      targetType: 'book',
      targetId: bookId,
      targetTitle: bookData.title,
      tripleNumber: bookData.tripleNumber.trim(),
      division: bookData.division.trim(),
      isUsed: false, // Starts as Available (لم يشتغل - أخضر)
      createdAt: formatArabicDateTime(),
    };

    setDb((prev) => ({
      ...prev,
      books: [newBook, ...prev.books],
      codes: [newCode, ...prev.codes],
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'إضافة كتاب PDF جديد وكوده',
      currentAdmin?.name || 'الإدارة',
      'content',
      `تمت إضافة كتاب (${newBook.title}) بكود [${newCode.code}] ورقم ثلاثي [${newCode.tripleNumber}] لشعبة (${newBook.division}).`
    );

    addToast({
      type: 'success',
      title: 'تمت إضافة الكتاب بنجاح 📚',
      message: `تم ربط الكتاب بكود (${newCode.code}) وحالته "لم يشتغل" (أخضر).`,
    });
  };

  const deleteBook = (bookId: string) => {
    const book = db.books.find((b) => b.id === bookId);
    if (!book) return;

    setDb((prev) => ({
      ...prev,
      books: prev.books.filter((b) => b.id !== bookId),
      codes: prev.codes.filter((c) => c.targetId !== bookId),
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'حذف كتاب PDF',
      currentAdmin?.name || 'الإدارة',
      'content',
      `تم حذف كتاب (${book.title}).`
    );

    addToast({
      type: 'info',
      title: 'تم حذف الكتاب',
      message: `تم إزالة "${book.title}" بنجاح.`,
    });
  };

  const saveQuiz = (quiz: Quiz) => {
    const exists = db.quizzes.some((q) => q.id === quiz.id);
    let updatedQuizzes: Quiz[];
    if (exists) {
      updatedQuizzes = db.quizzes.map((q) => (q.id === quiz.id ? quiz : q));
    } else {
      updatedQuizzes = [quiz, ...db.quizzes];
    }

    // Link quiz to lesson
    const updatedLessons = db.lessons.map((l) =>
      l.id === quiz.lessonId ? { ...l, quizId: quiz.id } : l
    );

    setDb((prev) => ({
      ...prev,
      quizzes: updatedQuizzes,
      lessons: updatedLessons,
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'حفظ اختبار إلكتروني',
      currentAdmin?.name || 'الإدارة',
      'quiz',
      `تم حفظ اختبار (${quiz.title}) المرتبط بحصة (${quiz.lessonTitle}) بعدد ${quiz.questions.length} أسئلة ومدته ${quiz.durationMinutes} دقيقة.`
    );

    addToast({
      type: 'success',
      title: 'تم حفظ الاختبار بنجاح 📝',
      message: `تم ربط الاختبار بالحصة المحددة وإتاحته للطلاب بعد فتح الحصة.`,
    });
  };

  const deleteQuiz = (quizId: string) => {
    const quiz = db.quizzes.find((q) => q.id === quizId);
    if (!quiz) return;

    setDb((prev) => ({
      ...prev,
      quizzes: prev.quizzes.filter((q) => q.id !== quizId),
      lessons: prev.lessons.map((l) => (l.quizId === quizId ? { ...l, quizId: undefined } : l)),
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'حذف اختبار',
      currentAdmin?.name || 'الإدارة',
      'quiz',
      `تم حذف اختبار (${quiz.title}).`
    );

    addToast({
      type: 'info',
      title: 'تم حذف الاختبار',
      message: `تم حذف "${quiz.title}" بنجاح.`,
    });
  };

  const createCode = (codeData: Omit<AccessCode, 'id' | 'isUsed' | 'createdAt'>) => {
    const newCode: AccessCode = {
      ...codeData,
      id: 'cd-' + Date.now(),
      code: codeData.code.trim().toUpperCase(),
      isUsed: false,
      createdAt: formatArabicDateTime(),
    };

    setDb((prev) => ({
      ...prev,
      codes: [newCode, ...prev.codes],
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'توليد كود دخول إضافي',
      currentAdmin?.name || 'الإدارة',
      'code',
      `تم إنشاء كود جديد [${newCode.code}] للـ (${newCode.targetTitle}) برقم ثلاثي (${newCode.tripleNumber}).`
    );

    addToast({
      type: 'success',
      title: 'تم توليد الكود',
      message: `الكود الجديد: ${newCode.code} - حالته: لم يشتغل (أخضر).`,
    });
  };

  const deleteCode = (codeId: string) => {
    const code = db.codes.find((c) => c.id === codeId);
    if (!code) return;

    setDb((prev) => ({
      ...prev,
      codes: prev.codes.filter((c) => c.id !== codeId),
    }));

    logEvent(
      'حذف كود',
      currentAdmin?.name || 'الإدارة',
      'code',
      `تم حذف الكود [${code.code}] المخصص لـ (${code.targetTitle}).`
    );

    addToast({
      type: 'info',
      title: 'تم حذف الكود',
      message: `تم حذف الكود ${code.code}.`,
    });
  };

  const addAdmin = (adminData: Omit<AdminAccount, 'id' | 'createdAt'>) => {
    const newAdmin: AdminAccount = {
      ...adminData,
      id: 'adm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: formatArabicDateTime(),
    };

    setDb((prev) => ({
      ...prev,
      admins: [...(prev.admins || DEFAULT_ADMINS), newAdmin],
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'إضافة مشرف جديد',
      currentAdmin?.name || 'الإدارة العليا',
      'admin',
      `تمت إضافة حساب مشرف جديد [${newAdmin.name} - اسم المستخدم: ${newAdmin.username}].`
    );

    addToast({
      type: 'success',
      title: 'تمت إضافة المشرف بنجاح',
      message: `تم تفعيل حساب المشرف ${newAdmin.name} بصلاحية الدخول للوحة الإدارة.`,
    });
  };

  const deleteAdmin = (adminId: string) => {
    const currentAdmins = db.admins || DEFAULT_ADMINS;
    const target = currentAdmins.find((a) => a.id === adminId);
    if (!target) return;

    if (currentAdmins.length <= 1) {
      addToast({
        type: 'error',
        title: 'تعذر الحذف',
        message: 'يجب أن يتبقى مشرف واحد على الأقل في النظام.',
      });
      return;
    }

    setDb((prev) => ({
      ...prev,
      admins: (prev.admins || DEFAULT_ADMINS).filter((a) => a.id !== adminId),
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'حذف مشرف',
      currentAdmin?.name || 'الإدارة العليا',
      'admin',
      `تم حذف حساب المشرف [${target.name} - ${target.username}].`
    );

    addToast({
      type: 'info',
      title: 'تم حذف حساب المشرف',
      message: `تم إلغاء صلاحية المشرف ${target.name}.`,
    });
  };

  const updateAdmin = (adminId: string, data: Partial<AdminAccount>) => {
    setDb((prev) => ({
      ...prev,
      admins: (prev.admins || DEFAULT_ADMINS).map((a) =>
        a.id === adminId ? { ...a, ...data } : a
      ),
      lastUpdated: new Date().toISOString(),
    }));

    logEvent(
      'تعديل بيانات مشرف',
      currentAdmin?.name || 'الإدارة العليا',
      'admin',
      `تم تحديث بيانات حساب المشرف (${adminId}).`
    );

    addToast({
      type: 'success',
      title: 'تم التعديل بنجاح',
      message: 'تم حفظ التعديلات على حساب المشرف.',
    });
  };

  const clearLogs = () => {
    setDb((prev) => ({
      ...prev,
      logs: [],
    }));
    addToast({
      type: 'info',
      title: 'تم مسح سجل اللوجات',
      message: 'تم تفريغ كافة سجلات النشاط بنجاح.',
    });
  };

  const exportDatabaseJson = () => {
    return JSON.stringify(db, null, 2);
  };

  const importDatabaseJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.students || !parsed.lessons || !parsed.codes) {
        return { success: false, error: 'الملف أو النص المدخل لا يحتوي على بنية قاعدة بيانات صالحة لمنصة د. سند!' };
      }
      setDb(parsed);
      logEvent('استيراد قاعدة بيانات JSON', currentAdmin?.name || 'الإدارة', 'admin', 'تم استيراد وتحديث قاعدة البيانات بنجاح من ملف JSON خارجي.');
      addToast({
        type: 'success',
        title: 'تم استيراد قاعدة البيانات بنجاح!',
        message: 'تم تحديث كافة الحسابات والحصص والأكواد والاختبارات.',
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: 'خطأ في تنسيق JSON: ' + (e.message || 'بيانات غير صالحة') };
    }
  };

  const resetToDefaultData = () => {
    setDb(INITIAL_DATABASE);
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(INITIAL_DATABASE));
    addToast({
      type: 'info',
      title: 'تم ضبط البيانات الافتراضية',
      message: 'تمت استعادة حالة المنصة النظيفة وجاهزيتها.',
    });
  };

  const clearAllDatabaseData = () => {
    const emptyDb: PlatformDatabase = {
      version: '2.0.0',
      lastUpdated: new Date().toISOString(),
      admins: db.admins || DEFAULT_ADMINS,
      students: [],
      lessons: [],
      books: [],
      codes: [],
      quizzes: [],
      grades: [],
      logs: [
        {
          id: 'log-clean-' + Date.now(),
          timestamp: formatArabicDateTime(),
          action: 'تفريغ قاعدة البيانات',
          actor: currentAdmin?.name || 'الإدارة',
          category: 'admin',
          details: 'تم تفريغ كافة بيانات المنصة لتكون جاهزة لاستقبال البيانات الجديدة كلياً.',
        },
      ],
    };
    setDb(emptyDb);
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(emptyDb));
    addToast({
      type: 'info',
      title: 'تم تفريغ المنصة بالكامل',
      message: 'المنصة أصبحت الآن جديدة وفارغة وجاهزة لملء بياناتك الخاصة.',
    });
  };

  const loadSampleDemoData = () => {
    setDb(SAMPLE_DEMO_DATABASE);
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(SAMPLE_DEMO_DATABASE));
    addToast({
      type: 'success',
      title: 'تم تحميل البيانات الاسترشادية',
      message: 'تم إدراج أمثلة نموذجية للحصص والكتب والطلاب لمعاينة طريقة عمل المنصة.',
    });
  };

  return (
    <PlatformContext.Provider
      value={{
        db,
        currentStudent,
        currentAdmin,
        deviceId,
        toasts,
        addToast,
        removeToast,
        activeTab,
        setActiveTab,
        isLoginOpen,
        setIsLoginOpen,
        isRegisterOpen,
        setIsRegisterOpen,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        isAddLessonModalOpen,
        setIsAddLessonModalOpen,
        isAddBookModalOpen,
        setIsAddBookModalOpen,
        activeVideoLesson,
        setActiveVideoLesson,
        activePdfBook,
        setActivePdfBook,
        activeQuiz,
        setActiveQuiz,
        activeQuizLesson,
        setActiveQuizLesson,
        loginStudent,
        registerStudent,
        loginAdmin,
        logout,
        redeemLessonCode,
        redeemBookCode,
        submitQuizResult,
        activateStudent,
        suspendStudent,
        unsuspendStudent,
        deleteStudent,
        updateStudent,
        toggleAllowOtherDevices,
        approveDeviceForStudent,
        addLesson,
        deleteLesson,
        addBook,
        deleteBook,
        saveQuiz,
        deleteQuiz,
        createCode,
        deleteCode,
        addAdmin,
        deleteAdmin,
        updateAdmin,
        clearLogs,
        exportDatabaseJson,
        importDatabaseJson,
        resetToDefaultData,
        clearAllDatabaseData,
        loadSampleDemoData,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
