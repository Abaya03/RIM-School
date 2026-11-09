import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  UserCheck,
  Database,
  Bell,
  MessageSquare,
  ChevronDown,
  Building2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    lang,
    setLang,
    role,
    setRole,
    schoolInfo,
    selectedTrimestre,
    setSelectedTrimestre,
    activeTab,
    setActiveTab,
    t,
  } = useApp();

  const rolesList: { id: UserRole; labelAr: string; labelFr: string; descAr: string; descFr: string }[] = [
    {
      id: 'director',
      labelAr: 'المدير العام',
      labelFr: 'Directeur Général',
      descAr: 'صلاحيات كاملة لكافة الوحدات',
      descFr: 'Accès complet à tous les modules',
    },
    {
      id: 'censeur',
      labelAr: 'الناظر العام / Censeur',
      labelFr: 'Censeur des Études',
      descAr: 'الانضباط والغياب والحضور',
      descFr: 'Discipline et assiduité',
    },
    {
      id: 'teacher',
      labelAr: 'أستاذ المادة',
      labelFr: 'Professeur',
      descAr: 'رصد الفروض والتقييم',
      descFr: 'Saisie des notes et appréciations',
    },
    {
      id: 'accountant',
      labelAr: 'المحاسب / الخازن',
      labelFr: 'Comptable Caissier',
      descAr: 'الرسوم والوصولات والمصاريف',
      descFr: 'Frais, reçus et dépenses',
    },
    {
      id: 'parent',
      labelAr: 'ولي أمر التلميذ',
      labelFr: 'Espace Parent',
      descAr: 'عرض النقاط والوصولات لابنه',
      descFr: 'Consultation notes et reçus',
    },
  ];

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return lang === 'ar'
          ? `الرئيسية - الثلاثي ${selectedTrimestre === 1 ? 'الأول' : selectedTrimestre === 2 ? 'الثاني' : 'الثالث'}`
          : `Tableau de Bord - ${selectedTrimestre}e Trimestre`;
      case 'students':
        return t.students;
      case 'grades':
        return t.gradesAndBulletins;
      case 'finance':
        return t.financeAndTuition;
      case 'attendance':
        return t.attendance;
      case 'teachers':
        return t.teachers;
      case 'communication':
        return lang === 'ar' ? 'التعاميم والتواصل' : 'Communications & Alertes';
      case 'calendar':
        return t.calendarAndExams;
      case 'settings':
        return lang === 'ar' ? 'إعدادات المؤسسة والهوية المدرسية' : "Paramètres & Identité de l'Établissement";
      case 'schema':
        return t.schemaAndArchitecture;
      default:
        return t.dashboard;
    }
  };

  return (
    <div className="no-print w-full flex flex-col shrink-0">
      {/* Top micro-bar with Mauritanian Republic Identity */}
      <div className="bg-emerald-900 text-emerald-100 text-[11px] py-1 px-4 sm:px-8 flex justify-between items-center border-b border-emerald-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-amber-400 text-emerald-950 font-bold text-[9px]">
            ★
          </span>
          <span className="font-medium tracking-wide">
            {lang === 'ar' ? 'الجمهورية الإسلامية الموريتانية • شرف - إخاء - عدل' : 'République Islamique de Mauritanie • Honneur - Fraternité - Justice'}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-emerald-200/90 text-[11px]">
          <span>{lang === 'ar' ? schoolInfo.drenAr : schoolInfo.drenFr}</span>
          <span>•</span>
          <span>{lang === 'ar' ? schoolInfo.wilayaAr : schoolInfo.wilayaFr}</span>
        </div>
      </div>

      {/* Main Sleek Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-30">
        {/* Left: Active Title & Academic Year Badge */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 truncate">
            {getActiveTabTitle()}
          </h1>
          <span className="hidden sm:inline-flex items-center bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium shrink-0">
            {lang === 'ar' ? `السنة الدراسية ${schoolInfo.currentYear}` : `Année Scolaire ${schoolInfo.currentYear}`}
          </span>
        </div>

        {/* Right: Controls & Sleek Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Trimestre Selector */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80 text-xs font-medium">
            <button
              onClick={() => setSelectedTrimestre(1)}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedTrimestre === 1
                  ? 'bg-white text-emerald-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'فصل 1' : 'T1'}
            </button>
            <button
              onClick={() => setSelectedTrimestre(2)}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedTrimestre === 2
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'فصل 2 (الحالي)' : 'T2 (Actuel)'}
            </button>
            <button
              onClick={() => setSelectedTrimestre(3)}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedTrimestre === 3
                  ? 'bg-white text-emerald-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'فصل 3' : 'T3'}
            </button>
          </div>

          {/* Language Switcher Pill */}
          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200/80">
            <button
              onClick={() => setLang('ar')}
              className={`px-3 py-1 text-xs sm:text-sm rounded-md font-medium transition-all cursor-pointer ${
                lang === 'ar'
                  ? 'bg-white shadow-xs font-bold text-slate-800'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              العربية
            </button>
            <button
              onClick={() => setLang('fr')}
              className={`px-3 py-1 text-xs sm:text-sm rounded-md font-medium transition-all cursor-pointer ${
                lang === 'fr'
                  ? 'bg-white shadow-xs font-bold text-slate-800'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Français
            </button>
          </div>

          {/* Role Switcher dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline font-bold text-slate-800">
                {lang === 'ar'
                  ? rolesList.find((r) => r.id === role)?.labelAr
                  : rolesList.find((r) => r.id === role)?.labelFr}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* Dropdown Menu */}
            <div className="absolute end-0 mt-1 w-60 bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 hidden group-hover:block transition-all z-50">
              <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {lang === 'ar' ? 'تبديل الدور لتجربة الصلاحيات:' : 'Changer de rôle pour tester :'}
              </div>
              {rolesList.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`w-full text-start px-2.5 py-2 rounded-lg text-xs flex flex-col gap-0.5 transition-colors cursor-pointer ${
                    role === r.id
                      ? 'bg-emerald-50 text-emerald-900 font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{lang === 'ar' ? r.labelAr : r.labelFr}</span>
                    {role === r.id && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {lang === 'ar' ? r.descAr : r.descFr}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Notification, Settings & Schema Circular Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center cursor-pointer transition-colors ${
                activeTab === 'settings'
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-emerald-700'
              }`}
              title={lang === 'ar' ? 'إعدادات ومعلومات المؤسسة' : "Paramètres de l'établissement"}
            >
              <Building2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('communication')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 cursor-pointer transition-colors relative"
              title={lang === 'ar' ? 'التعاميم والإشعارات' : 'Annonces & Notifications'}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-emerald-700 cursor-pointer transition-colors"
              title={lang === 'ar' ? 'مخطط قاعدة البيانات' : 'Architecture & Base de données'}
            >
              <Database className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
