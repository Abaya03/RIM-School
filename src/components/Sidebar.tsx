import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Wallet,
  CalendarCheck,
  UserSquare2,
  Calendar,
  Database,
  Megaphone,
  Building2,
  Layers,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, role, lang, schoolInfo, t } = useApp();

  // Navigation tabs with role permission filters
  const navItems = [
    {
      id: 'dashboard',
      label: t.dashboard,
      icon: LayoutDashboard,
      emoji: '📊',
      roles: ['director', 'censeur', 'teacher', 'accountant', 'parent'],
    },
    {
      id: 'students',
      label: t.students,
      icon: Users,
      emoji: '🎓',
      roles: ['director', 'censeur', 'accountant'],
    },
    {
      id: 'grades',
      label: t.gradesAndBulletins,
      icon: GraduationCap,
      emoji: '📝',
      badge: lang === 'ar' ? 'كشوف ونقاط' : '20/20',
      roles: ['director', 'censeur', 'teacher', 'accountant', 'parent'],
    },
    {
      id: 'finance',
      label: t.financeAndTuition,
      icon: Wallet,
      emoji: '💰',
      badge: 'MRU',
      roles: ['director', 'accountant', 'parent'],
    },
    {
      id: 'attendance',
      label: t.attendance,
      icon: CalendarCheck,
      emoji: '⏱️',
      roles: ['director', 'censeur', 'teacher', 'parent'],
    },
    {
      id: 'teachers',
      label: t.teachers,
      icon: UserSquare2,
      emoji: '👨‍🏫',
      roles: ['director', 'censeur'],
    },
    {
      id: 'academic',
      label: t.academicStructure || (lang === 'ar' ? 'الأطوار والأقسام والمواد' : 'Structure Pédagogique'),
      icon: Layers,
      emoji: '📚',
      badge: lang === 'ar' ? 'بيداغوجي' : 'Pédago',
      roles: ['director', 'censeur', 'teacher'],
    },
    {
      id: 'communication',
      label: lang === 'ar' ? 'التعاميم والتواصل' : 'Communications',
      icon: Megaphone,
      emoji: '📢',
      roles: ['director', 'censeur', 'teacher', 'parent'],
    },
    {
      id: 'calendar',
      label: t.calendarAndExams,
      icon: Calendar,
      emoji: '📅',
      roles: ['director', 'censeur', 'teacher', 'parent'],
    },
    {
      id: 'settings',
      label: lang === 'ar' ? 'إعدادات المؤسسة' : 'Paramètres Établissement',
      icon: Building2,
      emoji: '🏛️',
      badge: lang === 'ar' ? 'عام' : 'Info',
      roles: ['director', 'censeur', 'accountant'],
    },
    {
      id: 'schema',
      label: t.schemaAndArchitecture,
      icon: Database,
      emoji: '⚙️',
      badge: 'SQL',
      roles: ['director', 'censeur', 'teacher', 'accountant'],
    },
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(role));

  const roleLabels: Record<string, { ar: string; fr: string }> = {
    director: { ar: 'مدير المؤسسة', fr: 'Directeur Général' },
    censeur: { ar: 'ناظر الدروس', fr: 'Censeur des Études' },
    teacher: { ar: 'أستاذ المادة', fr: 'Professeur' },
    accountant: { ar: 'المحاسب المالي', fr: 'Comptable Caissier' },
    parent: { ar: 'ولي أمر التلميذ', fr: 'Espace Parent' },
  };

  const userRoleDisplay = roleLabels[role] || { ar: 'المستخدم', fr: 'Utilisateur' };

  return (
    <aside className="no-print w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0 border-b md:border-b-0 md:border-e border-slate-800 md:min-h-screen">
      {/* Brand Header */}
      <div className="p-5 sm:p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-xs shrink-0 overflow-hidden p-1 border border-emerald-500/40">
          {schoolInfo.logoUrl ? (
            <img src={schoolInfo.logoUrl} alt="Logo" className="w-full h-full object-contain" />
          ) : (
            <span className="font-serif">م</span>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-base sm:text-lg font-bold leading-tight text-white truncate">
            {lang === 'ar' ? schoolInfo.nameAr : schoolInfo.nameFr}
          </span>
          <span className="text-xs text-slate-400 truncate">
            {lang === 'ar' ? (schoolInfo.mottoAr ? schoolInfo.mottoAr.slice(0, 26) : 'إدارة التعليم الموريتاني') : (schoolInfo.mottoFr || 'Gestion Scolaire RIM')}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-3 px-2 md:py-4 md:px-3 gap-1.5 md:gap-1 overflow-x-auto md:overflow-y-auto flex md:flex-col scrollbar-thin">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-auto md:w-full shrink-0 md:shrink flex items-center justify-between gap-2.5 md:gap-3 px-3.5 py-2 md:py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base shrink-0">{item.emoji}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                    isActive
                      ? 'bg-emerald-700 text-emerald-100'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mauritanian Exam Countdown Widget (Desktop) */}
      <div className="hidden md:block mx-3 mb-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800/80 text-xs">
        <div className="flex items-center justify-between text-slate-300 font-bold mb-2">
          <span className="text-[11px] text-emerald-400">
            {lang === 'ar' ? 'امتحانات 2025' : 'Examens 2025'}
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
            MEN RIM
          </span>
        </div>
        <div className="space-y-1 text-[10px] text-slate-400">
          <div className="flex justify-between items-center">
            <span>{lang === 'ar' ? 'مسابقة (CEP)' : 'Concours (CEP)'}</span>
            <span className="font-semibold text-slate-300">16 {lang === 'ar' ? 'يونيو' : 'Juin'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>{lang === 'ar' ? 'إعدادية (BEPC)' : 'Brevet (BEPC)'}</span>
            <span className="font-semibold text-slate-300">18 {lang === 'ar' ? 'يونيو' : 'Juin'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>{lang === 'ar' ? 'بكالوريا (BAC)' : 'Baccalauréat'}</span>
            <span className="font-semibold text-emerald-400">30 {lang === 'ar' ? 'يونيو' : 'Juin'}</span>
          </div>
        </div>
      </div>

      {/* User Profile Card at Bottom */}
      <div className="p-4 border-t border-slate-800 mt-auto">
        <div className="flex items-center gap-3 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-600">
            {role === 'director' ? 'د' : role === 'teacher' ? 'أ' : 'م'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-slate-200 truncate">
              {lang === 'ar' ? userRoleDisplay.ar : userRoleDisplay.fr}
            </span>
            <span className="text-[10px] text-slate-400 truncate">
              {lang === 'ar' ? 'مؤسسة التميز • تفرغ زينة' : 'Complexe Excellence • TVZ'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
