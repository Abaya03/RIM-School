import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Teacher } from '../../types';
import { PhoneNumber } from '../common/PhoneNumber';
import { toLatinDigits, formatPhoneDisplay } from '../../utils/numberUtils';
import {
  Briefcase,
  PlusCircle,
  Search,
  Phone,
  Mail,
  BookOpen,
  Calendar,
  Award,
  Clock,
} from 'lucide-react';

export const TeachersModule: React.FC = () => {
  const { teachers, classes, subjects, addTeacher, lang, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Teacher form
  const [firstNameAr, setFirstNameAr] = useState('');
  const [lastNameAr, setLastNameAr] = useState('');
  const [firstNameFr, setFirstNameFr] = useState('');
  const [lastNameFr, setLastNameFr] = useState('');
  const [phone, setPhone] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'sub_sn');
  const [weeklyHours, setWeeklyHours] = useState(16);

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find((s) => s.id === subjectId);

    addTeacher({
      firstNameAr,
      lastNameAr,
      firstNameFr: firstNameFr || firstNameAr,
      lastNameFr: lastNameFr || lastNameAr,
      phone: formatPhoneDisplay(phone) || '+222 46 00 00 00',
      email: `${firstNameFr.toLowerCase() || 'prof'}@alamal.mr`,
      specialtyAr: sub ? sub.nameAr : 'العلوم الطبيعية',
      specialtyFr: sub ? sub.nameFr : 'Sciences Naturelles',
      qualification: lang === 'ar' ? 'أستاذ مرسم' : 'Professeur Titulaire',
      subjectsTaught: [subjectId],
      classesAssigned: [classes[0]?.id || 'cls_7d1'],
      subjectsAr: sub ? [sub.nameAr] : ['العلوم الطبيعية'],
      subjectsFr: sub ? [sub.nameFr] : ['Sciences Naturelles'],
      assignedClassIds: [classes[0]?.id || 'cls_7d1'],
      assignedClassNames: [classes[0]?.code || '7D1'],
      weeklyHours: Number(weeklyHours),
      status: 'active',
      monthlySalaryMRU: 25000,
    });

    setIsAddModalOpen(false);
    setFirstNameAr('');
    setLastNameAr('');
    setPhone('');
  };

  const getTeacherSubjects = (tch: Teacher) => {
    if (lang === 'ar' && tch.subjectsAr && tch.subjectsAr.length > 0) {
      return tch.subjectsAr.join('، ');
    }
    if (lang === 'fr' && tch.subjectsFr && tch.subjectsFr.length > 0) {
      return tch.subjectsFr.join(', ');
    }
    if (tch.subjectsTaught && tch.subjectsTaught.length > 0) {
      const subjectNames = tch.subjectsTaught
        .map((subId) => subjects.find((s) => s.id === subId))
        .filter((s): s is NonNullable<typeof s> => !!s)
        .map((s) => (lang === 'ar' ? s.nameAr : s.nameFr));
      if (subjectNames.length > 0) {
        return subjectNames.join(lang === 'ar' ? '، ' : ', ');
      }
    }
    return lang === 'ar' ? (tch.specialtyAr || 'التعليم العام') : (tch.specialtyFr || 'Enseignement');
  };

  const getTeacherClasses = (tch: Teacher) => {
    if (tch.assignedClassNames && tch.assignedClassNames.length > 0) {
      return tch.assignedClassNames.join(' • ');
    }
    if (tch.classesAssigned && tch.classesAssigned.length > 0) {
      const classNames = tch.classesAssigned
        .map((clsId) => classes.find((c) => c.id === clsId))
        .filter((c): c is NonNullable<typeof c> => !!c)
        .map((c) => c.code);
      if (classNames.length > 0) {
        return classNames.join(' • ');
      }
    }
    return lang === 'ar' ? 'غير مسند بعد' : 'Non assigné';
  };

  const filteredTeachers = teachers.filter((tch) =>
    (tch.firstNameAr || '').includes(searchTerm) ||
    (tch.lastNameAr || '').includes(searchTerm) ||
    (tch.firstNameFr || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tch.phone || '').includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <Briefcase className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'ar' ? 'هيئة التدريس والطاقم التربوي' : 'Corps Professoral & Équipe Pédagogique'}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {t.teachers}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'ar'
              ? 'تسيير ملفات المدرسين، المواد المسندة، الأقسام، وساعات العمل الأسبوعية.'
              : 'Gestion des enseignants, disciplines enseignées, classes et volumes horaires.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.addTeacher}</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-4">
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs ps-8 pe-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden"
          />
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map((tch) => (
            <div
              key={tch.id}
              className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 hover:shadow-xs transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
                  {(tch.firstNameAr && tch.firstNameAr[0]) || (tch.firstNameFr && tch.firstNameFr[0]) || 'أ'}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">
                    {lang === 'ar' ? `${tch.firstNameAr} ${tch.lastNameAr}` : `${tch.firstNameFr} ${tch.lastNameFr}`}
                  </h4>
                  <div className="text-[11px] text-emerald-700 font-semibold truncate">
                    {getTeacherSubjects(tch)}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <PhoneNumber phone={tch.phone} className="text-slate-700 font-semibold text-xs" />
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{lang === 'ar' ? 'الأقسام المسندة:' : 'Classes :'} {getTeacherClasses(tch)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{tch.weeklyHours} {lang === 'ar' ? 'ساعة أسبوعياً' : 'heures / semaine'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Teacher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'ar' ? 'إضافة مدرس جديد لهيئة التدريس' : 'Nouveau Professeur'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الاسم بالعربية:</label>
                  <input
                    type="text"
                    required
                    value={firstNameAr}
                    onChange={(e) => setFirstNameAr(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                    placeholder="الأستاذ..."
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">اللقب بالعربية:</label>
                  <input
                    type="text"
                    required
                    value={lastNameAr}
                    onChange={(e) => setLastNameAr(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prénom (Français):</label>
                  <input
                    type="text"
                    value={firstNameFr}
                    onChange={(e) => setFirstNameFr(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom (Français):</label>
                  <input
                    type="text"
                    value={lastNameFr}
                    onChange={(e) => setLastNameFr(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">المادة الأساسية:</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full font-semibold p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameAr} / {s.nameFr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ساعات العمل أسبوعياً:</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(parseInt(e.target.value) || 16)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">رقم الهاتف:</label>
                <input
                  type="tel"
                  dir="ltr"
                  required
                  value={phone}
                  onChange={(e) => setPhone(toLatinDigits(e.target.value))}
                  className="w-full font-mono text-left p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden phone-field"
                  placeholder="+222 46 12 34 56"
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
