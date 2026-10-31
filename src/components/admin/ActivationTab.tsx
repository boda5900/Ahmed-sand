import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { StudentAccount } from '../../types/platform';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  UserCheck,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Phone,
  CreditCard,
  Layers,
  Users,
  Hash,
  X,
  MessageCircle,
  AlertTriangle,
} from 'lucide-react';

export const ActivationTab: React.FC = () => {
  const { db, activateStudent, deleteStudent } = usePlatform();
  const [selectedStudentForView, setSelectedStudentForView] = useState<StudentAccount | null>(null);
  const [filterMode, setFilterMode] = useState<'pending' | 'all'>('pending');
  const [studentToDelete, setStudentToDelete] = useState<StudentAccount | null>(null);

  const pendingStudents = db.students.filter((s) => s.status === 'pending');
  const displayedStudents =
    filterMode === 'pending'
      ? pendingStudents
      : db.students;

  return (
    <div className="space-y-6">
      {/* Header and Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <span>تفعيل ومراجعة الحسابات</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            مراجعة طلبات التسجيل المعلقة (مهلة الـ 12 ساعة) وتفعيلها بضغطة زر مع إرسال إشعار الواتساب
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterMode === 'pending'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            بانتظار المراجعة ({pendingStudents.length})
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            كافة الحسابات ({db.students.length})
          </button>
        </div>
      </div>

      {/* List / Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-4">اسم الطالب</th>
                <th className="py-3.5 px-4">رقم الهاتف</th>
                <th className="py-3.5 px-4">الشعبة</th>
                <th className="py-3.5 px-4">السكشن</th>
                <th className="py-3.5 px-4">رقم الكشف</th>
                <th className="py-3.5 px-4">تاريخ الطلب</th>
                <th className="py-3.5 px-4">حالة الحساب</th>
                <th className="py-3.5 px-4 text-center">عرض البيانات (أيقونة العين)</th>
                <th className="py-3.5 px-4 text-center">الإجراء (تفعيل / حذف)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
                    <p className="font-bold">رائع! لا توجد طلبات حسابات معلقة بانتظار المراجعة حالياً.</p>
                  </td>
                </tr>
              ) : (
                displayedStudents.map((std) => {
                  const isPending = std.status === 'pending';
                  const isActive = std.status === 'active';
                  const isSuspended = std.status === 'suspended';

                  return (
                    <tr key={std.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        {std.fullName}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300" dir="ltr">
                        {std.phone}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                          {std.division}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">{std.section}</td>

                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        {std.rosterNumber}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {std.createdAt}
                      </td>

                      <td className="py-3.5 px-4">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                            <Clock className="w-3 h-3 animate-spin" />
                            قيد المراجعة
                          </span>
                        ) : isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                            مفعل ومنشط ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-bold">
                            موقوف ✗
                          </span>
                        )}
                      </td>

                      {/* زر العين لمشاهدة كافة بيانات الحساب المسجلة */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedStudentForView(std)}
                          className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-cyan-400 border border-blue-500/30 transition-all inline-flex items-center gap-1"
                          title="عرض كل بيانات الحساب المسجلة"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-[11px] font-bold hidden sm:inline">معاينة</span>
                        </button>
                      </td>

                      {/* تفعيل أو حذف */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {isPending && (
                            <button
                              onClick={() => activateStudent(std.id)}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-600/30 transition-all"
                              title="تفعيل الحساب مباشرة"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>تفعيل الحساب</span>
                            </button>
                          )}

                          {/* زر الحذف بجانب الحساب */}
                          <button
                            onClick={() => setStudentToDelete(std)}
                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                            title="حذف الحساب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal تأكيد حذف الحساب بدون الاعتماد على المتصفح */}
      <ConfirmModal
        isOpen={studentToDelete !== null}
        title="تأكيد حذف حساب الطالب"
        message={`هل أنت متأكد من رغبتك في حذف حساب الطالب "${studentToDelete?.fullName || ''}"؟ سيتم مسح بياناته نهائياً من قاعدة البيانات المركزية.`}
        confirmText="نعم، احذف الحساب"
        onConfirm={() => {
          if (studentToDelete) {
            deleteStudent(studentToDelete.id);
            setStudentToDelete(null);
          }
        }}
        onCancel={() => setStudentToDelete(null)}
      />

      {/* Eye Details Modal (عرض كافة بيانات الحساب المسجلة) */}
      {selectedStudentForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl text-right">
            <button
              onClick={() => setSelectedStudentForView(null)}
              className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  بيانات حساب الطالب المسجلة
                </h3>
                <p className="text-xs text-slate-400">
                  كافة الحقول المدخلة بواسطة الطالب أثناء إنشاء الحساب
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6">
              <div>
                <span className="text-slate-400 block mb-0.5">1. الاسم رباعي:</span>
                <span className="text-white font-bold text-sm">
                  {selectedStudentForView.fullName}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">2. رقم الهاتف:</span>
                <span className="text-white font-mono font-bold" dir="ltr">
                  {selectedStudentForView.phone}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">3. الرقم القومي:</span>
                <span className="text-white font-mono font-bold" dir="ltr">
                  {selectedStudentForView.nationalId}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">4. الشعبة:</span>
                <span className="text-cyan-300 font-bold">
                  {selectedStudentForView.division}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">5. السكشن:</span>
                <span className="text-white font-bold">
                  {selectedStudentForView.section}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">6. رقم الكشف:</span>
                <span className="text-amber-400 font-mono font-bold">
                  {selectedStudentForView.rosterNumber}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">7. كلمة المرور (الباسورد):</span>
                <span className="text-white font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {selectedStudentForView.password}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">حالة الحساب:</span>
                <span className="font-bold text-amber-400">
                  {selectedStudentForView.status === 'active'
                    ? 'منشط ومفعل'
                    : selectedStudentForView.status === 'suspended'
                    ? 'موقوف'
                    : 'قيد المراجعة'}
                </span>
              </div>
            </div>

            {/* Quick Actions in modal */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  if (confirm('تأكيد حذف الحساب؟')) {
                    deleteStudent(selectedStudentForView.id);
                    setSelectedStudentForView(null);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف الحساب</span>
              </button>

              {selectedStudentForView.status === 'pending' && (
                <button
                  onClick={() => {
                    activateStudent(selectedStudentForView.id);
                    setSelectedStudentForView(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تفعيل الحساب الآن</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
