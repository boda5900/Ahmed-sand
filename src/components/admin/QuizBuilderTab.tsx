import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { Quiz, QuizQuestion } from '../../types/platform';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  FileQuestion,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Save,
  Video,
  Award,
  AlertCircle,
  Check,
} from 'lucide-react';

export const QuizBuilderTab: React.FC = () => {
  const { db, saveQuiz, deleteQuiz, addToast } = usePlatform();

  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    db.lessons.length > 0 ? db.lessons[0].id : 'general'
  );
  const [quizTitle, setQuizTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [errorMsg, setErrorMsg] = useState('');

  // Delete modal state
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);

  // Dynamic questions list
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q-' + Date.now(),
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      points: 5,
      explanation: '',
    },
  ]);

  const totalPoints = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: 'q-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        points: 5,
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      addToast({
        type: 'warning',
        title: 'تنبيه',
        message: 'يجب أن يحتوي الاختبار على سؤال واحد على الأقل.',
      });
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, questionText: text } : q))
    );
  };

  const handleOptionTextChange = (qIdx: number, optIdx: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i === qIdx) {
          const newOpts = [...q.options] as [string, string, string, string];
          newOpts[optIdx] = text;
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  };

  const handleCorrectOptionChange = (qIdx: number, optIdx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, correctOptionIndex: optIdx } : q))
    );
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    let lessonTitle = 'اختبار فيزياء عام وشامل';
    let targetLessonId = 'general';

    if (selectedLessonId !== 'general') {
      const lesson = db.lessons.find((l) => l.id === selectedLessonId);
      if (lesson) {
        targetLessonId = lesson.id;
        lessonTitle = lesson.title;
      }
    }

    if (!quizTitle.trim()) {
      setErrorMsg('يرجى كتابة عنوان الاختبار');
      return;
    }

    // Validate that questions are filled
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].questionText.trim()) {
        setErrorMsg(`يرجى كتابة نص السؤال رقم ${i + 1}`);
        return;
      }
      for (let j = 0; j < 4; j++) {
        if (!questions[i].options[j].trim()) {
          setErrorMsg(`يرجى كتابة نص الخيار رقم ${j + 1} في السؤال رقم ${i + 1}`);
          return;
        }
      }
    }

    const newQuiz: Quiz = {
      id: 'quiz-' + Date.now(),
      lessonId: targetLessonId,
      lessonTitle,
      title: quizTitle.trim(),
      durationMinutes: Number(durationMinutes) || 15,
      questions,
      createdAt: new Date().toISOString(),
    };

    saveQuiz(newQuiz);

    addToast({
      type: 'success',
      title: 'تم حفظ ونشر الاختبار بنجاح 🎉',
      message: `تم إنشاء اختبار "${newQuiz.title}" بإجمالي ${totalPoints} درجة ومربوط بـ (${lessonTitle}).`,
    });

    // Reset
    setQuizTitle('');
    setErrorMsg('');
    setQuestions([
      {
        id: 'q-' + Date.now(),
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        points: 5,
        explanation: '',
      },
    ]);
  };

  const handleConfirmDeleteQuiz = () => {
    if (!quizToDelete) return;
    deleteQuiz(quizToDelete.id);
    addToast({
      type: 'info',
      title: 'تم حذف الاختبار',
      message: `تم حذف اختبار "${quizToDelete.title}" بنجاح.`,
    });
    setQuizToDelete(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-emerald-400" />
            <span>إضافة وإدارة الاختبارات الإلكترونية</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            إنشاء اختبارات كاملة مع 4 خيارات وتحديد الإجابة الصحيحة والدرجات ووقت الاختبار
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>إجمالي درجات الاختبار قيد الإنشاء:</span>
            <span className="text-emerald-400 font-mono font-black">{totalPoints} درجة</span>
          </div>
        </div>
      </div>

      {/* Quiz Creation Form */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-xl">
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveQuiz} className="space-y-6">
          {/* Top Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. الحصة التابع لها الاختبار */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ربط بالحصة الدراسية <span className="text-emerald-400">*</span>
              </label>
              <select
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="general">اختبار عام شامل (لجميع الطلاب)</option>
                {db.lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title} ({lesson.division || 'عام'})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. عنوان الاختبار */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                عنوان الاختبار <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="مثال: اختبار فيزياء شامل على الفصل الأول"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* 3. وقت الاختبار بالدقائق */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                مدة الاختبار بالدقائق <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={240}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono pl-8 focus:outline-none focus:border-emerald-500"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Questions Builder */}
          <div className="space-y-6 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <span>أسئلة الاختبار والخيارات الأربعة:</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-950 text-cyan-300 text-xs font-mono">
                  {questions.length} {questions.length === 1 ? 'سؤال' : 'أسئلة'}
                </span>
              </h4>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-900/30"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة سؤال إضافي</span>
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 relative space-y-4 shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                      {qIdx + 1}
                    </span>
                    <span className="font-bold text-xs text-slate-200">
                      نص السؤال وتحديد الدرجة:
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                      <span>درجة السؤال:</span>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={q.points}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value) || 1);
                          setQuestions((prev) =>
                            prev.map((item, i) => (i === qIdx ? { ...item, points: val } : item))
                          );
                        }}
                        className="w-14 bg-slate-950 border border-slate-700 rounded-lg px-1.5 py-0.5 text-center text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="حذف هذا السؤال"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* نص السؤال */}
                <div>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                    placeholder={`اكتب نص السؤال الفيزيائي رقم ${qIdx + 1}...`}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* الخيارات الأربعة */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400">
                    الخيارات الأربعة (حدد الخيار الصحيح بالضغط عليه):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = q.correctOptionIndex === optIdx;
                      const letter = ['أ', 'ب', 'ج', 'د'][optIdx];

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleCorrectOptionChange(qIdx, optIdx)}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                            isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/40 shadow-sm shadow-emerald-500/10'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCorrectOptionChange(qIdx, optIdx);
                            }}
                            className={`w-7 h-7 rounded-lg font-bold text-xs shrink-0 flex items-center justify-center transition-all ${
                              isCorrect
                                ? 'bg-emerald-500 text-slate-950 shadow-md'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                            title={isCorrect ? 'هذا هو الخيار الصحيح' : 'اضغط لاختيار هذا الخيار كإجابة صحيحة'}
                          >
                            {isCorrect ? <Check className="w-4 h-4 stroke-[3]" /> : letter}
                          </button>

                          <input
                            type="text"
                            value={opt}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleOptionTextChange(qIdx, optIdx, e.target.value)}
                            placeholder={`الخيار (${letter}) - اكتب الإجابة`}
                            required
                            className="w-full bg-transparent border-0 text-white text-xs placeholder:text-slate-600 focus:outline-none"
                          />

                          {isCorrect && (
                            <span className="text-[10px] text-emerald-400 font-black px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 shrink-0">
                              الإجابة الصحيحة ✓
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* تفسير اختياري للإجابة */}
                <div>
                  <input
                    type="text"
                    value={q.explanation || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setQuestions((prev) =>
                        prev.map((item, i) => (i === qIdx ? { ...item, explanation: val } : item))
                      );
                    }}
                    placeholder="تفسير أو شرح توضيحي لسبب الإجابة الصحيحة (اختياري يظهر للطالب بعد إنهاء الاختبار)..."
                    className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-2 text-[11px] text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-slate-600"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-98 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>حفظ الاختبار وتعيينه للطلاب بنجاح</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Quizzes Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-xs text-white flex items-center justify-between">
          <span>الاختبارات المفعلة حالياً بالمنصة ({db.quizzes.length})</span>
          <span className="text-slate-400 text-[11px]">يمكن للطلاب دخولها واحتساب درجاتهم تلقائياً</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3 px-4">عنوان الاختبار</th>
                <th className="py-3 px-4">الحصة التابع لها</th>
                <th className="py-3 px-4">المدة</th>
                <th className="py-3 px-4">عدد الأسئلة</th>
                <th className="py-3 px-4">إجمالي الدرجات</th>
                <th className="py-3 px-4 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {db.quizzes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    لا توجد اختبارات مضافة حالياً. يمكنك ملء النموذج بالأعلى لإضافة أول اختبار.
                  </td>
                </tr>
              ) : (
                db.quizzes.map((quiz) => {
                  const quizTotal = quiz.questions.reduce((acc, q) => acc + (Number(q.points) || 0), 0);
                  return (
                    <tr key={quiz.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-white">{quiz.title}</td>
                      <td className="py-3 px-4 text-slate-300">{quiz.lessonTitle}</td>
                      <td className="py-3 px-4 font-mono">{quiz.durationMinutes} دقيقة</td>
                      <td className="py-3 px-4 font-bold text-cyan-400">
                        {quiz.questions.length} أسئلة
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-400 font-mono">
                        {quizTotal} درجة
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setQuizToDelete(quiz)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="حذف هذا الاختبار"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={quizToDelete !== null}
        title="تأكيد حذف الاختبار"
        message={`هل أنت متأكد من حذف اختبار "${quizToDelete?.title || ''}"؟ سيتم حذفه من قاعدة البيانات المركزية ولن يتاح للطلاب بعد الآن.`}
        confirmLabel="نعم، احذف الاختبار"
        confirmVariant="danger"
        onConfirm={handleConfirmDeleteQuiz}
        onCancel={() => setQuizToDelete(null)}
      />
    </div>
  );
};
