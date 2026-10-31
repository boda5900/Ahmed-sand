import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  ListFilter,
  Search,
  Trash2,
  Clock,
  User,
  Shield,
  KeyRound,
  FileQuestion,
  Activity,
  Download,
} from 'lucide-react';

export const LogsTab: React.FC = () => {
  const { db, clearLogs } = usePlatform();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const filteredLogs = db.logs.filter((log) => {
    if (categoryFilter !== 'all' && log.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.timestamp.includes(q)
      );
    }
    return true;
  });

  const handleExportLogsTxt = () => {
    const text = db.logs
      .map(
        (l) =>
          `[${l.timestamp}] | الحدث: ${l.action} | الفاعل: ${l.actor} | التفاصيل: ${l.details}`
      )
      .join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dr_sanad_audit_logs_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>سجل نشاط المنصة (اللوجات الفورية)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            تسجيل فوري لكل حركة في المنصة (تسجيل الدخول، إنشاء الحساب، التفعيل، الإيقاف، الأكواد، الاختبارات) بالتاريخ والساعة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLogsTxt}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>تصدير ملف اللوجات TXT</span>
          </button>

          <button
            onClick={() => setIsClearModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح اللوجات</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              categoryFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الكل ({db.logs.length})
          </button>
          <button
            onClick={() => setCategoryFilter('auth')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              categoryFilter === 'auth'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            دخول وتسجيل
          </button>
          <button
            onClick={() => setCategoryFilter('admin')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              categoryFilter === 'admin'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            إدارة وتفعيل
          </button>
          <button
            onClick={() => setCategoryFilter('code')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              categoryFilter === 'code'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            أكواد
          </button>
          <button
            onClick={() => setCategoryFilter('quiz')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              categoryFilter === 'quiz'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            اختبارات
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في الأحداث أو الأسماء..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 pl-9"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-4">التاريخ والساعة</th>
                <th className="py-3.5 px-4">اسم الحدث</th>
                <th className="py-3.5 px-4">الفاعل / اسم الحساب</th>
                <th className="py-3.5 px-4">التصنيف</th>
                <th className="py-3.5 px-4">تفاصيل الحدث</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    لا توجد سجلات تطابق الفلتر الحالي
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  let badge = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                  if (log.category === 'admin')
                    badge = 'bg-amber-500/10 text-amber-300 border-amber-500/20';
                  if (log.category === 'code')
                    badge = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
                  if (log.category === 'quiz')
                    badge = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
                  if (log.category === 'security')
                    badge = 'bg-rose-500/10 text-rose-300 border-rose-500/20';

                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* التاريخ والساعة */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap" dir="ltr">
                        {log.timestamp}
                      </td>

                      {/* اسم الحدث */}
                      <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        {log.action}
                      </td>

                      {/* اسم الحساب أو المشرف */}
                      <td className="py-3.5 px-4 font-semibold text-cyan-300 whitespace-nowrap">
                        {log.actor}
                      </td>

                      {/* التصنيف */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge}`}>
                          {log.category}
                        </span>
                      </td>

                      {/* تفاصيل الحدث */}
                      <td className="py-3.5 px-4 text-slate-300 leading-relaxed max-w-md">
                        {log.details}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Clear Logs Modal */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        title="تأكيد تفريغ سجل اللوجات"
        message="هل أنت متأكد من رغبتك في مسح وتفريغ سجل نشاط المنصة بالكامل؟ لن يمكن التراجع عن هذه العملية."
        confirmText="نعم، افرغ سجل اللوجات"
        onConfirm={() => {
          clearLogs();
          setIsClearModalOpen(false);
        }}
        onCancel={() => setIsClearModalOpen(false)}
      />
    </div>
  );
};
