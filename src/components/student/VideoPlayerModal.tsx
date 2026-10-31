import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { Lesson } from '../../types/platform';
import {
  X,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  Settings,
  HelpCircle,
  FileQuestion,
  ExternalLink,
} from 'lucide-react';

interface VideoPlayerModalProps {
  lesson: Lesson;
  onClose: () => void;
  onStartQuiz?: () => void;
}

// Convert various Drive and YouTube URLs into clean embed URLs
function getSafeEmbedUrl(url: string): { embedUrl: string; isYouTube: boolean; isDrive: boolean } {
  if (!url) return { embedUrl: '', isYouTube: false, isDrive: false };

  // Check YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || '';
    }
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`,
      isYouTube: true,
      isDrive: false,
    };
  }

  // Check Google Drive
  if (url.includes('drive.google.com')) {
    let fileId = '';
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      fileId = match[1];
    } else {
      const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        fileId = idMatch[1];
      }
    }
    if (fileId) {
      // /preview renders just the video player without Google Drive UI navigation
      return {
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        isYouTube: false,
        isDrive: true,
      };
    }
  }

  return { embedUrl: url, isYouTube: false, isDrive: false };
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  lesson,
  onClose,
  onStartQuiz,
}) => {
  const { currentStudent } = usePlatform();
  const [isMaximized, setIsMaximized] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  const [watermarkPos, setWatermarkPos] = useState({ top: 20, right: 20 });

  // Floating watermark for anti-piracy that moves randomly every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTop = Math.floor(Math.random() * 70) + 15;
      const randomRight = Math.floor(Math.random() * 70) + 10;
      setWatermarkPos({ top: randomTop, right: randomRight });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const { embedUrl, isYouTube, isDrive } = getSafeEmbedUrl(lesson.driveUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className={`relative w-full bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isMaximized
            ? 'h-[98vh] max-w-[98vw]'
            : 'max-w-5xl h-[88vh] max-h-[820px]'
        }`}
      >
        {/* Top Header Controls */}
        <div className="px-4 py-3 sm:px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <div className="truncate">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {lesson.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                الشعبة: {lesson.division} • المدة: {lesson.duration}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Start Quiz shortcut if available */}
            {onStartQuiz && (
              <button
                onClick={onStartQuiz}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
              >
                <FileQuestion className="w-4 h-4 text-cyan-300" />
                <span className="hidden sm:inline">بدء اختبار الحصة</span>
                <span className="sm:hidden">الاختبار</span>
              </button>
            )}

            {/* Maximize / Minimize button */}
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMaximized ? 'تصغير حجم المشغل' : 'تكبير حجم المشغل'}
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
              title="إغلاق المشغل"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Container */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden select-none">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={lesson.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="text-center p-6 text-slate-400">
              <Play className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p>رابط المحاضرة غير متوفر حالياً، يرجى مراجعة إدارة المنصة.</p>
            </div>
          )}

          {/* Floating Anti-Piracy Dynamic Watermark (Protection overlay) */}
          {currentStudent && (
            <div
              style={{
                top: `${watermarkPos.top}%`,
                right: `${watermarkPos.right}%`,
              }}
              className="absolute pointer-events-none transition-all duration-1000 ease-in-out px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-xs border border-white/10 text-white/40 text-[10px] font-mono flex items-center gap-1.5 shadow-lg select-none"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500/60" />
              <span>{currentStudent.fullName}</span>
              <span>•</span>
              <span>{currentStudent.phone}</span>
            </div>
          )}

          {/* Top header mask to block user from clicking Google Drive pop-out icon */}
          {isDrive && (
            <div
              className="absolute top-0 right-0 left-0 h-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto"
              title="مشغل د. أحمد سند المحمي"
            />
          )}
        </div>

        {/* Bottom Details Bar */}
        <div className="px-4 py-3 sm:px-6 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-200">
              واجهة تشغيل محمية لمنصة دكتور أحمد سند
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-cyan-400">
              ممنوع مشاركة الحساب أو إعادة البث
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
              كود الحصة: {lesson.code}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
              الرقم الثلاثي: {lesson.tripleNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
