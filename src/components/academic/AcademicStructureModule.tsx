import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AcademicCycle, SecondaryStream, ClassRoom, Subject, CycleConfig, ClassSubject } from '../../types';
import {
  Layers,
  GraduationCap,
  BookOpen,
  Scale,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Users,
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  BookMarked,
  SlidersHorizontal,
} from 'lucide-react';

export const AcademicStructureModule: React.FC = () => {
  const {
    lang,
    cyclesConfig,
    updateCycleConfig,
    toggleCycleActive,
    resetCyclesConfig,
    classes,
    addClass,
    updateClass,
    deleteClass,
    resetClasses,
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    resetSubjects,
    classSubjects,
    assignSubjectToClass,
    removeClassSubject,
    resetClassSubjects,
    resetAllAcademicStructure,
    teachers,
    students,
    showToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'cycles' | 'classes' | 'subjects' | 'coefficients'>('classes');

  // Filters for Classes
  const [classSearch, setClassSearch] = useState('');
  const [classCycleFilter, setClassCycleFilter] = useState<string>('all');
  const [classStreamFilter, setClassStreamFilter] = useState<string>('all');

  // Filters for Subjects
  const [subjectSearch, setSubjectSearch] = useState('');
  const [subjectNatureFilter, setSubjectNatureFilter] = useState<string>('all');
  const [subjectLangFilter, setSubjectLangFilter] = useState<string>('all');
  const [subjectCycleFilter, setSubjectCycleFilter] = useState<string>('all');

  // State for Class Modals
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [classFormData, setClassFormData] = useState({
    code: '',
    nameAr: '',
    nameFr: '',
    cycle: 'lycee' as AcademicCycle,
    levelNumber: 7,
    stream: 'D' as SecondaryStream,
    roomNumber: '',
    mainTeacherId: '',
    capacity: 35,
    nationalExam: 'BAC' as 'CEP' | 'BEPC' | 'BAC' | null,
  });

  // State for Subject Modals
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectFormData, setSubjectFormData] = useState({
    code: '',
    nameAr: '',
    nameFr: '',
    language: 'fr' as 'ar' | 'fr',
    defaultCoefficient: 3,
    isScientific: true,
    weeklyHours: 3,
    applicableCycles: ['lycee'] as AcademicCycle[],
    descriptionAr: '',
    descriptionFr: '',
  });

  // State for Cycle Modal
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState<CycleConfig | null>(null);
  const [cycleFormData, setCycleFormData] = useState<Partial<CycleConfig>>({});

  // State for Coefficients Tab
  const [selectedClassForCoeff, setSelectedClassForCoeff] = useState<string>(classes[0]?.id || '');
  const [isAddSubjectToClassModal, setIsAddSubjectToClassModal] = useState(false);
  const [addSubjectToClassForm, setAddSubjectToClassForm] = useState({
    subjectId: '',
    coefficient: 3,
    teacherId: '',
    weeklyHours: 3,
  });

  // Reset confirmation modal
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Quick statistics
  const totalCapacity = classes.reduce((sum, c) => sum + c.capacity, 0);
  const totalEnrolled = students.length;
  const totalScientificSubjects = subjects.filter((s) => s.isScientific).length;
  const totalLiterarySubjects = subjects.filter((s) => !s.isScientific).length;

  // Selected class in Coefficients tab
  const activeClassObj = classes.find((c) => c.id === selectedClassForCoeff) || classes[0];
  const activeClassSubjects = classSubjects.filter((cs) => cs.classId === activeClassObj?.id);
  const activeClassTotalCoeffs = activeClassSubjects.reduce((sum, cs) => sum + cs.coefficient, 0);
  const activeClassTotalHours = activeClassSubjects.reduce((sum, cs) => sum + (cs.weeklyHours || 2), 0);

  // --- Handlers for Classes ---
  const handleOpenAddClass = () => {
    setEditingClass(null);
    setClassFormData({
      code: '',
      nameAr: '',
      nameFr: '',
      cycle: 'lycee',
      levelNumber: 7,
      stream: 'D',
      roomNumber: `القاعة ${(classes.length + 1).toString().padStart(2, '0')}`,
      mainTeacherId: teachers[0]?.id || '',
      capacity: 35,
      nationalExam: 'BAC',
    });
    setIsClassModalOpen(true);
  };

  const handleOpenEditClass = (cls: ClassRoom) => {
    setEditingClass(cls);
    setClassFormData({
      code: cls.code,
      nameAr: cls.nameAr,
      nameFr: cls.nameFr,
      cycle: cls.cycle,
      levelNumber: cls.levelNumber,
      stream: cls.stream,
      roomNumber: cls.roomNumber,
      mainTeacherId: cls.mainTeacherId,
      capacity: cls.capacity,
      nationalExam: cls.nationalExam || null,
    });
    setIsClassModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classFormData.code.trim()) {
      showToast(lang === 'ar' ? 'يرجى إدخال رمز القسم (Code)' : 'Veuillez saisir le code de la classe');
      return;
    }

    if (editingClass) {
      updateClass(editingClass.id, {
        code: classFormData.code.trim(),
        nameAr: classFormData.nameAr.trim() || classFormData.code,
        nameFr: classFormData.nameFr.trim() || classFormData.code,
        cycle: classFormData.cycle,
        levelNumber: Number(classFormData.levelNumber),
        stream: classFormData.cycle === 'lycee' ? classFormData.stream : 'none',
        roomNumber: classFormData.roomNumber.trim(),
        mainTeacherId: classFormData.mainTeacherId,
        capacity: Number(classFormData.capacity) || 30,
        nationalExam: classFormData.nationalExam,
      });
    } else {
      addClass({
        code: classFormData.code.trim(),
        nameAr: classFormData.nameAr.trim() || classFormData.code,
        nameFr: classFormData.nameFr.trim() || classFormData.code,
        cycle: classFormData.cycle,
        levelNumber: Number(classFormData.levelNumber),
        stream: classFormData.cycle === 'lycee' ? classFormData.stream : 'none',
        roomNumber: classFormData.roomNumber.trim(),
        mainTeacherId: classFormData.mainTeacherId,
        capacity: Number(classFormData.capacity) || 30,
        nationalExam: classFormData.nationalExam,
      });
    }
    setIsClassModalOpen(false);
  };

  // --- Handlers for Subjects ---
  const handleOpenAddSubject = () => {
    setEditingSubject(null);
    setSubjectFormData({
      code: '',
      nameAr: '',
      nameFr: '',
      language: 'fr',
      defaultCoefficient: 3,
      isScientific: true,
      weeklyHours: 3,
      applicableCycles: ['lycee'],
      descriptionAr: '',
      descriptionFr: '',
    });
    setIsSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (sub: Subject) => {
    setEditingSubject(sub);
    setSubjectFormData({
      code: sub.code,
      nameAr: sub.nameAr,
      nameFr: sub.nameFr,
      language: sub.language,
      defaultCoefficient: sub.defaultCoefficient,
      isScientific: sub.isScientific,
      weeklyHours: sub.weeklyHours || 2,
      applicableCycles: sub.applicableCycles || ['fundamental', 'college', 'lycee'],
      descriptionAr: sub.descriptionAr || '',
      descriptionFr: sub.descriptionFr || '',
    });
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectFormData.nameAr.trim() || !subjectFormData.code.trim()) {
      showToast(lang === 'ar' ? 'يرجى إدخال اسم المادة ورمزها المختصر' : 'Veuillez renseigner le nom et le code');
      return;
    }

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        code: subjectFormData.code.trim().toUpperCase(),
        nameAr: subjectFormData.nameAr.trim(),
        nameFr: subjectFormData.nameFr.trim() || subjectFormData.nameAr.trim(),
        language: subjectFormData.language,
        defaultCoefficient: Number(subjectFormData.defaultCoefficient) || 1,
        isScientific: subjectFormData.isScientific,
        weeklyHours: Number(subjectFormData.weeklyHours) || 2,
        applicableCycles: subjectFormData.applicableCycles,
        descriptionAr: subjectFormData.descriptionAr.trim(),
        descriptionFr: subjectFormData.descriptionFr.trim(),
      });
    } else {
      addSubject({
        code: subjectFormData.code.trim().toUpperCase(),
        nameAr: subjectFormData.nameAr.trim(),
        nameFr: subjectFormData.nameFr.trim() || subjectFormData.nameAr.trim(),
        language: subjectFormData.language,
        defaultCoefficient: Number(subjectFormData.defaultCoefficient) || 1,
        isScientific: subjectFormData.isScientific,
        weeklyHours: Number(subjectFormData.weeklyHours) || 2,
        applicableCycles: subjectFormData.applicableCycles,
        descriptionAr: subjectFormData.descriptionAr.trim(),
        descriptionFr: subjectFormData.descriptionFr.trim(),
      });
    }
    setIsSubjectModalOpen(false);
  };

  // --- Handlers for Cycle Edit ---
  const handleOpenEditCycle = (cycle: CycleConfig) => {
    setEditingCycle(cycle);
    setCycleFormData({ ...cycle });
    setIsCycleModalOpen(true);
  };

  const handleSaveCycle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCycle) return;
    updateCycleConfig(editingCycle.id, cycleFormData);
    setIsCycleModalOpen(false);
  };

  // --- Handlers for Coefficients / Attribution ---
  const handleOpenAddSubjectToClass = () => {
    const existingSubjectIds = activeClassSubjects.map((cs) => cs.subjectId);
    const available = subjects.filter((s) => !existingSubjectIds.includes(s.id));
    if (available.length === 0) {
      showToast(lang === 'ar' ? 'كافة المواد مدرجة بالفعل في هذا القسم' : 'Toutes les matières sont déjà assignées');
      return;
    }
    const defaultSub = available[0];
    setAddSubjectToClassForm({
      subjectId: defaultSub.id,
      coefficient: defaultSub.defaultCoefficient || 3,
      teacherId: teachers[0]?.id || '',
      weeklyHours: defaultSub.weeklyHours || 3,
    });
    setIsAddSubjectToClassModal(true);
  };

  const handleSaveSubjectToClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClassObj || !addSubjectToClassForm.subjectId) return;
    assignSubjectToClass(
      activeClassObj.id,
      addSubjectToClassForm.subjectId,
      Number(addSubjectToClassForm.coefficient) || 1,
      addSubjectToClassForm.teacherId,
      Number(addSubjectToClassForm.weeklyHours) || 2
    );
    setIsAddSubjectToClassModal(false);
  };

  // Quick Preset / Template Applicator
  const applyOfficialTemplate = (type: 'bac_d' | 'bac_c' | 'bepc' | 'cep') => {
    if (!activeClassObj) return;

    if (type === 'bac_d') {
      const templates = [
        { code: 'SVT', coeff: 6, hours: 5 },
        { code: 'PC', coeff: 5, hours: 4 },
        { code: 'MATH', coeff: 5, hours: 5 },
        { code: 'FRAN', coeff: 3, hours: 4 },
        { code: 'ARAB', coeff: 2, hours: 3 },
        { code: 'ANGL', coeff: 2, hours: 2 },
        { code: 'ISLAM', coeff: 2, hours: 2 },
        { code: 'PHIL', coeff: 2, hours: 2 },
        { code: 'EPS', coeff: 1, hours: 2 },
      ];
      templates.forEach((tpl) => {
        const sub = subjects.find((s) => s.code === tpl.code);
        if (sub) {
          assignSubjectToClass(activeClassObj.id, sub.id, tpl.coeff, teachers[0]?.id || '', tpl.hours);
        }
      });
      showToast(lang === 'ar' ? 'تم تطبيق المعاملات الرسمية للبكالوريا شعبة العلوم الطبيعية (D)' : 'Modèle officiel Bac D appliqué');
    } else if (type === 'bac_c') {
      const templates = [
        { code: 'MATH', coeff: 9, hours: 7 },
        { code: 'PC', coeff: 6, hours: 5 },
        { code: 'SVT', coeff: 2, hours: 2 },
        { code: 'FRAN', coeff: 3, hours: 4 },
        { code: 'ARAB', coeff: 2, hours: 3 },
        { code: 'ANGL', coeff: 2, hours: 2 },
        { code: 'ISLAM', coeff: 2, hours: 2 },
        { code: 'PHIL', coeff: 2, hours: 2 },
        { code: 'EPS', coeff: 1, hours: 2 },
      ];
      templates.forEach((tpl) => {
        const sub = subjects.find((s) => s.code === tpl.code);
        if (sub) {
          assignSubjectToClass(activeClassObj.id, sub.id, tpl.coeff, teachers[0]?.id || '', tpl.hours);
        }
      });
      showToast(lang === 'ar' ? 'تم تطبيق المعاملات الرسمية للبكالوريا شعبة الرياضيات (C)' : 'Modèle officiel Bac C appliqué');
    } else if (type === 'bepc') {
      const templates = [
        { code: 'MATH', coeff: 4, hours: 5 },
        { code: 'ARAB', coeff: 4, hours: 5 },
        { code: 'FRAN', coeff: 4, hours: 5 },
        { code: 'PC', coeff: 3, hours: 3 },
        { code: 'SVT', coeff: 3, hours: 3 },
        { code: 'ISLAM', coeff: 3, hours: 2 },
        { code: 'HG', coeff: 2, hours: 2 },
        { code: 'ANGL', coeff: 2, hours: 2 },
        { code: 'EPS', coeff: 1, hours: 2 },
      ];
      templates.forEach((tpl) => {
        const sub = subjects.find((s) => s.code === tpl.code);
        if (sub) {
          assignSubjectToClass(activeClassObj.id, sub.id, tpl.coeff, teachers[0]?.id || '', tpl.hours);
        }
      });
      showToast(lang === 'ar' ? 'تم تطبيق المعاملات الرسمية لشهادة الإعدادية (BEPC)' : 'Modèle officiel BEPC appliqué');
    } else if (type === 'cep') {
      const templates = [
        { code: 'ARAB', coeff: 5, hours: 8 },
        { code: 'MATH', coeff: 5, hours: 6 },
        { code: 'FRAN', coeff: 4, hours: 6 },
        { code: 'ISLAM', coeff: 3, hours: 3 },
        { code: 'SVT', coeff: 2, hours: 2 },
        { code: 'HG', coeff: 2, hours: 2 },
        { code: 'CIV', coeff: 1, hours: 1 },
        { code: 'EPS', coeff: 1, hours: 2 },
      ];
      templates.forEach((tpl) => {
        const sub = subjects.find((s) => s.code === tpl.code);
        if (sub) {
          assignSubjectToClass(activeClassObj.id, sub.id, tpl.coeff, teachers[0]?.id || '', tpl.hours);
        }
      });
      showToast(lang === 'ar' ? 'تم تطبيق المعاملات الرسمية لمسابقة دخول الإعدادية (CEP)' : 'Modèle officiel CEP appliqué');
    }
  };

  // Filtered Classes
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.code.toLowerCase().includes(classSearch.toLowerCase()) ||
      cls.nameAr.toLowerCase().includes(classSearch.toLowerCase()) ||
      cls.nameFr.toLowerCase().includes(classSearch.toLowerCase()) ||
      cls.roomNumber.toLowerCase().includes(classSearch.toLowerCase());
    const matchesCycle = classCycleFilter === 'all' || cls.cycle === classCycleFilter;
    const matchesStream = classStreamFilter === 'all' || cls.stream === classStreamFilter;
    return matchesSearch && matchesCycle && matchesStream;
  });

  // Filtered Subjects
  const filteredSubjects = subjects.filter((sub) => {
    const matchesSearch =
      sub.nameAr.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      sub.nameFr.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      sub.code.toLowerCase().includes(subjectSearch.toLowerCase());
    const matchesNature =
      subjectNatureFilter === 'all'
        ? true
        : subjectNatureFilter === 'scientific'
        ? sub.isScientific
        : !sub.isScientific;
    const matchesLang = subjectLangFilter === 'all' || sub.language === subjectLangFilter;
    const matchesCycle =
      subjectCycleFilter === 'all' ||
      (sub.applicableCycles && sub.applicableCycles.includes(subjectCycleFilter as AcademicCycle));
    return matchesSearch && matchesNature && matchesLang && matchesCycle;
  });

  // Stream Labels
  const streamLabels: Record<SecondaryStream, { ar: string; fr: string; color: string }> = {
    D: { ar: 'علوم طبيعية (D)', fr: 'Sciences Naturelles (D)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    C: { ar: 'رياضيات (C)', fr: 'Mathématiques (C)', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    LM: { ar: 'آداب عصرية (LM)', fr: 'Lettres Modernes (LM)', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    LO: { ar: 'آداب أصلية (LO)', fr: 'Lettres Originelles (LO)', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    none: { ar: 'عام / بدون شعبة', fr: 'Enseignement Général', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  };

  // Cycle Labels
  const cycleLabels: Record<AcademicCycle, { ar: string; fr: string }> = {
    fundamental: { ar: 'التعليم الأساسي (الابتدائي)', fr: 'Enseignement Fondamental' },
    college: { ar: 'التعليم الإعدادي', fr: 'Enseignement Collégial' },
    lycee: { ar: 'التعليم الثانوي', fr: 'Enseignement Secondaire (Lycée)' },
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute top-0 end-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'النظام التربوي والمسارات الموريتانية' : 'Système Éducatif Mauritanien'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {lang === 'ar' ? 'الهيكلة البيداغوجية: الأطوار، الأقسام، والمواد' : 'Structure Pédagogique : Cycles, Classes & Matières'}
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              {lang === 'ar'
                ? 'لوحة الإدارة الشاملة للمسارات التعليمية في المؤسسة: تفعيل الأطوار (ابتدائي، إعدادي، ثانوي)، تشكيل الفصول والقاعات، إدارة بنك المواد، وتوزيع المعاملات الرسمية وحصص الأساتذة.'
                : 'Gestion complète des cycles d’enseignement, constitution des classes, banque des disciplines et attribution des coefficients nationaux.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleOpenAddClass}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إضافة قسم جديد' : 'Nouvelle Classe'}</span>
            </button>
            <button
              onClick={handleOpenAddSubject}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold rounded-xl transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إضافة مادة' : 'Nouvelle Matière'}</span>
            </button>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              title={lang === 'ar' ? 'استعادة التشكيل الافتراضي' : 'Réinitialiser la structure'}
              className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-700/60 text-xs sm:text-sm">
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <div className="text-slate-400 text-[11px] font-medium">
              {lang === 'ar' ? 'الأطوار النشطة بالمؤسسة' : 'Cycles d’Enseignement'}
            </div>
            <div className="text-lg sm:text-xl font-bold text-emerald-400 mt-1">
              <bdi dir="ltr">{cyclesConfig.filter((c) => c.isActive).length} / 3</bdi>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <div className="text-slate-400 text-[11px] font-medium">
              {lang === 'ar' ? 'إجمالي الفصول المفتوحة' : 'Classes Opérationnelles'}
            </div>
            <div className="text-lg sm:text-xl font-bold text-white mt-1">
              <bdi dir="ltr">{classes.length}</bdi>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <div className="text-slate-400 text-[11px] font-medium">
              {lang === 'ar' ? 'المواد والمقررات المعتمدة' : 'Disciplines Enseignées'}
            </div>
            <div className="text-lg sm:text-xl font-bold text-white mt-1">
              <bdi dir="ltr">{subjects.length}</bdi>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <div className="text-slate-400 text-[11px] font-medium">
              {lang === 'ar' ? 'نسبة إشغال المقاعد' : 'Taux d’Occupation'}
            </div>
            <div className="text-lg sm:text-xl font-bold text-amber-400 mt-1">
              <bdi dir="ltr">{totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0}%</bdi>
              <span className="text-[11px] text-slate-400 font-normal ms-1.5">
                ({totalEnrolled}/{totalCapacity})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('classes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeSubTab === 'classes'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{lang === 'ar' ? 'الأقسام والفصول الدراسية' : 'Classes & Salles'}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeSubTab === 'classes' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {classes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('coefficients')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeSubTab === 'coefficients'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>{lang === 'ar' ? 'توزيع المعاملات والمقررات' : 'Coefficients & Attribution'}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeSubTab === 'coefficients' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {classSubjects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('subjects')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeSubTab === 'subjects'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{lang === 'ar' ? 'بنك المواد والمقررات' : 'Matières & Disciplines'}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeSubTab === 'subjects' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {subjects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('cycles')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeSubTab === 'cycles'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{lang === 'ar' ? 'الأطوار التعليمية' : 'Cycles d’Enseignement'}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeSubTab === 'cycles' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
            3
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CLASSES (الأقسام والفصول) */}
      {/* ========================================================================= */}
      {activeSubTab === 'classes' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                  placeholder={lang === 'ar' ? 'بحث برمز القسم، القاعة، أو الاسم...' : 'Recherche par code, salle, nom...'}
                  className="w-full ps-9 pe-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <select
                value={classCycleFilter}
                onChange={(e) => setClassCycleFilter(e.target.value)}
                className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">{lang === 'ar' ? 'كافة الأطوار' : 'Tous les cycles'}</option>
                <option value="fundamental">{lang === 'ar' ? 'الأساسي (ابتدائي)' : 'Fondamental'}</option>
                <option value="college">{lang === 'ar' ? 'الإعدادي' : 'Collège'}</option>
                <option value="lycee">{lang === 'ar' ? 'الثانوي' : 'Lycée'}</option>
              </select>

              <select
                value={classStreamFilter}
                onChange={(e) => setClassStreamFilter(e.target.value)}
                className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">{lang === 'ar' ? 'كافة الشعب' : 'Toutes les séries'}</option>
                <option value="D">D (علوم طبيعية)</option>
                <option value="C">C (رياضيات)</option>
                <option value="LM">LM (آداب عصرية)</option>
                <option value="LO">LO (آداب أصلية)</option>
                <option value="none">{lang === 'ar' ? 'عام' : 'Général'}</option>
              </select>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="text-xs text-slate-500 font-medium">
                {lang === 'ar' ? 'عدد النتائج:' : 'Résultats :'} <bdi dir="ltr" className="font-bold text-slate-800">{filteredClasses.length}</bdi>
              </span>
              <button
                onClick={handleOpenAddClass}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة قسم' : 'Ajouter'}</span>
              </button>
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredClasses.map((cls) => {
              const classSubs = classSubjects.filter((cs) => cs.classId === cls.id);
              const totalCoeff = classSubs.reduce((sum, cs) => sum + cs.coefficient, 0);
              const mainTeacher = teachers.find((t) => t.id === cls.mainTeacherId);
              const occupancy = cls.capacity > 0 ? Math.round((cls.studentsCount / cls.capacity) * 100) : 0;

              return (
                <div
                  key={cls.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Header: Code & Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-slate-900 tracking-tight font-mono">
                            <bdi dir="ltr">{cls.code}</bdi>
                          </span>
                          {cls.nationalExam && (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 rounded-full text-[10px] font-black tracking-wider">
                              {cls.nationalExam}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">
                          {lang === 'ar' ? cls.nameAr : cls.nameFr}
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${streamLabels[cls.stream]?.color || 'bg-slate-100 text-slate-700'}`}>
                        {lang === 'ar' ? streamLabels[cls.stream]?.ar : streamLabels[cls.stream]?.fr}
                      </span>
                    </div>

                    {/* Room & Teacher */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lang === 'ar' ? 'القاعة:' : 'Salle :'}</span>
                        </span>
                        <span className="font-bold text-slate-800">{cls.roomNumber || '-'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lang === 'ar' ? 'الأستاذ المسؤول:' : 'Prof. Principal :'}</span>
                        </span>
                        <span className="font-semibold text-emerald-800 truncate max-w-[150px]">
                          {mainTeacher ? (lang === 'ar' ? `${mainTeacher.firstNameAr} ${mainTeacher.lastNameAr}` : `${mainTeacher.firstNameFr} ${mainTeacher.lastNameFr}`) : (lang === 'ar' ? 'غير محدد' : 'Non assigné')}
                        </span>
                      </div>
                    </div>

                    {/* Capacity & Occupancy Progress */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-600 font-medium">
                        <span>{lang === 'ar' ? 'التلاميذ المسجلون:' : 'Effectif élèves :'}</span>
                        <span className="font-bold text-slate-800">
                          <bdi dir="ltr">{cls.studentsCount} / {cls.capacity}</bdi>
                          <span className="text-[11px] text-slate-500 ms-1">({occupancy}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            occupancy > 95 ? 'bg-rose-500' : occupancy > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(occupancy, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Subjects and Coefficients Counter */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {lang === 'ar' ? 'المواد المقررة:' : 'Matières :'} <bdi dir="ltr" className="font-bold text-slate-700">{classSubs.length}</bdi>
                      </span>
                      <span>
                        {lang === 'ar' ? 'مجموع المعاملات:' : 'Total Coeff :'} <bdi dir="ltr" className="font-bold text-emerald-700 font-mono">{totalCoeff}</bdi>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 gap-2">
                    <button
                      onClick={() => {
                        setSelectedClassForCoeff(cls.id);
                        setActiveSubTab('coefficients');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'المعاملات والمقرر' : 'Coefficients'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditClass(cls)}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title={lang === 'ar' ? 'تعديل القسم' : 'Modifier'}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(lang === 'ar' ? `هل أنت متأكد من حذف القسم "${cls.nameAr || cls.code}"؟` : `Supprimer la classe "${cls.code}" ?`)) {
                            deleteClass(cls.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title={lang === 'ar' ? 'حذف القسم' : 'Supprimer'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredClasses.length === 0 && (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-slate-700 font-bold">{lang === 'ar' ? 'لم يتم العثور على أقسام مطابقة للبحث' : 'Aucune classe trouvée'}</div>
              <p className="text-xs text-slate-500">{lang === 'ar' ? 'يمكنك ضبط فلاتر البحث أو إضافة فصل دراسي جديد' : 'Modifiez vos filtres ou ajoutez une classe'}</p>
              <button
                onClick={handleOpenAddClass}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة قسم جديد الآن' : 'Ajouter une classe'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COEFFICIENTS & ATTRIBUTION (توزيع المعاملات والمقررات) */}
      {/* ========================================================================= */}
      {activeSubTab === 'coefficients' && (
        <div className="space-y-6">
          {/* Class Selector & Header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === 'ar' ? 'اختر القسم الدراسي لعرض وتعديل مواده ومعاملاته:' : 'Sélectionnez la classe pour gérer son programme :'}
                </label>
                <select
                  value={selectedClassForCoeff}
                  onChange={(e) => setSelectedClassForCoeff(e.target.value)}
                  className="w-full sm:w-96 text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-300 bg-emerald-50/30 text-emerald-950 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {lang === 'ar' ? c.nameAr : c.nameFr} ({c.roomNumber})
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Summary Badges */}
              {activeClassObj && (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <div className="text-[10px] text-emerald-700 font-medium">{lang === 'ar' ? 'مجموع المعاملات' : 'Total Coeff'}</div>
                    <div className="text-base font-black text-emerald-900 font-mono">
                      <bdi dir="ltr">{activeClassTotalCoeffs}</bdi>
                    </div>
                  </div>
                  <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-center">
                    <div className="text-[10px] text-blue-700 font-medium">{lang === 'ar' ? 'الحصص الأسبوعية' : 'Volume horaire'}</div>
                    <div className="text-base font-black text-blue-900 font-mono">
                      <bdi dir="ltr">{activeClassTotalHours} h</bdi>
                    </div>
                  </div>
                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <div className="text-[10px] text-slate-500 font-medium">{lang === 'ar' ? 'عدد المواد' : 'Matières'}</div>
                    <div className="text-base font-black text-slate-800 font-mono">
                      <bdi dir="ltr">{activeClassSubjects.length}</bdi>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Template Presets */}
            {activeClassObj && (
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{lang === 'ar' ? 'نماذج المعاملات الرسمية:' : 'Modèles officiels :'}</span>
                  </span>
                  <button
                    onClick={() => applyOfficialTemplate('bac_d')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg text-slate-700 font-medium transition-colors"
                  >
                    {lang === 'ar' ? 'نموذج بكالوريا D' : 'Bac D'}
                  </button>
                  <button
                    onClick={() => applyOfficialTemplate('bac_c')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 hover:text-blue-800 rounded-lg text-slate-700 font-medium transition-colors"
                  >
                    {lang === 'ar' ? 'نموذج بكالوريا C' : 'Bac C'}
                  </button>
                  <button
                    onClick={() => applyOfficialTemplate('bepc')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-800 rounded-lg text-slate-700 font-medium transition-colors"
                  >
                    {lang === 'ar' ? 'نموذج شهادة BEPC' : 'Brevet BEPC'}
                  </button>
                  <button
                    onClick={() => applyOfficialTemplate('cep')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-purple-100 hover:text-purple-800 rounded-lg text-slate-700 font-medium transition-colors"
                  >
                    {lang === 'ar' ? 'نموذج مسابقة CEP' : 'Concours CEP'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddSubjectToClass}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'إدراج مادة في القسم' : 'Ajouter une matière'}</span>
                  </button>
                  <button
                    onClick={resetClassSubjects}
                    title={lang === 'ar' ? 'استعادة المعاملات الافتراضية' : 'Restaurer par défaut'}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table of Subjects in this class */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-emerald-700" />
                <span>
                  {lang === 'ar'
                    ? `قائمة المقررات والمعاملات لقسم: ${activeClassObj?.code || ''}`
                    : `Discipline et coefficients pour : ${activeClassObj?.code || ''}`}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                {lang === 'ar' ? 'انقر على المعامل أو الأستاذ لتعديله فورياً' : 'Modifiez directement les valeurs'}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs sm:text-sm">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-start">{lang === 'ar' ? 'المادة الدراسية' : 'Discipline'}</th>
                    <th className="p-3 text-start">{lang === 'ar' ? 'الرمز واللغة' : 'Code & Langue'}</th>
                    <th className="p-3 text-center">{lang === 'ar' ? 'المعامل الرسمي' : 'Coefficient'}</th>
                    <th className="p-3 text-center">{lang === 'ar' ? 'الحصص الأسبوعية' : 'Volume hebdo'}</th>
                    <th className="p-3 text-start">{lang === 'ar' ? 'الأستاذ المسند له التدريس' : 'Enseignant assigné'}</th>
                    <th className="p-3 text-center">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeClassSubjects.map((cs) => {
                    const sub = subjects.find((s) => s.id === cs.subjectId);
                    const teacher = teachers.find((t) => t.id === cs.teacherId);

                    return (
                      <tr key={`${cs.classId}-${cs.subjectId}`} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{sub?.nameAr || cs.subjectId}</div>
                          <div className="text-[11px] text-slate-500">{sub?.nameFr}</div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                              {sub?.code || 'SUB'}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${sub?.language === 'ar' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
                              {sub?.language === 'ar' ? 'العربية' : 'Français'}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min="1"
                            max="15"
                            value={cs.coefficient}
                            onChange={(e) => {
                              const val = Math.max(1, parseInt(e.target.value) || 1);
                              assignSubjectToClass(cs.classId, cs.subjectId, val, cs.teacherId, cs.weeklyHours);
                            }}
                            className="w-16 p-1.5 text-center font-mono font-bold text-emerald-800 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min="1"
                            max="12"
                            value={cs.weeklyHours || 2}
                            onChange={(e) => {
                              const val = Math.max(1, parseInt(e.target.value) || 1);
                              assignSubjectToClass(cs.classId, cs.subjectId, cs.coefficient, cs.teacherId, val);
                            }}
                            className="w-16 p-1.5 text-center font-mono text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
                          />
                          <span className="text-[10px] text-slate-400 ms-1">h</span>
                        </td>
                        <td className="p-3">
                          <select
                            value={cs.teacherId || ''}
                            onChange={(e) => {
                              assignSubjectToClass(cs.classId, cs.subjectId, cs.coefficient, e.target.value, cs.weeklyHours);
                            }}
                            className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-500 max-w-[200px]"
                          >
                            <option value="">{lang === 'ar' ? '-- بدون أستاذ --' : '-- Aucun --'}</option>
                            {teachers.map((tch) => (
                              <option key={tch.id} value={tch.id}>
                                {lang === 'ar' ? `${tch.firstNameAr} ${tch.lastNameAr} (${tch.specialtyAr})` : `${tch.firstNameFr} ${tch.lastNameFr} (${tch.specialtyFr})`}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              if (window.confirm(lang === 'ar' ? `هل أنت متأكد من سحب مادة "${sub?.nameAr}" من مقرر هذا القسم؟` : `Retirer cette matière de la classe ?`)) {
                                removeClassSubject(cs.classId, cs.subjectId);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title={lang === 'ar' ? 'إزالة من هذا القسم' : 'Retirer'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {activeClassSubjects.length === 0 && (
              <div className="p-10 text-center text-slate-500 space-y-3">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="font-bold">{lang === 'ar' ? 'لم يتم إدراج أي مواد بعد في هذا القسم' : 'Aucune matière assignée à cette classe'}</div>
                <p className="text-xs">{lang === 'ar' ? 'اضغط على زر "إدراج مادة" أو اختر نموذجاً رسمياً أعلاه' : 'Appliquez un modèle ou ajoutez manuellement'}</p>
                <button
                  onClick={handleOpenAddSubjectToClass}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  {lang === 'ar' ? 'إدراج مادة الآن' : 'Ajouter'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SUBJECTS (بنك المواد والمقررات) */}
      {/* ========================================================================= */}
      {activeSubTab === 'subjects' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                  placeholder={lang === 'ar' ? 'بحث باسم المادة، الرمز المختصر...' : 'Recherche par nom, code...'}
                  className="w-full ps-9 pe-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <select
                value={subjectNatureFilter}
                onChange={(e) => setSubjectNatureFilter(e.target.value)}
                className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">{lang === 'ar' ? 'كافة التخصصات' : 'Toutes natures'}</option>
                <option value="scientific">{lang === 'ar' ? 'المواد العلمية' : 'Disciplines Scientifiques'}</option>
                <option value="literary">{lang === 'ar' ? 'المواد الأدبية واللغات' : 'Disciplines Littéraires'}</option>
              </select>

              <select
                value={subjectLangFilter}
                onChange={(e) => setSubjectLangFilter(e.target.value)}
                className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">{lang === 'ar' ? 'كافة اللغات' : 'Toutes langues'}</option>
                <option value="ar">{lang === 'ar' ? 'اللغة العربية' : 'Arabe'}</option>
                <option value="fr">{lang === 'ar' ? 'اللغة الفرنسية' : 'Français'}</option>
              </select>

              <select
                value={subjectCycleFilter}
                onChange={(e) => setSubjectCycleFilter(e.target.value)}
                className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">{lang === 'ar' ? 'كافة الأطوار' : 'Tous cycles'}</option>
                <option value="fundamental">{lang === 'ar' ? 'الأساسي' : 'Fondamental'}</option>
                <option value="college">{lang === 'ar' ? 'الإعدادي' : 'Collège'}</option>
                <option value="lycee">{lang === 'ar' ? 'الثانوي' : 'Lycée'}</option>
              </select>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="text-xs text-slate-500 font-medium">
                {lang === 'ar' ? 'إجمالي المواد:' : 'Total :'} <bdi dir="ltr" className="font-bold text-slate-800">{filteredSubjects.length}</bdi>
              </span>
              <button
                onClick={handleOpenAddSubject}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة مادة' : 'Ajouter'}</span>
              </button>
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredSubjects.map((sub) => {
              const assignedClassesCount = classSubjects.filter((cs) => cs.subjectId === sub.id).length;

              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-900 text-sm px-2.5 py-1 bg-slate-100 rounded-lg">
                            <bdi dir="ltr">{sub.code}</bdi>
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.language === 'ar' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
                            {sub.language === 'ar' ? 'اللغة العربية' : 'Français'}
                          </span>
                          {sub.isScientific ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                              {lang === 'ar' ? 'علمية' : 'Scientifique'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              {lang === 'ar' ? 'أدبية / لغات' : 'Littéraire'}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-base text-slate-900 mt-2">
                          {sub.nameAr}
                        </h3>
                        <div className="text-xs text-slate-500 font-medium">
                          {sub.nameFr}
                        </div>
                      </div>
                    </div>

                    {/* Meta stats */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">{lang === 'ar' ? 'المعامل القياسي:' : 'Coeff standard :'}</span>
                        <span className="font-mono font-bold text-emerald-800 text-sm">
                          <bdi dir="ltr">{sub.defaultCoefficient}</bdi>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">{lang === 'ar' ? 'الحصص الأسبوعية:' : 'Volume horaire :'}</span>
                        <span className="font-mono font-bold text-slate-800 text-sm">
                          <bdi dir="ltr">{sub.weeklyHours || 2} h</bdi>
                        </span>
                      </div>
                    </div>

                    {/* Applicable Cycles */}
                    {sub.applicableCycles && sub.applicableCycles.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {lang === 'ar' ? 'الأطوار المطبقة:' : 'Cycles applicables :'}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {sub.applicableCycles.map((c) => (
                            <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-semibold">
                              {c === 'fundamental' ? (lang === 'ar' ? 'الابتدائي (AF)' : 'Primaire') : c === 'college' ? (lang === 'ar' ? 'الإعدادي (AS)' : 'Collège') : (lang === 'ar' ? 'الثانوي' : 'Lycée')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium">
                      {lang === 'ar' ? 'الأقسام المعتمدة بها:' : 'Classes :'} <bdi dir="ltr" className="font-bold text-slate-800">{assignedClassesCount}</bdi>
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditSubject(sub)}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title={lang === 'ar' ? 'تعديل المادة' : 'Modifier'}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(lang === 'ar' ? `هل أنت متأكد من حذف المادة "${sub.nameAr}"؟` : `Supprimer la matière "${sub.nameFr}" ?`)) {
                            deleteSubject(sub.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title={lang === 'ar' ? 'حذف المادة' : 'Supprimer'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CYCLES (الأطوار التعليمية) */}
      {/* ========================================================================= */}
      {activeSubTab === 'cycles' && (
        <div className="space-y-6">
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-emerald-950">
                <div className="font-bold">
                  {lang === 'ar' ? 'إدارة واعتماد الأطوار التعليمية الموريتانية' : 'Configuration des Cycles Nationaux'}
                </div>
                <div className="text-emerald-800 text-xs mt-0.5 leading-relaxed">
                  {lang === 'ar'
                    ? 'يتكون النظام التعليمي الوطني من ثلاثة أطوار متكاملة: التعليم الأساسي (6 سنوات تتوج بمسابقة CEP)، التعليم الإعدادي (4 سنوات تتوج بشهادة BEPC)، والتعليم الثانوي (3 سنوات تتوج بامتحان البكالوريا BAC بمختلف شعبه).'
                    : 'Le système comprend le Primaire (CEP), le Collège (BEPC), et le Secondaire Lycée (Baccalauréat).'}
                </div>
              </div>
            </div>

            <button
              onClick={resetCyclesConfig}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 hover:text-emerald-700 border border-slate-200 rounded-xl text-xs font-bold shrink-0 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'استعادة إعدادات الأطوار' : 'Réinitialiser'}</span>
            </button>
          </div>

          {/* Cycles Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {cyclesConfig.map((cycle) => {
              const cycleClasses = classes.filter((c) => c.cycle === cycle.id);
              const cycleStudentsCount = students.filter((s) => s.cycle === cycle.id).length;

              return (
                <div
                  key={cycle.id}
                  className={`bg-white rounded-2xl border transition-all p-6 space-y-4 shadow-sm flex flex-col justify-between ${
                    cycle.isActive ? 'border-emerald-300 ring-1 ring-emerald-500/20' : 'border-slate-200 opacity-80'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header with Switch */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg">
                        {cycle.shortCode}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {cycle.isActive ? (lang === 'ar' ? 'طور مفعّل' : 'Actif') : (lang === 'ar' ? 'طور معطل' : 'Inactif')}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCycleActive(cycle.id)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                            cycle.isActive ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              cycle.isActive ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900">{cycle.nameAr}</h3>
                      <div className="text-xs text-slate-500 font-medium">{cycle.nameFr}</div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {lang === 'ar' ? cycle.notesAr : cycle.notesFr}
                    </p>

                    {/* Cycle Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        <span className="text-slate-500 text-[10px] block">{lang === 'ar' ? 'الأقسام المفتوحة:' : 'Classes :'}</span>
                        <span className="font-bold text-emerald-900 text-base">
                          <bdi dir="ltr">{cycleClasses.length}</bdi>
                        </span>
                      </div>
                      <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-100">
                        <span className="text-slate-500 text-[10px] block">{lang === 'ar' ? 'التلاميذ المسجلون:' : 'Élèves :'}</span>
                        <span className="font-bold text-blue-900 text-base">
                          <bdi dir="ltr">{cycleStudentsCount}</bdi>
                        </span>
                      </div>
                    </div>

                    {/* Exam & Levels Details */}
                    <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">{lang === 'ar' ? 'المستويات والسنوات:' : 'Niveaux :'}</span>
                        <span className="font-bold text-slate-800">
                          <bdi dir="ltr">{cycle.minLevel} ➔ {cycle.maxLevel}</bdi> ({cycle.maxLevel - cycle.minLevel + 1} {lang === 'ar' ? 'سنوات' : 'ans'})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">{lang === 'ar' ? 'الامتحان / المسابقة:' : 'Examen officiel :'}</span>
                        <span className="font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded font-mono">
                          {cycle.nationalExam}
                        </span>
                      </div>
                      {cycle.streams && cycle.streams.length > 1 && (
                        <div className="pt-2">
                          <span className="text-slate-400 block text-[10px] mb-1">{lang === 'ar' ? 'الشعب المعتمدة في هذا الطور:' : 'Séries disponibles :'}</span>
                          <div className="flex flex-wrap gap-1">
                            {cycle.streams.map((st) => (
                              <span key={st} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono font-bold text-[10px]">
                                {st}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditCycle(cycle)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'تعديل معايير الطور' : 'Modifier les paramètres'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT CLASS */}
      {/* ========================================================================= */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-gradient-to-l from-slate-900 to-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base sm:text-lg">
                  {editingClass
                    ? (lang === 'ar' ? `تعديل بيانات القسم: ${editingClass.code}` : `Modifier la classe : ${editingClass.code}`)
                    : (lang === 'ar' ? 'إضافة قسم / فصل دراسي جديد' : 'Créer une nouvelle classe')}
                </h3>
              </div>
              <button
                onClick={() => setIsClassModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'رمز القسم (Code) *' : 'Code de la classe *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={classFormData.code}
                    onChange={(e) => setClassFormData({ ...classFormData, code: e.target.value })}
                    placeholder="مثال: 7ème D1 أو 4AS2 أو 6AF"
                    className="w-full text-xs sm:text-sm font-bold font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الطور التعليمي *' : 'Cycle d’enseignement *'}
                  </label>
                  <select
                    value={classFormData.cycle}
                    onChange={(e) => {
                      const c = e.target.value as AcademicCycle;
                      setClassFormData({
                        ...classFormData,
                        cycle: c,
                        levelNumber: c === 'fundamental' ? 6 : c === 'college' ? 4 : 7,
                        stream: c === 'lycee' ? 'D' : 'none',
                        nationalExam: c === 'fundamental' ? 'CEP' : c === 'college' ? 'BEPC' : 'BAC',
                      });
                    }}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="fundamental">{lang === 'ar' ? 'التعليم الأساسي (الابتدائي AF)' : 'Fondamental (Primaire)'}</option>
                    <option value="college">{lang === 'ar' ? 'التعليم الإعدادي (AS)' : 'Collège'}</option>
                    <option value="lycee">{lang === 'ar' ? 'التعليم الثانوي (Lycée)' : 'Lycée'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'اسم القسم بالعربية' : 'Nom en arabe'}
                  </label>
                  <input
                    type="text"
                    value={classFormData.nameAr}
                    onChange={(e) => setClassFormData({ ...classFormData, nameAr: e.target.value })}
                    placeholder="السابعة ثانوية (علوم طبيعية - بكالوريا D)"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'اسم القسم بالفرنسية' : 'Nom en français'}
                  </label>
                  <input
                    type="text"
                    value={classFormData.nameFr}
                    onChange={(e) => setClassFormData({ ...classFormData, nameFr: e.target.value })}
                    placeholder="7ème Année D (Terminale Sciences)"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'المستوى الدراسي' : 'Niveau d’études'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={classFormData.levelNumber}
                    onChange={(e) => setClassFormData({ ...classFormData, levelNumber: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400">
                    {classFormData.cycle === 'fundamental' ? '1 إلى 6 AF' : classFormData.cycle === 'college' ? '1 إلى 4 AS' : '5 إلى 7 ثانوي'}
                  </span>
                </div>

                {classFormData.cycle === 'lycee' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'الشعبة الثانوية' : 'Série / Filière'}
                    </label>
                    <select
                      value={classFormData.stream}
                      onChange={(e) => setClassFormData({ ...classFormData, stream: e.target.value as SecondaryStream })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="D">D (علوم طبيعية)</option>
                      <option value="C">C (رياضيات)</option>
                      <option value="LM">LM (آداب عصرية)</option>
                      <option value="LO">LO (آداب أصلية)</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'الشعبة' : 'Filière'}
                    </label>
                    <input
                      type="text"
                      disabled
                      value={lang === 'ar' ? 'تعليم عام' : 'Général'}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الامتحان الوطني' : 'Examen National'}
                  </label>
                  <select
                    value={classFormData.nationalExam || 'none'}
                    onChange={(e) => {
                      const v = e.target.value;
                      setClassFormData({ ...classFormData, nationalExam: v === 'none' ? null : (v as 'CEP' | 'BEPC' | 'BAC') });
                    }}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="none">{lang === 'ar' ? 'بدون امتحان وطني' : 'Aucun'}</option>
                    <option value="CEP">CEP (دخول الإعدادية)</option>
                    <option value="BEPC">BEPC (ختم الإعدادية)</option>
                    <option value="BAC">BAC (البكالوريا)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'رقم القاعة المخصصة' : 'Numéro de la salle'}
                  </label>
                  <input
                    type="text"
                    value={classFormData.roomNumber}
                    onChange={(e) => setClassFormData({ ...classFormData, roomNumber: e.target.value })}
                    placeholder="القاعة 12 (Bâtiment B)"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الطاقة الاستيعابية (مقعد)' : 'Capacité max'}
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="60"
                    value={classFormData.capacity}
                    onChange={(e) => setClassFormData({ ...classFormData, capacity: parseInt(e.target.value) || 30 })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الأستاذ المسؤول / الرئيسي' : 'Professeur principal'}
                  </label>
                  <select
                    value={classFormData.mainTeacherId}
                    onChange={(e) => setClassFormData({ ...classFormData, mainTeacherId: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">{lang === 'ar' ? '-- بدون تحديد --' : '-- Aucun --'}</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {lang === 'ar' ? `${t.firstNameAr} ${t.lastNameAr} (${t.specialtyAr})` : `${t.firstNameFr} ${t.lastNameFr}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  {editingClass ? (lang === 'ar' ? 'حفظ التعديلات' : 'Enregistrer') : (lang === 'ar' ? 'إنشاء القسم' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT SUBJECT */}
      {/* ========================================================================= */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-gradient-to-l from-slate-900 to-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base sm:text-lg">
                  {editingSubject
                    ? (lang === 'ar' ? `تعديل المادة: ${editingSubject.nameAr}` : `Modifier la matière : ${editingSubject.nameFr}`)
                    : (lang === 'ar' ? 'إضافة مادة دراسية جديدة' : 'Ajouter une matière')}
                </h3>
              </div>
              <button
                onClick={() => setIsSubjectModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'رمز المادة المختصر (Code) *' : 'Code matière *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={subjectFormData.code}
                    onChange={(e) => setSubjectFormData({ ...subjectFormData, code: e.target.value.toUpperCase() })}
                    placeholder="مثال: MATH أو INFO أو PHIL"
                    className="w-full text-xs sm:text-sm font-bold font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'لغة التدريس *' : 'Langue d’enseignement *'}
                  </label>
                  <select
                    value={subjectFormData.language}
                    onChange={(e) => setSubjectFormData({ ...subjectFormData, language: e.target.value as 'ar' | 'fr' })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ar">{lang === 'ar' ? 'اللغة العربية' : 'Arabe'}</option>
                    <option value="fr">{lang === 'ar' ? 'اللغة الفرنسية' : 'Français'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'اسم المادة بالعربية *' : 'Nom en arabe *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={subjectFormData.nameAr}
                    onChange={(e) => setSubjectFormData({ ...subjectFormData, nameAr: e.target.value })}
                    placeholder="مثال: الفلسفة والفكر الإسلامي"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'اسم المادة بالفرنسية' : 'Nom en français'}
                  </label>
                  <input
                    type="text"
                    value={subjectFormData.nameFr}
                    onChange={(e) => setSubjectFormData({ ...subjectFormData, nameFr: e.target.value })}
                    placeholder="Ex: Philosophie & Pensée"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'المعامل القياسي الافتراضي' : 'Coefficient par défaut'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={subjectFormData.defaultCoefficient}
                    onChange={(e) => setSubjectFormData({ ...subjectFormData, defaultCoefficient: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الحصص الأسبوعية المقترحة' : 'Volume horaire hebdo'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={subjectFormData.weeklyHours}
                    onChange={(e) => setSubjectFormData({ ...subjectFormData, weeklyHours: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Is Scientific Checkbox */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isScientificCheck"
                  checked={subjectFormData.isScientific}
                  onChange={(e) => setSubjectFormData({ ...subjectFormData, isScientific: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="isScientificCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                  {lang === 'ar' ? 'تصنيف المادة كمادة علمية (Sciences / Maths / Tech)' : 'Discipline scientifique (Sciences / Mathématiques)'}
                </label>
              </div>

              {/* Applicable Cycles Checkboxes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {lang === 'ar' ? 'الأطوار التعليمية التي تدرس فيها هذه المادة:' : 'Cycles d’enseignement applicables :'}
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['fundamental', 'college', 'lycee'] as AcademicCycle[]).map((c) => {
                    const isChecked = subjectFormData.applicableCycles.includes(c);
                    return (
                      <label
                        key={c}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                          isChecked ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <span>{c === 'fundamental' ? (lang === 'ar' ? 'الأساسي' : 'Primaire') : c === 'college' ? (lang === 'ar' ? 'الإعدادي' : 'Collège') : (lang === 'ar' ? 'الثانوي' : 'Lycée')}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSubjectFormData({ ...subjectFormData, applicableCycles: [...subjectFormData.applicableCycles, c] });
                            } else {
                              setSubjectFormData({ ...subjectFormData, applicableCycles: subjectFormData.applicableCycles.filter((item) => item !== c) });
                            }
                          }}
                          className="w-3.5 h-3.5 text-emerald-600 rounded"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  {editingSubject ? (lang === 'ar' ? 'حفظ التعديلات' : 'Enregistrer') : (lang === 'ar' ? 'إضافة المادة' : 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT CYCLE CONFIG */}
      {/* ========================================================================= */}
      {isCycleModalOpen && editingCycle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 bg-gradient-to-l from-slate-900 to-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">
                  {lang === 'ar' ? `تعديل الطور: ${editingCycle.nameAr}` : `Modifier : ${editingCycle.nameFr}`}
                </h3>
              </div>
              <button
                onClick={() => setIsCycleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCycle} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'اسم الطور بالعربية' : 'Nom en arabe'}
                </label>
                <input
                  type="text"
                  value={cycleFormData.nameAr || ''}
                  onChange={(e) => setCycleFormData({ ...cycleFormData, nameAr: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'اسم الطور بالفرنسية' : 'Nom en français'}
                </label>
                <input
                  type="text"
                  value={cycleFormData.nameFr || ''}
                  onChange={(e) => setCycleFormData({ ...cycleFormData, nameFr: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'أدنى مستوى' : 'Niveau Min'}
                  </label>
                  <input
                    type="number"
                    value={cycleFormData.minLevel || 1}
                    onChange={(e) => setCycleFormData({ ...cycleFormData, minLevel: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'أقصى مستوى' : 'Niveau Max'}
                  </label>
                  <input
                    type="number"
                    value={cycleFormData.maxLevel || 6}
                    onChange={(e) => setCycleFormData({ ...cycleFormData, maxLevel: parseInt(e.target.value) || 6 })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'الامتحان أو المسابقة الوطنية المعتمدة' : 'Examen national'}
                </label>
                <input
                  type="text"
                  value={cycleFormData.nationalExam || 'CEP'}
                  onChange={(e) => setCycleFormData({ ...cycleFormData, nationalExam: e.target.value as any })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'الملاحظات الإدارية والبيداغوجية' : 'Observations pédagogiques'}
                </label>
                <textarea
                  rows={2}
                  value={cycleFormData.notesAr || ''}
                  onChange={(e) => setCycleFormData({ ...cycleFormData, notesAr: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCycleModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  {lang === 'ar' ? 'حفظ' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD SUBJECT TO CLASS */}
      {/* ========================================================================= */}
      {isAddSubjectToClassModal && activeClassObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-l from-slate-900 to-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">
                  {lang === 'ar' ? `إدراج مادة في قسم ${activeClassObj.code}` : `Ajouter une matière à ${activeClassObj.code}`}
                </h3>
              </div>
              <button
                onClick={() => setIsAddSubjectToClassModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubjectToClass} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'المادة الدراسية *' : 'Matière *'}
                </label>
                <select
                  value={addSubjectToClassForm.subjectId}
                  onChange={(e) => {
                    const subId = e.target.value;
                    const found = subjects.find((s) => s.id === subId);
                    setAddSubjectToClassForm({
                      ...addSubjectToClassForm,
                      subjectId: subId,
                      coefficient: found?.defaultCoefficient || 3,
                      weeklyHours: found?.weeklyHours || 3,
                    });
                  }}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  {subjects
                    .filter((s) => !activeClassSubjects.some((cs) => cs.subjectId === s.id))
                    .map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.code} - {sub.nameAr} ({sub.language === 'ar' ? 'عربية' : 'Français'})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'المعامل الرسمي لهذا الفصل *' : 'Coefficient *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    required
                    value={addSubjectToClassForm.coefficient}
                    onChange={(e) => setAddSubjectToClassForm({ ...addSubjectToClassForm, coefficient: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الحصص الأسبوعية' : 'Volume hebdo (h)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={addSubjectToClassForm.weeklyHours}
                    onChange={(e) => setAddSubjectToClassForm({ ...addSubjectToClassForm, weeklyHours: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'الأستاذ المسند له التدريس في هذا القسم' : 'Enseignant responsable'}
                </label>
                <select
                  value={addSubjectToClassForm.teacherId}
                  onChange={(e) => setAddSubjectToClassForm({ ...addSubjectToClassForm, teacherId: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">{lang === 'ar' ? '-- بدون أستاذ حالياً --' : '-- Aucun --'}</option>
                  {teachers.map((tch) => (
                    <option key={tch.id} value={tch.id}>
                      {lang === 'ar' ? `${tch.firstNameAr} ${tch.lastNameAr} (${tch.specialtyAr})` : `${tch.firstNameFr} ${tch.lastNameFr}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectToClassModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  {lang === 'ar' ? 'إدراج' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RESET ALL CONFIRMATION */}
      {/* ========================================================================= */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg text-slate-900">
                {lang === 'ar' ? 'استعادة الهيكلة البيداغوجية الافتراضية؟' : 'Restaurer la configuration par défaut ?'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'ar'
                  ? 'سيؤدي هذا الإجراء إلى إعادة ضبط الأطوار، الأقسام، وبنك المواد، والمعاملات إلى النماذج الموريتانية الرسمية الأصلية المخزنة.'
                  : 'Cela restaurera la liste complète des cycles, classes, disciplines et coefficients officiels.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
              >
                {lang === 'ar' ? 'تراجع' : 'Annuler'}
              </button>
              <button
                onClick={() => {
                  resetAllAcademicStructure();
                  setIsResetConfirmOpen(false);
                }}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                {lang === 'ar' ? 'تأكيد الاستعادة' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
