import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import {
  Sparkles,
  Zap,
  PlayCircle,
  BookMarked,
  ShieldAlert,
  ChevronLeft,
  Users,
  Award,
  Video,
  FileCheck2,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const {
    currentStudent,
    currentAdmin,
    setIsLoginOpen,
    setIsRegisterOpen,
    setIsAddLessonModalOpen,
    setIsAddBookModalOpen,
    setActiveTab,
    db,
  } = usePlatform();

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-slate-900">
      {/* Background ambient physics glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Physics Formula Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>V = I · R &nbsp;|&nbsp; F = q·v·B &nbsp;|&nbsp; E = h·ν</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>

        {/* The Exact User Welcome Sentence */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300 tracking-tight leading-tight max-w-4xl mx-auto">
          أهلاً بك في منصة الدكتور أحمد سند لشرح الفيزياء ببساطة
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          الفيزياء ليست مجرد معادلات للحفظ، بل هي متعة وتفكير عميق. انضم الآن لأقوى تجربة
          تعليمية مع فصول تفاعلية، شروحات مبسطة، بنوك أسئلة ومتابعة لحظية لكل طالب.
        </p>

        {/* Interactive Action Area */}
        {!currentStudent && !currentAdmin ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span>إنشاء حساب طالب جديد</span>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm sm:text-base flex items-center gap-2 transition-all hover:border-slate-500"
            >
              <span>تسجيل دخول بحسابي</span>
            </button>
          </div>
        ) : currentStudent ? (
          /* Student is logged in: direct shortcuts to Add Lesson & Add Book */
          <div className="mt-8 flex flex-col items-center">
            <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-4 sm:p-6 max-w-xl w-full shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                  حساب الطالب المسجل
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  الحساب منشط ومفعل
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {currentStudent.fullName}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                الشعبة: <span className="text-slate-200 font-semibold">{currentStudent.division}</span> | السكشن:{' '}
                <span className="text-slate-200 font-semibold">{currentStudent.section}</span> | رقم الكشف:{' '}
                <span className="text-amber-400 font-bold">{currentStudent.rosterNumber}</span>
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsAddLessonModalOpen(true)}
                  className="py-3 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 hover:brightness-110 active:scale-95 transition-all"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>إضافة حصة جديدة</span>
                </button>
                <button
                  onClick={() => setIsAddBookModalOpen(true)}
                  className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <BookMarked className="w-4 h-4 text-cyan-400" />
                  <span>إضافة كتاب PDF</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Live Platform Stats */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-2">
              <Video className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">{db.lessons.length}</div>
            <div className="text-xs text-slate-400 font-medium">محاضرات وحصص فيزيائية</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2">
              <BookMarked className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">{db.books.length}</div>
            <div className="text-xs text-slate-400 font-medium">مذكرات وكتب PDF</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">{db.quizzes.length}</div>
            <div className="text-xs text-slate-400 font-medium">اختبارات إلكترونية بوقت</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {db.students.filter((s) => s.status === 'active').length + 150}+
            </div>
            <div className="text-xs text-slate-400 font-medium">طالب مسجل بالمنصة</div>
          </div>
        </div>
      </div>
    </section>
  );
};
