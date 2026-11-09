import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatMRU } from '../../utils/academicUtils';
import {
  Users,
  CalendarCheck,
  CreditCard,
  AlertTriangle,
  Award,
  ArrowUpRight,
  PlusCircle,
  FileCheck,
  Receipt,
  GraduationCap,
  TrendingUp,
  Clock,
  Send,
  Building2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const DirectorDashboard: React.FC = () => {
  const {
    students,
    attendance,
    payments,
    expenses,
    announcements,
    classes,
    lang,
    t,
    setActiveTab,
    setSelectedBulletinStudentId,
    setSelectedReceiptId,
  } = useApp();

  // 1. Total students
  const totalStudentsCount = students.length;

  // 2. Today's attendance percentage
  const totalMarked = attendance.length;
  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const attendanceRate = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 94;

  // 3. Financial calculations in MRU
  const totalTuitionDue = students.reduce((sum, s) => sum + s.tuitionTotal, 0);
  const totalCollected = students.reduce((sum, s) => sum + s.tuitionPaid, 0);
  const totalArrears = Math.max(0, totalTuitionDue - totalCollected);
  const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  // 4. Distribution by Cycles
  const fundamentalStudents = students.filter((s) => s.cycle === 'fundamental').length;
  const collegeStudents = students.filter((s) => s.cycle === 'college').length;
  const lyceeStudents = students.filter((s) => s.cycle === 'lycee').length;

  return (
    <div className="space-y-6">
      {/* Header Greeting Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-teal-900 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{t.academicYear}: 2024 - 2025</span>
            <span>•</span>
            <span className="bg-emerald-700/80 px-2 py-0.5 rounded text-[11px] text-emerald-100 font-bold">
              {t.currentTrimestre}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {lang === 'ar' ? 'مرحباً بك في لوحة القيادة الإدارية والتربوية' : 'Tableau de Bord de Direction & Gestion'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl">
            {lang === 'ar'
              ? 'متابعة شاملة للمستويات التعليمية، رصد الفروض والتقويمات، تحصيل الرسوم بالأوقية MRU، واستخراج كشوف النقاط الرسمية.'
              : 'Supervision des cycles primaire, collège et lycée, saisie des devoirs, recouvrement en MRU et bulletins officiels.'}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('students')}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.addStudent}</span>
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-xs transition-colors cursor-pointer border border-white/20"
          >
            <Receipt className="w-4 h-4 text-amber-300" />
            <span>{t.recordPayment}</span>
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-xs transition-colors cursor-pointer border border-white/20"
          >
            <GraduationCap className="w-4 h-4 text-cyan-300" />
            <span>{t.enterGrades}</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600 text-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-emerald-500 text-xs font-bold">+12%</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 tracking-tight">
            {totalStudentsCount}
          </div>
          <div className="text-sm text-slate-500 mt-1">{t.totalStudents}</div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-50 p-2 rounded-lg text-amber-600 text-xl flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span className="text-slate-400 text-xs font-bold">94%</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 tracking-tight">
            {attendanceRate}%
          </div>
          <div className="text-sm text-slate-500 mt-1">{t.todayAttendance}</div>
        </div>

        {/* Financial Revenue (MRU) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 text-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-emerald-600 text-xs font-bold">
              {Math.round((totalCollected / (totalTuitionDue || 1)) * 100)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-800 tracking-tight">
            {formatMRU(totalCollected, lang)}
          </div>
          <div className="text-sm text-slate-500 mt-1">{t.financialRevenue}</div>
        </div>

        {/* Tuition Arrears / Alert */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-rose-50 p-2 rounded-lg text-rose-600 text-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-rose-600 text-xs font-bold">
              {lang === 'ar' ? 'عاجل' : 'Relances'}
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-800 tracking-tight">
            {formatMRU(totalArrears, lang)}
          </div>
          <div className="text-sm text-slate-500 mt-1">{t.tuitionArrears}</div>
        </div>
      </div>

      {/* Main Grid: Series distribution & Recent Financial Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (col-span-2): Series Distribution & Classrooms */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-slate-800 text-base">
              {lang === 'ar' ? 'توزيع التلاميذ حسب الشعب (الثانوي)' : 'Répartition des Élèves par Séries'}
            </h2>
            <button
              onClick={() => setActiveTab('students')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
            >
              {lang === 'ar' ? 'عرض الكل' : 'Voir tout'}
            </button>
          </div>

          <div className="p-6 flex-1 space-y-6">
            {/* Mauritanian Streams Progress Bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">
                    {lang === 'ar' ? 'شعبة العلوم الطبيعية (7D)' : 'Sciences Naturelles (Série D)'}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">
                    {students.filter((s) => s.classId === 'cls_7d1').length || 28}{' '}
                    {lang === 'ar' ? 'تلميذاً' : 'élèves'} (85%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[85%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">
                    {lang === 'ar' ? 'شعبة الرياضيات (7C)' : 'Mathématiques (Série C)'}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">
                    {students.filter((s) => s.classId === 'cls_7c').length || 24}{' '}
                    {lang === 'ar' ? 'تلميذاً' : 'élèves'} (40%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[40%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">
                    {lang === 'ar' ? 'شعبة الآداب العصرية (7LM)' : 'Lettres Modernes (Série LM)'}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">
                    {students.filter((s) => s.classId === 'cls_7lm').length || 31}{' '}
                    {lang === 'ar' ? 'تلميذاً' : 'élèves'} (60%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[60%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">
                    {lang === 'ar' ? 'شعبة الآداب الأصلية (7LO)' : 'Lettres Originelles (Série LO)'}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">
                    {students.filter((s) => s.classId === 'cls_7lo').length || 22}{' '}
                    {lang === 'ar' ? 'تلميذاً' : 'élèves'} (25%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[25%] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Active Classrooms Quick Row */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                {lang === 'ar' ? 'الأقسام الموريتانية النشطة والامتحانات الرسمية:' : 'Classes actives & examens d’État :'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {classes.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {c.code}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {lang === 'ar' ? c.nameAr : c.nameFr}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {c.studentsCount} {lang === 'ar' ? 'تلميذ' : 'élèves'} • {c.roomNumber}
                        </div>
                      </div>
                    </div>
                    {c.nationalExam && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                        {c.nationalExam}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right (col-span-1): Recent Financial Operations */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 text-base">
                {lang === 'ar' ? 'آخر العمليات المالية' : 'Dernières Opérations'}
              </h2>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                MRU
              </span>
            </div>

            <div className="divide-y divide-slate-100 px-5 max-h-[320px] overflow-y-auto">
              {payments.slice(0, 5).map((p) => (
                <div key={p.id} className="py-3.5 flex items-center justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {p.studentName}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {p.paymentType === 'tuition'
                        ? (lang === 'ar' ? 'قسط دراسي' : 'Frais de scolarité')
                        : (lang === 'ar' ? 'رسوم التسجيل' : 'Frais inscription')}{' '}
                      • {p.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-emerald-600 font-mono shrink-0">
                    +{formatMRU(p.amount, lang)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
            <button
              onClick={() => setActiveTab('finance')}
              className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-xs transition-colors cursor-pointer"
            >
              {lang === 'ar' ? 'تحميل التقرير المالي اليومي' : 'Télécharger le rapport financier'}
            </button>
            <button
              onClick={() => setSelectedBulletinStudentId('std_02')}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'ar' ? 'كشف نقاط فاطمة المختار (7D)' : 'Bulletin Fatimetou El Mokhtar'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sleek Announcement Banner */}
      {announcements.length > 0 && (
        <div className="bg-emerald-900 rounded-xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs border border-emerald-800">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-3xl sm:text-4xl bg-emerald-800/80 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0">
              📢
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {lang === 'ar' ? announcements[0].titleAr : announcements[0].titleFr}
                </h3>
                <span className="text-[10px] bg-emerald-700 text-emerald-100 px-2 py-0.5 rounded font-mono">
                  {announcements[0].date}
                </span>
              </div>
              <p className="text-emerald-200 text-xs sm:text-sm opacity-90 max-w-2xl leading-relaxed mt-0.5 line-clamp-2">
                {lang === 'ar' ? announcements[0].contentAr : announcements[0].contentFr}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('communication')}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            {lang === 'ar' ? 'إدارة التعاميم' : 'Gérer les circulaires'}
          </button>
        </div>
      )}
    </div>
  );
};
