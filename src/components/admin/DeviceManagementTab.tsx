import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Laptop,
  Check,
  X,
  Clock,
} from 'lucide-react';

export const DeviceManagementTab: React.FC = () => {
  const {
    db,
    toggleAllowOtherDevices,
    approveDeviceForStudent,
  } = usePlatform();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-indigo-400" />
          <span>السماح للأجهزة الأخرى وإدارة بصمة الأجهزة</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          حماية الحسابات من المشاركة: قصر الدخول على جهاز واحد مع إمكانية السماح للأجهزة الأخرى أو اعتماد أجهزة جديدة بعد موافقة الإدارة
        </p>
      </div>

      {/* Students Device Rules Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white">
            قائمة الطلاب وسياسة الأجهزة المعتمدة
          </span>
          <span className="text-[11px] text-slate-400">
            مفعل بشكل افتراضي للحماية ضد مشاركة الحسابات
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-4">اسم الطالب</th>
                <th className="py-3.5 px-4">الهاتف</th>
                <th className="py-3.5 px-4">معرف الجهاز الأساسي</th>
                <th className="py-3.5 px-4">السماح لأجهزة أخرى (مباشر)</th>
                <th className="py-3.5 px-4">محاولات الدخول من أجهزة جديدة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {db.students.map((student) => {
                const pendingDevices = (student.deviceLogs || []).filter(
                  (d) => !d.approved && d.deviceId !== student.deviceId
                );

                return (
                  <tr key={student.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {student.fullName}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300" dir="ltr">
                      {student.phone}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-cyan-400 text-[11px]">
                      {student.deviceId?.slice(0, 16) || 'جهاز مسجل'}...
                    </td>

                    {/* خانة السماح للأجهزة الأخرى */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            toggleAllowOtherDevices(student.id, !student.allowOtherDevices)
                          }
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            student.allowOtherDevices ? 'bg-emerald-600' : 'bg-slate-800'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              student.allowOtherDevices ? '-translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span
                          className={`text-xs font-bold ${
                            student.allowOtherDevices
                              ? 'text-emerald-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {student.allowOtherDevices ? 'مسموح بالدخول' : 'ممنوع (جهاز واحد فقط)'}
                        </span>
                      </div>
                    </td>

                    {/* الأجهزة الجديدة المنتظرة للموافقة */}
                    <td className="py-3.5 px-4">
                      {pendingDevices.length === 0 ? (
                        <span className="text-slate-500 text-[11px]">
                          لا توجد طلبات أجهزة معلقة
                        </span>
                      ) : (
                        <div className="space-y-1.5">
                          {pendingDevices.map((d, i) => (
                            <div
                              key={i}
                              className="p-2 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between gap-2"
                            >
                              <div>
                                <span className="font-mono text-[10px] text-amber-300 block">
                                  جهاز: {d.deviceId.slice(0, 10)}...
                                </span>
                                <span className="text-[10px] text-slate-400" dir="ltr">
                                  {d.timestamp}
                                </span>
                              </div>

                              <button
                                onClick={() =>
                                  approveDeviceForStudent(student.id, d.deviceId)
                                }
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>موافقة واعتماد</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
