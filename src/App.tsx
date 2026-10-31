import React from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StudentPortal } from './components/student/StudentPortal';
import { UnlockedContent } from './components/student/UnlockedContent';
import { StudentGrades } from './components/student/StudentGrades';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { AdminLoginModal } from './components/auth/AdminLoginModal';
import { AddLessonModal } from './components/student/AddLessonModal';
import { AddBookModal } from './components/student/AddBookModal';
import { VideoPlayerModal } from './components/student/VideoPlayerModal';
import { PdfViewerModal } from './components/student/PdfViewerModal';
import { QuizModal } from './components/student/QuizModal';
import { Footer } from './components/Footer';
import {
  Atom,
  PlayCircle,
  BookOpen,
  Award,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  ChevronLeft,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    currentStudent,
    currentAdmin,
    setIsLoginOpen,
    setIsRegisterOpen,
    activeVideoLesson,
    setActiveVideoLesson,
    activePdfBook,
    setActivePdfBook,
    activeQuiz,
    setActiveQuiz,
    activeQuizLesson,
    setActiveQuizLesson,
    db,
  } = usePlatform();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-['Cairo',sans-serif]">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Main Header */}
      <Header />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {activeTab === 'admin' ? (
          <AdminDashboard />
        ) : activeTab === 'content' ? (
          <UnlockedContent />
        ) : activeTab === 'my-grades' ? (
          <StudentGrades />
        ) : (
          /* Home view */
          <div>
            <Hero />

            {/* If Student is logged in, show the central action models */}
            {currentStudent ? (
              <StudentPortal />
            ) : (
              /* If Visitor, show platform feature previews and physics advantages */
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20 text-xs font-bold mb-3">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>لماذا منصة الدكتور أحمد سند؟</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white">
                    نظام تعليمي متكامل يرتقي بفهمك الفيزيائي
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    تم بناء المنصة خصيصاً لتوفير أقصى درجات التركيز مع حماية متطورة للمحتوى ومتابعة دقيقة لكل فكرة فيزيائية.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Feature 1 */}
                  <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/20">
                        <PlayCircle className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg text-white mb-2">
                        مشغل فيديو محمي مخصص
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        واجهة تشغيل متطورة مصممة للفيديوهات تمنع سرقة الروابط أو نسخها مع علامة مائية عائمة متغيرة وتكبير/تصغير الفيديو.
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-800 text-xs text-blue-400 font-semibold flex items-center gap-1">
                      <span>محاضرات بأعلى جودة</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/20">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg text-white mb-2">
                        مذكرات وبنوك أسئلة PDF
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        مذكرات الشرح الشاملة وخرائط المفاهيم الذهنية وتجميعات الأسئلة الوزارية الصعبة متاحة فور إدخال كود الكتاب.
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-800 text-xs text-indigo-400 font-semibold flex items-center gap-1">
                      <span>مذكرات معتمدة 2026</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
                        <Award className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg text-white mb-2">
                        اختبارات إلكترونية مؤقتة
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        اختبار مخصص لكل حصة بوقت محدد، مع ظهور فوري للدرجة والنسبة المئوية ومراجعة تفصيلية للإجابات الصحيحة والخاطئة.
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-800 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <span>تقييم لحظي ورصد النتائج</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Call to action card */}
                <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 text-center max-w-2xl mx-auto shadow-2xl">
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                    ابدأ رحلتك للتفوق في الفيزياء الآن
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mb-6">
                    أنشئ حسابك خلال دقيقة واحدة، وسيتولى فريق د. أحمد سند مراجعة وتفعيل الحساب والتواصل معك عبر واتساب.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setIsRegisterOpen(true)}
                      className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all"
                    >
                      إنشاء حساب طالب الآن
                    </button>
                    <button
                      onClick={() => setIsLoginOpen(true)}
                      className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all"
                    >
                      تسجيل دخول بحسابي
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <LoginModal />
      <RegisterModal />
      <AdminLoginModal />
      <AddLessonModal />
      <AddBookModal />

      {/* Video Player Modal */}
      {activeVideoLesson && (
        <VideoPlayerModal
          lesson={activeVideoLesson}
          onClose={() => setActiveVideoLesson(null)}
          onStartQuiz={() => {
            const q = db.quizzes.find((quiz) => quiz.lessonId === activeVideoLesson.id);
            if (q) {
              setActiveQuiz(q);
              setActiveQuizLesson(activeVideoLesson);
              setActiveVideoLesson(null);
            } else {
              alert('لم يتم تعيين اختبار إلكتروني لهذه الحصة بعد.');
            }
          }}
        />
      )}

      {/* PDF Viewer Modal */}
      {activePdfBook && (
        <PdfViewerModal
          book={activePdfBook}
          onClose={() => setActivePdfBook(null)}
        />
      )}

      {/* Quiz Modal */}
      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          lesson={
            activeQuizLesson ||
            db.lessons.find((l) => l.id === activeQuiz.lessonId) ||
            db.lessons[0]
          }
          onClose={() => {
            setActiveQuiz(null);
            setActiveQuizLesson(null);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <MainLayout />
    </PlatformProvider>
  );
}
