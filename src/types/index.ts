export type Language = 'ar' | 'fr';

export type UserRole = 'director' | 'censeur' | 'teacher' | 'accountant' | 'parent';

export type AcademicCycle = 'fundamental' | 'college' | 'lycee';

export type SecondaryStream = 'D' | 'C' | 'LM' | 'LO' | 'none'; // D: Sciences Nat, C: Math, LM: Lettres Mod, LO: Lettres Orig

export type Trimestre = 1 | 2 | 3;

export interface SchoolInfo {
  nameAr: string;
  nameFr: string;
  drenAr: string;
  drenFr: string;
  wilayaAr?: string;
  wilayaFr?: string;
  moughataaAr?: string;
  moughataaFr?: string;
  cityAr: string;
  cityFr: string;
  addressAr: string;
  addressFr: string;
  phone: string;
  phoneSecondary?: string;
  whatsapp?: string;
  email: string;
  website?: string;
  licenseNumber?: string; // رقم الاعتماد / الترخيص الوزاري
  directorNameAr?: string;
  directorNameFr?: string;
  directorPhone?: string;
  censeurNameAr?: string;
  censeurNameFr?: string;
  currentYear: string;
  currentTrimestre: Trimestre;
  currencyAr: string;
  currencyFr: string;
  mottoAr?: string;
  mottoFr?: string;
  logoUrl?: string; // Custom logo base64 or URL
  stampUrl?: string; // Administrative seal/stamp image or data URL
  bulletinHeaderNoteAr?: string;
  bulletinHeaderNoteFr?: string;
  bankilyNumber?: string;
  masrviNumber?: string;
  sedadNumber?: string;
  bankAccountName?: string;
  bankRib?: string;
}

export interface Student {
  id: string;
  matricule: string; // e.g. RIM-2024-0102
  firstNameAr: string;
  lastNameAr: string;
  firstNameFr: string;
  lastNameFr: string;
  gender: 'M' | 'F';
  birthDate: string;
  birthPlaceAr: string;
  birthPlaceFr: string;
  nationalIdNni: string; // Numéro National d'Identification (NNI موريتاني)
  cycle: AcademicCycle;
  classId: string;
  classNameAr: string;
  classNameFr: string;
  stream: SecondaryStream;
  guardianNameAr: string;
  guardianNameFr: string;
  guardianPhone: string;
  guardianRelation: string;
  medicalNotes: string;
  registrationDate: string;
  status: 'active' | 'suspended' | 'transferred';
  photoUrl?: string;
  // Financial status
  tuitionTotal: number;
  tuitionPaid: number;
  discountPercentage?: number;
}

export interface CycleConfig {
  id: AcademicCycle;
  nameAr: string;
  nameFr: string;
  shortCode: string;
  minLevel: number;
  maxLevel: number;
  nationalExam: 'CEP' | 'BEPC' | 'BAC' | 'none';
  nationalExamNameAr: string;
  nationalExamNameFr: string;
  streams: SecondaryStream[];
  isActive: boolean;
  notesAr?: string;
  notesFr?: string;
  order: number;
}

export interface ClassRoom {
  id: string;
  code: string; // e.g. 7D1, 4AS2, 6AF1
  nameAr: string;
  nameFr: string;
  cycle: AcademicCycle;
  levelNumber: number; // 1 to 6 for AF, 1 to 4 for AS, 5 to 7 for Lycée
  stream: SecondaryStream;
  roomNumber: string;
  mainTeacherId: string;
  capacity: number;
  studentsCount: number;
  nationalExam?: 'CEP' | 'BEPC' | 'BAC' | null;
  academicYear?: string;
}

export interface Subject {
  id: string;
  code: string;
  nameAr: string;
  nameFr: string;
  language: 'ar' | 'fr'; // Language of instruction
  defaultCoefficient: number;
  isScientific: boolean;
  applicableCycles?: AcademicCycle[];
  weeklyHours?: number;
  descriptionAr?: string;
  descriptionFr?: string;
}

export interface ClassSubject {
  classId: string;
  subjectId: string;
  coefficient: number;
  teacherId: string;
  weeklyHours?: number;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  classId: string;
  subjectId: string;
  trimestre: Trimestre;
  devoir1?: number; // /20
  devoir2?: number; // /20
  composition?: number; // /20
  coefficient: number;
  appreciationAr?: string;
  appreciationFr?: string;
}

