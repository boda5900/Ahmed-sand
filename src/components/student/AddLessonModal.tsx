import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  X,
  PlayCircle,
  KeyRound,
  Hash,
  Layers,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const AddLessonModal: React.FC = () => {
  const {
    isAddLessonModalOpen,
    setIsAddLessonModalOpen,
    redeemLessonCode,
    setActiveTab,
    setActiveVideoLesson,
    currentStudent,
    db,
  } = usePlatform();

  const [code, setCode] = useState('');
  const [division, setDivision] = useState(currentStudent?.division || '');
  const [tripleNumber, setTripleNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAddLessonModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!code.trim()) {
      setErrorMsg('يرجى إدخال رقم الكود الخاص بالحصة.');
      return;
    }
    if (!division.trim()) {
      setErrorMsg('يرجى تحديد أو كتابة الشعبة.');
      return;
    }
    if (!tripleNumber.trim()) {
      setErrorMsg('يرجى إدخال الرقم الثلاثي المسجل في كود الحصة.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = redeemLessonCode(code, tripleNumber, division);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'تعذر إضافة الحصة. يرجى التأكد من صحة البيانات.');
      } else {
        setIsAddLessonModalOpen(false);
        setCode('');
        setTripleNumber('');
        // Switch to content tab
        setActiveTab('content');
        if (res.lesson) {
          setActiveVideoLesson(res.lesson);
        }
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-right">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAddLessonModalOpen(false);
            setErrorMsg('');
          }}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">إضافة حصة جديدة</h2>
            <p className="text-xs text-slate-400">
              أدخل بيانات الكود المخصص من لوحة الإدارة لفتح المحاضرة
            </p>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs sm:text-sm animate-in shake">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. رقم الكود */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              رقم الكود <span className="text-blue-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="مثال: PHYS-9941"
                dir="ltr"
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-10 text-right uppercase font-mono tracking-wider"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. شعبتك إيه (خانة منفصلة) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              شعبتك إيه؟ <span className="text-blue-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                placeholder="اكتب اسم شعبتك..."
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-10"
              />
              <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3. الرقم الثلاثي (خانة منفصلة) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              الرقم الثلاثي <span className="text-blue-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={tripleNumber}
                onChange={(e) => setTripleNumber(e.target.value)}
                placeholder="الرقم الثلاثي المرفق بالكود (مثال: 420)"
                maxLength={5}
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-10"
              />
              <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 active:scale-98 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{loading ? 'جارٍ التحقق وتفعيل الحصة...' : 'تأكيد إضافة الحصة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
