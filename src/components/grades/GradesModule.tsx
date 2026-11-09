import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateSubjectMoyenne, computeStudentBulletin } from '../../utils/academicUtils';
import { GradeRecord, Student, Subject } from '../../types';
import {
  GraduationCap,
  Filter,
  FileCheck,
  Edit3,
  Search,
  CheckCircle2,
  Plus,
  FileText,
  Calculator,
  Eye,
  Sparkles,
  HelpCircle,
  Award,
  X,
  Printer,
} from 'lucide-react';

export const GradesModule: React.FC = () => {
  const {
    students,
    classes,
    subjects,
    classSubjects,
    grades,
    selectedTrimestre,
    setSelectedTrimestre,
    setSelectedBulletinStudentId,
    updateGrade,
    addBulkGrades,
    lang,
    t,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls_7d1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Single grade edit modal
  const [editingGradeRecord, setEditingGradeRecord] = useState<{
    student: Student;
    subject: Subject;
    grade?: GradeRecord;
  } | null>(null);

  // Form inputs for single editing
  const [formDevoir1, setFormDevoir1] = useState<number | ''>('');
  const [formDevoir2, setFormDevoir2] = useState<number | ''>('');
  const [formComposition, setFormComposition] = useState<number | ''>('');
  const [formAppreciationAr, setFormAppreciationAr] = useState<string>('');
  const [formAppreciationFr, setFormAppreciationFr] = useState<string>('');

  // New Grade Sheet / Bulletin Modal
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState<boolean>(false);
  const [modalStudentId, setModalStudentId] = useState<string>('');
  const [modalTrimestre, setModalTrimestre] = useState<number>(selectedTrimestre);
  const [modalMode, setModalMode] = useState<'full' | 'single'>('full');
  const [modalSelectedSubjectId, setModalSelectedSubjectId] = useState<string>('');
  const [isModalEmptyMode, setIsModalEmptyMode] = useState<boolean>(true);

  // Bulk marks record for modal: subjectId -> { d1, d2, compo, appAr, appFr }
  const [modalBulkMarks, setModalBulkMarks] = useState<
    Record<string, { d1: number | ''; d2: number | ''; compo: number | ''; appAr: string; appFr: string }>
  >({});

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === selectedClassId);
  const currentClassSubjects = classSubjects.filter((cs) => cs.classId === selectedClassId);

  // Calculate student ranks and stats for this class
  const evaluatedStudents = useMemo(() => {
    const list = classStudents.map((std) => {
      const bulletin = computeStudentBulletin(
        std,
        selectedClass,
        classSubjects,
        subjects,
        grades,
        classStudents,
        selectedTrimestre,
        lang
      );
      return {
        student: std,
        bulletin,
      };
    });

    // Sort by Moyenne Générale descending
    list.sort((a, b) => b.bulletin.moyenneGenerale - a.bulletin.moyenneGenerale);

    // Assign true ranks
    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  }, [classStudents, selectedClass, classSubjects, subjects, grades, selectedTrimestre, lang]);

  // Filtered evaluated students based on search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return evaluatedStudents;
    const q = searchQuery.toLowerCase().trim();
    return evaluatedStudents.filter(({ student }) => {
      const nameAr = `${student.firstNameAr} ${student.lastNameAr}`.toLowerCase();
      const nameFr = `${student.firstNameFr} ${student.lastNameFr}`.toLowerCase();
      const mat = (student.matricule || '').toLowerCase();
      const nni = (student.nationalIdNni || '').toLowerCase();
      return nameAr.includes(q) || nameFr.includes(q) || mat.includes(q) || nni.includes(q);
    });
  }, [evaluatedStudents, searchQuery]);

  // Summary statistics for this class
  const classMoyennes = evaluatedStudents.map((e) => e.bulletin.moyenneGenerale);
  const classAvg =
    classMoyennes.length > 0
      ? Math.round((classMoyennes.reduce((a, b) => a + b, 0) / classMoyennes.length) * 100) / 100
      : 0;
  const highestAvg = classMoyennes.length > 0 ? Math.max(...classMoyennes) : 0;
  const lowestAvg = classMoyennes.length > 0 ? Math.min(...classMoyennes) : 0;
  const passRate =
    classMoyennes.length > 0
      ? Math.round((classMoyennes.filter((m) => m >= 10).length / classMoyennes.length) * 100)
      : 0;

  // Initialize completely empty marks for all subjects of the student's class
  const initializeEmptyMarks = (studentId: string) => {
    const std = students.find((s) => s.id === studentId);
    if (!std) return;

    const stdClassSubjects = classSubjects.filter((cs) => cs.classId === std.classId);
    const emptyMarks: Record<
      string,
      { d1: number | ''; d2: number | ''; compo: number | ''; appAr: string; appFr: string }
    > = {};

    stdClassSubjects.forEach((cs) => {
      emptyMarks[cs.subjectId] = {
        d1: '',
        d2: '',
        compo: '',
        appAr: '',
        appFr: '',
      };
    });

    setModalBulkMarks(emptyMarks);
    if (stdClassSubjects[0]) {
      setModalSelectedSubjectId(stdClassSubjects[0].subjectId);
    }
  };

  // Populate modal with existing marks from database (if any) or leave blank
  const populateModalMarks = (studentId: string, trim: number) => {
    const std = students.find((s) => s.id === studentId);
    if (!std) return;

    const stdClassSubjects = classSubjects.filter((cs) => cs.classId === std.classId);
    const initialMarks: Record<
      string,
      { d1: number | ''; d2: number | ''; compo: number | ''; appAr: string; appFr: string }
    > = {};

    stdClassSubjects.forEach((cs) => {
      const existing = grades.find(
        (g) =>
          g.studentId === studentId &&
          g.classId === std.classId &&
          g.subjectId === cs.subjectId &&
          g.trimestre === trim
      );

      if (existing) {
        initialMarks[cs.subjectId] = {
          d1: existing.devoir1 !== undefined && existing.devoir1 !== null ? existing.devoir1 : '',
          d2: existing.devoir2 !== undefined && existing.devoir2 !== null ? existing.devoir2 : '',
          compo: existing.composition !== undefined && existing.composition !== null ? existing.composition : '',
          appAr: existing.appreciationAr || '',
          appFr: existing.appreciationFr || '',
        };
      } else {
        initialMarks[cs.subjectId] = {
          d1: '',
          d2: '',
          compo: '',
          appAr: '',
          appFr: '',
        };
      }
    });

    setModalBulkMarks(initialMarks);
    if (stdClassSubjects[0]) {
      setModalSelectedSubjectId(stdClassSubjects[0].subjectId);
    }
  };

  // When opening new report modal, default to first student and open completely empty of results
  const handleOpenNewReportModal = (targetStudentId?: string, openEmpty: boolean = true) => {
    const sId = targetStudentId || classStudents[0]?.id || students[0]?.id || '';
    setModalStudentId(sId);
    setModalTrimestre(selectedTrimestre);
    setModalMode('full');
    setIsModalEmptyMode(openEmpty);

    if (openEmpty) {
      // Open completely empty of any grades/results
      initializeEmptyMarks(sId);
    } else {
      populateModalMarks(sId, selectedTrimestre);
    }
    setIsNewReportModalOpen(true);
  };

  // Re-populate or clear marks when modal student or trimestre changes
  useEffect(() => {
    if (isNewReportModalOpen && modalStudentId) {
      if (isModalEmptyMode) {
        initializeEmptyMarks(modalStudentId);
      } else {
        populateModalMarks(modalStudentId, modalTrimestre);
      }
    }
  }, [modalStudentId, modalTrimestre, isModalEmptyMode]);

  // Helper to handle input changes for marks cleanly
  const handleBulkMarkChange = (subjectId: string, field: 'd1' | 'd2' | 'compo', rawVal: string) => {
    setModalBulkMarks((prev) => {
      const cur = prev[subjectId] || { d1: '', d2: '', compo: '', appAr: '', appFr: '' };
      let parsed: number | '' = '';
      if (rawVal !== '') {
        const p = parseFloat(rawVal);
        if (!isNaN(p)) {
          parsed = Math.min(20, Math.max(0, p));
        }
      }
      return {
        ...prev,
        [subjectId]: {
          ...cur,
          [field]: parsed,
        },
      };
    });
  };

  const handleSaveBulkReport = (andPreview: boolean = false) => {
    const std = students.find((s) => s.id === modalStudentId);
    if (!std) return;

    const stdClassSubjects = classSubjects.filter((cs) => cs.classId === std.classId);

    if (modalMode === 'full') {
      const recordsToSave: {
        studentId: string;
        classId: string;
        subjectId: string;
        trimestre: any;
        coefficient: number;
        devoir1: number;
        devoir2: number;
        composition: number;
        appreciationAr: string;
        appreciationFr: string;
      }[] = [];

      stdClassSubjects.forEach((cs) => {
        const mark = modalBulkMarks[cs.subjectId];
        if (!mark) return;
        const hasAny = mark.d1 !== '' || mark.d2 !== '' || mark.compo !== '';
        if (hasAny) {
          recordsToSave.push({
            studentId: std.id,
            classId: std.classId,
            subjectId: cs.subjectId,
            trimestre: modalTrimestre as any,
            coefficient: cs.coefficient,
            devoir1: mark.d1 === '' ? 0 : Number(mark.d1),
            devoir2: mark.d2 === '' ? 0 : Number(mark.d2),
            composition: mark.compo === '' ? 0 : Number(mark.compo),
            appreciationAr: mark.appAr || '',
            appreciationFr: mark.appFr || '',
          });
        }
      });

      if (recordsToSave.length > 0) {
        addBulkGrades(recordsToSave);
      }
    } else {
      // Single subject mode
      const cs = stdClassSubjects.find((c) => c.subjectId === modalSelectedSubjectId) || stdClassSubjects[0];
      const mark = modalBulkMarks[modalSelectedSubjectId];
      if (cs && mark && (mark.d1 !== '' || mark.d2 !== '' || mark.compo !== '')) {
        updateGrade({
          studentId: std.id,
          classId: std.classId,
          subjectId: cs.subjectId,
          trimestre: modalTrimestre as any,
          coefficient: cs.coefficient,
          devoir1: mark.d1 === '' ? 0 : Number(mark.d1),
          devoir2: mark.d2 === '' ? 0 : Number(mark.d2),
          composition: mark.compo === '' ? 0 : Number(mark.compo),
          appreciationAr: mark.appAr || '',
          appreciationFr: mark.appFr || '',
        });
      }
    }

    setIsNewReportModalOpen(false);

    if (andPreview) {
      setSelectedBulletinStudentId(std.id);
    }
  };

  const handleOpenEdit = (student: Student, subject: Subject) => {
    const existing = grades.find(
      (g) =>
        g.studentId === student.id &&
        g.classId === selectedClassId &&
        g.subjectId === subject.id &&
        g.trimestre === selectedTrimestre
    );

    setEditingGradeRecord({ student, subject, grade: existing });
    setFormDevoir1(existing?.devoir1 !== undefined && existing?.devoir1 !== null ? existing.devoir1 : '');
    setFormDevoir2(existing?.devoir2 !== undefined && existing?.devoir2 !== null ? existing.devoir2 : '');
    setFormComposition(existing?.composition !== undefined && existing?.composition !== null ? existing.composition : '');
    setFormAppreciationAr(existing?.appreciationAr || '');
    setFormAppreciationFr(existing?.appreciationFr || '');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGradeRecord) return;

    updateGrade({
      studentId: editingGradeRecord.student.id,
      classId: selectedClassId,
      subjectId: editingGradeRecord.subject.id,
      trimestre: selectedTrimestre,
      devoir1: formDevoir1 === '' ? 0 : Number(formDevoir1),
      devoir2: formDevoir2 === '' ? 0 : Number(formDevoir2),
      composition: formComposition === '' ? 0 : Number(formComposition),
      coefficient: currentClassSubjects.find((cs) => cs.subjectId === editingGradeRecord.subject.id)?.coefficient || 2,
      appreciationAr: formAppreciationAr,
      appreciationFr: formAppreciationFr,
    });

    setEditingGradeRecord(null);
  };

  // Compute live average preview for new report modal
  const modalStudent = students.find((s) => s.id === modalStudentId);
  const modalClass = classes.find((c) => c.id === modalStudent?.classId);
  const modalClassSubjects = modalClass ? classSubjects.filter((cs) => cs.classId === modalClass.id) : [];

  const modalComputedAvgInfo = useMemo(() => {
    if (!modalClassSubjects.length) return { avg: null, hasMarks: false, enteredCount: 0 };
    let totalWeighted = 0;
    let totalCoeffs = 0;
    let enteredCount = 0;

    modalClassSubjects.forEach((cs) => {
      const mark = modalBulkMarks[cs.subjectId];
      if (!mark) return;
      const hasAny = mark.d1 !== '' || mark.d2 !== '' || mark.compo !== '';
      if (hasAny) {
        enteredCount++;
        const d1 = typeof mark.d1 === 'number' ? mark.d1 : 0;
        const d2 = typeof mark.d2 === 'number' ? mark.d2 : 0;
        const compo = typeof mark.compo === 'number' ? mark.compo : 0;
        const subMoyenne = calculateSubjectMoyenne(d1, d2, compo);
        totalWeighted += subMoyenne * cs.coefficient;
        totalCoeffs += cs.coefficient;
      }
    });

    if (enteredCount === 0 || totalCoeffs === 0) {
      return { avg: null, hasMarks: false, enteredCount: 0 };
    }

    const avg = Math.round((totalWeighted / totalCoeffs) * 100) / 100;
    return { avg, hasMarks: true, enteredCount };
  }, [modalClassSubjects, modalBulkMarks]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <GraduationCap className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'ar' ? 'منظومة الدرجات والنتائج الموريتانية' : 'Notes & Résultats Scolaires RIM'}</span>
            <span className="text-slate-300">•</span>
            <span className="bg-emerald-50 px-2 py-0.5 rounded text-emerald-800 font-bold">
              {lang === 'ar' ? 'التقييم الرسمي من 20/20 مع المعامل' : 'Barème Officiel 20/20 avec Coeff'}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {t.gradesAndBulletins}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'ar'
              ? 'إدارة كشوف النقاط، رصد الفروض والامتحانات، حساب المعدلات العامة آلياً، والطباعة الرسمية لكشوف التلاميذ.'
              : 'Gestion des bulletins, saisie des devoirs, calcul automatique des moyennes et impression des relevés.'}
          </p>
        </div>

        {/* Action Button & Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Main Action: Add New Grade Sheet / Bulletin */}
          <button
            onClick={() => handleOpenNewReportModal()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إضافة كشف جديد' : 'Nouveau Bulletin'}</span>
          </button>

          {/* Class Select */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">{t.class}:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-transparent font-bold text-slate-900 outline-hidden cursor-pointer"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {lang === 'ar' ? c.nameAr : c.nameFr}
                </option>
              ))}
            </select>
          </div>

          {/* Trimestre buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => setSelectedTrimestre(num as any)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedTrimestre === num
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'ar' ? `الثلاثي ${num}` : `Trimestre ${num}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Helper guide banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
            📝
          </div>
          <div>
            <span className="font-bold block">
              {lang === 'ar' ? 'كيفية إصدار ورصد كشف جديد:' : 'Comment saisir ou éditer un bulletin :'}
            </span>
            <span className="text-emerald-800 text-[11px]">
              {lang === 'ar'
                ? 'اضغط على زر "إضافة كشف جديد" أعلاه لرصد درجات تلميذ وتوليد كشفه كاملاً، أو اضغط على "كشف النقاط" أمام أي تلميذ لمعاينته وطباعته فوراً.'
                : 'Cliquez sur "Nouveau Bulletin" pour saisir les notes d’un élève, ou cliquez sur "Bulletin" dans le tableau pour visualiser et imprimer.'}
            </span>
          </div>
        </div>

        <button
          onClick={() => handleOpenNewReportModal()}
          className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'رصد الآن' : 'Saisir'}</span>
        </button>
      </div>

      {/* Class Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            {t.classAverage}
          </span>
          <div className="text-xl font-black text-slate-900 font-mono">
            {classAvg.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ 20</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">
            {lang === 'ar' ? 'معدل القسم العام' : 'Moyenne générale'}
          </span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            {lang === 'ar' ? 'نسبة النجاح (≥ 10/20)' : 'Taux de Réussite (≥ 10)'}
          </span>
          <div className="text-xl font-black text-emerald-800 font-mono">
            {passRate}%
          </div>
          <span className="text-[10px] text-slate-500">
            {evaluatedStudents.filter((e) => e.bulletin.moyenneGenerale >= 10).length} {lang === 'ar' ? 'تلاميذ ناجحون' : 'admis'}
          </span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            {t.highestAverage}
          </span>
          <div className="text-xl font-black text-teal-800 font-mono">
            {highestAvg.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ 20</span>
          </div>
          <span className="text-[10px] text-teal-700 font-medium truncate block">
            {evaluatedStudents[0]?.student.firstNameAr || 'الأول'}
          </span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            {t.lowestAverage}
          </span>
          <div className="text-xl font-black text-amber-800 font-mono">
            {lowestAvg.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ 20</span>
          </div>
          <span className="text-[10px] text-amber-700">
            {lang === 'ar' ? 'يحتاج استدراكاً' : 'Aide requise'}
          </span>
        </div>
      </div>

      {/* Main Class Rankings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{lang === 'ar' ? 'جدول نتائج وكشوف نقاط الفصل' : 'Résultats & Bulletins de la Promotion'}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {selectedClass.code}
              </span>
              <span className="text-xs text-slate-400 font-normal">
                ({filteredStudents.length} {lang === 'ar' ? 'تلميذ' : 'élèves'})
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'ar'
                ? 'الصيغة الموريتانية الرسمية: معدل المادة = (فرض 1 + فرض 2 + 2 × التأليف) ÷ 4'
                : 'Formule MEN RIM : Note = (D1 + D2 + 2 × Compo) / 4'}
            </p>
          </div>

          {/* Search box within class */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'بحث بالاسم أو رقم التسجيل...' : 'Rechercher élève...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs ps-8 pe-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-hidden"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-3 px-3 text-center w-12">{lang === 'ar' ? 'الترتيب' : 'Rang'}</th>
                <th className="py-3 px-3 text-start">{t.fullName}</th>
                <th className="py-3 px-3 text-start">{t.matricule}</th>
                <th className="py-3 px-3 text-center">{lang === 'ar' ? 'مجموع المعاملات' : 'Coeffs'}</th>
                <th className="py-3 px-3 text-center">{lang === 'ar' ? 'مجموع النقاط' : 'Points'}</th>
                <th className="py-3 px-3 text-center bg-emerald-50 text-emerald-950 font-black">
                  {t.moyenneGenerale}
                </th>
                <th className="py-3 px-3 text-start">{t.mention}</th>
                <th className="py-3 px-3 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    {lang === 'ar' ? 'لا توجد نتائج مطابقة لبحثك' : 'Aucun résultat trouvé'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map(({ student, bulletin, rank }) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                          rank === 1
                            ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                            : rank === 2
                            ? 'bg-slate-300 text-slate-900'
                            : rank === 3
                            ? 'bg-amber-700/20 text-amber-900'
                            : 'text-slate-600 bg-slate-100'
                        }`}
                      >
                        {rank}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">
                        {lang === 'ar' ? `${student.firstNameAr} ${student.lastNameAr}` : `${student.firstNameFr} ${student.lastNameFr}`}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        NNI: {student.nationalIdNni}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-semibold text-emerald-800 text-[11px]">
                      {student.matricule}
                    </td>

                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {bulletin.totalCoefficients}
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-slate-700">
                      {bulletin.totalPoints.toFixed(1)}
                    </td>

                    <td className="py-3 px-3 text-center bg-emerald-50/50">
                      <span className="font-mono font-black text-sm text-emerald-900">
                        {bulletin.moyenneGenerale.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/ 20</span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          bulletin.moyenneGenerale >= 16
                            ? 'bg-emerald-100 text-emerald-800'
                            : bulletin.moyenneGenerale >= 14
                            ? 'bg-teal-100 text-teal-800'
                            : bulletin.moyenneGenerale >= 10
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {bulletin.mention}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Official Bulletin Print Trigger */}
                        <button
                          onClick={() => setSelectedBulletinStudentId(student.id)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                          title={t.officialBulletin}
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{lang === 'ar' ? 'كشف النقاط' : 'Bulletin'}</span>
                        </button>

                        {/* Quick edit / add marks for this student */}
                        <button
                          onClick={() => handleOpenNewReportModal(student.id)}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          title={lang === 'ar' ? 'إضافة / تعديل كشف هذا التلميذ' : 'Éditer tout le bulletin'}
                        >
                          <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="hidden md:inline">{lang === 'ar' ? 'رصد كشف' : 'Notes'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD NEW REPORT / BULLETIN (كشف درجات جديد)       */}
      {/* ========================================================= */}
      {isNewReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-6">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {lang === 'ar' ? 'إضافة وتوليد كشف درجات جديد' : 'Nouveau Relevé & Bulletin de Notes'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'ar'
                      ? 'رصد درجات الفروض والتأليف وحساب المعدل العام فورياً وفق المعاملات الرسمية.'
                      : 'Saisie des notes périodiques et calcul immédiat de la moyenne générale.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student & Period Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              {/* Student Picker */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'اختر التلميذ:' : 'Sélectionner l’élève :'}
                </label>
                <select
                  value={modalStudentId}
                  onChange={(e) => setModalStudentId(e.target.value)}
                  className="w-full text-xs font-bold p-2 rounded-lg border border-slate-300 bg-white focus:border-emerald-600 outline-hidden cursor-pointer"
                >
                  {students.map((s) => {
                    const c = classes.find((cl) => cl.id === s.classId);
                    return (
                      <option key={s.id} value={s.id}>
                        {lang === 'ar' ? `${s.firstNameAr} ${s.lastNameAr}` : `${s.firstNameFr} ${s.lastNameFr}`} ({s.matricule} - {c?.code || ''})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Trimestre Picker */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'الفترة / الثلاثي:' : 'Période / Trimestre :'}
                </label>
                <select
                  value={modalTrimestre}
                  onChange={(e) => setModalTrimestre(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2 rounded-lg border border-slate-300 bg-white focus:border-emerald-600 outline-hidden cursor-pointer"
                >
                  <option value={1}>{lang === 'ar' ? 'الثلاثي الأول (1er Trimestre)' : '1er Trimestre'}</option>
                  <option value={2}>{lang === 'ar' ? 'الثلاثي الثاني (2ème Trimestre)' : '2ème Trimestre'}</option>
                  <option value={3}>{lang === 'ar' ? 'الثلاثي الثالث (3ème Trimestre)' : '3ème Trimestre'}</option>
                </select>
              </div>
            </div>

            {/* Sheet Mode Status & Quick Tools */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                    isModalEmptyMode
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <span>{isModalEmptyMode ? '✨' : '📂'}</span>
                  <span>
                    {isModalEmptyMode
                      ? lang === 'ar'
                        ? 'كشف جديد فارغ (جاهز للرصد)'
                        : 'Nouveau bulletin vierge'
                      : lang === 'ar'
                      ? 'تم تحميل الدرجات المسجلة'
                      : 'Notes enregistrées chargées'}
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  {isModalEmptyMode
                    ? lang === 'ar'
                      ? 'الحقول فارغة تماماً للبدء برصد كشف جديد.'
                      : 'Champs vides prêts pour la saisie.'
                    : lang === 'ar'
                    ? 'يمكنك التعديل عليها أو تفريغها.'
                    : 'Modifiez ou videz selon besoin.'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalEmptyMode(true);
                    initializeEmptyMarks(modalStudentId);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    isModalEmptyMode
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                  title={lang === 'ar' ? 'تفريغ كافة الخانات وجعل الكشف فارغاً' : 'Vider tous les champs'}
                >
                  <span>🧹</span>
                  <span>{lang === 'ar' ? 'تفريغ الكل (كشف فارغ)' : 'Vider tout'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsModalEmptyMode(false);
                    populateModalMarks(modalStudentId, modalTrimestre);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    !isModalEmptyMode
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                  title={lang === 'ar' ? 'استيراد الدرجات المسجلة مسبقاً في النظام لهذا التلميذ' : 'Importer notes existantes'}
                >
                  <span>📥</span>
                  <span>{lang === 'ar' ? 'استيراد المسجل' : 'Importer'}</span>
                </button>
              </div>
            </div>

            {/* Entry Mode Tabs */}
            <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs">
              <button
                type="button"
                onClick={() => setModalMode('full')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  modalMode === 'full'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang === 'ar' ? '📋 كشف شامل لكافة المواد' : '📋 Toutes les matières'}
              </button>
              <button
                type="button"
                onClick={() => setModalMode('single')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  modalMode === 'single'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang === 'ar' ? '🎯 رصد مادة واحدة محددة' : '🎯 Une seule matière'}
              </button>
            </div>

            {/* Mode 1: Full Sheet Table */}
            {modalMode === 'full' ? (
              <div className="space-y-3">
                <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-start text-xs border-collapse">
                    <thead className="bg-slate-100 sticky top-0 border-b border-slate-200 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 text-start">{lang === 'ar' ? 'المادة التعليمية' : 'Matière'}</th>
                        <th className="p-2 text-center w-14">{lang === 'ar' ? 'المعامل' : 'Coeff'}</th>
                        <th className="p-2 text-center w-20">{t.devoir1}</th>
                        <th className="p-2 text-center w-20">{t.devoir2}</th>
                        <th className="p-2 text-center w-20">{t.composition}</th>
                        <th className="p-2 text-center w-20 bg-emerald-50 text-emerald-950 font-bold">
                          {lang === 'ar' ? 'المعدل' : 'Moy'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {modalClassSubjects.map((cs) => {
                        const sub = subjects.find((s) => s.id === cs.subjectId);
                        const curMark = modalBulkMarks[cs.subjectId] || { d1: '', d2: '', compo: '', appAr: '', appFr: '' };
                        const hasMark = curMark.d1 !== '' || curMark.d2 !== '' || curMark.compo !== '';
                        const calculatedSubAvg = hasMark
                          ? calculateSubjectMoyenne(
                              typeof curMark.d1 === 'number' ? curMark.d1 : 0,
                              typeof curMark.d2 === 'number' ? curMark.d2 : 0,
                              typeof curMark.compo === 'number' ? curMark.compo : 0
                            )
                          : null;

                        return (
                          <tr key={cs.subjectId} className="hover:bg-slate-50/70">
                            <td className="p-2 font-semibold text-slate-800">
                              {lang === 'ar' ? sub?.nameAr : sub?.nameFr}
                            </td>
                            <td className="p-2 text-center font-bold text-slate-600">
                              {cs.coefficient}
                            </td>
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="20"
                                placeholder="—"
                                value={curMark.d1}
                                onChange={(e) => handleBulkMarkChange(cs.subjectId, 'd1', e.target.value)}
                                className="w-16 p-1 text-center font-mono font-bold bg-white border border-slate-300 rounded focus:border-emerald-600 outline-hidden"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="20"
                                placeholder="—"
                                value={curMark.d2}
                                onChange={(e) => handleBulkMarkChange(cs.subjectId, 'd2', e.target.value)}
                                className="w-16 p-1 text-center font-mono font-bold bg-white border border-slate-300 rounded focus:border-emerald-600 outline-hidden"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="20"
                                placeholder="—"
                                value={curMark.compo}
                                onChange={(e) => handleBulkMarkChange(cs.subjectId, 'compo', e.target.value)}
                                className="w-16 p-1 text-center font-mono font-bold bg-emerald-50/50 border border-emerald-300 rounded focus:border-emerald-600 outline-hidden text-emerald-950"
                              />
                            </td>
                            <td className="p-2 text-center bg-emerald-50/40 font-mono font-black text-emerald-900">
                              {calculatedSubAvg !== null ? (
                                calculatedSubAvg.toFixed(2)
                              ) : (
                                <span className="text-slate-300 font-sans font-normal">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Real-time General Average Result Banner */}
                <div className="p-3.5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block text-slate-200">
                        {lang === 'ar' ? 'المعدل العام التقديري لهذا الكشف:' : 'Moyenne Générale Estimée :'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {modalComputedAvgInfo.hasMarks
                          ? lang === 'ar'
                            ? `محسوب وفق المعاملات الرسمية (${modalComputedAvgInfo.enteredCount} مواد مدخلة)`
                            : `Calculé selon les coefficients (${modalComputedAvgInfo.enteredCount} matières)`
                          : lang === 'ar'
                          ? 'كشف جديد فارغ — بانتظار إدخال الدرجات لرصد النتائج'
                          : 'Bulletin vierge — En attente de saisie des notes'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xl font-black font-mono text-emerald-400 self-end sm:self-center">
                    {modalComputedAvgInfo.hasMarks ? (
                      <>
                        {modalComputedAvgInfo.avg?.toFixed(2)}{' '}
                        <span className="text-xs font-normal text-slate-400">/ 20</span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-slate-400">
                        {lang === 'ar' ? '— فارغ —' : '— Vierge —'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Mode 2: Single Subject Entry */
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'اختر المادة التعليمية:' : 'Choisir la matière :'}
                  </label>
                  <select
                    value={modalSelectedSubjectId}
                    onChange={(e) => setModalSelectedSubjectId(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-white focus:border-emerald-600 outline-hidden cursor-pointer"
                  >
                    {modalClassSubjects.map((cs) => {
                      const sub = subjects.find((s) => s.id === cs.subjectId);
                      return (
                        <option key={cs.subjectId} value={cs.subjectId}>
                          {lang === 'ar' ? sub?.nameAr : sub?.nameFr} (معامل {cs.coefficient})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {(() => {
                  const cur = modalBulkMarks[modalSelectedSubjectId] || { d1: '', d2: '', compo: '', appAr: '', appFr: '' };
                  const hasMark = cur.d1 !== '' || cur.d2 !== '' || cur.compo !== '';
                  const subAvg = hasMark
                    ? calculateSubjectMoyenne(
                        typeof cur.d1 === 'number' ? cur.d1 : 0,
                        typeof cur.d2 === 'number' ? cur.d2 : 0,
                        typeof cur.compo === 'number' ? cur.compo : 0
                      )
                    : null;

                  return (
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            {t.devoir1} (/20)
                          </label>
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            max="20"
                            placeholder="—"
                            value={cur.d1}
                            onChange={(e) => handleBulkMarkChange(modalSelectedSubjectId, 'd1', e.target.value)}
                            className="w-full text-sm font-mono font-bold p-2 text-center rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            {t.devoir2} (/20)
                          </label>
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            max="20"
                            placeholder="—"
                            value={cur.d2}
                            onChange={(e) => handleBulkMarkChange(modalSelectedSubjectId, 'd2', e.target.value)}
                            className="w-full text-sm font-mono font-bold p-2 text-center rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            {t.composition} (/20)
                          </label>
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            max="20"
                            placeholder="—"
                            value={cur.compo}
                            onChange={(e) => handleBulkMarkChange(modalSelectedSubjectId, 'compo', e.target.value)}
                            className="w-full text-sm font-mono font-bold p-2 text-center rounded-xl border border-emerald-400 bg-emerald-50 focus:border-emerald-600 outline-hidden text-emerald-950"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">
                          {lang === 'ar' ? 'معدل المادة المحسوب:' : 'Moyenne de la matière :'}
                        </span>
                        <span className="text-base font-black text-emerald-800 font-mono">
                          {subAvg !== null ? (
                            `${subAvg.toFixed(2)} / 20`
                          ) : (
                            <span className="text-slate-400 font-normal font-sans">
                              {lang === 'ar' ? '— بانتظار الدرجات —' : '— En attente de notes —'}
                            </span>
                          )}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.appreciation}:
                        </label>
                        <input
                          type="text"
                          value={cur.appAr}
                          onChange={(e) => {
                            const v = e.target.value;
                            setModalBulkMarks((prev) => ({
                              ...prev,
                              [modalSelectedSubjectId]: { ...cur, appAr: v },
                            }));
                          }}
                          placeholder={lang === 'ar' ? 'ملاحظة الأستاذ بالعربية (اختياري)...' : 'Appréciation (optionnel)...'}
                          className="w-full text-xs p-2 rounded-xl border border-slate-200 mb-2 focus:border-emerald-600 outline-hidden"
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewReportModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSaveBulkReport(false)}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors cursor-pointer"
                >
                  {lang === 'ar' ? 'حفظ الكشف فقط' : 'Enregistrer'}
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveBulkReport(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'حفظ ومعاينة كشف النقاط الرسمي' : 'Enregistrer & Voir Bulletin'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: SINGLE SUBJECT GRADE EDIT MODAL                  */}
      {/* ========================================================= */}
      {editingGradeRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 block">
                  {lang === 'ar' ? `رصد درجات الثلاثي ${selectedTrimestre}` : `Saisie Trimestre ${selectedTrimestre}`}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {editingGradeRecord.student.firstNameAr} {editingGradeRecord.student.lastNameAr}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {editingGradeRecord.student.matricule} • {selectedClass.code}
                </p>
              </div>
              <button
                onClick={() => setEditingGradeRecord(null)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              {/* Subject Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'اختر المادة التعليمية:' : 'Matière d’enseignement :'}
                </label>
                <select
                  value={editingGradeRecord.subject.id}
                  onChange={(e) => {
                    const newSub = subjects.find((s) => s.id === e.target.value);
                    if (newSub) {
                      handleOpenEdit(editingGradeRecord.student, newSub);
                    }
                  }}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden cursor-pointer"
                >
                  {currentClassSubjects.map((cs) => {
                    const sub = subjects.find((s) => s.id === cs.subjectId);
                    if (!sub) return null;
                    return (
                      <option key={sub.id} value={sub.id}>
                        {sub.nameAr} / {sub.nameFr} (معامل {cs.coefficient})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Three Mauritanian Mark inputs: Devoir 1, Devoir 2, Composition */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {t.devoir1} (/20)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="20"
                    placeholder="—"
                    value={formDevoir1}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormDevoir1(v === '' ? '' : Math.min(20, Math.max(0, parseFloat(v) || 0)));
                    }}
                    className="w-full text-sm font-mono font-bold p-2 text-center rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {t.devoir2} (/20)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="20"
                    placeholder="—"
                    value={formDevoir2}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormDevoir2(v === '' ? '' : Math.min(20, Math.max(0, parseFloat(v) || 0)));
                    }}
                    className="w-full text-sm font-mono font-bold p-2 text-center rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {t.composition} (/20)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="20"
                    placeholder="—"
                    value={formComposition}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormComposition(v === '' ? '' : Math.min(20, Math.max(0, parseFloat(v) || 0)));
                    }}
                    className="w-full text-sm font-mono font-bold p-2 text-center rounded-xl border border-emerald-400 bg-emerald-50/50 focus:border-emerald-600 outline-hidden text-emerald-950"
                  />
                </div>
              </div>

              {/* Real-time calculated trimester note preview */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">
                    {lang === 'ar' ? 'معدل المادة المحسوب تلقائياً:' : 'Moyenne calculée de la matière :'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({formDevoir1 === '' ? '—' : formDevoir1} + {formDevoir2 === '' ? '—' : formDevoir2} + 2×{formComposition === '' ? '—' : formComposition}) ÷ 4
                  </span>
                </div>
                <div className="text-lg font-black text-emerald-800 font-mono">
                  {formDevoir1 !== '' || formDevoir2 !== '' || formComposition !== '' ? (
                    `${calculateSubjectMoyenne(Number(formDevoir1) || 0, Number(formDevoir2) || 0, Number(formComposition) || 0).toFixed(2)} / 20`
                  ) : (
                    <span className="text-slate-400 font-normal font-sans text-xs">
                      {lang === 'ar' ? '— فارغ —' : '— Vierge —'}
                    </span>
                  )}
                </div>
              </div>

              {/* Appreciation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.appreciation} (بالعربية / Français):
                </label>
                <input
                  type="text"
                  value={formAppreciationAr}
                  onChange={(e) => setFormAppreciationAr(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 mb-2 focus:border-emerald-600 outline-hidden"
                  placeholder="ملاحظة الأستاذ بالعربية"
                />
                <input
                  type="text"
                  value={formAppreciationFr}
                  onChange={(e) => setFormAppreciationFr(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                  placeholder="Observation en français"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingGradeRecord(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
