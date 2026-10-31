import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { StudentGrade } from '../../types/platform';
import {
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  FileQuestion,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';

export const StudentGrades: React.FC = () => {
  const { currentStudent, db } = usePlatform();
  const [selectedGrade, setSelectedGrade] = useState<StudentGrade | null>(null);

  // Filter student grades
  const studentGrades = db.grades.filter(
    (g) => g.studentId === currentStudent?.id || !currentStudent
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">درجات الطالب</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              سجل نتائج الاختبارات الإلكترونية والنسبة المئوية في فيزياء د. أحمد سند
            </p>
          </div>
        </div>
      </div>

      {studentGrades.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">لا توجد درجات مسجلة بعد</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            قم بالدخول إلى أي حصة مفعلة واضغط على "بدء الاختبار" لاختبار معلوماتك ورصد درجاتك هنا مباشرة.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentGrades.map((grade) => (
            <div
              key={grade.id}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      grade.percentage >= 85
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : grade.percentage >= 60
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {grade.percentage}% -{' '}
                    {grade.percentage >= 85
                      ? 'ممتاز'
                      : grade.percentage >= 60
                      ? 'جيد جداً'
                      : 'يحتاج لمراجعة'}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{grade.submittedAt.split(' ')[0]}</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-white mb-1">
                  {grade.quizTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  الطالب: <span className="text-slate-200">{grade.studentName}</span>
                </p>

                {/* Score display */}
                <div className="my-5 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-around text-center">
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold mb-0.5">
                      الدرجة المحصلة
                    </div>
                    <div className="text-xl font-black text-white">
                      {grade.score} <span className="text-xs text-slate-500">/ {grade.totalPoints}</span>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-800" />
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold mb-0.5">
                      النسبة
                    </div>
                    <div className="text-xl font-black text-cyan-400">
                      {grade.percentage}%
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedGrade(grade)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>معاينة الإجابات بالتفصيل</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Answers Detail Modal */}
      {selectedGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl text-right my-8 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedGrade(null)}
              className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white mb-1">
              تفاصيل إجابات: {selectedGrade.quizTitle}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              النتيجة: {selectedGrade.score} من {selectedGrade.totalPoints} ({selectedGrade.percentage}%) • التاريخ: {selectedGrade.submittedAt}
            </p>

            <div className="space-y-4">
              {selectedGrade.answers.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${
                    ans.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2 font-bold text-sm text-white">
                    <span>
                      {idx + 1}. {ans.questionText}
                    </span>
                    {ans.isCorrect ? (
                      <span className="text-xs text-emerald-400 shrink-0 font-bold">صواب ✓</span>
                    ) : (
                      <span className="text-xs text-rose-400 shrink-0 font-bold">خطأ ✗</span>
                    )}
                  </div>

                  <div className="text-xs space-y-1.5 mt-2">
                    <p>
                      <strong className="text-slate-400">إجابة الطالب:</strong>{' '}
                      <span className={ans.isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                        {ans.selectedOptionIndex >= 0 ? ans.options[ans.selectedOptionIndex] : 'لم يُجب'}
                      </span>
                    </p>
                    {!ans.isCorrect && (
                      <p>
                        <strong className="text-slate-400">الإجابة الصحيحة:</strong>{' '}
                        <span className="text-emerald-300 font-bold">
                          {ans.options[ans.correctOptionIndex]}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-left">
              <button
                onClick={() => setSelectedGrade(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
