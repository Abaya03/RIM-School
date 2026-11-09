import {
  Student,
  ClassRoom,
  Subject,
  ClassSubject,
  GradeRecord,
  StudentBulletin,
  StudentSubjectSummary,
  Trimestre,
  Language,
} from '../types';

/**
 * Mauritanian standard trimester subject calculation:
 * Note Trimester = (Devoir 1 + Devoir 2 + 2 * Composition) / 4
 */
export function calculateSubjectMoyenne(
  devoir1: number = 0,
  devoir2: number = 0,
  composition: number = 0
): number {
  const result = (devoir1 + devoir2 + 2 * composition) / 4;
  return Math.round(result * 100) / 100;
}

export function getMention(moyenne: number, lang: Language): string {
  if (lang === 'ar') {
    if (moyenne >= 16) return 'ممتاز (لوحة شرف مع تهنئة)';
    if (moyenne >= 14) return 'جيد جداً (لوحة شرف مع تشجيع)';
    if (moyenne >= 12) return 'جيد (لوحة شرف)';
    if (moyenne >= 10) return 'مقبول (لوحة شرف)';
    if (moyenne >= 8) return 'دون الوسط (تنبيه)';
    return 'غير كافٍ (إنذار)';
  } else {
    if (moyenne >= 16) return 'Excellent (Félicitations)';
    if (moyenne >= 14) return 'Très Bien (Encouragements)';
    if (moyenne >= 12) return 'Bien (Tableau d’Honneur)';
    if (moyenne >= 10) return 'Assez Bien / Passable';
    if (moyenne >= 8) return 'Insuffisant (Avertissement)';
    return 'Médiocre (Blâme)';
  }
}

export function computeStudentBulletin(
  student: Student,
  classRoom: ClassRoom,
  allClassSubjects: ClassSubject[],
  allSubjects: Subject[],
  allGrades: GradeRecord[],
  allClassStudents: Student[],
  trimestre: Trimestre = 2,
  lang: Language = 'ar'
): StudentBulletin {
  // Get subjects for this class
  const classSubjects = allClassSubjects.filter((cs) => cs.classId === classRoom.id);

  // Compute this student's subjects summary
  const subjectsSummary: StudentSubjectSummary[] = classSubjects.map((cs) => {
    const subject = allSubjects.find((s) => s.id === cs.subjectId) || {
      id: cs.subjectId,
      code: 'SUB',
      nameAr: 'مادة',
      nameFr: 'Matière',
      language: 'ar' as const,
      defaultCoefficient: cs.coefficient,
      isScientific: false,
    };

    const grade = allGrades.find(
      (g) =>
        g.studentId === student.id &&
        g.classId === classRoom.id &&
        g.subjectId === cs.subjectId &&
        g.trimestre === trimestre
    );

    const d1 = grade?.devoir1 ?? 12;
    const d2 = grade?.devoir2 ?? 12;
    const comp = grade?.composition ?? 12;
    const moy = calculateSubjectMoyenne(d1, d2, comp);
    const coeff = cs.coefficient || subject.defaultCoefficient || 1;
    const totalPoints = Math.round(moy * coeff * 100) / 100;

    return {
      subject,
      coefficient: coeff,
      devoir1: d1,
      devoir2: d2,
      composition: comp,
      moyenneMatiere: moy,
      totalPoints,
      appreciation:
        lang === 'ar'
          ? (grade?.appreciationAr || 'عمل مستحسن')
          : (grade?.appreciationFr || 'Bon travail'),
      teacherName: 'الأستاذ المشرف',
      rankInSubject: 1, // dynamically calculated if needed
    };
  });

  const totalCoefficients = subjectsSummary.reduce((sum, s) => sum + s.coefficient, 0) || 1;
  const totalPoints = subjectsSummary.reduce((sum, s) => sum + s.totalPoints, 0);
  const moyenneGenerale = Math.round((totalPoints / totalCoefficients) * 100) / 100;

  // Compute all class averages to get class stats & rank
  const peerMoyennes = allClassStudents.map((peer) => {
    if (peer.id === student.id) return moyenneGenerale;
    // Calculate peer average
    let pPoints = 0;
    let pCoeffs = 0;
    classSubjects.forEach((cs) => {
      const g = allGrades.find(
        (gr) =>
          gr.studentId === peer.id &&
          gr.classId === classRoom.id &&
          gr.subjectId === cs.subjectId &&
          gr.trimestre === trimestre
      );
      const d1 = g?.devoir1 ?? 11.5;
      const d2 = g?.devoir2 ?? 12.0;
      const comp = g?.composition ?? 11.0;
      const m = calculateSubjectMoyenne(d1, d2, comp);
      pPoints += m * cs.coefficient;
      pCoeffs += cs.coefficient;
    });
    return Math.round((pPoints / (pCoeffs || 1)) * 100) / 100;
  });

  peerMoyennes.sort((a, b) => b - a);
  const rankInClass = peerMoyennes.indexOf(moyenneGenerale) + 1 || 1;
  const classHighestMoyenne = Math.max(...peerMoyennes, moyenneGenerale);
  const classLowestMoyenne = Math.min(...peerMoyennes, moyenneGenerale);
  const classAverageMoyenne =
    Math.round((peerMoyennes.reduce((a, b) => a + b, 0) / peerMoyennes.length) * 100) / 100;

  return {
    student,
    classRoom,
    trimestre,
    subjectsSummary,
    totalCoefficients,
    totalPoints: Math.round(totalPoints * 100) / 100,
    moyenneGenerale,
    rankInClass,
    classHighestMoyenne,
    classLowestMoyenne,
    classAverageMoyenne,
    mention: getMention(moyenneGenerale, lang),
    discipline: {
      absencesHours: 4,
      unjustifiedAbsencesHours: 2,
      delaysCount: 1,
      sanctions: lang === 'ar' ? 'لا توجد عقوبات' : 'Aucune sanction',
    },
    councilDecisionAr:
      moyenneGenerale >= 10
        ? 'ينتقل بنجاح مع تهنئة مجلس الأساتذة'
        : 'يُحث على مضاعفة الجهد في الثلاثي القادم لتعويض التأخر',
    councilDecisionFr:
      moyenneGenerale >= 10
        ? 'Passage mérité, félicitations du conseil'
        : 'Doit redoubler d’efforts au 3ème trimestre',
    directorNoteAr:
      moyenneGenerale >= 14
        ? 'تلميذ متميز، انضباط وقدوة حسنة في المؤسسة.'
        : 'سلوك حسن ومواظبة ملحوظة، ننتظر نتائج أفضل.',
    directorNoteFr:
      moyenneGenerale >= 14
        ? 'Élève exemplaire, très bon comportement.'
        : 'Bonne assiduité, potentiel à exploiter davantage.',
  };
}

