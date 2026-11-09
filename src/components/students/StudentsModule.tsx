import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, AcademicCycle, SecondaryStream } from '../../types';
import { PhoneNumber } from '../common/PhoneNumber';
import { toLatinDigits, formatPhoneDisplay } from '../../utils/numberUtils';
import {
  Users,
  Search,
  PlusCircle,
  Download,
  Filter,
  UserCheck,
  FileCheck,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle2,
  X,
  CreditCard,
} from 'lucide-react';

export const StudentsModule: React.FC = () => {
  const {
    students,
    classes,
    addStudent,
    setSelectedBulletinStudentId,
    lang,
    t,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCycle, setSelectedCycle] = useState<string>('all');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // New Student Form State
  const [firstNameAr, setFirstNameAr] = useState('');
  const [lastNameAr, setLastNameAr] = useState('');
  const [firstNameFr, setFirstNameFr] = useState('');
  const [lastNameFr, setLastNameFr] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birthDate, setBirthDate] = useState('2007-05-15');
  const [birthPlaceAr, setBirthPlaceAr] = useState('نواكشوط');
  const [birthPlaceFr, setBirthPlaceFr] = useState('Nouakchott');
  const [nationalIdNni, setNationalIdNni] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || 'cls_7d1');
  const [guardianNameAr, setGuardianNameAr] = useState('');
  const [guardianNameFr, setGuardianNameFr] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('سليم ولله الحمد');
  const [tuitionTotal, setTuitionTotal] = useState<number>(31500);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedClass = classes.find((c) => c.id === classId) || classes[0];

    addStudent({
      firstNameAr,
      lastNameAr,
      firstNameFr: firstNameFr || firstNameAr,
      lastNameFr: lastNameFr || lastNameAr,
      gender,
      birthDate,
      birthPlaceAr,
      birthPlaceFr,
      nationalIdNni: toLatinDigits(nationalIdNni) || `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      cycle: assignedClass.cycle,
      classId: assignedClass.id,
      classNameAr: assignedClass.nameAr,
      classNameFr: assignedClass.nameFr,
      stream: assignedClass.stream,
      guardianNameAr: guardianNameAr || 'ولي الأمر',
      guardianNameFr: guardianNameFr || 'Tuteur',
      guardianPhone: formatPhoneDisplay(guardianPhone) || '+222 46 00 00 00',
      guardianRelation: 'الأب / Père',
      medicalNotes,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'active',
      tuitionTotal: Number(tuitionTotal),
      tuitionPaid: 0,
    });

    setIsAddModalOpen(false);
    // Reset form
    setFirstNameAr('');
    setLastNameAr('');
    setFirstNameFr('');
    setLastNameFr('');
    setGuardianNameAr('');
    setGuardianPhone('');
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Matricule', 'NNI', 'Nom Arabe', 'Nom Francais', 'Classe', 'Cycle', 'Telephone Tuteur', 'Situation'];
    const rows = filteredStudents.map((s) => [
      s.matricule,
      s.nationalIdNni,
      `"${s.firstNameAr} ${s.lastNameAr}"`,
      `"${s.firstNameFr} ${s.lastNameFr}"`,
      `"${s.classNameAr}"`,
      s.cycle,
      s.guardianPhone,
      s.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eleves_alamal_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.firstNameAr.includes(searchTerm) ||
      s.lastNameAr.includes(searchTerm) ||
      s.firstNameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastNameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nationalIdNni.includes(searchTerm);

    const matchesCycle = selectedCycle === 'all' || s.cycle === selectedCycle;
    const matchesClass = selectedClassId === 'all' || s.classId === selectedClassId;

    return matchesSearch && matchesCycle && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'ar' ? 'السجل المدرسي للتلاميذ والترقيات' : 'Fichier Central des Élèves'}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {t.students}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'ar'
              ? 'تسيير الملفات الشخصية، أرقام التسجيل الفريدة (Matricule)، التوزيع على الشعب، واستخراج القوائم.'
              : 'Gestion des fiches individuelles, matricules uniques RIM, affectations et exportations.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.addStudent}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer border border-slate-200"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportExcel}</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs ps-8 pe-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden"
            />
          </div>

          {/* Cycle filter */}
          <div>
            <select
              value={selectedCycle}
              onChange={(e) => setSelectedCycle(e.target.value)}
              className="w-full text-xs font-semibold p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden"
            >
              <option value="all">{lang === 'ar' ? 'كافة الأطوار التعليمية' : 'Tous les cycles'}</option>
              <option value="fundamental">{t.cycleFundamental}</option>
              <option value="college">{t.cycleCollege}</option>
              <option value="lycee">{t.cycleLycee}</option>
            </select>
          </div>

          {/* Class filter */}
          <div>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full text-xs font-semibold p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden"
            >
              <option value="all">{lang === 'ar' ? 'كافة الأقسام' : 'Toutes les classes'}</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {lang === 'ar' ? c.nameAr : c.nameFr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-3 px-3 text-start">{t.matricule}</th>
                <th className="py-3 px-3 text-start">{t.fullName}</th>
                <th className="py-3 px-3 text-start">{t.class}</th>
                <th className="py-3 px-3 text-start">{t.guardian}</th>
                <th className="py-3 px-3 text-start">{t.birthInfo}</th>
                <th className="py-3 px-3 text-center">{t.tuitionStatus}</th>
                <th className="py-3 px-3 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-emerald-800 text-[11px]">
                    <bdi dir="ltr" className="inline-block text-left">{std.matricule}</bdi>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">
                      {lang === 'ar' ? `${std.firstNameAr} ${std.lastNameAr}` : `${std.firstNameFr} ${std.lastNameFr}`}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      NNI: <bdi dir="ltr" className="inline-block">{toLatinDigits(std.nationalIdNni)}</bdi>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-800 text-[11px]">
                      {lang === 'ar' ? std.classNameAr : std.classNameFr}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800">
                      {lang === 'ar' ? std.guardianNameAr : std.guardianNameFr}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                      <PhoneNumber phone={std.guardianPhone} className="text-slate-600" />
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-[11px]">
                    <div>{std.birthDate}</div>
                    <div className="text-[10px] text-slate-400">
                      {lang === 'ar' ? std.birthPlaceAr : std.birthPlaceFr}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {std.tuitionPaid >= std.tuitionTotal ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {lang === 'ar' ? 'مسدد' : 'À jour'}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {lang === 'ar' ? 'متأخرات' : 'Arriéré'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setViewingStudent(std)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {lang === 'ar' ? 'الملف الكامل' : 'Fiche'}
                      </button>
                      <button
                        onClick={() => setSelectedBulletinStudentId(std.id)}
                        className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors cursor-pointer"
                        title={t.officialBulletin}
                      >
                        <FileCheck className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Sheet */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center">
                  {viewingStudent.firstNameAr[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {viewingStudent.firstNameAr} {viewingStudent.lastNameAr}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">
                    <bdi dir="ltr">{viewingStudent.matricule}</bdi> • NNI: <bdi dir="ltr">{toLatinDigits(viewingStudent.nationalIdNni)}</bdi>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-500 block text-[10px]">القسم والشعبة:</span>
                  <span className="font-bold text-slate-800">{viewingStudent.classNameAr}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">تاريخ التسجيل:</span>
                  <span className="font-medium text-slate-800">{viewingStudent.registrationDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ولي الأمر:</span>
                  <span className="font-bold text-slate-800">{viewingStudent.guardianNameAr}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">هاتف الولي:</span>
                  <div className="mt-0.5">
                    <PhoneNumber phone={viewingStudent.guardianPhone} className="text-emerald-800 font-bold" />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] mb-0.5">الحالة الصحية / الملاحظات الطبية:</span>
                <p className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-700">
                  {viewingStudent.medicalNotes || 'سليم ولا توجد موانع صحية.'}
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-emerald-800 block">الوضعية المالية:</span>
                  <span className="text-xs font-bold text-emerald-950">
                    تم سداد {viewingStudent.tuitionPaid} أوقية من أصل {viewingStudent.tuitionTotal} أوقية
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedBulletinStudentId(viewingStudent.id);
                    setViewingStudent(null);
                  }}
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  كشف النقاط
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 block">
                  {lang === 'ar' ? 'استمارة تسجيل تلميذ جديد' : 'Nouvelle Inscription Élève'}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {lang === 'ar' ? 'إدخال بيانات التلميذ وتوليد رقم التسجيل' : 'Enregistrement & Attribution Matricule'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الاسم الشخصي (بالعربية):</label>
                  <input
                    type="text"
                    required
                    value={firstNameAr}
                    onChange={(e) => setFirstNameAr(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                    placeholder="مثال: محمد"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الاسم العائلي (بالعربية):</label>
                  <input
                    type="text"
                    required
                    value={lastNameAr}
                    onChange={(e) => setLastNameAr(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                    placeholder="مثال: ولد أحمد"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prénom (en Français):</label>
                  <input
                    type="text"
                    value={firstNameFr}
                    onChange={(e) => setFirstNameFr(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                    placeholder="ex: Mohamed"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom (en Français):</label>
                  <input
                    type="text"
                    value={lastNameFr}
                    onChange={(e) => setLastNameFr(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                    placeholder="ex: Ould Ahmed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الرقم الوطني الموريتاني (NNI):</label>
                  <input
                    type="text"
                    dir="ltr"
                    maxLength={10}
                    value={nationalIdNni}
                    onChange={(e) => setNationalIdNni(toLatinDigits(e.target.value))}
                    className="w-full font-mono text-left p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                    placeholder="10 أرقام (ex: 2849102847)"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">القسم والشعبة الموجه إليها:</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full font-semibold p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">اسم ولي الأمر:</label>
                  <input
                    type="text"
                    required
                    value={guardianNameAr}
                    onChange={(e) => setGuardianNameAr(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                    placeholder="اسم الأب أو الوصي"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">هاتف ولي الأمر (Bankily/SMS):</label>
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(toLatinDigits(e.target.value))}
                    className="w-full font-mono text-left p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden phone-field"
                    placeholder="+222 46 12 34 56"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">الحالة الصحية والملاحظات:</label>
                <input
                  type="text"
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {lang === 'ar' ? 'تأكيد التسجيل وإصدار الرقم' : 'Inscrire l’Élève'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
