import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { Lesson, Book, Quiz } from '../../types/platform';
import {
  PlayCircle,
  BookOpen,
  FileQuestion,
  Video,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle,
  PlusCircle,
  HelpCircle,
  X,
} from 'lucide-react';

export const UnlockedContent: React.FC = () => {
  const {
    currentStudent,
    db,
    setIsAddLessonModalOpen,
    setIsAddBookModalOpen,
    setActiveVideoLesson,
    setActivePdfBook,
    setActiveQuiz,
    setActiveQuizLesson,
  } = usePlatform();

  const [activeCategory, setActiveCategory] = useState<'lessons' | 'books'>('lessons');
  const [selectedLessonForAction, setSelectedLessonForAction] = useState<Lesson | null>(null);

  // Filter lessons and books unlocked by the current student (or all if in admin preview)
  const studentUnlockedLessonIds = currentStudent ? currentStudent.unlockedLessons : [];
  const studentUnlockedBookIds = currentStudent ? currentStudent.unlockedBooks : [];

  const unlockedLessons = db.lessons.filter(
    (l) => studentUnlockedLessonIds.includes(l.id) || !currentStudent
  );

  const unlockedBooks = db.books.filter(
    (b) => studentUnlockedBookIds.includes(b.id) || !currentStudent
  );

  const handleOpenLessonAction = (lesson: Lesson) => {
    setSelectedLessonForAction(lesson);
  };

  const handleWatchLesson = (lesson: Lesson) => {
    setSelectedLessonForAction(null);
    setActiveVideoLesson(lesson);
  };

  const handleStartQuiz = (lesson: Lesson) => {
    setSelectedLessonForAction(null);
    const quiz = db.quizzes.find((q) => q.lessonId === lesson.id || q.id === lesson.quizId);
    if (quiz) {
      setActiveQuiz(quiz);
      setActiveQuizLesson(lesson);
    } else {
      alert('لم يتم بعد تعيين اختبار إلكتروني لهذه الحصة من قِبل المشرف.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              الحصص المضافة والكتب
            </h2>
            <span className="px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              مكتبتي الدراسية
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            جميع المحاضرات والكتب التي قمت بتفعيلها بأكوادك الخاصة لدى دكتور أحمد سند
          </p>
        </div>

        {/* Action buttons to add more */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddLessonModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-600/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة حصة بكود</span>
          </button>
          <button
            onClick={() => setIsAddBookModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>إضافة كتاب PDF</span>
          </button>
        </div>
      </div>

      {/* Segmented Switcher for Lessons vs Books */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit mb-8">
        <button
          onClick={() => setActiveCategory('lessons')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 ${
            activeCategory === 'lessons'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>الحصص والمحاضرات المفعلة</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/30 text-white">
            {unlockedLessons.length}
          </span>
        </button>

        <button
          onClick={() => setActiveCategory('books')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 ${
            activeCategory === 'books'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الكتب والمذكرات PDF</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/30 text-white">
            {unlockedBooks.length}
          </span>
        </button>
      </div>

      {/* Content Grid */}
      {activeCategory === 'lessons' ? (
        unlockedLessons.length === 0 ? (
          <div className="py-16 px-4 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">لم تقم بإضافة أي حصة بعد</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
              استخدم زر "إضافة حصة بكود" وأدخل رقم الكود والرقم الثلاثي وشعبتك لفتح المحاضرات.
            </p>
            <button
              onClick={() => setIsAddLessonModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إدخال كود الحصة الآن</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedLessons.map((lesson) => {
              const quiz = db.quizzes.find(
                (q) => q.lessonId === lesson.id || q.id === lesson.quizId
              );

              return (
                <div
                  key={lesson.id}
                  className="group rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 overflow-hidden flex flex-col shadow-xl"
                >
                  {/* Card Thumbnail / Header */}
                  <div className="relative h-44 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/40 p-5 flex flex-col justify-between border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {lesson.division}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-300 border border-slate-800 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {lesson.duration}
                      </span>
                    </div>

                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleOpenLessonAction(lesson)}
                        className="w-14 h-14 rounded-2xl bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 group-hover:scale-110 transition-transform"
                      >
                        <PlayCircle className="w-8 h-8" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      كود: {lesson.code} • الرقم الثلاثي: {lesson.tripleNumber}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors leading-relaxed">
                        {lesson.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {lesson.description || 'شرح فيزيائي مبسط وعميق مع تدريبات محلولة نموذجية.'}
                      </p>
                    </div>

                    {/* Action buttons on card */}
                    <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2">
                      <button
                        onClick={() => handleWatchLesson(lesson)}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Video className="w-4 h-4 text-cyan-400" />
                        <span>مشاهدة الحصة</span>
                      </button>

                      {quiz && (
                        <button
                          onClick={() => handleStartQuiz(lesson)}
                          className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <FileQuestion className="w-4 h-4 text-emerald-400" />
                          <span>بدء الاختبار</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Books Tab */
        unlockedBooks.length === 0 ? (
          <div className="py-16 px-4 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">لم تقم بإضافة أي كتاب PDF بعد</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
              استخدم زر "إضافة كتاب PDF" وأدخل كود المذكرة لفتحها وقراءتها.
            </p>
            <button
              onClick={() => setIsAddBookModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إدخال كود الكتاب الآن</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedBooks.map((book) => (
              <div
                key={book.id}
                className="group rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden flex flex-col shadow-xl"
              >
                <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border-b border-slate-800 flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {book.division}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                      {book.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {book.description || 'مذكرة المراجعة الشاملة لأسئلة ومسائل الفيزياء مع دكتور أحمد سند.'}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span>{book.pages}</span>
                      <span>•</span>
                      <span>كود: {book.code}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => setActivePdfBook(book)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>قراءة وتصفح الكتاب PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Choice Modal for Selected Lesson: "مشاهدة الحصة" OR "بدء الاختبار" */}
      {selectedLessonForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-right">
            <button
              onClick={() => setSelectedLessonForAction(null)}
              className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <PlayCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">دخول الحصة</h3>
                <p className="text-xs text-slate-400">{selectedLessonForAction.title}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              اختر الإجراء الذي ترغب في البدء به: مشاهدة الشرح بالفيديو المحمي أو أداء
              الاختبار الإلكتروني الخاص بهذه الحصة.
            </p>

            <div className="space-y-3">
              {/* Option 1: مشاهدة الحصة */}
              <button
                onClick={() => handleWatchLesson(selectedLessonForAction)}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-between shadow-lg shadow-blue-600/30 transition-all active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-cyan-300" />
                  <div className="text-right">
                    <div>مشاهدة الحصة الآن</div>
                    <div className="text-[11px] text-blue-200 font-normal">
                      شاشة عرض مخصصة ومحمية للفيديو
                    </div>
                  </div>
                </div>
                <PlayCircle className="w-5 h-5" />
              </button>

              {/* Option 2: بدء الاختبار */}
              <button
                onClick={() => handleStartQuiz(selectedLessonForAction)}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 hover:bg-emerald-950/20 text-emerald-300 font-bold text-sm flex items-center justify-between transition-all active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <FileQuestion className="w-5 h-5 text-emerald-400" />
                  <div className="text-right">
                    <div>بدء الاختبار الإلكتروني</div>
                    <div className="text-[11px] text-slate-400 font-normal">
                      أسئلة بوقت محدد ورصد فوري للدرجة
                    </div>
                  </div>
                </div>
                <Clock className="w-5 h-5 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
