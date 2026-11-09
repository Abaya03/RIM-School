import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord } from '../../types';
import {
  CalendarCheck,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Phone,
  AlertTriangle,
  UserCheck,
  BellRing,
} from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const {
    students,
    classes,
    attendance,
    toggleAttendance,
    sendParentNotification,
    lang,
    t,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls_7d1');
  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  const todayStr = new Date().toISOString().split('T')[0];

  const getStudentStatus = (studentId: string): AttendanceRecord['status'] => {
    const rec = attendance.find((a) => a.studentId === studentId && a.date === todayStr);
    return rec ? rec.status : 'present';
  };

  const getStatusNotes = (studentId: string): string => {
    const rec = attendance.find((a) => a.studentId === studentId && a.date === todayStr);
    return rec?.notes || '';
  };

  // Class attendance statistics for today
  const markedRecords = classStudents.map((s) => getStudentStatus(s.id));
  const presents = markedRecords.filter((s) => s === 'present').length;
  const absents = markedRecords.filter((s) => s.startsWith('absent')).length;
  const lates = markedRecords.filter((s) => s === 'late').length;
  const rate = classStudents.length > 0 ? Math.round((presents / classStudents.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <CalendarCheck className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'ar' ? 'سجل الحضور اليومي والانضباط المدرسي' : 'Contrôle d’Assiduité & Discipline'}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {t.attendance}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'ar'
              ? 'تسجيل الحضور اليومي الفوري، إشعارات تلقائية لأولياء الأمور عبر الرسائل، وتقارير الانضباط.'
              : 'Pointage quotidien, alertes instantanées SMS aux tuteurs et bilans d’assiduité.'}
          </p>
        </div>

        {/* Filter by class */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">{t.class}:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs font-bold p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden cursor-pointer"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {lang === 'ar' ? c.nameAr : c.nameFr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            {lang === 'ar' ? 'نسبة حضور القسم اليوم' : 'Taux de présence'}
          </span>
          <div className="text-xl font-black text-emerald-800 font-mono">
            {rate}%
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">
            {presents} {lang === 'ar' ? 'حاضرون' : 'présents'}
          </span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            {lang === 'ar' ? 'الغيابات المسجلة' : 'Absences'}
          </span>
          <div className="text-xl font-black text-red-700 font-mono">
            {absents}
          </div>
          <span className="text-[10px] text-red-600 font-medium">
            {lang === 'ar' ? 'تم إشعار الأولياء' : 'Tuteurs alertés'}
          </span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            {lang === 'ar' ? 'حالات التأخر' : 'Retards'}
          </span>
          <div className="text-xl font-black text-amber-700 font-mono">
            {lates}
          </div>
          <span className="text-[10px] text-amber-700">
            {lang === 'ar' ? 'أقل من 20 دقيقة' : '< 20 minutes'}
          </span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            {lang === 'ar' ? 'تاريخ الحصة' : 'Date de séance'}
          </span>
          <div className="text-sm font-bold text-slate-800 font-mono mt-1">
            {todayStr}
          </div>
          <span className="text-[10px] text-slate-500">
            {lang === 'ar' ? 'الفترة الصباحية (Matin)' : 'Séance du matin'}
          </span>
        </div>
      </div>

      {/* Interactive Daily Roll-call Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'ar' ? 'ورقة الحضور الصباحية اليومية' : 'Feuille de Présence Quotidienne'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'ar' ? 'اضغط لتغيير حالة التلميذ (يتم إرسال تنبيه SMS للولي فورياً عند الغياب)' : 'Cliquer pour basculer le statut'}
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-700 rounded-lg">
            {classStudents.length} {lang === 'ar' ? 'تلميذاً في القسم' : 'élèves'}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {classStudents.map((std) => {
            const status = getStudentStatus(std.id);
            const notes = getStatusNotes(std.id);

            return (
              <div
                key={std.id}
                className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 font-bold text-xs flex items-center justify-center text-slate-700">
                    {std.firstNameAr[0]}
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">
                      {lang === 'ar' ? `${std.firstNameAr} ${std.lastNameAr}` : `${std.firstNameFr} ${std.lastNameFr}`}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                      <span>{std.matricule}</span>
                      <span>•</span>
                      <span>هاتف الولي: {std.guardianPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  <button
                    onClick={() => toggleAttendance(std.id, 'present')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      status === 'present'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t.present}</span>
                  </button>

                  <button
                    onClick={() => toggleAttendance(std.id, 'absent_unjustified', 'غياب غير مبرر')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      status === 'absent_unjustified'
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{t.absentUnjustified}</span>
                  </button>

                  <button
                    onClick={() => toggleAttendance(std.id, 'absent_justified', 'إذن رسمي من الولي')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      status === 'absent_justified'
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{t.absentJustified}</span>
                  </button>

                  <button
                    onClick={() => toggleAttendance(std.id, 'late', 'تأخر 15 دقيقة')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      status === 'late'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.late}</span>
                  </button>

                  {/* Direct manual SMS alert trigger button */}
                  <button
                    onClick={() => sendParentNotification(std.id, 'تأخر أو غياب')}
                    className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    title={t.sendSmsAlert}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
