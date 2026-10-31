export type AccountStatus = 'pending' | 'active' | 'suspended';

export interface StudentAccount {
  id: string;
  fullName: string; // الاسم رباعي
  phone: string; // رقم الهاتف
  nationalId: string; // الرقم القومي
  division: string; // الشعبة (كتابة)
  section: string; // السكشن (كتابة)
  rosterNumber: string; // رقم الكشف
  password: string; // كلمة المرور
  status: AccountStatus; // قيد المراجعة / منشط / موقوف
  createdAt: string; // تاريخ التسجيل
  approvedAt?: string;
  deviceId: string; // معرف الجهاز المسجل
  allowOtherDevices: boolean; // السماح للأجهزة الأخرى
  deviceLogs: { deviceId: string; userAgent: string; timestamp: string; approved: boolean }[];
  unlockedLessons: string[]; // معرفات الحصص المفعلة
  unlockedBooks: string[]; // معرفات الكتب المفعلة
  unlockedCodes: string[]; // الأكواد المستخدمة
}

export interface AdminAccount {
  id: string;
  username: string; // اسم المشرف للدخول
  password: string; // كلمة المرور
  name: string; // اسم المشرف الكامل
  role: 'superadmin' | 'supervisor' | 'assistant'; // الصلاحية
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string; // اسم الحصة
  code: string; // رقم الكود
  tripleNumber: string; // الرقم الثلاثي
  division: string; // الشعبة
  driveUrl: string; // لينك المحاضرة (جوجل درايف أو يوتيوب)
  duration: string; // المدة
  description: string;
  createdAt: string;
  quizId?: string; // الاختبار المرتبط بالحصة
}

export interface Book {
  id: string;
  title: string; // اسم الكتاب
  code: string; // رقم الكود
  tripleNumber: string; // الرقم الثلاثي
  division: string; // الشعبة
  driveUrl: string; // لينك الكتاب PDF
  pages: string; // عدد الصفحات
  description: string;
  createdAt: string;
}

export interface AccessCode {
  id: string;
  code: string; // رقم الكود
  targetType: 'lesson' | 'book'; // نوع المحتوى
  targetId: string; // معرف الحصة أو الكتاب
  targetTitle: string; // اسم الحصة أو الكتاب
  tripleNumber: string; // الرقم الثلاثي
  division: string; // الشعبة
  isUsed: boolean; // حالة الكود: اشتغل (أحمر) أو لم يشتغل (أخضر)
  usedBy?: {
    studentId: string;
    studentName: string;
    studentPhone: string;
    usedAt: string;
  };
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: [string, string, string, string]; // 4 خيارات
  correctOptionIndex: number; // 0, 1, 2, 3
  points: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  lessonTitle: string;
  title: string;
  durationMinutes: number; // وقت الاختبار بالدقائق
  questions: QuizQuestion[];
  createdAt: string;
}

export interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  quizId: string;
  lessonId: string;
  quizTitle: string;
  score: number;
  totalPoints: number;
  percentage: number;
  submittedAt: string;
  answers: {
    questionId: string;
    questionText: string;
    selectedOptionIndex: number;
    correctOptionIndex: number;
    isCorrect: boolean;
    options: string[];
  }[];
}

export interface ActivityLog {
  id: string;
  timestamp: string; // التاريخ والساعة
  action: string; // نوع الحدث
  actor: string; // اسم الحساب أو المشرف
  category: 'auth' | 'admin' | 'code' | 'quiz' | 'content' | 'security';
  details: string;
}

export interface PlatformDatabase {
  admins: AdminAccount[];
  students: StudentAccount[];
  lessons: Lesson[];
  books: Book[];
  codes: AccessCode[];
  quizzes: Quiz[];
  grades: StudentGrade[];
  logs: ActivityLog[];
  version: string;
  lastUpdated: string;
}
