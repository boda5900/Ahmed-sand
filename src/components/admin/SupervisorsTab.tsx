import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { AdminAccount } from '../../types/platform';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  KeyRound,
  Eye,
  EyeOff,
  User,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const SupervisorsTab: React.FC = () => {
  const { db, addAdmin, deleteAdmin, currentAdmin, addToast } = usePlatform();

  // New admin form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'superadmin' | 'supervisor' | 'assistant'>('supervisor');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Confirm delete modal state
  const [adminToDelete, setAdminToDelete] = useState<AdminAccount | null>(null);

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddSupervisor = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanName = name.trim();

    if (!cleanUser || !cleanPass || !cleanName) {
      setErrorMsg('يرجى ملء كافة الخانات (اسم المشرف، الباسورد، والاسم الكامل).');
      return;
    }

    if (cleanPass.length < 4) {
      setErrorMsg('كلمة المرور يجب ألا تقل عن 4 خانات.');
      return;
    }

    // Check if username already exists
    if ((db.admins || []).some((a) => a.username.trim().toLowerCase() === cleanUser)) {
      setErrorMsg('اسم المشرف هذا مسجل بالفعل مسبقاً! يرجى اختيار اسم مستخدم آخر.');
      return;
    }

    addAdmin({
      username: cleanUser,
      password: cleanPass,
      name: cleanName,
      role,
    });

    // Reset form
    setUsername('');
    setPassword('');
    setName('');
  };

  const handleConfirmDelete = () => {
    if (!adminToDelete) return;

    if (currentAdmin && currentAdmin.username.toLowerCase() === adminToDelete.username.toLowerCase()) {
      addToast({
        type: 'error',
        title: 'تعذر الحذف',
        message: 'لا يمكنك حذف حساب المشرف الذي تستخدمه حالياً في تسجيل الدخول!',
      });
      setAdminToDelete(null);
      return;
    }

    deleteAdmin(adminToDelete.id);
    setAdminToDelete(null);
  };

  const adminList = db.admins || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>إدارة حسابات مشرفي لوحة الإدارة</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          إضافة حسابات جديدة لدخول لوحة التحكم الإدارية أو مسح حسابات المشرفين مع الحفظ المركزي
        </p>
      </div>

      {/* Add New Supervisor Form */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-xl">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-base text-white">إضافة مشرف جديد للوحة التحكم</h4>
            <p className="text-xs text-slate-400">
              قم بإنشاء حساب جديد للمشرف مع تحديد اسم المستخدم وكلمة المرور
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAddSupervisor} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. اسم المشرف للدخول (Username) */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                اسم المشرف للدخول <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="مثال: admin_ali"
                  dir="ltr"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-500 pl-8 text-right"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. كلمة المرور */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                كلمة المرور (الباسورد) <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="اكتب باسورد المشرف"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-500 pl-8 text-right"
                />
                <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 3. اسم المشرف الكامل */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                اسم المشرف الكامل <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: أ. علي حسن (مشرف)"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* 4. الصلاحية */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                الرتبة والصلاحية
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
              >
                <option value="superadmin">مشرف رئيسي (Super Admin)</option>
                <option value="supervisor">مشرف عام (Supervisor)</option>
                <option value="assistant">مساعد سكرتارية (Assistant)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 active:scale-98 transition-all"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>حفظ وإضافة المشرف الآن</span>
            </button>
          </div>
        </form>
      </div>

      {/* Supervisors Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="font-bold text-xs text-white flex items-center gap-2">
            <span>قائمة المشرفين المصرح لهم بدخول المنصة ({adminList.length})</span>
          </div>
          <span className="text-[11px] text-slate-400">
            يمكن لأي مشرف مضاف تسجيل الدخول فوراً
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-4">اسم المشرف الكامل</th>
                <th className="py-3.5 px-4">اسم المستخدم (للدخول)</th>
                <th className="py-3.5 px-4">كلمة المرور (الباسورد)</th>
                <th className="py-3.5 px-4">الرتبة</th>
                <th className="py-3.5 px-4">تاريخ الإضافة</th>
                <th className="py-3.5 px-4 text-center">مسح / حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {adminList.map((admin) => {
                const isCurrent = currentAdmin && currentAdmin.username.toLowerCase() === admin.username.toLowerCase();
                const isVisible = showPasswords[admin.id];

                return (
                  <tr key={admin.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>{admin.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          أنت حالياً
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-amber-300" dir="ltr">
                      {admin.username}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-slate-200">
                          {isVisible ? admin.password : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(admin.id)}
                          className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                          title={isVisible ? 'إخفاء' : 'إظهار كلمة المرور'}
                        >
                          {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 border border-slate-800 text-slate-300">
                        {admin.role === 'superadmin'
                          ? 'مشرف رئيسي'
                          : admin.role === 'supervisor'
                          ? 'مشرف عام'
                          : 'مساعد'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono" dir="ltr">
                      {admin.createdAt || 'افتراضي'}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        disabled={Boolean(isCurrent)}
                        onClick={() => setAdminToDelete(admin)}
                        className={`p-2 rounded-xl transition-all ${
                          isCurrent
                            ? 'opacity-30 cursor-not-allowed text-slate-600'
                            : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                        title={isCurrent ? 'لا يمكنك حذف الحساب النشط حالياً' : 'مسح حساب المشرف'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Delete In-App Modal */}
      <ConfirmModal
        isOpen={Boolean(adminToDelete)}
        title="تأكيد مسح حساب المشرف"
        message={`هل أنت متأكد من رغبتك في مسح حساب المشرف "${adminToDelete?.name}" (${adminToDelete?.username})؟ لن يتمكن هذا الحساب من الدخول للوحة الإدارة بعد الآن.`}
        confirmText="نعم، امسح الحساب"
        cancelText="إلغاء"
        onConfirm={handleConfirmDelete}
        onCancel={() => setAdminToDelete(null)}
      />
    </div>
  );
};
