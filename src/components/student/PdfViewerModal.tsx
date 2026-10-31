import React, { useState } from 'react';
import { Book } from '../../types/platform';
import {
  X,
  Maximize2,
  Minimize2,
  BookOpen,
  FileText,
  Download,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface PdfViewerModalProps {
  book: Book;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ book, onClose }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  // Convert drive url if needed
  let embedUrl = book.driveUrl;
  if (embedUrl.includes('drive.google.com')) {
    const match = embedUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      embedUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className={`relative w-full bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isMaximized
            ? 'h-[98vh] max-w-[98vw]'
            : 'max-w-5xl h-[88vh] max-h-[850px]'
        }`}
      >
        {/* Top Header */}
        <div className="px-4 py-3 sm:px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {book.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                الشعبة: {book.division} • الحجم: {book.pages}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Maximize / Minimize button */}
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMaximized ? 'تصغير الحجم' : 'تكبير الشاشة'}
            >
              {isMaximized ? (
                <Minimize2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <Maximize2 className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="إغلاق الكتاب"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Frame */}
        <div className="relative flex-1 bg-slate-950">
          <iframe
            src={embedUrl}
            title={book.title}
            className="w-full h-full border-0"
            allow="fullscreen"
          />
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>نسخة أصلية معتمدة من د. أحمد سند</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            الكود: {book.code} | الرقم الثلاثي: {book.tripleNumber}
          </div>
        </div>
      </div>
    </div>
  );
};
