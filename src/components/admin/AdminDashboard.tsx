import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { AccountsTab } from './AccountsTab';
import { ActivationTab } from './ActivationTab';
import { AddContentTab } from './AddContentTab';
import { QuizBuilderTab } from './QuizBuilderTab';
import { StudentGradesTab } from './StudentGradesTab';
import { CodesTab } from './CodesTab';
import { DeviceManagementTab } from './DeviceManagementTab';
import { SupervisorsTab } from './SupervisorsTab';
import { LogsTab } from './LogsTab';
import { JsonSyncTab } from './JsonSyncTab';
import {
  Users,
  UserCheck,
  PlusCircle,
  FileQuestion,
  Award,
  KeyRound,
  Smartphone,
  Shield,
  Activity,
  Database,
  ShieldCheck,
  LogOut,
  ChevronLeft,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentAdmin, logout, db } = usePlatform();
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<
    | 'accounts'
    | 'activation'
    | 'content'
    | 'quizzes'
    | 'grades'
    | 'codes'
    | 'devices'
    | 'supervisors'
    | 'logs'
    | 'json'
  >('accounts');

  const pendingCount = db.students.filter((s) => s.status === 'pending').length;

  const tabs = [
    {
      id: 'accounts',
      label: 'إدارة الحسابات',
      icon: <Users className="w-4 h-4" />,
      badge: db.students.length,
    },
    {
      id: 'activation',
      label: 'تفعيل الحسابات',
      icon: <UserCheck className="w-4 h-4" />,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-black animate-pulse',
    },
    {
      id: 'content',
      label: 'إضافة حصص وكتب',
      icon: <PlusCircle className="w-4 h-4" />,
    },
    {
      id: 'quizzes',
      label: 'إضافة اختبارات',
      icon: <FileQuestion className="w-4 h-4" />,
      badge: db.quizzes.length,
    },
    {
      id: 'grades',
      label: 'درجات الطلاب',
      icon: <Award className="w-4 h-4" />,
      badge: db.grades.length,
    },
    {
      id: 'codes',
      label: 'إدارة الأكواد',
      icon: <KeyRound className="w-4 h-4" />,
      badge: db.codes.length,
    },
    {
      id: 'devices',
      label: 'السماح للأجهزة',
      icon: <Smartphone className="w-4 h-4" />,
    },
    {
      id: 'supervisors',
      label: 'مشرفي اللوحة',
      icon: <Shield className="w-4 h-4" />,
      badge: (db.admins || []).length,
    },
    {
      id: 'logs',
      label: 'سجل اللوجات',
      icon: <Activity className="w-4 h-4" />,
      badge: db.logs.length,
    },
    {
      id: 'json',
      label: 'بيانات JSON والمزامنة',
      icon: <Database className="w-4 h-4" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Top Admin Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 mb-8 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                لوحة الإدارة والتحكم الشاملة
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {currentAdmin?.name || 'المشرف'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              إدارة كاملة لمنصة د. أحمد سند للفيزياء • مراجعة الحسابات، الأكواد، الاختبارات، والأجهزة
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>خروج المشرف</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeAdminSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== null && tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    tab.badgeColor || (isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-300')
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Component */}
      <div className="min-h-[500px]">
        {activeAdminSubTab === 'accounts' && <AccountsTab />}
        {activeAdminSubTab === 'activation' && <ActivationTab />}
        {activeAdminSubTab === 'content' && <AddContentTab />}
        {activeAdminSubTab === 'quizzes' && <QuizBuilderTab />}
        {activeAdminSubTab === 'grades' && <StudentGradesTab />}
        {activeAdminSubTab === 'codes' && <CodesTab />}
        {activeAdminSubTab === 'devices' && <DeviceManagementTab />}
        {activeAdminSubTab === 'supervisors' && <SupervisorsTab />}
        {activeAdminSubTab === 'logs' && <LogsTab />}
        {activeAdminSubTab === 'json' && <JsonSyncTab />}
      </div>
    </div>
  );
};
