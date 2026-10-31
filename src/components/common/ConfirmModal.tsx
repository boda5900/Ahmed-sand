import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  confirmLabel?: string;
  cancelText?: string;
  isDestructive?: boolean;
  confirmVariant?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  confirmLabel,
  cancelText = 'إلغاء',
  isDestructive = true,
  confirmVariant,
  onConfirm,
  onCancel,
}) => {
  const resolvedConfirmText = confirmText || confirmLabel || 'تأكيد الحذف';
  const isDestruct = isDestructive && confirmVariant !== 'primary' && confirmVariant !== 'info';
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl text-right animate-in zoom-in-95">
        <button
          onClick={onCancel}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isDestructive
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
            }`}
          >
            {isDestructive ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-black text-white">{title}</h3>
            <span className="text-[11px] text-slate-400">يرجى تأكيد العملية للاستمرار</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-1.5 ${
              isDestruct
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
            }`}
          >
            {isDestruct && <Trash2 className="w-4 h-4" />}
            <span>{resolvedConfirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
