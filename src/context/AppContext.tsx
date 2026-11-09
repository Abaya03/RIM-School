import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  UserRole,
  Student,
  Teacher,
  ClassRoom,
  Subject,
  ClassSubject,
  GradeRecord,
  AttendanceRecord,
  PaymentTransaction,
  SchoolExpense,
  SchoolAnnouncement,
  AcademicCalendarEvent,
  ExamScheduleItem,
  SchoolHolidayItem,
  TimetableEntry,
  SchoolInfo,
  Trimestre,
  CycleConfig,
  AcademicCycle,
} from '../types';
import {
  initialSchoolInfo,
  initialClasses,
  initialSubjects,
  initialClassSubjects,
  initialStudents,
  initialTeachers,
  initialGrades,
  initialAttendance,
  initialPayments,
  initialExpenses,
  initialAnnouncements,
  initialCalendarEvents,
  initialExams,
  initialHolidays,
  defaultTimetableRows,
  defaultCyclesConfig,
} from '../data/initialData';
import { translations } from '../utils/translations';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  schoolInfo: SchoolInfo;
  cyclesConfig: CycleConfig[];
  classes: ClassRoom[];
  subjects: Subject[];
  classSubjects: ClassSubject[];
  students: Student[];
  teachers: typeof initialTeachers;
  grades: GradeRecord[];
  attendance: AttendanceRecord[];
  payments: PaymentTransaction[];
  expenses: SchoolExpense[];
  announcements: SchoolAnnouncement[];
  calendarEvents: AcademicCalendarEvent[];
  exams: ExamScheduleItem[];
  holidays: SchoolHolidayItem[];
  timetables: Record<string, TimetableEntry[]>;
  t: typeof translations.ar;
  selectedTrimestre: Trimestre;
  setSelectedTrimestre: (t: Trimestre) => void;

  // Modals & views
  selectedBulletinStudentId: string | null;
  setSelectedBulletinStudentId: (id: string | null) => void;
  selectedReceiptId: string | null;
  setSelectedReceiptId: (id: string | null) => void;

  // Actions
  addStudent: (student: Omit<Student, 'id' | 'matricule'>) => void;
  addTeacher: (teacher: Omit<Teacher, 'id' | 'matricule'>) => void;

  // Academic Structure Management (الأطوار، الأقسام، والمواد)
  updateCycleConfig: (cycleId: AcademicCycle, updated: Partial<CycleConfig>) => void;
  toggleCycleActive: (cycleId: AcademicCycle) => void;
  resetCyclesConfig: () => void;

  addClass: (newClass: Omit<ClassRoom, 'id' | 'studentsCount'>) => void;
  updateClass: (id: string, updated: Partial<ClassRoom>) => void;
  deleteClass: (id: string) => boolean;
  resetClasses: () => void;

  addSubject: (newSubject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updated: Partial<Subject>) => void;
  deleteSubject: (id: string) => boolean;
  resetSubjects: () => void;

  assignSubjectToClass: (
    classId: string,
    subjectId: string,
    coefficient: number,
    teacherId: string,
    weeklyHours?: number
  ) => void;
  removeClassSubject: (classId: string, subjectId: string) => void;
  updateClassSubject: (classId: string, subjectId: string, updated: Partial<ClassSubject>) => void;
  resetClassSubjects: () => void;
  resetAllAcademicStructure: () => void;
  
  // Announcements Management
  addAnnouncement: (announcement: Omit<SchoolAnnouncement, 'id'>) => void;
  updateAnnouncement: (id: string, updated: Partial<SchoolAnnouncement>) => void;
  deleteAnnouncement: (id: string) => void;
  resetAnnouncements: () => void;

  // Exams Management
  addExam: (exam: Omit<ExamScheduleItem, 'id'>) => void;
  updateExam: (id: string, updated: Partial<ExamScheduleItem>) => void;
  deleteExam: (id: string) => void;
  resetExams: () => void;

  // Holidays Management
  addHoliday: (holiday: Omit<SchoolHolidayItem, 'id'>) => void;
  updateHoliday: (id: string, updated: Partial<SchoolHolidayItem>) => void;
  deleteHoliday: (id: string) => void;
  resetHolidays: () => void;

  // Timetables Management
  updateTimetableRow: (classId: string, dayId: string, updated: Partial<TimetableEntry>) => void;
  resetTimetables: () => void;

  updateGrade: (record: Partial<GradeRecord> & { studentId: string; classId: string; subjectId: string; trimestre: Trimestre }) => void;
  addBulkGrades: (records: (Partial<GradeRecord> & { studentId: string; classId: string; subjectId: string; trimestre: Trimestre })[]) => void;
  resetGrades: () => void;
  recordPayment: (payment: Omit<PaymentTransaction, 'id' | 'receiptNumber'>) => string;
  addExpense: (expense: Omit<SchoolExpense, 'id'>) => void;
  toggleAttendance: (studentId: string, status: AttendanceRecord['status'], notes?: string) => void;
  sendParentNotification: (studentId: string, reason: string) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // School Settings
  updateSchoolInfo: (updated: Partial<SchoolInfo>) => void;
  resetSchoolInfo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar');
  const [role, setRole] = useState<UserRole>('director');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTrimestre, setSelectedTrimestre] = useState<Trimestre>(2);

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    try {
      const saved = localStorage.getItem('alamal_school_info');
      if (saved) {
        return { ...initialSchoolInfo, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return initialSchoolInfo;
  });

  const [cyclesConfig, setCyclesConfig] = useState<CycleConfig[]>(() => {
    try {
      const saved = localStorage.getItem('alamal_cycles_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultCyclesConfig;
  });

  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    try {
      const saved = localStorage.getItem('alamal_classes');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialClasses;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem('alamal_subjects');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialSubjects;
  });

  const [classSubjects, setClassSubjects] = useState<ClassSubject[]>(() => {
    try {
      const saved = localStorage.getItem('alamal_class_subjects');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialClassSubjects;
  });

  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState(initialTeachers);
  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('alamal_grades');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialGrades;
  });
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [payments, setPayments] = useState<PaymentTransaction[]>(initialPayments);
  const [expenses, setExpenses] = useState<SchoolExpense[]>(initialExpenses);
  
  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(() => {
    try {
      const saved = localStorage.getItem('alamal_announcements');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialAnnouncements;
  });

  const [calendarEvents] = useState<AcademicCalendarEvent[]>(initialCalendarEvents);

  const [exams, setExams] = useState<ExamScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem('alamal_exams');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialExams;
  });

  const [holidays, setHolidays] = useState<SchoolHolidayItem[]>(() => {
    try {
      const saved = localStorage.getItem('alamal_holidays');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialHolidays;
  });

  const [timetables, setTimetables] = useState<Record<string, TimetableEntry[]>>(() => {
    try {
      const saved = localStorage.getItem('alamal_timetables');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    const map: Record<string, TimetableEntry[]> = {};
    initialClasses.forEach((cls) => {
      map[cls.id] = defaultTimetableRows;
    });
    return map;
  });

  const [selectedBulletinStudentId, setSelectedBulletinStudentId] = useState<string | null>(null);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync document dir and lang
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'matricule'>) => {
    const newId = `std_${Date.now()}`;
    const randMatricule = `RIM-2025-0${Math.floor(100 + Math.random() * 900)}`;
    const newStudent: Student = {
      ...studentData,
      id: newId,
      matricule: randMatricule,
    };
    setStudents((prev) => [newStudent, ...prev]);
    showToast(lang === 'ar' ? `تم تسجيل التلميذ بنجاح برقم ${randMatricule}` : `Élève inscrit avec succès sous le matricule ${randMatricule}`);
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'matricule'>) => {
    const newId = `tch_${Date.now()}`;
    const randMatricule = `ENS-2025-0${Math.floor(10 + Math.random() * 90)}`;
    const newTeacher: Teacher = {
      ...teacherData,
      id: newId,
      matricule: randMatricule,
    };
    setTeachers((prev) => [newTeacher, ...prev]);
    showToast(lang === 'ar' ? `تمت إضافة الأستاذ بنجاح (${randMatricule})` : `Professeur ajouté avec succès (${randMatricule})`);
  };

  // --- Announcements Actions ---
  const addAnnouncement = (announcementData: Omit<SchoolAnnouncement, 'id'>) => {
    const newId = `ann_${Date.now()}`;
    const newAnn: SchoolAnnouncement = {
      ...announcementData,
      id: newId,
    };
    setAnnouncements((prev) => {
      const next = [newAnn, ...prev];
      try {
        localStorage.setItem('alamal_announcements', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(lang === 'ar' ? 'تم نشر التعميم بنجاح باللوحة الرقمية' : 'Circulaire publiée avec succès');
  };

  const updateAnnouncement = (id: string, updated: Partial<SchoolAnnouncement>) => {
    setAnnouncements((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
      try {
        localStorage.setItem('alamal_announcements', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(lang === 'ar' ? 'تم تصحيح وتحديث التعميم بنجاح' : 'Circulaire modifiée avec succès');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => {
      const next = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('alamal_announcements', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(lang === 'ar' ? 'تم حذف التعميم من لوحة الإعلانات' : 'Circulaire supprimée');
  };

  const resetAnnouncements = () => {
    setAnnouncements(initialAnnouncements);
    try {
      localStorage.removeItem('alamal_announcements');
    } catch (err) {
      console.error(err);
    }
    showToast(lang === 'ar' ? 'تمت استعادة قائمة التعاميم الافتراضية' : 'Circulaires par défaut restaurées');
  };

  // --- Exams Actions ---
  const addExam = (examData: Omit<ExamScheduleItem, 'id'>) => {
    const newExam: ExamScheduleItem = {
      ...examData,
      id: `exam_${Date.now()}`,
    };
    setExams((prev) => {
      const next = [...prev, newExam];
      try {
        localStorage.setItem('alamal_exams', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(lang === 'ar' ? 'تمت إضافة موعد الامتحان بنجاح' : 'Examen ajouté avec succès');
  };

  const updateExam = (id: string, updated: Partial<ExamScheduleItem>) => {
    setExams((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
      try {
        localStorage.setItem('alamal_exams', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(lang === 'ar' ? 'تم تصحيح وتعديل بيانات الامتحان بنجاح' : 'Examen mis à jour avec succès');
  };

  const deleteExam = (id: string) => {
    setExams((prev) => {
      const next = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('alamal_exams', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(lang === 'ar' ? 'تم حذف موعد الامتحان من الأجندة' : 'Examen supprimé de l’agenda');
  };

  const resetExams = () => {
    setExams(initialExams);
    try {
      localStorage.removeItem('alamal_exams');
    } catch (err) {
      console.error(err);
    }
    showToast(lang === 'ar' ? 'تمت استعادة أجندة الامتحانات الرسمية الافتراضية' : 'Examens par défaut restaurés');
  };

  // --- Holidays Actions ---
  const addHoliday = (holidayData: Omit<SchoolHolidayItem, 'id'>) => {
    const newHoliday: SchoolHolidayItem = {
      ...holidayData,
      id: `hol_${Date.now()}`,
    };
    setHolidays((prev) => {
      const next = [...prev, newHoliday];
      try {
        localStorage.setItem('alamal_holidays', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(lang === 'ar' ? 'تمت إضافة العطلة بنجاح إلى التقويم' : 'Jour férié ajouté au calendrier');
  };

  const updateHoliday = (id: string, updated: Partial<SchoolHolidayItem>) => {
    setHolidays((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updated } : item));
      try {
        localStorage.setItem('alamal_holidays', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(lang === 'ar' ? 'تم تصحيح وتعديل تاريخ العطلة بنجاح' : 'Jour férié mis à jour');
  };

  const deleteHoliday = (id: string) => {
    setHolidays((prev) => {
      const next = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('alamal_holidays', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(lang === 'ar' ? 'تم حذف العطلة من التقويم المدرسي' : 'Jour férié supprimé');
  };

  const resetHolidays = () => {
    setHolidays(initialHolidays);
    try {
      localStorage.removeItem('alamal_holidays');
    } catch (err) {
      console.error(err);
    }
    showToast(lang === 'ar' ? 'تمت استعادة قائمة العطل الرسمية الافتراضية' : 'Vacances par défaut restaurées');
  };

  // --- Timetables Actions ---
  const updateTimetableRow = (classId: string, dayId: string, updated: Partial<TimetableEntry>) => {
    setTimetables((prev) => {
      const currentRows = prev[classId] || defaultTimetableRows;
      const nextRows = currentRows.map((r) => (r.id === dayId ? { ...r, ...updated } : r));
      const next = { ...prev, [classId]: nextRows };
      try {
        localStorage.setItem('alamal_timetables', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(lang === 'ar' ? 'تم تصحيح وتعديل جدول الحصص الأسبوعي بنجاح' : 'Emploi du temps mis à jour');
  };

  const resetTimetables = () => {
    const map: Record<string, TimetableEntry[]> = {};
    initialClasses.forEach((cls) => {
      map[cls.id] = defaultTimetableRows;
    });
    setTimetables(map);
    try {
      localStorage.removeItem('alamal_timetables');
    } catch (err) {
      console.error(err);
    }
    showToast(lang === 'ar' ? 'تمت استعادة جداول الحصص الافتراضية' : 'Emplois du temps par défaut restaurés');
  };

  const updateGrade = (record: Partial<GradeRecord> & { studentId: string; classId: string; subjectId: string; trimestre: Trimestre }) => {
    setGrades((prev) => {
      const index = prev.findIndex(
        (g) =>
          g.studentId === record.studentId &&
          g.classId === record.classId &&
          g.subjectId === record.subjectId &&
          g.trimestre === record.trimestre
      );

      let next: GradeRecord[];
      if (index >= 0) {
        next = [...prev];
        next[index] = { ...next[index], ...record };
      } else {
        const newRecord: GradeRecord = {
          id: `gr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          studentId: record.studentId,
          classId: record.classId,
          subjectId: record.subjectId,
          trimestre: record.trimestre,
          coefficient: record.coefficient || 2,
          devoir1: record.devoir1,
          devoir2: record.devoir2,
          composition: record.composition,
          appreciationAr: record.appreciationAr,
          appreciationFr: record.appreciationFr,
        };
        next = [...prev, newRecord];
      }
      try {
        localStorage.setItem('alamal_grades', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(lang === 'ar' ? 'تم حفظ الدرجات وتحديث كشف النقاط فورياً' : 'Notes enregistrées et bulletin actualisé');
  };

  const addBulkGrades = (records: (Partial<GradeRecord> & { studentId: string; classId: string; subjectId: string; trimestre: Trimestre })[]) => {
    setGrades((prev) => {
      let next = [...prev];
      records.forEach((rec) => {
        const index = next.findIndex(
          (g) =>
            g.studentId === rec.studentId &&
            g.classId === rec.classId &&
            g.subjectId === rec.subjectId &&
            g.trimestre === rec.trimestre
        );
        if (index >= 0) {
          next[index] = { ...next[index], ...rec };
        } else {
          next.push({
            id: `gr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            studentId: rec.studentId,
            classId: rec.classId,
            subjectId: rec.subjectId,
            trimestre: rec.trimestre,
            coefficient: rec.coefficient || 2,
            devoir1: rec.devoir1,
            devoir2: rec.devoir2,
            composition: rec.composition,
            appreciationAr: rec.appreciationAr,
            appreciationFr: rec.appreciationFr,
          });
        }
      });
      try {
        localStorage.setItem('alamal_grades', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(lang === 'ar' ? 'تم رصد وتوليد كشف الدرجات بنجاح لجميع المواد' : 'Bulletin de notes enregistré avec succès');
  };

  const resetGrades = () => {
    setGrades(initialGrades);
    try {
      localStorage.removeItem('alamal_grades');
    } catch (err) {
      console.error(err);
    }
    showToast(lang === 'ar' ? 'تمت استعادة سجل الدرجات الافتراضي' : 'Notes par défaut restaurées');
  };

  const recordPayment = (paymentData: Omit<PaymentTransaction, 'id' | 'receiptNumber'>): string => {
    const receiptNum = `REC-2025-0${Math.floor(150 + Math.random() * 850)}`;
    const newPayment: PaymentTransaction = {
      ...paymentData,
      id: `pay_${Date.now()}`,
      receiptNumber: receiptNum,
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update student's tuitionPaid
    setStudents((prev) =>
      prev.map((std) =>
        std.id === paymentData.studentId
          ? { ...std, tuitionPaid: std.tuitionPaid + paymentData.amount }
          : std
      )
    );

    showToast(
      lang === 'ar'
        ? `تم إصدار الوصل الرسمي ${receiptNum} بمبلغ ${paymentData.amount} أوقية`
        : `Reçu officiel ${receiptNum} émis avec succès (${paymentData.amount} MRU)`
    );

    return newPayment.id;
  };

  const addExpense = (expenseData: Omit<SchoolExpense, 'id'>) => {
    const newExpense: SchoolExpense = {
      ...expenseData,
      id: `exp_${Date.now()}`,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    showToast(lang === 'ar' ? 'تم تسجيل المصروف في الدفتر المحاسبي' : 'Dépense comptabilisée avec succès');
  };

  const toggleAttendance = (studentId: string, status: AttendanceRecord['status'], notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setAttendance((prev) => {
      const existing = prev.find((a) => a.studentId === studentId && a.date === today);
      if (existing) {
        return prev.map((a) => (a.id === existing.id ? { ...a, status, notes } : a));
      } else {
        const student = students.find((s) => s.id === studentId);
        return [
          ...prev,
          {
            id: `att_${Date.now()}_${studentId}`,
            date: today,
            studentId,
            classId: student?.classId || 'cls_7d1',
            session: 'morning',
            status,
            recordedBy: 'الناظر العام / Censeur',
            parentNotified: status.startsWith('absent'),
            notes,
          },
        ];
      }
    });

    if (status === 'absent_unjustified') {
      sendParentNotification(studentId, 'غياب عن الحصة الصباحية');
    }
  };

  const sendParentNotification = (studentId: string, reason: string) => {
    const std = students.find((s) => s.id === studentId);
    if (!std) return;
    const msg =
      lang === 'ar'
        ? `تم إرسال إشعار فوري إلى هاتف الولي (${std.guardianPhone}): التلميذ ${std.firstNameAr} ${std.lastNameAr} مسجل غائباً اليوم.`
        : `Notification SMS envoyée au tuteur (${std.guardianPhone}) : L'élève ${std.firstNameFr} ${std.lastNameFr} est absent ce jour.`;
    showToast(msg);
  };

  const updateSchoolInfo = (updated: Partial<SchoolInfo>) => {
    setSchoolInfo((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('alamal_school_info', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to persist school info:', err);
      }
      return next;
    });
    showToast(
      lang === 'ar'
        ? 'تم حفظ وتحديث إعدادات المؤسسة والهوية المدرسية بنجاح'
        : "Informations et identité de l'établissement mises à jour avec succès"
    );
  };

  const resetSchoolInfo = () => {
    setSchoolInfo(initialSchoolInfo);
    try {
      localStorage.removeItem('alamal_school_info');
    } catch (err) {
      console.error('Failed to remove saved school info:', err);
    }
    showToast(
      lang === 'ar'
        ? 'تمت استعادة البيانات والخيارات الافتراضية للمؤسسة'
        : "Paramètres par défaut de l'établissement restaurés"
    );
  };

  // --- Academic Structure Management (الأطوار، الأقسام، والمواد) ---

  const updateCycleConfig = (
    cycleId: AcademicCycle,
    updated: Partial<CycleConfig>
  ) => {
    setCyclesConfig((prev) => {
      const next = prev.map((c) => (c.id === cycleId ? { ...c, ...updated } : c));
      try {
        localStorage.setItem('alamal_cycles_config', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(
      lang === 'ar'
        ? 'تم تحديث إعدادات الطور التعليمي بنجاح'
        : 'Paramètres du cycle mis à jour avec succès'
    );
  };

  const toggleCycleActive = (cycleId: AcademicCycle) => {
    setCyclesConfig((prev) => {
      const next = prev.map((c) =>
        c.id === cycleId ? { ...c, isActive: !c.isActive } : c
      );
      try {
        localStorage.setItem('alamal_cycles_config', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(
      lang === 'ar'
        ? 'تم تعديل حالة تفعيل الطور التعليمي بالمؤسسة'
        : 'Statut du cycle modifié avec succès'
    );
  };

  const resetCyclesConfig = () => {
    setCyclesConfig(defaultCyclesConfig);
    try {
      localStorage.removeItem('alamal_cycles_config');
    } catch (err) {
      console.error(err);
    }
    showToast(
      lang === 'ar' ? 'تمت استعادة إعدادات الأطوار الافتراضية' : 'Cycles réinitialisés par défaut'
    );
  };

  const addClass = (newClass: Omit<ClassRoom, 'id' | 'studentsCount'>) => {
    const id = `cls_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;
    const created: ClassRoom = {
      ...newClass,
      id,
      studentsCount: 0,
    };
    setClasses((prev) => {
      const next = [...prev, created];
      try {
        localStorage.setItem('alamal_classes', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(
      lang === 'ar'
        ? `تمت إضافة الفصل الجديد "${created.nameAr || created.code}" بنجاح`
        : `Nouvelle classe "${created.nameFr || created.code}" créée avec succès`
    );
  };

  const updateClass = (id: string, updated: Partial<ClassRoom>) => {
    setClasses((prev) => {
      const next = prev.map((cls) => (cls.id === id ? { ...cls, ...updated } : cls));
      try {
        localStorage.setItem('alamal_classes', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(
      lang === 'ar' ? 'تم حفظ تعديلات القسم بنجاح' : 'Classe mise à jour avec succès'
    );
  };

  const deleteClass = (id: string): boolean => {
    const hasStudents = students.some((s) => s.classId === id);
    if (hasStudents) {
      showToast(
        lang === 'ar'
          ? 'تعذر حذف القسم: يوجد به تلاميذ مسجلون حالياً، يرجى نقلهم لفصل آخر أولاً'
          : 'Impossible de supprimer cette classe : des élèves y sont inscrits.'
      );
      return false;
    }
    setClasses((prev) => {
      const next = prev.filter((cls) => cls.id !== id);
      try {
        localStorage.setItem('alamal_classes', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    setClassSubjects((prev) => {
      const next = prev.filter((cs) => cs.classId !== id);
      try {
        localStorage.setItem('alamal_class_subjects', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(
      lang === 'ar' ? 'تم حذف القسم بنجاح' : 'Classe supprimée avec succès'
    );
    return true;
  };

  const resetClasses = () => {
    setClasses(initialClasses);
    try {
      localStorage.removeItem('alamal_classes');
    } catch (err) {
      console.error(err);
    }
    showToast(
      lang === 'ar' ? 'تمت استعادة الأقسام الافتراضية' : 'Classes par défaut restaurées'
    );
  };

  const addSubject = (newSubject: Omit<Subject, 'id'>) => {
    const id = `sub_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;
    const created: Subject = { ...newSubject, id };
    setSubjects((prev) => {
      const next = [...prev, created];
      try {
        localStorage.setItem('alamal_subjects', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(
      lang === 'ar'
        ? `تمت إضافة المادة الدراسية "${created.nameAr}" بنجاح`
        : `Matière "${created.nameFr}" ajoutée avec succès`
    );
  };

  const updateSubject = (id: string, updated: Partial<Subject>) => {
    setSubjects((prev) => {
      const next = prev.map((sub) => (sub.id === id ? { ...sub, ...updated } : sub));
      try {
        localStorage.setItem('alamal_subjects', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(
      lang === 'ar' ? 'تم تحديث بيانات المادة بنجاح' : 'Matière mise à jour avec succès'
    );
  };

  const deleteSubject = (id: string): boolean => {
    const isAssigned = classSubjects.some((cs) => cs.subjectId === id);
    if (isAssigned) {
      showToast(
        lang === 'ar'
          ? 'تعذر الحذف: هذه المادة مدرجة في مقررات دراسية حالية، قم بإلغاء إسنادها أولاً'
          : 'Cette matière est attribuée à une ou plusieurs classes.'
      );
      return false;
    }
    setSubjects((prev) => {
      const next = prev.filter((sub) => sub.id !== id);
      try {
        localStorage.setItem('alamal_subjects', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(
      lang === 'ar' ? 'تم حذف المادة بنجاح' : 'Matière supprimée avec succès'
    );
    return true;
  };

  const resetSubjects = () => {
    setSubjects(initialSubjects);
    try {
      localStorage.removeItem('alamal_subjects');
    } catch (err) {
      console.error(err);
    }
    showToast(
      lang === 'ar' ? 'تمت استعادة قائمة المواد الافتراضية' : 'Matières par défaut restaurées'
    );
  };

  const assignSubjectToClass = (
    classId: string,
    subjectId: string,
    coefficient: number,
    teacherId: string,
    weeklyHours?: number
  ) => {
    setClassSubjects((prev) => {
      const existing = prev.find(
        (cs) => cs.classId === classId && cs.subjectId === subjectId
      );
      let next: ClassSubject[];
      if (existing) {
        next = prev.map((cs) =>
          cs.classId === classId && cs.subjectId === subjectId
            ? { ...cs, coefficient, teacherId, weeklyHours: weeklyHours ?? cs.weeklyHours }
            : cs
        );
      } else {
        next = [
          ...prev,
          { classId, subjectId, coefficient, teacherId, weeklyHours: weeklyHours || 2 },
        ];
      }
      try {
        localStorage.setItem('alamal_class_subjects', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(
      lang === 'ar'
        ? 'تم حفظ إسناد المادة وتحديد معاملها للقسم بنجاح'
        : 'Matière et coefficient enregistrés pour la classe'
    );
  };

  const removeClassSubject = (classId: string, subjectId: string) => {
    setClassSubjects((prev) => {
      const next = prev.filter(
        (cs) => !(cs.classId === classId && cs.subjectId === subjectId)
      );
      try {
        localStorage.setItem('alamal_class_subjects', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    showToast(
      lang === 'ar'
        ? 'تم سحب المادة من مقرر هذا الفصل الدراسي'
        : 'Matière retirée du programme de cette classe'
    );
  };

  const updateClassSubject = (
    classId: string,
    subjectId: string,
    updated: Partial<ClassSubject>
  ) => {
    setClassSubjects((prev) => {
      const next = prev.map((cs) =>
        cs.classId === classId && cs.subjectId === subjectId
          ? { ...cs, ...updated }
          : cs
      );
      try {
        localStorage.setItem('alamal_class_subjects', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const resetClassSubjects = () => {
    setClassSubjects(initialClassSubjects);
    try {
      localStorage.removeItem('alamal_class_subjects');
    } catch (err) {
      console.error(err);
    }
    showToast(
      lang === 'ar'
        ? 'تمت استعادة جدول المعاملات والمقررات الافتراضية'
        : 'Coefficients et matières par défaut restaurés'
    );
  };

  const resetAllAcademicStructure = () => {
    setCyclesConfig(defaultCyclesConfig);
    setClasses(initialClasses);
    setSubjects(initialSubjects);
    setClassSubjects(initialClassSubjects);
    try {
      localStorage.removeItem('alamal_cycles_config');
      localStorage.removeItem('alamal_classes');
      localStorage.removeItem('alamal_subjects');
      localStorage.removeItem('alamal_class_subjects');
    } catch (err) {
      console.error(err);
    }
    showToast(
      lang === 'ar'
        ? 'تمت استعادة الهيكلة البيداغوجية بالكامل (الأطوار، الأقسام، والمواد) إلى حالتها الافتراضية'
        : 'Structure académique complète réinitialisée par défaut'
    );
  };

  // Compute live student count for each class dynamically
  const liveClasses = classes.map((cls) => ({
    ...cls,
    studentsCount: students.filter((s) => s.classId === cls.id).length,
  }));

  const t = translations[lang];

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        role,
        setRole,
        activeTab,
        setActiveTab,
        schoolInfo,
        updateSchoolInfo,
        resetSchoolInfo,
        cyclesConfig,
        updateCycleConfig,
        toggleCycleActive,
        resetCyclesConfig,
        classes: liveClasses,
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
        updateClassSubject,
        resetClassSubjects,
        resetAllAcademicStructure,
        students,
        teachers,
        grades,
        attendance,
        payments,
        expenses,
        announcements,
        calendarEvents,
        exams,
        holidays,
        timetables,
        t,
        selectedTrimestre,
        setSelectedTrimestre,
        selectedBulletinStudentId,
        setSelectedBulletinStudentId,
        selectedReceiptId,
        setSelectedReceiptId,
        addStudent,
        addTeacher,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        resetAnnouncements,
        addExam,
        updateExam,
        deleteExam,
        resetExams,
        addHoliday,
        updateHoliday,
        deleteHoliday,
        resetHolidays,
        updateTimetableRow,
        resetTimetables,
        updateGrade,
        addBulkGrades,
        resetGrades,
        recordPayment,
        addExpense,
        toggleAttendance,
        sendParentNotification,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
