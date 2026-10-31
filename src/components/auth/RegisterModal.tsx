import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  X,
  User,
  Phone,
  CreditCard,
  Layers,
  Users,
  Hash,
  Lock,
  UserPlus,
  AlertCircle,
  Clock,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';

export const RegisterModal: React.FC = () => {
  const { isRegisterOpen, setIsRegisterOpen, setIsLoginOpen, registerStudent } = usePlatform();

  // 8 Fields required by the user
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [division, setDivision] = useState(''); // شعبتك (كتابة)
  const [section, setSection] = useState(''); // سكشن إيه (كتابة)
  const [rosterNumber, setRosterNumber] = useState(''); // رقم كام في الكشف
  const [password, setPassword] = useState(''); // الباسورد >= 8
  const [confirmPassword, setConfirmPassword] = useState(''); // تأكيد الباسورد

  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  if (!isRegisterOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !nationalId.trim() ||
      !division.trim() ||
      !section.trim() ||
      !rosterNumber.trim() ||
      !password ||
      !confirmPassword
    ) {
      setErrorMsg('يرجى ملء جميع الخانات الـ 8 المطلوبة بدقة للتسجيل.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('كلمة المرور يجب ألا تقل عن 8 حروف أو أرقام أو رموز.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('كلمتا المرور غير متطابقتين، يرجى إعادة التأكد من كتابة الباسورد.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = registerStudent({
        fullName,
        phone,
        nationalId,
        division,
        section,
        rosterNumber,
        password,
      });

      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'تعذر إتمام التسجيل.');
      } else {
        setSubmittedNotice(true);
      }
    }, 400);
  };

  const handleClose = () => {
    setIsRegisterOpen(false);
    setSubmittedNotice(false);
    setErrorMsg('');
    setFullName('');
    setPhone('');
    setNationalId('');
    setDivision('');
    setSection('');
    setRosterNumber('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-right my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedNotice ? (
          /* Notice Screen After Registration as requested by user */
          <div className="py-6 text-center animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border-2 border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-500/10">
              <Clock className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-3">
              حسابك بانتظار التفعيل من الإدارة
            </span>

            <h3 className="text-2xl font-black text-white mb-4">
              تم استلام طلبك بنجاح!
            </h3>

            {/* The exact requested text */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-700/80 text-right leading-relaxed mb-6 space-y-3">
              <p className="text-sm sm:text-base font-semibold text-slate-100">
                ⚠️ <span className="text-amber-400 font-bold">انتظر 12 ساعة:</span> الحساب يكون غير مفعّل حتى يتم مراجعة طلبك للانضمام لمنصة دكتور سند.
              </p>
              <p className="text-sm text-slate-300">
                📲 وبعد الانتهاء من مراجعة طلبك سيتم إرسال لك رسالة <strong className="text-emerald-400 font-bold">واتساب</strong> تعرّفك أن تم انتهاء مراجعة طلبك وتفعيل حسابك للبدء مباشرة.
              </p>
            </div>

            {/* WhatsApp notification preview */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs text-right mb-6 flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-300">رسالة الواتساب المتوقعة:</p>
                <p className="mt-1 text-emerald-200/90">
                  "مرحباً بك يا {fullName} في منصة د. أحمد سند للفيزياء. تم التحقق من بياناتك وتفعيل حسابك بنجاح. يمكنك الآن تسجيل الدخول مباشرة."
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
            >
              حسناً، فهمت وسأنتظر رسالة التفعيل
            </button>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  إنشاء حساب طالب جديد
                </h2>
                <p className="text-xs text-slate-400">
                  املأ الخانات الـ 8 بدقة لمراجعة طلبك للانضمام لمنصة د. أحمد سند
                </p>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs sm:text-sm animate-in shake">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. الاسم رباعي */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    الاسم رباعي <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: أحمد محمد محمود علي"
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-10"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 2. رقم الهاتف */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    رقم الهاتف (واتساب للتفعيل) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01012345678"
                      dir="ltr"
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-10 text-right"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. الرقم القومي */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    الرقم القومي (14 رقم) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder="الرقم القومي من بطاقة الرقم القومي"
                      dir="ltr"
                      maxLength={14}
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-10 text-right"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 4. ما هي شعبتك (كتابة - بدون خيارات مفروضة) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    ما هي شعبتك؟ (كتابة) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      placeholder="اكتب اسم شعبتك هنا..."
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-10"
                    />
                    <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 5. سكشن إيه (كتابة) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    سيكشن إيه؟ (كتابة) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      placeholder="اكتب اسم أو رقم السكشن (مثال: سكشن 3 / مجموعة السبت)"
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-10"
                    />
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 6. رقم كام في الكشف */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    رقم كام في الكشف؟ <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={rosterNumber}
                      onChange={(e) => setRosterNumber(e.target.value)}
                      placeholder="رقمك في كشف الحضور والغياب (مثال: 45)"
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-10"
                    />
                    <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 7. الباسورد */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      الباسورد (8 رموز على الأقل) <span className="text-rose-400">*</span>
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
                      placeholder="حروف أو أرقام ورموز (8+)"
                      required
                      minLength={8}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-10"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 8. تأكيد الباسورد */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    تأكيد الباسورد <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="أعد كتابة الباسورد للتأكيد"
                      required
                      minLength={8}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-10"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Requirement reminder */}
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-blue-300 text-xs flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>
                  ملاحظة: بعد إرسال النموذج ينتقل حسابك لمراجعة الإدارة (خلال 12 ساعة) وسيصلك إشعار واتساب بالقبول.
                </span>
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 active:scale-98 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'جارٍ تسجيل البيانات وإرسال الطلب...' : 'إرسال طلب إنشاء الحساب'}</span>
                </button>
              </div>

              {/* Already have account */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  لديك حساب مسجل بالفعل؟{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterOpen(false);
                      setIsLoginOpen(true);
                    }}
                    className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4"
                  >
                    تسجيل الدخول الآن
                  </button>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
