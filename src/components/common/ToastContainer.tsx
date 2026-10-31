import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X,
  Clock,
  MessageCircle,
} from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePlatform();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        const isWhatsApp = toast.type === 'whatsapp';
        const isInfo = toast.type === 'info';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        let borderClass = 'border-blue-500/40 bg-slate-900/95';
        let icon = <Info className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />;

        if (isWhatsApp) {
          borderClass = 'border-emerald-500/60 bg-emerald-950/90 shadow-emerald-500/20';
          icon = <MessageCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />;
        } else if (isSuccess) {
          borderClass = 'border-emerald-500/40 bg-slate-900/95 shadow-emerald-500/10';
          icon = <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />;
        } else if (isWarning) {
          borderClass = 'border-amber-500/40 bg-slate-900/95 shadow-amber-500/10';
          icon = <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />;
        } else if (isError) {
          borderClass = 'border-rose-500/50 bg-slate-900/95 shadow-rose-500/10';
          icon = <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />;
        } else if (isInfo) {
          borderClass = 'border-cyan-500/40 bg-slate-900/95 shadow-cyan-500/10';
          icon = <Clock className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border ${borderClass} p-4 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4`}
          >
            <div className="flex items-start gap-3">
              {icon}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    {toast.title}
                    {isWhatsApp && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        WhatsApp Verified
                      </span>
                    )}
                  </h4>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                    aria-label="إغلاق الإشعار"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed font-medium">
                  {toast.message}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
