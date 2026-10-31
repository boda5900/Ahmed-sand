import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { Quiz, Lesson } from '../../types/platform';
import {
  X,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface QuizModalProps {
  quiz: Quiz;
  lesson: Lesson;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ quiz, lesson, onClose }) => {
  const { currentStudent, submitQuizResult } = usePlatform();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    totalPoints: number;
    percentage: number;
    answersList: {
      questionId: string;
      questionText: string;
      selectedOptionIndex: number;
      correctOptionIndex: number;
      isCorrect: boolean;
      options: string[];
    }[];
  } | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;

    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleAutoSubmit = () => {
    calculateAndSaveResults();
  };

  const calculateAndSaveResults = () => {
    let earnedPoints = 0;
    let totalPoints = 0;

    const answersList = quiz.questions.map((q, idx) => {
      totalPoints += q.points;
      const selected = selectedAnswers[idx] ?? -1;
      const isCorrect = selected === q.correctOptionIndex;
      if (isCorrect) {
        earnedPoints += q.points;
      }
      return {
        questionId: q.id,
        questionText: q.questionText,
        selectedOptionIndex: selected,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        options: [...q.options],
      };
    });

    const percentage = Math.round((earnedPoints / (totalPoints || 1)) * 100);

    const calculatedResult = {
      score: earnedPoints,
      totalPoints,
      percentage,
      answersList,
    };

    setResult(calculatedResult);
    setIsSubmitted(true);

    if (currentStudent) {
      submitQuizResult({
        studentId: currentStudent.id,
        studentName: currentStudent.fullName,
        studentPhone: currentStudent.phone,
        quizId: quiz.id,
        lessonId: lesson.id,
        quizTitle: quiz.title,
        score: earnedPoints,
        totalPoints,
        percentage,
        answers: answersList,
      });
    }
  };

  const currentQ = quiz.questions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-right my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="إغلاق الاختبار"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Top Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800 mb-6">
              <div>
                <span className="text-xs font-bold text-blue-400">
                  {lesson.title}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  {quiz.title}
                </h3>
              </div>

              {/* Countdown Timer */}
              <div
                className={`px-4 py-2 rounded-2xl border flex items-center gap-2 font-mono text-sm font-bold shadow-inner ${
                  timeLeft < 180
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 animate-pulse'
                    : 'bg-slate-950 border-slate-700 text-cyan-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            </div>

            {/* Question Progress Dots */}
            <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-2">
              {quiz.questions.map((_, idx) => {
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : isAnswered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Current Question Box */}
            {currentQ && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                    <span className="font-bold text-blue-400">
                      السؤال رقم {currentIndex + 1} من {quiz.questions.length}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                      {currentQ.points} درجات
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    {currentQ.questionText}
                  </h4>
                </div>

                {/* 4 Choices */}
                <div className="space-y-2.5">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[currentIndex] === optIdx;
                    const optionLetter = ['أ', 'ب', 'ج', 'د'][optIdx];
                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(currentIndex, optIdx)}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 select-none ${
                          isSelected
                            ? 'bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500/50 shadow-md shadow-blue-500/10'
                            : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-900 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {optionLetter}
                        </div>
                        <span className="text-sm font-medium leading-relaxed">
                          {option}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Nav Buttons */}
            <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs disabled:opacity-40 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                <button
                  type="button"
                  disabled={currentIndex === quiz.questions.length - 1}
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs disabled:opacity-40 transition-colors flex items-center gap-1.5"
                >
                  <span>التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={calculateAndSaveResults}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تسليم الاختبار ورصد الدرجة</span>
              </button>
            </div>
          </div>
        ) : (
          /* Result Screen */
          <div className="animate-in zoom-in-95 py-2">
            <div className="text-center mb-6">
              <div
                className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-3 shadow-xl ${
                  (result?.percentage ?? 0) >= 60
                    ? 'bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10'
                    : 'bg-rose-500/10 border-2 border-rose-500/40 text-rose-400 shadow-rose-500/10'
                }`}
              >
                <Award className="w-10 h-10" />
              </div>

              <span className="text-xs font-bold text-slate-400">
                نتيجة اختبار: {quiz.title}
              </span>

              {/* Exact user requirements: يظهر الدرجه و النسبة المئوية */}
              <div className="mt-3 flex items-center justify-center gap-4">
                <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-semibold mb-0.5">الدرجة</div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {result?.score} <span className="text-sm text-slate-400 font-normal">/ {result?.totalPoints}</span>
                  </div>
                </div>

                <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-semibold mb-0.5">النسبة المئوية</div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400">
                    {result?.percentage}%
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 font-medium">
                {(result?.percentage ?? 0) >= 85
                  ? '🌟 ممتاز جداً! فهم عميق لقوانين الفيزياء مع د. سند.'
                  : (result?.percentage ?? 0) >= 60
                  ? '👍 جيد! اجتزت الاختبار بنجاح، راجع الأسئلة الخاطئة أدناه.'
                  : '⚠️ ينصح بإعادة مشاهدة محاضرة الشرح ومراجعة الأفكار مرة أخرى.'}
              </p>
            </div>

            {/* Question-by-question review (Red / Green) */}
            <div className="space-y-4 max-h-96 overflow-y-auto pl-2 pr-1 my-6">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>مراجعة الإجابات النموذجية:</span>
              </h4>

              {result?.answersList.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${
                    ans.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-xs text-white">
                      السؤال {idx + 1}: {ans.questionText}
                    </span>
                    {ans.isCorrect ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold shrink-0">
                        إجابة صحيحة ✓
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold shrink-0">
                        إجابة غير صحيحة ✗
                      </span>
                    )}
                  </div>

                  <div className="text-xs space-y-1.5 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">إجابتك:</span>
                      <span className={ans.isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                        {ans.selectedOptionIndex >= 0 ? ans.options[ans.selectedOptionIndex] : 'لم تتم الإجابة'}
                      </span>
                    </div>

                    {!ans.isCorrect && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">الإجابة الصحيحة:</span>
                        <span className="text-emerald-300 font-bold">
                          {ans.options[ans.correctOptionIndex]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all"
              >
                إغلاق والعودة للمنصة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
