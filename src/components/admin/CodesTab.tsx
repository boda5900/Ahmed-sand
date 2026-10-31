import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { AccessCode } from '../../types/platform';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  KeyRound,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  Filter,
  Plus,
  Trash2,
  Hash,
  PlayCircle,
  BookOpen,
} from 'lucide-react';

export const CodesTab: React.FC = () => {
  const {
    db,
    createCode,
    deleteCode,
    setActiveVideoLesson,
    setActivePdfBook,
  } = usePlatform();

  const [filterMode, setFilterMode] = useState<'all' | 'used' | 'unused'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [codeToDelete, setCodeToDelete] = useState<AccessCode | null>(null);

  // Quick Code Generator State
  const [showGenerator, setShowGenerator] = useState(false);
  const [genTargetType, setGenTargetType] = useState<'lesson' | 'book'>('lesson');
  const [genTargetId, setGenTargetId] = useState('');
  const [genTripleNumber, setGenTripleNumber] = useState('');
  const [genCustomCode, setGenCustomCode] = useState('');

  const filteredCodes = db.codes.filter((c) => {
    // Status filter
    if (filterMode === 'used' && !c.isUsed) return false;
    if (filterMode === 'unused' && c.isUsed) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.targetTitle.toLowerCase().includes(q) ||
        c.tripleNumber.includes(q) ||
        c.division.toLowerCase().includes(q) ||
        (c.usedBy && c.usedBy.studentName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleLaunchTarget = (code: AccessCode) => {
    if (code.targetType === 'lesson') {
      const lesson = db.lessons.find((l) => l.id === code.targetId || l.code === code.code);
      if (lesson) {
        setActiveVideoLesson(lesson);
      } else {
        alert('الحصة غير موجودة');
      }
    } else {
      const book = db.books.find((b) => b.id === code.targetId || b.code === code.code);
      if (book) {
        setActivePdfBook(book);
      } else {
        alert('الكتاب غير موجود');
      }
    }
  };

  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    let targetTitle = '';
    let division = '';

    if (genTargetType === 'lesson') {
      const les = db.lessons.find((l) => l.id === genTargetId);
      if (!les) return;
      targetTitle = les.title;
      division = les.division;
    } else {
      const bk = db.books.find((b) => b.id === genTargetId);
      if (!bk) return;
      targetTitle = bk.title;
      division = bk.division;
    }

    const codeToUse =
      genCustomCode.trim() ||
      `${genTargetType === 'lesson' ? 'PHYS' : 'BOOK'}-${Math.floor(1000 + Math.random() * 9000)}`;

    createCode({
      code: codeToUse.toUpperCase(),
      targetType: genTargetType,
      targetId: genTargetId,
      targetTitle,
      tripleNumber: genTripleNumber || '715',
      division,
    });

    setShowGenerator(false);
    setGenCustomCode('');
    setGenTripleNumber('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <span>إدارة ومتابعة الأكواد</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            متابعة حالة الكود (اشتغل بالأحمر / لم يشتغل بالأخضر) وربطها بروابط الحصص والكتب
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter Buttons as explicitly requested */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              عرض كل الأكواد ({db.codes.length})
            </button>
            <button
              onClick={() => setFilterMode('used')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                filterMode === 'used'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-rose-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>الأكواد المستخدمة (اشتغل)</span>
            </button>
            <button
              onClick={() => setFilterMode('unused')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                filterMode === 'unused'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>الأكواد المتاحة (لم يشتغل)</span>
            </button>
          </div>

          {/* Quick Create Code Button */}
          <button
            onClick={() => setShowGenerator(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>توليد كود إضافي</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="بحث برقم الكود أو اسم الحصة أو الرقم الثلاثي أو اسم الطالب..."
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 pl-9"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Codes Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-4">رقم الكود</th>
                <th className="py-3.5 px-4">اسم الحصة أو الكتاب</th>
                <th className="py-3.5 px-4">النوع</th>
                <th className="py-3.5 px-4">الرقم الثلاثي</th>
                <th className="py-3.5 px-4">الشعبة</th>
                <th className="py-3.5 px-4">حالة الكود (اشتغل / لم يشتغل)</th>
                <th className="py-3.5 px-4">مستخدم بواسطة</th>
                <th className="py-3.5 px-4 text-center">فتح المحتوى</th>
                <th className="py-3.5 px-4 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredCodes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-500 font-medium">
                    لا توجد أكواد مطابقة للتصفية الحالية
                  </td>
                </tr>
              ) : (
                filteredCodes.map((code) => {
                  const isUsed = code.isUsed;

                  return (
                    <tr
                      key={code.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* رقم الكود */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white tracking-wider">
                        {code.code}
                      </td>

                      {/* اسم الحصة أو الكتاب */}
                      <td className="py-3.5 px-4 font-semibold text-slate-100 max-w-xs truncate">
                        {code.targetTitle}
                      </td>

                      {/* النوع */}
                      <td className="py-3.5 px-4">
                        {code.targetType === 'lesson' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                            <PlayCircle className="w-3 h-3" />
                            حصة
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                            <BookOpen className="w-3 h-3" />
                            كتاب PDF
                          </span>
                        )}
                      </td>

                      {/* الرقم الثلاثي */}
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        {code.tripleNumber}
                      </td>

                      {/* الشعبة */}
                      <td className="py-3.5 px-4 text-slate-300">{code.division}</td>

                      {/* حالة الكود: اشتغل (أحمر) أو لم يشتغل (أخضر) */}
                      <td className="py-3.5 px-4">
                        {isUsed ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-black text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span>اشتغل (مستخدم)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>لم يشتغل (متاح)</span>
                          </span>
                        )}
                      </td>

                      {/* مستخدم بواسطة */}
                      <td className="py-3.5 px-4 text-slate-300">
                        {code.usedBy ? (
                          <div>
                            <div className="font-bold text-white text-[11px]">
                              {code.usedBy.studentName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono" dir="ltr">
                              {code.usedBy.usedAt}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">لم يُستخدم بعد</span>
                        )}
                      </td>

                      {/* زر عند النقر يدخل على الحصة مربوط باللينك المضاف في لوحة الإدارة */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleLaunchTarget(code)}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 hover:text-white transition-all inline-flex items-center gap-1.5 font-bold text-[11px]"
                          title="فتح الحصة / الكتاب المربوط بهذا الكود"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                          <span>دخول</span>
                        </button>
                      </td>

                      {/* حذف الكود */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setCodeToDelete(code)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="حذف الكود"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Confirm Delete Code Modal */}
      <ConfirmModal
        isOpen={codeToDelete !== null}
        title="تأكيد حذف كود الدخول"
        message={`هل أنت متأكد من حذف الكود [${codeToDelete?.code || ''}] المخصص لـ (${codeToDelete?.targetTitle || ''})؟`}
        confirmText="نعم، احذف الكود"
        onConfirm={() => {
          if (codeToDelete) {
            deleteCode(codeToDelete.id);
            setCodeToDelete(null);
          }
        }}
        onCancel={() => setCodeToDelete(null)}
      />

      {/* Code Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-right">
            <h3 className="text-lg font-black text-white mb-1 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <span>توليد كود دخول إضافي</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              أنشئ كوداً لحصة أو كتاب موجود ليستخدمه طالب جديد
            </p>

            <form onSubmit={handleGenerateCode} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">نوع المحتوى:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGenTargetType('lesson');
                      setGenTargetId(db.lessons[0]?.id || '');
                    }}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      genTargetType === 'lesson'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    حصة
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGenTargetType('book');
                      setGenTargetId(db.books[0]?.id || '');
                    }}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      genTargetType === 'book'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    كتاب PDF
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  اختر {genTargetType === 'lesson' ? 'الحصة' : 'الكتاب'}:
                </label>
                <select
                  value={genTargetId}
                  onChange={(e) => setGenTargetId(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="">-- اضغط للاختيار --</option>
                  {genTargetType === 'lesson'
                    ? db.lessons.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title}
                        </option>
                      ))
                    : db.books.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.title}
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الرقم الثلاثي:</label>
                <input
                  type="text"
                  value={genTripleNumber}
                  onChange={(e) => setGenTripleNumber(e.target.value)}
                  placeholder="مثال: 715"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  كود مخصص (اختياري، اتركه فارغاً لتوليد كود عشوائي):
                </label>
                <input
                  type="text"
                  value={genCustomCode}
                  onChange={(e) => setGenCustomCode(e.target.value.toUpperCase())}
                  placeholder="مثال: PHYS-SPECIAL-1"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowGenerator(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!genTargetId}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black disabled:opacity-50"
                >
                  توليد الكود
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