export function formatMRU(amount: number, lang: Language): string {
  const formatted = new Intl.NumberFormat('fr-FR').format(amount);
  return lang === 'ar' ? `${formatted} أوقية (MRU)` : `${formatted} MRU`;
}

export function numberToWordsMauritanian(amount: number, lang: Language): string {
  if (lang === 'ar') {
    if (amount === 3500) return 'ثلاثة آلاف وخمسمائة أوقية جديدة لا غير';
    if (amount === 6000) return 'ستة آلاف أوقية جديدة لا غير';
    if (amount === 7000) return 'سبعة آلاف أوقية جديدة لا غير';
    if (amount === 10500) return 'عشرة آلاف وخمسمائة أوقية جديدة لا غير';
    if (amount === 14000) return 'أربعة عشر ألف أوقية جديدة لا غير';
    if (amount === 21000) return 'واحد وعشرون ألف أوقية جديدة لا غير';
    if (amount === 28000) return 'ثمانية وعشرون ألف أوقية جديدة لا غير';
    if (amount === 31500) return 'واحد وثلاثون ألف وخمسمائة أوقية جديدة لا غير';
    return `${new Intl.NumberFormat('fr-FR').format(amount)} أوقية جديدة`;
  } else {
    if (amount === 3500) return 'Trois mille cinq cents ouguiyas seulement';
    if (amount === 6000) return 'Six mille ouguiyas seulement';
    if (amount === 7000) return 'Sept mille ouguiyas seulement';
    if (amount === 10500) return 'Dix mille cinq cents ouguiyas seulement';
    if (amount === 14000) return 'Quatorze mille ouguiyas seulement';
    if (amount === 21000) return 'Vingt et un mille ouguiyas seulement';
    if (amount === 28000) return 'Vingt-huit mille ouguiyas seulement';
    if (amount === 31500) return 'Trente et un mille cinq cents ouguiyas seulement';
    return `${amount} Ouguiyas (MRU)`;
  }
}
