import React from 'react';
import { Atom, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-10 mt-16 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Atom className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">
                منصة الدكتور أحمد سند لشرح الفيزياء ببساطة
              </h4>
              <p className="text-xs text-slate-400">
                المنصة المتكاملة لطلاب الثانوية العامة والجامعات في الفيزياء
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              منصة مؤمنة بحماية الأجهزة ومنع نسخ الروابط
            </span>
          </div>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 جميع الحقوق محفوظة لمنصة الدكتور أحمد سند للفيزياء.</p>
          <p className="flex items-center gap-1">
            <span>صُممت بأعلى مستويات الجودة والأداء</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </p>
        </div>
      </div>
    </footer>
  );
};