export interface StudentSubjectSummary {
  subject: Subject;
  coefficient: number;
  devoir1: number;
  devoir2: number;
  composition: number;
  moyenneMatiere: number; // Note finale de la matière sur 20
  totalPoints: number; // moyenne * coeff
  appreciation: string;
  teacherName: string;
  rankInSubject: number;
}

export interface StudentBulletin {
  student: Student;
  classRoom: ClassRoom;
  trimestre: Trimestre;
  subjectsSummary: StudentSubjectSummary[];
  totalCoefficients: number;
  totalPoints: number;
  moyenneGenerale: number; // Sur 20
  rankInClass: number;
  classHighestMoyenne: number;
  classLowestMoyenne: number;
  classAverageMoyenne: number;
  mention: string;
  discipline: {
    absencesHours: number;
    unjustifiedAbsencesHours: number;
    delaysCount: number;
    sanctions: string;
  };
  councilDecisionAr: string;
  councilDecisionFr: string;
  directorNoteAr: string;
  directorNoteFr: string;
}

export interface Teacher {
  id: string;
  matricule: string;
  firstNameAr: string;
  lastNameAr: string;
  firstNameFr: string;
  lastNameFr: string;
  phone: string;
  email: string;
  specialtyAr: string;
  specialtyFr: string;
  qualification: string;
  subjectsTaught: string[]; // Subject IDs
  classesAssigned: string[]; // Class IDs
  weeklyHours: number;
  status: 'active' | 'leave';
  subjectsAr?: string[];
  subjectsFr?: string[];
  assignedClassNames?: string[];
  assignedClassIds?: string[];
  monthlySalaryMRU?: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  classId: string;
  session: 'morning' | 'afternoon';
  status: 'present' | 'absent_unjustified' | 'absent_justified' | 'late';
  recordedBy: string;
  parentNotified: boolean;
  notes?: string;
}

export interface PaymentTransaction {
  id: string;
  receiptNumber: string; // e.g. REC-2024-0089
  studentId: string;
  studentNameAr: string;
  studentNameFr: string;
  matricule: string;
  classId: string;
  classNameAr: string;
  classNameFr: string;
  amount: number; // in MRU
  paymentDate: string;
  paymentType: 'registration' | 'tuition_monthly' | 'tuition_trimestre' | 'books' | 'transport';
  monthCovered?: string; // e.g. Janvier 2025
  trimestreCovered?: Trimestre;
  paymentMethod: 'cash' | 'bankily' | 'masrvi' | 'sedad' | 'bank_transfer';
  cashierName: string;
  notes?: string;
}

export interface SchoolExpense {
  id: string;
  category: 'salaries' | 'rent' | 'utilities' | 'maintenance' | 'supplies' | 'other';
  titleAr: string;
  titleFr: string;
  amount: number; // in MRU
  date: string;
  beneficiary: string;
  paymentMethod: string;
  approvedBy: string;
}

export interface SchoolAnnouncement {
  id: string;
  titleAr: string;
  titleFr: string;
  contentAr: string;
  contentFr: string;
  date: string;
  targetAudience: 'all' | 'teachers' | 'parents' | 'students';
  priority: 'normal' | 'important' | 'urgent';
  author: string;
}

export interface AcademicCalendarEvent {
  id: string;
  titleAr: string;
  titleFr: string;
  startDate: string;
  endDate: string;
  type: 'holiday' | 'exam' | 'trimestre_period' | 'meeting';
  isNational: boolean;
  descriptionAr?: string;
  descriptionFr?: string;
}

export interface ExamScheduleItem {
  id: string;
  titleAr: string;
  titleFr: string;
  dates: string;
  target: string;
  badge: string;
  color: 'emerald' | 'teal' | 'blue' | 'amber' | 'rose' | 'purple';
  isNational: boolean;
  notes?: string;
}

export interface SchoolHolidayItem {
  id: string;
  nameAr: string;
  nameFr: string;
  date: string;
  type?: 'religious' | 'national' | 'school_vacation';
  daysCount?: number;
}

export interface TimetableEntry {
  id: string;
  dayAr: string;
  dayFr: string;
  period1: string; // 08:00 - 10:00
  period2: string; // 10:15 - 12:00
  period3: string; // 12:15 - 14:00
  period4: string; // 15:00 - 17:00
}
