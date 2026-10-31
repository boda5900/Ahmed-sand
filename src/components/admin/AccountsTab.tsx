import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { StudentAccount } from '../../types/platform';
import {
  Users,
  Search,
  Edit2,
  PowerOff,
  Power,
  Eye,
  EyeOff,
  Smartphone,
  ShieldCheck,
  X,
  Save,
  CheckCircle,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal';

export const AccountsTab: React.FC = () => {
  const {
    db,
    suspendStudent,
    unsuspendStudent,
    deleteStudent,
    updateStudent,
    toggleAllowOtherDevices,
  } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState<StudentAccount | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentAccount | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Filter students (only those not pending, or all)
  const filteredStudents = db.students.filter(
    (s) =>
      s.fullName.includes(searchQuery) ||
      s.phone.includes(searchQuery) ||
      s.nationalId.includes(searchQuery) ||
      s.division.includes(searchQuery)
  );

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudent(editingStudent.id, editingStudent);
    setEditingStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* Tab Header & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>إدارة الحسابات المسجلة</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            عرض بيانات الطلاب، تعديل البيانات، إظهار كلمة المرور، وتنشيط أو إيقاف الحساب
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو الهاتف أو القومي..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 pl-9"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Accounts Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-4">اسم الطالب</th>
                <th className="py-3.5 px-4">رقم الهاتف</th>
                <th className="py-3.5 px-4">الرقم القومي</th>
                <th className="py-3.5 px-4">الباسورد</th>
                <th className="py-3.5 px-4">الشعبة</th>
                <th className="py-3.5 px-4">السكشن</th>
                <th className="py-3.5 px-4">رقم الكشف</th>
                <th className="py-3.5 px-4">حالة الحساب</th>
                <th className="py-3.5 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-500">
                    لا توجد حسابات مطابقة للبحث
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => {
                  const isSuspended = std.status === 'suspended';
                  const isVisible = showPasswords[std.id];

                  return (
                    <tr
                      key={std.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        {std.fullName}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono text-slate-300" dir="ltr">
                        {std.phone}
                      </td>

                      {/* National ID */}
                      <td className="py-3.5 px-4 font-mono text-slate-400" dir="ltr">
                        {std.nationalId}
                      </td>

                      {/* Password (Visible with toggle) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-200">
                            {isVisible ? std.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(std.id)}
                            className="p-1 text-slate-400 hover:text-cyan-400 transition-colors"
                            title={isVisible ? 'إخفاء' : 'إظهار الباسورد'}
                          >
                            {isVisible ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Division */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                          {std.division}
                        </span>
                      </td>

                      {/* Section */}
                      <td className="py-3.5 px-4 text-slate-300">{std.section}</td>

                      {/* Roster Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        {std.rosterNumber}
                      </td>

                      {/* Status Badge: Red for Suspended, Green for Active */}
                      <td className="py-3.5 px-4">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            موقوف
                          </span>
                        ) : std.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            منشط
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                            بانتظار التفعيل
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => setEditingStudent({ ...std })}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-all"
                            title="تعديل بيانات الحساب"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Suspend / Activate Button */}
                          {isSuspended ? (
                            <button
                              onClick={() => unsuspendStudent(std.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold text-[11px] flex items-center gap-1 transition-all"
                              title="تنشيط الحساب (جعله منشط بالأخضر)"
                            >
                              <Power className="w-3.5 h-3.5" />
                              <span>تنشيط</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => suspendStudent(std.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 font-bold text-[11px] flex items-center gap-1 transition-all"
                              title="إيقاف الحساب (جعله موقوف بالأحمر)"
                            >
                              <PowerOff className="w-3.5 h-3.5" />
                              <span>إيقاف</span>
                            </button>
                          )}

                          {/* Delete Account Button */}
                          <button
                            onClick={() => setStudentToDelete(std)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
                            title="حذف هذا الحساب نهائياً"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Confirm Delete Account Modal */}
      <ConfirmModal
        isOpen={studentToDelete !== null}
        title="تأكيد حذف حساب الطالب"
        message={`هل أنت متأكد من حذف حساب الطالب "${studentToDelete?.fullName || ''}" (${studentToDelete?.phone || ''}) نهائياً؟`}
        confirmText="نعم، احذف الحساب"
        onConfirm={() => {
          if (studentToDelete) {
            deleteStudent(studentToDelete.id);
            setStudentToDelete(null);
          }
        }}
        onCancel={() => setStudentToDelete(null)}
      />

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl text-right">
            <button
              onClick={() => setEditingStudent(null)}
              className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white mb-1 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-blue-400" />
              <span>تعديل بيانات الحساب</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              تعديل بيانات الطالب {editingStudent.fullName} مباشرة
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">الاسم رباعي:</label>
                <input
                  type="text"
                  value={editingStudent.fullName}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, fullName: e.target.value })
                  }
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">رقم الهاتف:</label>
                  <input
                    type="tel"
                    value={editingStudent.phone}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, phone: e.target.value })
                    }
                    dir="ltr"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-right"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">الرقم القومي:</label>
                  <input
                    type="text"
                    value={editingStudent.nationalId}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, nationalId: e.target.value })
                    }
                    dir="ltr"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الباسورد:</label>
                <input
                  type="text"
                  value={editingStudent.password}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, password: e.target.value })
                  }
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">الشعبة:</label>
                  <input
                    type="text"
                    value={editingStudent.division}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, division: e.target.value })
                    }
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">السكشن:</label>
                  <input
                    type="text"
                    value={editingStudent.section}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, section: e.target.value })
                    }
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">رقم الكشف:</label>
                  <input
                    type="text"
                    value={editingStudent.rosterNumber}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, rosterNumber: e.target.value })
                    }
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
