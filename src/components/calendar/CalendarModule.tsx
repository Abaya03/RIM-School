import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExamScheduleItem, SchoolHolidayItem, TimetableEntry } from '../../types';
import {
  CalendarDays,
  Award,
  GraduationCap,
  Clock,
  Flag,
  BookOpen,
  PlusCircle,
  Edit3,
  Trash2,
  RotateCcw,
  Printer,
  CalendarCheck,
  Layers,
  Sparkles,
  AlertCircle,
  Calendar as CalendarIcon,
} from 'lucide-react';

export const CalendarModule: React.FC = () => {
  const {
    lang,
    t,
    classes,
    exams,
    addExam,
    updateExam,
    deleteExam,
    resetExams,
    holidays,
    addHoliday,
    updateHoliday,
    deleteHoliday,
    resetHolidays,
    timetables,
    updateTimetableRow,
    resetTimetables,
    schoolInfo,
    showToast,
  } = useApp();

  // Active section tab inside Calendar
  const [activeSection, setActiveSection] = useState<'all' | 'exams' | 'holidays' | 'timetable'>('all');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls_7d1');

  // Modals state for Exams
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamScheduleItem | null>(null);
  const [deletingExamId, setDeletingExamId] = useState<string | null>(null);

  // Exam Form State
  const [examTitleAr, setExamTitleAr] = useState('');
  const [examTitleFr, setExamTitleFr] = useState('');
  const [examDates, setExamDates] = useState('');
  const [examTarget, setExamTarget] = useState('');
  const [examBadge, setExamBadge] = useState('');
  const [examColor, setExamColor] = useState<ExamScheduleItem['color']>('emerald');
  const [examIsNational, setExamIsNational] = useState(true);
  const [examNotes, setExamNotes] = useState('');

  // Modals state for Holidays
  const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<SchoolHolidayItem | null>(null);
  const [deletingHolidayId, setDeletingHolidayId] = useState<string | null>(null);

  // Holiday Form State
  const [holNameAr, setHolNameAr] = useState('');
  const [holNameFr, setHolNameFr] = useState('');
  const [holDate, setHolDate] = useState('');
  const [holType, setHolType] = useState<SchoolHolidayItem['type']>('national');
  const [holDaysCount, setHolDaysCount] = useState(1);

  // Modals state for Timetable Row Editing
  const [editingTimetableDay, setEditingTimetableDay] = useState<TimetableEntry | null>(null);
  const [period1, setPeriod1] = useState('');
  const [period2, setPeriod2] = useState('');
  const [period3, setPeriod3] = useState('');
  const [period4, setPeriod4] = useState('');

  // Current class timetables
  const currentClassTimetable: TimetableEntry[] =
    timetables[selectedClassId] || timetables['cls_7d1'] || [];

  const selectedClassObj = classes.find((c) => c.id === selectedClassId) || classes[0];

  // --- Handlers for Exams ---
  const handleOpenAddExamModal = () => {
    setExamTitleAr('');
    setExamTitleFr('');
    setExamDates('');
    setExamTarget('');
    setExamBadge(lang === 'ar' ? 'امتحان موحد' : 'Épreuve officielle');
    setExamColor('emerald');
    setExamIsNational(true);
    setExamNotes('');
    setIsAddExamModalOpen(true);
  };

  const handleOpenEditExamModal = (exam: ExamScheduleItem) => {
    setEditingExam(exam);
    setExamTitleAr(exam.titleAr);
    setExamTitleFr(exam.titleFr);
    setExamDates(exam.dates);
    setExamTarget(exam.target);
    setExamBadge(exam.badge);
    setExamColor(exam.color);
    setExamIsNational(exam.isNational);
    setExamNotes(exam.notes || '');
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitleAr.trim() || !examDates.trim()) return;

    addExam({
      titleAr: examTitleAr.trim(),
      titleFr: examTitleFr.trim() || examTitleAr.trim(),
      dates: examDates.trim(),
      target: examTarget.trim() || (lang === 'ar' ? 'كافة الفصول المعنية' : 'Classes concernées'),
      badge: examBadge.trim() || (examIsNational ? 'امتحان وطني' : 'تقييم داخلي'),
      color: examColor,
      isNational: examIsNational,
      notes: examNotes.trim(),
    });

    setIsAddExamModalOpen(false);
  };

  const handleSaveEditExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExam || !examTitleAr.trim() || !examDates.trim()) return;

    updateExam(editingExam.id, {
      titleAr: examTitleAr.trim(),
      titleFr: examTitleFr.trim() || examTitleAr.trim(),
      dates: examDates.trim(),
      target: examTarget.trim(),
      badge: examBadge.trim(),
      color: examColor,
      isNational: examIsNational,
      notes: examNotes.trim(),
    });

    setEditingExam(null);
  };

  const handleConfirmDeleteExam = (id: string) => {
    deleteExam(id);
    setDeletingExamId(null);
  };

  // --- Handlers for Holidays ---
  const handleOpenAddHolidayModal = () => {
    setHolNameAr('');
    setHolNameFr('');
    setHolDate('');
    setHolType('school_vacation');
    setHolDaysCount(1);
    setIsAddHolidayModalOpen(true);
  };

  const handleOpenEditHolidayModal = (hol: SchoolHolidayItem) => {
    setEditingHoliday(hol);
    setHolNameAr(hol.nameAr);
    setHolNameFr(hol.nameFr);
    setHolDate(hol.date);
    setHolType(hol.type || 'national');
    setHolDaysCount(hol.daysCount || 1);
  };

  const handleCreateHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holNameAr.trim() || !holDate.trim()) return;

    addHoliday({
      nameAr: holNameAr.trim(),
      nameFr: holNameFr.trim() || holNameAr.trim(),
      date: holDate.trim(),
      type: holType,
      daysCount: Number(holDaysCount) || 1,
    });

    setIsAddHolidayModalOpen(false);
  };

  const handleSaveEditHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHoliday || !holNameAr.trim() || !holDate.trim()) return;

    updateHoliday(editingHoliday.id, {
      nameAr: holNameAr.trim(),
      nameFr: holNameFr.trim() || holNameAr.trim(),
      date: holDate.trim(),
      type: holType,
      daysCount: Number(holDaysCount) || 1,
    });

    setEditingHoliday(null);
  };

  const handleConfirmDeleteHoliday = (id: string) => {
    deleteHoliday(id);
    setDeletingHolidayId(null);
  };

  // --- Handlers for Timetable Row ---
  const handleOpenEditTimetableDay = (dayRow: TimetableEntry) => {
    setEditingTimetableDay(dayRow);
    setPeriod1(dayRow.period1);
    setPeriod2(dayRow.period2);
    setPeriod3(dayRow.period3);
    setPeriod4(dayRow.period4);
  };

  const handleSaveTimetableDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTimetableDay) return;

    updateTimetableRow(selectedClassId, editingTimetableDay.id, {
      period1: period1.trim(),
      period2: period2.trim(),
      period3: period3.trim(),
      period4: period4.trim(),
    });

    setEditingTimetableDay(null);
  };

  const handlePrintTimetable = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <CalendarDays className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'ar' ? 'التقويم المدرسي الرسمي لوزارة التهذيب الوطني (2024-2025)' : 'Calendrier Officiel MEN Mauritanie'}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {t.calendarAndSchedule}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'ar'
              ? 'إدارة وتعديل أجندة الامتحانات الوطنية والداخلية، العطل المدرسية، واستعمالات الزمن الأسبوعية للأقسام.'
              : 'Gestion, modification et correction des examens nationaux, vacances officielles et emplois du temps.'}
          </p>
        </div>

        {/* Global Reset Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              resetExams();
              resetHolidays();
              resetTimetables();
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            title={lang === 'ar' ? 'استعادة كل المواعيد والتقويمات الرسمية الافتراضية' : 'Restaurer tout par défaut'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'استعادة التقويم المعتمد' : 'Restaurer par défaut'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveSection('all')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'all'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'عرض شامل للتقويم' : 'Vue Globale'}</span>
        </button>

        <button
          onClick={() => setActiveSection('exams')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'exams'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'أجندة الامتحانات والمسابقات' : 'Examens & Concours'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {exams.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('holidays')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'holidays'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Flag className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'العطل والراحة المدرسية' : 'Vacances & Jours Fériés'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {holidays.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('timetable')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'timetable'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'استعمال الزمن الأسبوعي' : 'Emploi du Temps'}</span>
        </button>
      </div>

      {/* SECTION 1: Exams & Holidays Grid */}
      {(activeSection === 'all' || activeSection === 'exams' || activeSection === 'holidays') && (
        <div className={`grid grid-cols-1 ${activeSection === 'all' ? 'lg:grid-cols-2' : ''} gap-6`}>
          {/* National & School Exams */}
          {(activeSection === 'all' || activeSection === 'exams') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'ar' ? 'أجندة الامتحانات والمسابقات الرسمية' : 'Examens Nationaux & Trimestriels'}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleOpenAddExamModal}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'إضافة امتحان' : 'Ajouter'}</span>
                  </button>

                  <button
                    onClick={resetExams}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title={lang === 'ar' ? 'استعادة مواعيد الامتحانات الافتراضية' : 'Restaurer les examens par défaut'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-2 relative group"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            exam.color === 'emerald'
                              ? 'bg-emerald-600'
                              : exam.color === 'teal'
                              ? 'bg-teal-600'
                              : exam.color === 'blue'
                              ? 'bg-blue-600'
                              : exam.color === 'purple'
                              ? 'bg-purple-600'
                              : 'bg-amber-600'
                          }`}
                        />
                        <span className="text-xs font-black text-emerald-950">
                          {lang === 'ar' ? exam.titleAr : exam.titleFr}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {exam.badge}
                        </span>

                        <button
                          onClick={() => handleOpenEditExamModal(exam)}
                          className="p-1 rounded-md text-slate-400 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title={lang === 'ar' ? 'تعديل وتصحيح الموعد والبيانات' : 'Modifier cet examen'}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeletingExamId(exam.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          title={lang === 'ar' ? 'حذف موعد الامتحان' : 'Supprimer'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pt-1 font-mono">
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{exam.dates}</span>
                      </div>
                      <div className="text-slate-500 font-sans text-[11px]">
                        {exam.target}
                      </div>
                    </div>

                    {exam.notes && (
                      <p className="text-[11px] text-slate-500 font-sans border-t border-slate-200/60 pt-1.5">
                        {exam.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official & School Holidays */}
          {(activeSection === 'all' || activeSection === 'holidays') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Flag className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'ar' ? 'العطل الرسمية والدينية والراحة المدرسية' : 'Vacances & Jours Fériés'}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleOpenAddHolidayModal}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'إضافة عطلة' : 'Ajouter'}</span>
                  </button>

                  <button
                    onClick={resetHolidays}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title={lang === 'ar' ? 'استعادة العطل الافتراضية' : 'Restaurer les vacances par défaut'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {holidays.map((hol) => (
                  <div
                    key={hol.id}
                    className="p-3 rounded-xl border border-slate-100 bg-white flex flex-wrap justify-between items-center text-xs hover:border-slate-200 transition-colors gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <div className="font-semibold text-slate-800 truncate">
                        {lang === 'ar' ? hol.nameAr : hol.nameFr}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded">
                        {hol.date}
                      </div>

                      <button
                        onClick={() => handleOpenEditHolidayModal(hol)}
                        className="p-1 text-slate-400 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                        title={lang === 'ar' ? 'تعديل تاريخ وتسمية العطلة' : 'Modifier ce jour férié'}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeletingHolidayId(hol.id)}
                        className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title={lang === 'ar' ? 'حذف العطلة' : 'Supprimer'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: Weekly Timetable (Emploi du temps) with Live Editing Per Class */}
      {(activeSection === 'all' || activeSection === 'timetable') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'ar' ? 'جدول الحصص الأسبوعي للقسم (Emploi du Temps)' : 'Emploi du Temps Hebdomadaire'}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {lang === 'ar'
                  ? 'اختر الفصل الدراسي، ثم انقر على زر التعديل أمام أي يوم لتغيير المواد والمدرسين والتوقيت.'
                  : 'Sélectionnez la classe et modifiez les matières assignées pour chaque plage horaire.'}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-semibold">{t.class}:</span>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="font-bold p-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden cursor-pointer text-xs"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {lang === 'ar' ? c.nameAr : c.nameFr}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handlePrintTimetable}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                title={lang === 'ar' ? 'طباعة جدول الحصص' : 'Imprimer l’emploi du temps'}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'طباعة' : 'Imprimer'}</span>
              </button>

              <button
                onClick={resetTimetables}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title={lang === 'ar' ? 'استعادة جداول الحصص الافتراضية' : 'Réinitialiser les emplois du temps'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Class Timetable Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold text-center">
                  <th className="py-2.5 px-3 text-start w-36">{lang === 'ar' ? 'اليوم' : 'Jour'}</th>
                  <th className="py-2.5 px-3">08:00 - 10:00</th>
                  <th className="py-2.5 px-3">10:15 - 12:00</th>
                  <th className="py-2.5 px-3">12:15 - 14:00</th>
                  <th className="py-2.5 px-3">15:00 - 17:00</th>
                  <th className="py-2.5 px-3 w-20">{lang === 'ar' ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentClassTimetable.map((row, idx) => (
                  <tr key={row.id || idx} className={idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}>
                    <td className="py-3 px-3 font-bold text-slate-900 border-e border-slate-200">
                      {lang === 'ar' ? row.dayAr : row.dayFr}
                    </td>
                    <td className="py-3 px-3 text-center border-e border-slate-200 font-medium text-slate-700">
                      {row.period1}
                    </td>
                    <td className="py-3 px-3 text-center border-e border-slate-200 font-medium text-slate-700">
                      {row.period2}
                    </td>
                    <td className="py-3 px-3 text-center border-e border-slate-200 font-medium text-slate-700">
                      {row.period3}
                    </td>
                    <td className="py-3 px-3 text-center border-e border-slate-200 font-medium text-slate-700">
                      {row.period4}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleOpenEditTimetableDay(row)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                        title={lang === 'ar' ? 'تعديل حصص هذا اليوم' : 'Modifier les cours de ce jour'}
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'تعديل' : 'Modifier'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Add New Exam Modal */}
      {isAddExamModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'ar' ? 'إضافة موعد امتحان جديد إلى التقويم' : 'Nouvel Examen au Calendrier'}</span>
              </h3>
              <button
                onClick={() => setIsAddExamModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'اسم الامتحان بالعربية:' : 'Nom de l’examen en Arabe :'}
                </label>
                <input
                  type="text"
                  required
                  value={examTitleAr}
                  onChange={(e) => setExamTitleAr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                  placeholder="مثال: امتحان البكالوريا التجريبية (Bac Blanc)"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'الاسم بالفرنسية:' : 'Nom en Français :'}
                </label>
                <input
                  type="text"
                  value={examTitleFr}
                  onChange={(e) => setExamTitleFr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                  placeholder="Ex: Baccalauréat Blanc Régional"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الفترة الزمنية / التواريخ:' : 'Dates / Période :'}
                  </label>
                  <input
                    type="text"
                    required
                    value={examDates}
                    onChange={(e) => setExamDates(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-mono"
                    placeholder="مثال: 12 - 15 مايو 2025"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'المستويات والأقسام المستهدفة:' : 'Classes cibles :'}
                  </label>
                  <input
                    type="text"
                    value={examTarget}
                    onChange={(e) => setExamTarget(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                    placeholder="مثال: السوابع ثانوية (D, C, LM)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الشارة التوضيحية:' : 'Badge / Label :'}
                  </label>
                  <input
                    type="text"
                    value={examBadge}
                    onChange={(e) => setExamBadge(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                    placeholder="مثال: شهادة وطنية"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'طبيعة الامتحان:' : 'Type d’examen :'}
                  </label>
                  <select
                    value={examIsNational ? 'national' : 'internal'}
                    onChange={(e) => setExamIsNational(e.target.value === 'national')}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:border-emerald-600 outline-hidden font-semibold"
                  >
                    <option value="national">{lang === 'ar' ? 'امتحان وطني رسمي' : 'National Officiel'}</option>
                    <option value="internal">{lang === 'ar' ? 'تقييم داخلي للمؤسسة' : 'Interne à l’école'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'لون التمييز:' : 'Couleur :'}
                  </label>
                  <select
                    value={examColor}
                    onChange={(e) => setExamColor(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:border-emerald-600 outline-hidden font-semibold"
                  >
                    <option value="emerald">أخضر زمردي (Emerald)</option>
                    <option value="teal">أزرق بترولي (Teal)</option>
                    <option value="blue">أزرق سماوي (Blue)</option>
                    <option value="amber">كهرماني (Amber)</option>
                    <option value="purple">بنفسجي (Purple)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'ملاحظات إضافية وتوجيهات للأساتذة والتلاميذ:' : 'Notes complémentaires :'}
                </label>
                <textarea
                  rows={2}
                  value={examNotes}
                  onChange={(e) => setExamNotes(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                  placeholder="ملاحظات حول مراكز الامتحانات، بطاقات التعريف، إلخ..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddExamModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {lang === 'ar' ? 'إضافة الامتحان' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit / Correct Existing Exam Modal */}
      {editingExam && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'ar' ? 'تعديل وتصحيح موعد الامتحان' : 'Modifier & Corriger l’Examen'}</span>
              </h3>
              <button
                onClick={() => setEditingExam(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditExam} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'اسم الامتحان بالعربية:' : 'Nom de l’examen en Arabe :'}
                </label>
                <input
                  type="text"
                  required
                  value={examTitleAr}
                  onChange={(e) => setExamTitleAr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'الاسم بالفرنسية:' : 'Nom en Français :'}
                </label>
                <input
                  type="text"
                  value={examTitleFr}
                  onChange={(e) => setExamTitleFr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الفترة الزمنية / التواريخ:' : 'Dates / Période :'}
                  </label>
                  <input
                    type="text"
                    required
                    value={examDates}
                    onChange={(e) => setExamDates(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'المستويات والأقسام المستهدفة:' : 'Classes cibles :'}
                  </label>
                  <input
                    type="text"
                    value={examTarget}
                    onChange={(e) => setExamTarget(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الشارة التوضيحية:' : 'Badge / Label :'}
                  </label>
                  <input
                    type="text"
                    value={examBadge}
                    onChange={(e) => setExamBadge(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'طبيعة الامتحان:' : 'Type d’examen :'}
                  </label>
                  <select
                    value={examIsNational ? 'national' : 'internal'}
                    onChange={(e) => setExamIsNational(e.target.value === 'national')}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:border-emerald-600 outline-hidden font-semibold"
                  >
                    <option value="national">{lang === 'ar' ? 'امتحان وطني رسمي' : 'National Officiel'}</option>
                    <option value="internal">{lang === 'ar' ? 'تقييم داخلي للمؤسسة' : 'Interne à l’école'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'لون التمييز:' : 'Couleur :'}
                  </label>
                  <select
                    value={examColor}
                    onChange={(e) => setExamColor(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:border-emerald-600 outline-hidden font-semibold"
                  >
                    <option value="emerald">أخضر زمردي (Emerald)</option>
                    <option value="teal">أزرق بترولي (Teal)</option>
                    <option value="blue">أزرق سماوي (Blue)</option>
                    <option value="amber">كهرماني (Amber)</option>
                    <option value="purple">بنفسجي (Purple)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'ملاحظات وتوجيهات:' : 'Notes complémentaires :'}
                </label>
                <textarea
                  rows={2}
                  value={examNotes}
                  onChange={(e) => setExamNotes(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingExam(null)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {lang === 'ar' ? 'حفظ التعديلات' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Exam Confirmation Modal */}
      {deletingExamId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'ar' ? 'تأكيد حذف موعد الامتحان' : 'Supprimer l’examen'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ar'
                  ? 'هل أنت متأكد من حذف هذا الامتحان من أجندة التقويم المدرسي؟'
                  : 'Voulez-vous supprimer cet examen du calendrier scolaire ?'}
              </p>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingExamId(null)}
                className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl text-xs transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDeleteExam(deletingExamId)}
                className="px-4 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                {lang === 'ar' ? 'نعم، حذف الامتحان' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Add New Holiday Modal */}
      {isAddHolidayModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flag className="w-4 h-4 text-amber-600" />
                <span>{lang === 'ar' ? 'إضافة عطلة أو راحة مدرسية جديدة' : 'Nouveau Jour Férié / Vacances'}</span>
              </h3>
              <button
                onClick={() => setIsAddHolidayModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHoliday} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'اسم العطلة بالعربية:' : 'Nom en Arabe :'}
                </label>
                <input
                  type="text"
                  required
                  value={holNameAr}
                  onChange={(e) => setHolNameAr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-amber-600 outline-hidden font-sans"
                  placeholder="مثال: عطلة نصف الفصل الثاني"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'الاسم بالفرنسية:' : 'Nom en Français :'}
                </label>
                <input
                  type="text"
                  value={holNameFr}
                  onChange={(e) => setHolNameFr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-amber-600 outline-hidden font-sans"
                  placeholder="Ex: Pause Pédagogique du 2e Trimestre"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'التاريخ أو الفترة:' : 'Date ou Période :'}
                  </label>
                  <input
                    type="text"
                    required
                    value={holDate}
                    onChange={(e) => setHolDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-amber-600 outline-hidden font-mono"
                    placeholder="مثال: 15 - 18 فبراير 2025"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'طبيعة العطلة:' : 'Type de congé :'}
                  </label>
                  <select
                    value={holType}
                    onChange={(e) => setHolType(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:border-amber-600 outline-hidden font-semibold"
                  >
                    <option value="school_vacation">{lang === 'ar' ? 'عطلة مدرسية دورية' : 'Vacances scolaires'}</option>
                    <option value="national">{lang === 'ar' ? 'عيد وطني رسمي' : 'Fête nationale'}</option>
                    <option value="religious">{lang === 'ar' ? 'مناسبة دينية مباركة' : 'Fête religieuse'}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddHolidayModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {lang === 'ar' ? 'إضافة العطلة' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Edit Existing Holiday Modal */}
      {editingHoliday && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span>{lang === 'ar' ? 'تعديل وتصحيح تاريخ العطلة' : 'Modifier le Jour Férié'}</span>
              </h3>
              <button
                onClick={() => setEditingHoliday(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditHoliday} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'اسم العطلة بالعربية:' : 'Nom en Arabe :'}
                </label>
                <input
                  type="text"
                  required
                  value={holNameAr}
                  onChange={(e) => setHolNameAr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-amber-600 outline-hidden font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'الاسم بالفرنسية:' : 'Nom en Français :'}
                </label>
                <input
                  type="text"
                  value={holNameFr}
                  onChange={(e) => setHolNameFr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-amber-600 outline-hidden font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'التاريخ أو الفترة:' : 'Date ou Période :'}
                  </label>
                  <input
                    type="text"
                    required
                    value={holDate}
                    onChange={(e) => setHolDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-amber-600 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'طبيعة العطلة:' : 'Type de congé :'}
                  </label>
                  <select
                    value={holType}
                    onChange={(e) => setHolType(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:border-amber-600 outline-hidden font-semibold"
                  >
                    <option value="school_vacation">{lang === 'ar' ? 'عطلة مدرسية دورية' : 'Vacances scolaires'}</option>
                    <option value="national">{lang === 'ar' ? 'عيد وطني رسمي' : 'Fête nationale'}</option>
                    <option value="religious">{lang === 'ar' ? 'مناسبة دينية مباركة' : 'Fête religieuse'}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingHoliday(null)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {lang === 'ar' ? 'حفظ التعديل' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Holiday Confirmation Modal */}
      {deletingHolidayId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'ar' ? 'تأكيد حذف العطلة' : 'Supprimer le jour férié'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ar'
                  ? 'هل أنت متأكد من حذف هذه العطلة من التقويم المدرسي؟'
                  : 'Voulez-vous supprimer ce jour férié du calendrier ?'}
              </p>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingHolidayId(null)}
                className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl text-xs transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDeleteHoliday(deletingHolidayId)}
                className="px-4 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                {lang === 'ar' ? 'نعم، حذف' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Edit Timetable Day Row */}
      {editingTimetableDay && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-700" />
                  <span>
                    {lang === 'ar'
                      ? `تعديل حصص يوم ${editingTimetableDay.dayAr} (${selectedClassObj.code})`
                      : `Modifier les cours du ${editingTimetableDay.dayFr} (${selectedClassObj.code})`}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  {lang === 'ar' ? selectedClassObj.nameAr : selectedClassObj.nameFr}
                </p>
              </div>
              <button
                onClick={() => setEditingTimetableDay(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTimetableDay} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'الحصة الأولى (08:00 - 10:00):' : '1ère Séance (08:00 - 10:00) :'}
                </label>
                <input
                  type="text"
                  required
                  value={period1}
                  onChange={(e) => setPeriod1(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                  placeholder="اسم المادة أو الأستاذ..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'الحصة الثانية (10:15 - 12:00):' : '2ème Séance (10:15 - 12:00) :'}
                </label>
                <input
                  type="text"
                  required
                  value={period2}
                  onChange={(e) => setPeriod2(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                  placeholder="اسم المادة أو الأستاذ..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'الحصة الثالثة (12:15 - 14:00):' : '3ème Séance (12:15 - 14:00) :'}
                </label>
                <input
                  type="text"
                  required
                  value={period3}
                  onChange={(e) => setPeriod3(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                  placeholder="اسم المادة أو الأستاذ..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'الحصة الرابعة (15:00 - 17:00):' : '4ème Séance (15:00 - 17:00) :'}
                </label>
                <input
                  type="text"
                  value={period4}
                  onChange={(e) => setPeriod4(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                  placeholder="اسم المادة، أو فارغ (-)..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTimetableDay(null)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {lang === 'ar' ? 'حفظ جدول اليوم' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
