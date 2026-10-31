import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { StudentGrade } from '../../types/platform';
import {
  Award,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  X,
  FileQuestion,
  Calendar,
} from 'lucide-react';

export const StudentGradesTab: React.FC = () => {
  const { db } = usePlatform();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<StudentGrade | null>(null);

  const filteredGrades = db.grades.filter(
    (g) =>
      g.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.studentPhone.includes(searchQuery) ||
      g.quizTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>سجل نتائج ودرجات الطلاب في الاختبارات</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            متابعة الدرجات والنسب المئوية والاطلاع على الأسئلة المحلولة صح أو خطأ لكل طالب
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم الطالب أو الاختبار أو الهاتف..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 pl-9"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Grades Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-4">اسم الطالب</th>
                <th className="py-3.5 px-4">رقم الهاتف</th>
                <th className="py-3.5 px-4">اسم الامتحان</th>
                <th className="py-3.5 px-4">الدرجة</th>
                <th className="py-3.5 px-4">النسبة المئوية</th>
                <th className="py-3.5 px-4">تاريخ التسليم</th>
                <th className="py-3.5 px-4 text-center">فحص الإجابات (صح/خطأ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    لا توجد درجات مسجلة تطابق البحث
                  </td>
                </tr>
              ) : (
                filteredGrades.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {g.studentName}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300" dir="ltr">
                      {g.studentPhone}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {g.quizTitle}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {g.score} <span className="text-slate-500">/ {g.totalPoints}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          g.percentage >= 85
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : g.percentage >= 60
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {g.percentage}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]" dir="ltr">
                      {g.submittedAt}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedGrade(g)}
                        className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-cyan-300 hover:text-white transition-all inline-flex items-center gap-1.5 font-bold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>معاينة إجابات الطالب</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Answer Inspection Modal with Green/Red Breakdown */}
      {selectedGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl text-right my-8 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedGrade(null)}
              className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FileQuestion className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  فحص إجابات الطالب: {selectedGrade.studentName}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedGrade.quizTitle} • النتيجة:{' '}
                  <span className="text-emerald-400 font-bold">
                    {selectedGrade.score} / {selectedGrade.totalPoints} ({selectedGrade.percentage}%)
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-4 my-6">
              {selectedGrade.answers.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${
                    ans.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="font-bold text-xs text-white">
                      السؤال {idx + 1}: {ans.questionText}
                    </span>
                    {ans.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        حله صح
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full shrink-0">
                        <XCircle className="w-3.5 h-3.5" />
                        حله غلط
                      </span>
                    )}
                  </div>

                  <div className="text-xs space-y-1.5 mt-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400 font-medium">إجابة الطالب: </span>
                      <span className={ans.isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {ans.selectedOptionIndex >= 0 ? ans.options[ans.selectedOptionIndex] : 'لم يُجب'}
                      </span>
                    </div>

                    {!ans.isCorrect && (
                      <div>
                        <span className="text-slate-400 font-medium">الإجابة الصحيحة النموذجية: </span>
                        <span className="text-emerald-400 font-bold">
                          {ans.options[ans.correctOptionIndex]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-left pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedGrade(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
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
