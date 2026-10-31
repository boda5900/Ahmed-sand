import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { Lesson, Book } from '../../types/platform';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Video,
  BookOpen,
  PlusCircle,
  KeyRound,
  Hash,
  Layers,
  Link,
  Trash2,
  Clock,
  ExternalLink,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export const AddContentTab: React.FC = () => {
  const { db, addLesson, deleteLesson, addBook, deleteBook } = usePlatform();

  // Confirm delete states
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  // Model 1: Add Lesson State
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonCode, setLessonCode] = useState('');
  const [lessonTripleNumber, setLessonTripleNumber] = useState('');
  const [lessonDivision, setLessonDivision] = useState('');
  const [lessonDriveUrl, setLessonDriveUrl] = useState('');
  const [lessonDuration, setLessonDuration] = useState('50 دقيقة');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonError, setLessonError] = useState('');

  // Model 2: Add PDF Book State
  const [bookTitle, setBookTitle] = useState('');
  const [bookCode, setBookCode] = useState('');
  const [bookTripleNumber, setBookTripleNumber] = useState('');
  const [bookDivision, setBookDivision] = useState('');
  const [bookDriveUrl, setBookDriveUrl] = useState('');
  const [bookPages, setBookPages] = useState('45 صفحة');
  const [bookDescription, setBookDescription] = useState('');
  const [bookError, setBookError] = useState('');

  const handleAddLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLessonError('');

    if (
      !lessonTitle.trim() ||
      !lessonCode.trim() ||
      !lessonTripleNumber.trim() ||
      !lessonDivision.trim() ||
      !lessonDriveUrl.trim()
    ) {
      setLessonError('يرجى ملء جميع خانات الحصة بدقة (اسم الحصة، الكود، الرقم الثلاثي، الشعبة، ولينك الفيديو).');
      return;
    }

    // Check if code already exists
    if (db.codes.some((c) => c.code.toUpperCase() === lessonCode.trim().toUpperCase())) {
      setLessonError('رقم الكود هذا مستخدم بالفعل في كود آخر! يرجى اختيار كود فريد.');
      return;
    }

    addLesson({
      title: lessonTitle.trim(),
      code: lessonCode.trim().toUpperCase(),
      tripleNumber: lessonTripleNumber.trim(),
      division: lessonDivision.trim(),
      driveUrl: lessonDriveUrl.trim(),
      duration: lessonDuration.trim(),
      description: lessonDescription.trim(),
    });

    // Reset form
    setLessonTitle('');
    setLessonCode('');
    setLessonTripleNumber('');
    setLessonDivision('');
    setLessonDriveUrl('');
    setLessonDescription('');
  };

  const handleAddBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookError('');

    if (
      !bookTitle.trim() ||
      !bookCode.trim() ||
      !bookTripleNumber.trim() ||
      !bookDivision.trim() ||
      !bookDriveUrl.trim()
    ) {
      setBookError('يرجى ملء جميع خانات الكتاب بدقة (اسم الكتاب، الكود، الرقم الثلاثي، الشعبة، ولينك الـ PDF).');
      return;
    }

    if (db.codes.some((c) => c.code.toUpperCase() === bookCode.trim().toUpperCase())) {
      setBookError('رقم الكود مستخدم بالفعل! اختر كود فريد للكتاب.');
      return;
    }

    addBook({
      title: bookTitle.trim(),
      code: bookCode.trim().toUpperCase(),
      tripleNumber: bookTripleNumber.trim(),
      division: bookDivision.trim(),
      driveUrl: bookDriveUrl.trim(),
      pages: bookPages.trim(),
      description: bookDescription.trim(),
    });

    setBookTitle('');
    setBookCode('');
    setBookTripleNumber('');
    setBookDivision('');
    setBookDriveUrl('');
    setBookDescription('');
  };

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-blue-400" />
          <span>إضافة حصص وكتب PDF جديدة</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          إدراج المحاضرات ومذكرات الـ PDF مع ربطها بالأكواد والأرقام الثلاثية والشعب
        </p>
      </div>

      {/* The Two Distinct Forms Side by Side (النموذج الأول والنموذج الثاني) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* النموذج الأول: إضافة حصص */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-blue-500/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">
                  النموذج الأول: إضافة حصة جديدة
                </h4>
                <p className="text-xs text-slate-400">
                  ربط فيديو جوجل درايف أو يوتيوب بكود ورقم ثلاثي وشعبة
                </p>
              </div>
            </div>

            {lessonError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{lessonError}</span>
              </div>
            )}

            <form onSubmit={handleAddLessonSubmit} className="space-y-3.5 text-xs">
              {/* 1. اسم الحصة */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  اسم الحصة والموضوع <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="مثال: الحصة 4: الحث الكهرومغناطيسي وقاعدة لينز"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 2. رقم الكود */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    رقم الكود <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={lessonCode}
                      onChange={(e) => setLessonCode(e.target.value.toUpperCase())}
                      placeholder="PHYS-XXXX"
                      dir="ltr"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase text-right pl-8"
                    />
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. الرقم الثلاثي (في خانة منفصلة كما طلب المستخدم) */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    الرقم الثلاثي <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={lessonTripleNumber}
                      onChange={(e) => setLessonTripleNumber(e.target.value)}
                      placeholder="مثال: 530"
                      maxLength={5}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-right pl-8"
                    />
                    <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 4. الشعبة (في خانة منفصلة كتابة) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    الشعبة (كتابة) <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={lessonDivision}
                    onChange={(e) => setLessonDivision(e.target.value)}
                    placeholder="اكتب اسم الشعبة..."
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    مدة الحصة التقريبية:
                  </label>
                  <input
                    type="text"
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(e.target.value)}
                    placeholder="مثال: 55 دقيقة"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* 5. لينك المحاضرة (جوجل درايف أو يوتيوب) */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  لينك المحاضرة (جوجل درايف أو يوتيوب) <span className="text-blue-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={lessonDriveUrl}
                    onChange={(e) => setLessonDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... أو رابط يوتيوب"
                    dir="ltr"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs pl-8 text-right"
                  />
                  <Link className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  سيتم تشغيل الفيديو عبر واجهة المنصة المحمية المخصصة لمنع نسخ الرابط.
                </p>
              </div>

              {/* وصف إضافي */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  وصف ومحتويات الحصة:
                </label>
                <textarea
                  rows={2}
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                  placeholder="أهم النقاط والقوانين المغطاة في المحاضرة..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>حفظ وإضافة الحصة وتوليد الكود</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* النموذج الثاني: إضافة كتاب PDF */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">
                  النموذج الثاني: إضافة كتاب PDF
                </h4>
                <p className="text-xs text-slate-400">
                  إدراج مذكرات الشرح وتجميعات الأسئلة الوزارية بصيغة PDF
                </p>
              </div>
            </div>

            {bookError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookError}</span>
              </div>
            )}

            <form onSubmit={handleAddBookSubmit} className="space-y-3.5 text-xs">
              {/* 1. اسم الكتاب */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  اسم الكتاب أو المذكرة <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="مثال: مذكرة مراجعة ليلة الامتحان في الفيزياء الحديثة"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* 2. رقم الكود و 3. الرقم الثلاثي */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    رقم الكود <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bookCode}
                      onChange={(e) => setBookCode(e.target.value.toUpperCase())}
                      placeholder="BOOK-XXXX"
                      dir="ltr"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase text-right pl-8"
                    />
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    الرقم الثلاثي <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bookTripleNumber}
                      onChange={(e) => setBookTripleNumber(e.target.value)}
                      placeholder="مثال: 610"
                      maxLength={5}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-right pl-8"
                    />
                    <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 4. الشعبة وعدد الصفحات */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    الشعبة (كتابة) <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={bookDivision}
                    onChange={(e) => setBookDivision(e.target.value)}
                    placeholder="اكتب اسم الشعبة..."
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    عدد الصفحات:
                  </label>
                  <input
                    type="text"
                    value={bookPages}
                    onChange={(e) => setBookPages(e.target.value)}
                    placeholder="مثال: 60 صفحة"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* 5. لينك الكتاب (جوجل درايف) */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  لينك الكتاب PDF (جوجل درايف) <span className="text-indigo-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={bookDriveUrl}
                    onChange={(e) => setBookDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../preview"
                    dir="ltr"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs pl-8 text-right"
                  />
                  <Link className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* وصف الكتاب */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  نبذة عن الكتاب:
                </label>
                <textarea
                  rows={2}
                  value={bookDescription}
                  onChange={(e) => setBookDescription(e.target.value)}
                  placeholder="ملاحظات وتوجيهات د. أحمد سند للطلاب حول هذه المذكرة..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>حفظ وإضافة الكتاب PDF وتوليد الكود</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* List of Existing Lessons and Books */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-slate-800">
        {/* Existing Lessons */}
        <div>
          <h4 className="font-bold text-sm text-white mb-3 flex items-center justify-between">
            <span>الحصص المتاحة حالياً ({db.lessons.length})</span>
          </h4>
          <div className="space-y-2.5">
            {db.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h5 className="font-bold text-white text-xs">{lesson.title}</h5>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    كود: <span className="text-cyan-400 font-bold">{lesson.code}</span> •
                    ثلاثي: <span className="text-amber-400 font-bold">{lesson.tripleNumber}</span> •
                    شعبة: {lesson.division}
                  </div>
                </div>

                <button
                  onClick={() => setLessonToDelete(lesson)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="حذف الحصة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Books */}
        <div>
          <h4 className="font-bold text-sm text-white mb-3 flex items-center justify-between">
            <span>الكتب والمذكرات المتاحة حالياً ({db.books.length})</span>
          </h4>
          <div className="space-y-2.5">
            {db.books.map((book) => (
              <div
                key={book.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h5 className="font-bold text-white text-xs">{book.title}</h5>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    كود: <span className="text-indigo-400 font-bold">{book.code}</span> •
                    ثلاثي: <span className="text-amber-400 font-bold">{book.tripleNumber}</span> •
                    شعبة: {book.division}
                  </div>
                </div>

                <button
                  onClick={() => setBookToDelete(book)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="حذف الكتاب"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal تأكيد حذف الحصة */}
      <ConfirmModal
        isOpen={lessonToDelete !== null}
        title="تأكيد حذف الحصة"
        message={`هل أنت متأكد من حذف الحصة "${lessonToDelete?.title || ''}"؟ سيتم حذفها مع كودها ورابطها من قاعدة البيانات.`}
        confirmText="نعم، احذف الحصة"
        onConfirm={() => {
          if (lessonToDelete) {
            deleteLesson(lessonToDelete.id);
            setLessonToDelete(null);
          }
        }}
        onCancel={() => setLessonToDelete(null)}
      />

      {/* Modal تأكيد حذف الكتاب */}
      <ConfirmModal
        isOpen={bookToDelete !== null}
        title="تأكيد حذف الكتاب PDF"
        message={`هل أنت متأكد من حذف كتاب "${bookToDelete?.title || ''}"؟`}
        confirmText="نعم، احذف الكتاب"
        onConfirm={() => {
          if (bookToDelete) {
            deleteBook(bookToDelete.id);
            setBookToDelete(null);
          }
        }}
        onCancel={() => setBookToDelete(null)}
      />
    </div>
  );
};
