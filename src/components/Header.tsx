import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import {
  LogIn,
  UserPlus,
  ShieldCheck,
  LogOut,
  GraduationCap,
  BookOpen,
  Award,
  Atom,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentStudent,
    currentAdmin,
    activeTab,
    setActiveTab,
    setIsLoginOpen,
    setIsRegisterOpen,
    setIsAdminLoginOpen,
    logout,
  } = usePlatform();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo (Right side in RTL) */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3.5 cursor-pointer select-none group"
        >
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Atom className="w-7 h-7 text-cyan-400 group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-slate-950 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                د. أحمد سند
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                فيزياء 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              شرح الفيزياء ببساطة وبأعلى درجات الفهم
            </p>
          </div>
        </div>

        {/* Center / Quick navigation if logged in */}
        {currentStudent && (
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'home'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              الرئيسية والكود
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'content'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              الحصص المضافة والكتب
              {currentStudent.unlockedLessons.length + currentStudent.unlockedBooks.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-cyan-400/20 text-cyan-300 font-black">
                  {currentStudent.unlockedLessons.length + currentStudent.unlockedBooks.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('my-grades')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'my-grades'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              درجات الطالب
            </button>
          </nav>
        )}

        {/* Header Action Buttons (Top Left in RTL) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {!currentStudent && !currentAdmin ? (
            <>
              {/* زر دخول الإداري */}
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-400 hover:text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm hover:border-amber-500/40"
                title="دخول المشرف والإداري"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="hidden xs:inline">دخول الإداري</span>
                <span className="xs:hidden">الإدارة</span>
              </button>

              {/* زر تسجيل دخول */}
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-100 hover:text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm hover:border-blue-500/40"
              >
                <LogIn className="w-4 h-4 text-blue-400 shrink-0" />
                <span>تسجيل دخول</span>
              </button>

              {/* زر إنشاء حساب */}
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-2.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/25 active:scale-95 shrink-0"
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">إنشاء حساب</span>
                <span className="sm:hidden">تسجيل</span>
              </button>
            </>
          ) : currentStudent ? (
            <>
              {/* Student status badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-right">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div className="text-xs">
                  <div className="font-bold text-slate-100 leading-tight">
                    {currentStudent.fullName.split(' ').slice(0, 2).join(' ')}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    شعبة: {currentStudent.division} • كشف: {currentStudent.rosterNumber}
                  </div>
                </div>
              </div>

              {/* Mobile trigger for content */}
              <button
                onClick={() => setActiveTab('content')}
                className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400"
                title="الحصص والكتب"
              >
                <BookOpen className="w-4 h-4" />
              </button>

              {/* Logout button */}
              <button
                onClick={logout}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </>
          ) : (
            /* Admin is logged in */
            <>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 text-amber-400 border border-amber-500/30 hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>لوحة الإدارة</span>
              </button>

              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  activeTab === 'home'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                معاينة المنصة
              </button>

              <button
                onClick={logout}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج المشرف</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
