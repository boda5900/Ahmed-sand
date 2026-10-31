import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  X,
  Phone,
  Lock,
  LogIn,
  AlertCircle,
  HelpCircle,
  Smartphone,
  ShieldAlert,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginOpen, setIsLoginOpen, setIsRegisterOpen, loginStudent, addToast } = usePlatform();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!phone.trim() || !password) {
      setErrorMsg('يرجى ملء كافة الخانات (رقم الهاتف وكلمة المرور).');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = loginStudent(phone, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'فشل تسجيل الدخول');
      } else {
        setPhone('');
        setPassword('');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-right">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsLoginOpen(false);
            setErrorMsg('');
          }}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <LogIn className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">تسجيل الدخول للطالب</h2>
            <p className="text-xs text-slate-400">أدخل رقم الهاتف وكلمة المرور للدخول لمنصتك</p>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs sm:text-sm leading-relaxed animate-in shake">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>{errorMsg}</div>
          </div>
        )}

        {/* Form with 2 fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              رقم الهاتف <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 01012345678"
                dir="ltr"
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pl-10 text-right"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Field 2: Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">
                كلمة المرور (الباسورد) <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-blue-400 hover:underline"
              >
                {showPassword ? 'إخفاء' : 'إظهار'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل الباسورد"
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pl-10 text-right"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 active:scale-98 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'جارٍ التحقق...' : 'دخول المنصة'}</span>
            </button>
          </div>
        </form>

        {/* Switch to Register */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            ليس لديك حساب بعد؟{' '}
            <button
              type="button"
              onClick={() => {
                setIsLoginOpen(false);
                setIsRegisterOpen(true);
              }}
              className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4"
            >
              اضغط هنا لإنشاء حساب جديد
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
