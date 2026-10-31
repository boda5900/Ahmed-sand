import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  X,
  ShieldCheck,
  User,
  Lock,
  LogIn,
  AlertCircle,
  KeyRound,
  Shield,
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isAdminLoginOpen, setIsAdminLoginOpen, loginAdmin } = usePlatform();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAdminLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('يرجى كتابة اسم المشرف وكلمة المرور.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = loginAdmin(username, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'بيانات الدخول الإداري غير صحيحة.');
      } else {
        setUsername('');
        setPassword('');
      }
    }, 350);
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 text-right">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAdminLoginOpen(false);
            setErrorMsg('');
          }}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>دخول الإداري</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                لوحة الإدارة
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              خاص بالدكتور أحمد سند ومشرفي المنصة
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
          {/* Field 1: اسم المشرف */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              اسم المشرف <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المشرف المصرح"
                dir="ltr"
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 pl-10 text-right"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Field 2: خانة الباسورد */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">
                كلمة المرور (الباسورد) <span className="text-amber-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-amber-400 hover:underline"
              >
                {showPassword ? 'إخفاء' : 'إظهار'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور الإدارية"
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 pl-10 text-right"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 active:scale-98 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>{loading ? 'جارٍ تسجيل الدخول الإداري...' : 'دخول لوحة التحكم'}</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-500/70" />
            <span>لوحة مؤمنة ومشفرة خاصة بالإدارة فقط</span>
          </p>
        </div>
      </div>
    </div>
  );
};
