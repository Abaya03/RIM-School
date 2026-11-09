import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { computeStudentBulletin } from '../../utils/academicUtils';
import {
  Printer,
  X,
  Award,
  Download,
  CheckCircle2,
  Calendar,
  School,
  FileSpreadsheet,
} from 'lucide-react';

export const OfficialBulletinView: React.FC = () => {
  const {
    selectedBulletinStudentId,
    setSelectedBulletinStudentId,
    students,
    classes,
    classSubjects,
    subjects,
    grades,
    schoolInfo,
    selectedTrimestre,
    lang,
    t,
  } = useApp();

  const student = students.find((s) => s.id === selectedBulletinStudentId);
  const classRoom = classes.find((c) => c.id === student?.classId) || classes[0];

  const bulletin = useMemo(() => {
    if (!student || !classRoom) return null;
    const classStudents = students.filter((s) => s.classId === classRoom.id);
    return computeStudentBulletin(
      student,
      classRoom,
      classSubjects,
      subjects,
      grades,
      classStudents,
      selectedTrimestre,
      lang
    );
  }, [student, classRoom, classSubjects, subjects, grades, students, selectedTrimestre, lang]);

  if (!selectedBulletinStudentId || !student || !bulletin) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-4 border border-slate-200">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-bold text-xs sm:text-sm">
              {lang === 'ar'
                ? `كشف نقاط رسمي ثلاثي: ${student.firstNameAr} ${student.lastNameAr}`
                : `Bulletin Officiel Trimestriel : ${student.firstNameFr} ${student.lastNameFr}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.print}</span>
            </button>
            <button
              onClick={() => setSelectedBulletinStudentId(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Sheet (Optimized for A4) */}
        <div className="p-6 sm:p-8 bg-white text-slate-900 print-page text-xs sm:text-sm font-sans selection:bg-none">
          {/* Header 3-part layout (Mauritanian Official Standard) */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5">
            <div className="grid grid-cols-3 gap-2 items-center text-center">
              {/* Arabic Side (Right in RTL, Left in LTR) */}
              <div className="text-start leading-tight space-y-0.5">
                <div className="font-bold text-[11px] sm:text-xs text-slate-900">
                  الجمهورية الإسلامية الموريتانية
                </div>
                <div className="text-[10px] text-slate-700 italic font-serif">
                  شرف - إخاء - عدل
                </div>
                <div className="text-[10px] font-semibold text-slate-800">
                  وزارة التهذيب الوطني وإصلاح النظام التعليمي
                </div>
                <div className="text-[10px] text-slate-600">
                  {schoolInfo.drenAr}
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-emerald-900 pt-0.5">
                  {schoolInfo.nameAr}
                </div>
              </div>

              {/* Central Seal & Trimestre title */}
              <div className="flex flex-col items-center justify-center space-y-1">
                {/* Official Mauritanian Emblem Badge / School Logo */}
                <div className="w-14 h-14 rounded-full border-2 border-emerald-800 bg-emerald-50 flex flex-col items-center justify-center shadow-xs overflow-hidden p-0.5">
                  {schoolInfo.logoUrl ? (
                    <img src={schoolInfo.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <>
                      <span className="text-amber-600 text-lg font-black leading-none">★</span>
                      <span className="text-[9px] font-extrabold text-emerald-950 uppercase tracking-tighter">
                        R.I.M
                      </span>
                    </>
                  )}
                </div>
                <div className="bg-slate-900 text-white font-black text-xs px-3 py-1 rounded-sm tracking-wider uppercase">
                  {lang === 'ar' ? `كشف درجات الثلاثي ${selectedTrimestre}` : `BULLETIN DU ${selectedTrimestre}e TRIMESTRE`}
                </div>
                <div className="text-[11px] font-bold text-slate-700">
                  {lang === 'ar' ? `السنة الدراسية: ${schoolInfo.currentYear}` : `Année Scolaire : ${schoolInfo.currentYear}`}
                </div>
              </div>

              {/* French Side */}
              <div className="text-end leading-tight space-y-0.5">
                <div className="font-bold text-[11px] sm:text-xs text-slate-900">
                  République Islamique de Mauritanie
                </div>
                <div className="text-[10px] text-slate-700 italic font-serif">
                  Honneur - Fraternité - Justice
                </div>
                <div className="text-[10px] font-semibold text-slate-800">
                  Ministère de l'Éducation Nationale
                </div>
                <div className="text-[10px] text-slate-600">
                  {schoolInfo.drenFr}
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-emerald-900 pt-0.5">
                  {schoolInfo.nameFr}
                </div>
              </div>
            </div>
          </div>

          {/* Student Identification Card */}
          <div className="border border-slate-300 rounded-lg p-3.5 mb-5 bg-slate-50/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">
                  {lang === 'ar' ? 'اسم التلميذ (الكامل):' : 'Nom & Prénom :'}
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {student.firstNameAr} {student.lastNameAr}
                </span>
                <span className="block text-[11px] text-slate-600">
                  {student.firstNameFr} {student.lastNameFr}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">
                  {lang === 'ar' ? 'رقم التسجيل (Matricule):' : 'N° Matricule :'}
                </span>
                <span className="font-mono font-bold text-emerald-800 text-xs sm:text-sm">
                  <bdi dir="ltr">{student.matricule}</bdi>
                </span>
                <span className="block text-[10px] text-slate-500 font-mono">
                  NNI: <bdi dir="ltr">{student.nationalIdNni}</bdi>
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">
                  {lang === 'ar' ? 'القسم والشعبة:' : 'Classe & Filière :'}
                </span>
                <span className="font-bold text-slate-900">
                  {lang === 'ar' ? classRoom.nameAr : classRoom.nameFr}
                </span>
                <span className="block text-[10px] text-slate-500">
                  {lang === 'ar' ? `عدد التلاميذ: ${bulletin.classRoom.studentsCount}` : `Effectif : ${bulletin.classRoom.studentsCount} élèves`}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">
                  {lang === 'ar' ? 'تاريخ ومكان الميلاد:' : 'Date & Lieu de Naissance :'}
                </span>
                <span className="font-medium text-slate-800">
                  {student.birthDate}
                </span>
                <span className="block text-[10px] text-slate-600">
                  {lang === 'ar' ? student.birthPlaceAr : student.birthPlaceFr}
                </span>
              </div>
            </div>
          </div>

          {/* Official Evaluation Table */}
          <div className="overflow-x-auto border border-slate-300 rounded-lg mb-5">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold text-center">
                  <th className="py-2 px-3 text-start border-e border-slate-300">
                    {lang === 'ar' ? 'المادة التعليمية (Matière)' : 'Matière d’Enseignement'}
                  </th>
                  <th className="py-2 px-2 w-14 border-e border-slate-300">
                    {lang === 'ar' ? 'المعامل' : 'Coeff'}
                  </th>
                  <th className="py-2 px-2 w-16 border-e border-slate-300">
                    {lang === 'ar' ? 'الفرض 1' : 'Devoir 1'}
                  </th>
                  <th className="py-2 px-2 w-16 border-e border-slate-300">
                    {lang === 'ar' ? 'الفرض 2' : 'Devoir 2'}
                  </th>
                  <th className="py-2 px-2 w-16 border-e border-slate-300">
                    {lang === 'ar' ? 'التأليف' : 'Compo'}
                  </th>
                  <th className="py-2 px-2 w-20 border-e border-slate-300 bg-emerald-50 text-emerald-950 font-black">
                    {lang === 'ar' ? 'المعدل /20' : 'Moy /20'}
                  </th>
                  <th className="py-2 px-2 w-20 border-e border-slate-300">
                    {lang === 'ar' ? 'المجموع' : 'Points'}
                  </th>
                  <th className="py-2 px-3 text-start">
                    {lang === 'ar' ? 'ملاحظة الأستاذ المشرف' : 'Appréciation du Professeur'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bulletin.subjectsSummary.map((sub, idx) => (
                  <tr
                    key={sub.subject.id}
                    className={idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}
                  >
                    <td className="py-2 px-3 border-e border-slate-200 font-semibold text-slate-900">
                      <div className="flex items-center justify-between">
                        <span>
                          {lang === 'ar' ? sub.subject.nameAr : sub.subject.nameFr}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {lang === 'ar' ? sub.subject.nameFr : sub.subject.nameAr}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center border-e border-slate-200 font-bold text-slate-700">
                      {sub.coefficient}
                    </td>
                    <td className="py-2 px-2 text-center border-e border-slate-200 font-mono">
                      {sub.devoir1.toFixed(2)}
                    </td>
                    <td className="py-2 px-2 text-center border-e border-slate-200 font-mono">
                      {sub.devoir2.toFixed(2)}
                    </td>
                    <td className="py-2 px-2 text-center border-e border-slate-200 font-mono">
                      {sub.composition.toFixed(2)}
                    </td>
                    <td className="py-2 px-2 text-center border-e border-slate-200 bg-emerald-50/50 font-mono font-bold text-emerald-900 text-xs">
                      {sub.moyenneMatiere.toFixed(2)}
                    </td>
                    <td className="py-2 px-2 text-center border-e border-slate-200 font-mono font-semibold text-slate-800">
                      {sub.totalPoints.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-[11px] text-slate-600">
                      {sub.appreciation}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-300 text-slate-900 text-center">
                  <td className="py-2.5 px-3 text-start border-e border-slate-300">
                    {lang === 'ar' ? 'المجموع العام (TOTAL GÉNÉRAL)' : 'TOTAL GÉNÉRAL'}
                  </td>
                  <td className="py-2.5 px-2 border-e border-slate-300 text-emerald-800">
                    {bulletin.totalCoefficients}
                  </td>
                  <td colSpan={3} className="py-2.5 px-2 border-e border-slate-300 text-slate-400 text-[11px]">
                    {lang === 'ar' ? 'حساب المعاملات المعتمد' : 'Pondération officielle'}
                  </td>
                  <td className="py-2.5 px-2 border-e border-slate-300 bg-emerald-100 text-emerald-950 font-black text-sm">
                    {bulletin.moyenneGenerale.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 border-e border-slate-300 font-mono">
                    {bulletin.totalPoints.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-start text-xs font-extrabold text-emerald-900">
                    {bulletin.mention}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Results Summary and Class Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* Left: Academic Standing */}
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/60 space-y-2 text-xs">
              <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 flex justify-between items-center">
                <span>{lang === 'ar' ? 'إحصائيات ونتائج الفصل' : 'Bilan & Rang en Classe'}</span>
                <span className="text-emerald-700 font-mono font-bold">
                  {bulletin.moyenneGenerale >= 10 ? 'ناجح / Admis' : 'راسب / Ajourné'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">
                    {lang === 'ar' ? 'المعدل العام (sur 20):' : 'Moyenne Générale :'}
                  </span>
                  <span className="text-base font-black text-emerald-800 font-mono">
                    {bulletin.moyenneGenerale.toFixed(2)} / 20
                  </span>
                </div>

                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">
                    {lang === 'ar' ? 'الترتيب في القسم:' : 'Rang dans la Classe :'}
                  </span>
                  <span className="text-base font-black text-slate-900 font-mono">
                    {bulletin.rankInClass} {lang === 'ar' ? 'من' : 'sur'} {bulletin.classRoom.studentsCount}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                <span>{lang === 'ar' ? 'أعلى معدل:' : 'Max :'} <strong className="text-slate-800 font-mono">{bulletin.classHighestMoyenne.toFixed(2)}</strong></span>
                <span>{lang === 'ar' ? 'معدل القسم:' : 'Moy Classe :'} <strong className="text-slate-800 font-mono">{bulletin.classAverageMoyenne.toFixed(2)}</strong></span>
                <span>{lang === 'ar' ? 'أدنى معدل:' : 'Min :'} <strong className="text-slate-800 font-mono">{bulletin.classLowestMoyenne.toFixed(2)}</strong></span>
              </div>
            </div>

            {/* Right: Discipline & Council Decision */}
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/60 space-y-2 text-xs">
              <div className="font-bold text-slate-800 border-b border-slate-200 pb-1">
                {lang === 'ar' ? 'السلوك والمواظبة وقرار المجلس' : 'Discipline & Décision du Conseil'}
              </div>

              <div className="text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">{lang === 'ar' ? 'ساعات الغياب:' : 'Heures d’absence :'}</span>
                  <span className="font-bold text-slate-800">{bulletin.discipline.absencesHours} ساعة (منها {bulletin.discipline.unjustifiedAbsencesHours} غير مبررة)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">{lang === 'ar' ? 'قرار مجلس الأساتذة:' : 'Décision du conseil :'}</span>
                  <span className="font-semibold text-emerald-800">
                    {lang === 'ar' ? bulletin.councilDecisionAr : bulletin.councilDecisionFr}
                  </span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-500 text-[10px] block">
                    {lang === 'ar' ? 'ملاحظة الإدارة العامة:' : 'Observation de la Direction :'}
                  </span>
                  <span className="italic text-slate-700">
                    "{lang === 'ar' ? bulletin.directorNoteAr : bulletin.directorNoteFr}"
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Signatures & Official Stamp Block */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-center text-xs">
            <div>
              <div className="font-bold text-slate-800 mb-10">
                {lang === 'ar' ? 'الأستاذ المشرف على القسم' : 'Le Professeur Principal'}
              </div>
              <div className="text-[11px] text-slate-400 italic">
                {lang === 'ar' ? '(التوقيع)' : '(Signature)'}
              </div>
            </div>

            <div>
              <div className="font-bold text-slate-800 mb-10">
                {lang === 'ar' ? 'ناظر الدروس / الموجه' : 'Le Censeur des Études'}
              </div>
              <div className="text-[11px] text-slate-400 italic">
                {lang === 'ar' ? '(تأشيرة الناظر)' : '(Visa)'}
              </div>
            </div>

            <div className="relative">
              <div className="font-bold text-slate-800 mb-2">
                {lang === 'ar'
                  ? schoolInfo.directorNameAr || 'المدير العام والختم الرسمي'
                  : schoolInfo.directorNameFr || 'Le Directeur & Cachet'}
              </div>
              {/* Mauritanian Official Stamp Simulation / Custom Stamp */}
              {schoolInfo.stampUrl ? (
                <div className="inline-block w-24 h-24 rotate-3">
                  <img src={schoolInfo.stampUrl} alt="Official Stamp" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="inline-block p-2 rounded-full border-2 border-dashed border-emerald-700 text-emerald-900 text-[9px] font-black uppercase rotate-6 bg-emerald-50/40">
                  <div className="line-clamp-1">{schoolInfo.nameFr.toUpperCase()}</div>
                  <div className="text-amber-700 font-bold">★ {schoolInfo.cityFr.toUpperCase()} ★</div>
                  <div>DIRECTION GÉNÉRALE</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
