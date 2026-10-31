import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  FileCode,
  Download,
  Upload,
  Copy,
  Check,
  RotateCcw,
  Globe,
  Share2,
  Database,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const JsonSyncTab: React.FC = () => {
  const {
    db,
    exportDatabaseJson,
    importDatabaseJson,
    resetToDefaultData,
    clearAllDatabaseData,
    loadSampleDemoData,
    addToast,
  } = usePlatform();

  const [inputJson, setInputJson] = useState('');
  const [remoteUrl, setRemoteUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmAction, setConfirmAction] = useState<'clear' | 'demo' | null>(null);

  const currentJsonString = exportDatabaseJson();

  const handleCopyJson = () => {
    navigator.clipboard.writeText(currentJsonString);
    setCopied(true);
    addToast({
      type: 'success',
      title: 'تم نسخ ملف البيانات JSON',
      message: 'يمكنك الآن لصقه ورفعه على أي خدمة مثل JSONBin أو ملف مستقل.',
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([currentJsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dr_ahmed_sanad_database_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'تم تنزيل ملف JSON بنجاح',
      message: 'تم حفظ نسخة احتياطية من قاعدة البيانات بالكامل على جهازك.',
    });
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!inputJson.trim()) {
      setErrorMsg('يرجى لصق كود JSON أولاً للاستيراد.');
      return;
    }

    const res = importDatabaseJson(inputJson);
    if (!res.success) {
      setErrorMsg(res.error || 'فشل استيراد ملف JSON.');
    } else {
      setInputJson('');
    }
  };

  const handleFetchRemote = async () => {
    if (!remoteUrl.trim()) {
      setErrorMsg('يرجى كتابة رابط JSON السحابي (URL)');
      return;
    }

    setErrorMsg('');
    setRemoteLoading(true);

    try {
      const response = await fetch(remoteUrl.trim());
      if (!response.ok) {
        throw new Error(`خطأ في جلب البيانات: ${response.statusText}`);
      }
      const data = await response.json();
      const stringified = JSON.stringify(data);
      const res = importDatabaseJson(stringified);
      if (!res.success) {
        setErrorMsg(res.error || 'البيانات المستلمة من الرابط غير صالحة.');
      } else {
        addToast({
          type: 'success',
          title: 'تمت المزامنة السحابية بنجاح!',
          message: 'تم تحديث قاعدة بيانات المنصة من الرابط السحابي المباشر.',
        });
      }
    } catch (err: any) {
      setErrorMsg('فشل الاتصال بالرابط: ' + (err.message || 'تأكد من تفعيل CORS أو صحة الرابط'));
    } finally {
      setRemoteLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <span>مركز بيانات JSON والمزامنة المشتركة بين الأجهزة</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          تصدير ملف قاعدة البيانات JSON لرفعه على السحابة (JSONBin) أو استيراده لمشاركة البيانات بين أجهزة متعددة
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Export JSON Button */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm mb-1">تنزيل ملف JSON</h4>
            <p className="text-xs text-slate-400 mb-4">
              احفظ نسخة كاملة من قاعدة بيانات المنصة في ملف JSON مستقل على جهازك.
            </p>
          </div>
          <button
            onClick={handleDownloadFile}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل dr_sanad_database.json</span>
          </button>
        </div>

        {/* Copy to Clipboard */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3">
              <Copy className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm mb-1">نسخ كود JSON</h4>
            <p className="text-xs text-slate-400 mb-4">
              انسخ نص الـ JSON كاملاً بنقرة واحدة لرفعه على أي موقع أو خدمة سيرفر خارجي.
            </p>
          </div>
          <button
            onClick={handleCopyJson}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">تم النسخ للحافظة!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-cyan-400" />
                <span>نسخ نص الـ JSON</span>
              </>
            )}
          </button>
        </div>

        {/* Make Platform Clean & Empty (المنصة الجديدة فارغة بيانات كما طلب المستخدم) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm mb-1">تفريغ المنصة بالكامل (فارغة)</h4>
            <p className="text-xs text-slate-400 mb-4">
              تصفير كافة الحسابات والحصص والأكواد لتصبح المنصة نظيفة تماماً وجديدة لملئها بنفسك.
            </p>
          </div>
          <button
            onClick={() => setConfirmAction('clear')}
            className="w-full py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>تفريغ المنصة كلياً (فارغة)</span>
          </button>
        </div>

        {/* Load Sample Demo Data */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm mb-1">تحميل بيانات استرشادية</h4>
            <p className="text-xs text-slate-400 mb-4">
              تحميل نموذج استرشادي يوضح شكل الحصص والمذكرات والاختبارات والأكواد.
            </p>
          </div>
          <button
            onClick={() => setConfirmAction('demo')}
            className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>تحميل بيانات استرشادية</span>
          </button>
        </div>
      </div>

      {/* Import / Paste JSON Section */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-emerald-400" />
          <span>استيراد وتحديث قاعدة البيانات من كود JSON</span>
        </h4>

        <form onSubmit={handleImportSubmit} className="space-y-3">
          <textarea
            rows={5}
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="الصق كود JSON هنا لتحديث كافة بيانات المنصة والحسابات فوراً..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-cyan-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
            dir="ltr"
          />

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>تطبيق واستيراد البيانات الآن</span>
          </button>
        </form>
      </div>

      {/* Cloud Remote Sync URL */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>مزامنة سحابية عبر رابط مباشر (JSONBin / Gist / API)</span>
        </h4>
        <p className="text-xs text-slate-400">
          إذا رفعت ملف الـ JSON على رابط مباشر، يمكنك جلبه بضغطة زر لمزامنة المنصة بين عدة أشخاص وأجهزة:
        </p>

        <div className="flex gap-2">
          <input
            type="url"
            value={remoteUrl}
            onChange={(e) => setRemoteUrl(e.target.value)}
            placeholder="مثال: https://api.jsonbin.io/v3/b/... أو https://raw.githubusercontent.com/..."
            dir="ltr"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder:text-slate-600 font-mono"
          />
          <button
            type="button"
            disabled={remoteLoading}
            onClick={handleFetchRemote}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Globe className="w-4 h-4" />
            <span>{remoteLoading ? 'جارٍ الجلب...' : 'جلب ومزامنة'}</span>
          </button>
        </div>
      </div>

      {/* Preview of Current Database JSON */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">
            معاينة حية لبيانات المنصة الحالية (JSON Preview):
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            الحجم: {(currentJsonString.length / 1024).toFixed(1)} KB
          </span>
        </div>

        <pre
          className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] font-mono text-slate-300 max-h-60 overflow-y-auto leading-relaxed select-all"
          dir="ltr"
        >
          {currentJsonString.slice(0, 3000)}
          {currentJsonString.length > 3000 && '\n... [باقي البيانات موجودة في الملف المحمّل بالكامل]'}
        </pre>
      </div>

      {/* Confirm Clear Platform Modal */}
      <ConfirmModal
        isOpen={confirmAction === 'clear'}
        title="تأكيد تفريغ المنصة بالكامل"
        message="هل أنت متأكد من تفريغ كافة بيانات المنصة لتصبح فارغة تماماً ونظيفة لملئها ببياناتك الجديدة؟"
        confirmText="نعم، افرغ المنصة"
        onConfirm={() => {
          clearAllDatabaseData();
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />

      {/* Confirm Load Demo Data Modal */}
      <ConfirmModal
        isOpen={confirmAction === 'demo'}
        title="تأكيد تحميل البيانات الاسترشادية"
        message="هل ترغب في تحميل البيانات النموذجية لمعاينة عمل المنصة (حصص، كتب، طلاب، واختبارات تجريبية)؟"
        confirmText="نعم، حمّل البيانات الاسترشادية"
        isDestructive={false}
        onConfirm={() => {
          loadSampleDemoData();
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
};
