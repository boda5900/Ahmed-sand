import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  PlayCircle,
  BookMarked,
  BookOpen,
  Award,
  KeyRound,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const {
    currentStudent,
    setIsAddLessonModalOpen,
    setIsAddBookModalOpen,
    setActiveTab,
    db,
  } = usePlatform();

  if (!currentStudent) return null;

  const unlockedCount =
    currentStudent.unlockedLessons.length + currentStudent.unlockedBooks.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Welcome Card for Logged In Student */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/50 border border-blue-500/30 mb-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>الحساب مفعل ومعتمد لدى د. أحمد سند</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              أهلاً بك يا {currentStudent.fullName}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800">
                الشعبة: <strong className="text-white">{currentStudent.division}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800">
                السكشن: <strong className="text-white">{currentStudent.section}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800">
                رقم الكشف: <strong className="text-amber-400">{currentStudent.rosterNumber}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => setActiveTab('content')}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>الحصص المضافة والكتب ({unlockedCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('my-grades')}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>سجل درجاتي</span>
            </button>
          </div>
        </div>
      </div>

      {/* The Two Central Models in the Middle of the Page as requested */}
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-black text-white">
          تفعيل المحتوى والمحاضرات بأكوادك الخاصة
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
          اضغط على النموذج المطلوب وأدخل رقم الكود والرقم الثلاثي وشعبتك لفتح الحصة أو الكتاب فوراً
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Model 1: إضافة حصة (Add Lesson) */}
        <div className="group relative p-8 rounded-3xl bg-slate-900 border border-blue-500/40 hover:border-blue-400 transition-all duration-300 shadow-2xl flex flex-col justify-between hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <PlayCircle className="w-8 h-8" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                النموذج الأول
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>

            <h4 className="text-2xl font-black text-white mb-2">
              إضافة حصة
            </h4>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              إدخال كود المحاضرة، شعبتك، والرقم الثلاثي لفتح فيديو الشرح التفاعلي عبر واجهة المشغل المحمية للمنصة وبدء الاختبار المخصص.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <button
              onClick={() => setIsAddLessonModalOpen(true)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/30 active:scale-98 transition-all"
            >
              <KeyRound className="w-5 h-5 text-cyan-300" />
              <span>فتح نموذج إضافة الحصة بالكود</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Model 2: إضافة كتاب PDF (Add Book) */}
        <div className="group relative p-8 rounded-3xl bg-slate-900 border border-indigo-500/40 hover:border-indigo-400 transition-all duration-300 shadow-2xl flex flex-col justify-between hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
              <BookMarked className="w-8 h-8" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                النموذج الثاني
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            </div>

            <h4 className="text-2xl font-black text-white mb-2">
              إضافة كتاب PDF
            </h4>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              إدخال كود مذكرة الشرح أو بنك الأسئلة PDF، مع الشعبة والرقم الثلاثي لقراءة المذكرات وتنزيل ملخصات دكتور أحمد سند.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <button
              onClick={() => setIsAddBookModalOpen(true)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-600/30 active:scale-98 transition-all"
            >
              <KeyRound className="w-5 h-5 text-indigo-300" />
              <span>فتح نموذج إضافة كتاب PDF بالكود</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
