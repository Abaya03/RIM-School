import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatMRU } from '../../utils/academicUtils';
import { Student } from '../../types';
import { PhoneNumber } from '../common/PhoneNumber';
import {
  Wallet,
  Receipt,
  PlusCircle,
  TrendingDown,
  TrendingUp,
  FileCheck,
  Search,
  Building,
  CreditCard,
  Printer,
  Calendar,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export const FinanceModule: React.FC = () => {
  const {
    students,
    payments,
    expenses,
    schoolInfo,
    recordPayment,
    addExpense,
    setSelectedReceiptId,
    lang,
    t,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'receipts' | 'students' | 'expenses'>('receipts');
  const [searchTerm, setSearchTerm] = useState('');

  // New Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStudentId, setPaymentStudentId] = useState<string>(students[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState<number>(3500);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bankily' | 'masrvi' | 'sedad' | 'bank_transfer'>('bankily');
  const [paymentType, setPaymentType] = useState<'tuition_monthly' | 'registration' | 'tuition_trimestre'>('tuition_monthly');
  const [paymentMonth, setPaymentMonth] = useState<string>('فبراير 2025 (Février 2025)');
  const [paymentNotes, setPaymentNotes] = useState<string>('دفع عبر تطبيق بنكيلي Bankily');

  // New Expense Modal State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseTitleAr, setExpenseTitleAr] = useState('');
  const [expenseTitleFr, setExpenseTitleFr] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number>(15000);
  const [expenseCategory, setExpenseCategory] = useState<'salaries' | 'rent' | 'utilities' | 'supplies' | 'maintenance'>('supplies');
  const [expenseBeneficiary, setExpenseBeneficiary] = useState('');

  // Financial Calculations in MRU
  const totalTuitionDue = students.reduce((sum, s) => sum + s.tuitionTotal, 0);
  const totalCollected = students.reduce((sum, s) => sum + s.tuitionPaid, 0);
  const totalArrears = Math.max(0, totalTuitionDue - totalCollected);
  const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalCollected - totalExpensesAmount;

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === paymentStudentId);
    if (!student) return;

    const receiptId = recordPayment({
      studentId: student.id,
      studentNameAr: `${student.firstNameAr} ${student.lastNameAr}`,
      studentNameFr: `${student.firstNameFr} ${student.lastNameFr}`,
      matricule: student.matricule,
      classId: student.classId,
      classNameAr: student.classNameAr,
      classNameFr: student.classNameFr,
      amount: Number(paymentAmount),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentType,
      monthCovered: paymentMonth,
      trimestreCovered: 2,
      paymentMethod,
      cashierName: 'محمد لمين ولد أعمر (المحاسب)',
      notes: paymentNotes,
    });

    setIsPaymentModalOpen(false);
    setSelectedReceiptId(receiptId); // Automatically open printable official receipt!
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      titleAr: expenseTitleAr || 'مصروف تشغيلي',
      titleFr: expenseTitleFr || 'Dépense opérationnelle',
      category: expenseCategory,
      amount: Number(expenseAmount),
      date: new Date().toISOString().split('T')[0],
      beneficiary: expenseBeneficiary || 'المورد المحلي',
      paymentMethod: 'تحويل / شباك',
      approvedBy: 'المدير العام',
    });

    setIsExpenseModalOpen(false);
    setExpenseTitleAr('');
    setExpenseTitleFr('');
  };

  // Filtered lists
  const filteredPayments = payments.filter((p) =>
    p.studentNameAr.includes(searchTerm) ||
    p.studentNameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.matricule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter((s) =>
    s.firstNameAr.includes(searchTerm) ||
    s.lastNameAr.includes(searchTerm) ||
    s.matricule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 mb-1">
            <Wallet className="w-4 h-4 text-teal-700" />
            <span>{lang === 'ar' ? 'الخزينة والمحاسبة المدرسية بالأوقية الموريتانية (MRU)' : 'Comptabilité & Gestion Financière (MRU)'}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {t.financeAndTuition}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'ar'
              ? 'متابعة الرسوم الدراسية، المتأخرات، إصدار الوصولات المعتمدة، وتسجيل المصاريف التشغيلية.'
              : 'Suivi des mensualités, arriérés, émission des reçus officiels et gestion des dépenses.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.recordReceipt}</span>
          </button>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors cursor-pointer border border-slate-200"
          >
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span>{lang === 'ar' ? 'تسجيل مصروف' : 'Nouvelle Dépense'}</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs in MRU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Incomes */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.financialRevenue}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-emerald-900 font-mono">
            {formatMRU(totalCollected, lang)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {lang === 'ar' ? `المستخلص من أصل ${formatMRU(totalTuitionDue, lang)}` : `Sur ${formatMRU(totalTuitionDue, lang)} attendus`}
          </div>
        </div>

        {/* Arrears */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.tuitionArrears}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-amber-900 font-mono">
            {formatMRU(totalArrears, lang)}
          </div>
          <div className="text-[11px] text-amber-700 mt-1">
            {students.filter((s) => s.tuitionPaid < s.tuitionTotal).length} {lang === 'ar' ? 'تلميذاً عليهم متأخرات' : 'élèves en retard'}
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.expenses}</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono">
            {formatMRU(totalExpensesAmount, lang)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {lang === 'ar' ? 'رواتب، كراء، فواتير صيانة' : 'Salaires, loyer, charges'}
          </div>
        </div>

        {/* Net Flow */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.netProfit}</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-xl font-extrabold font-mono ${netBalance >= 0 ? 'text-teal-900' : 'text-red-700'}`}>
            {formatMRU(netBalance, lang)}
          </div>
          <div className="text-[11px] text-teal-700 mt-1">
            {lang === 'ar' ? 'رصيد الخزينة الإيجابي' : 'Solde disponible en caisse'}
          </div>
        </div>
      </div>

      {/* Sub tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('receipts')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'receipts'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'سجل الوصولات الصادرة' : 'Journal des Reçus'} ({payments.length})
            </button>
            <button
              onClick={() => setActiveSubTab('students')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'students'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'وضعية رسوم التلاميذ' : 'Situation par Élève'} ({students.length})
            </button>
            <button
              onClick={() => setActiveSubTab('expenses')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'expenses'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'سجل المصاريف التشغيلية' : 'Dépenses & Charges'} ({expenses.length})
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs ps-8 pe-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden"
            />
          </div>
        </div>

        {/* Tab 1: Receipts Ledger */}
        {activeSubTab === 'receipts' && (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-2.5 px-3 text-start">{t.receiptNumber}</th>
                  <th className="py-2.5 px-3 text-start">{t.fullName}</th>
                  <th className="py-2.5 px-3 text-start">{t.class}</th>
                  <th className="py-2.5 px-3 text-center">{t.amount}</th>
                  <th className="py-2.5 px-3 text-start">{t.paymentMethod}</th>
                  <th className="py-2.5 px-3 text-start">{t.paymentDate}</th>
                  <th className="py-2.5 px-3 text-center">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                      {p.receiptNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">
                        {lang === 'ar' ? p.studentNameAr : p.studentNameFr}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {p.matricule}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {lang === 'ar' ? p.classNameAr : p.classNameFr}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-black text-emerald-900 text-xs sm:text-sm">
                      {formatMRU(p.amount, lang)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {p.paymentDate}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setSelectedReceiptId(p.id)}
                        className="flex items-center justify-center gap-1 mx-auto px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title={t.printReceipt}
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{lang === 'ar' ? 'طباعة الوصل' : 'Imprimer'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Student Tuition Balances */}
        {activeSubTab === 'students' && (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-2.5 px-3 text-start">{t.matricule}</th>
                  <th className="py-2.5 px-3 text-start">{t.fullName}</th>
                  <th className="py-2.5 px-3 text-start">{t.class}</th>
                  <th className="py-2.5 px-3 text-center">{lang === 'ar' ? 'الرسوم السنوية' : 'Total Dû'}</th>
                  <th className="py-2.5 px-3 text-center">{lang === 'ar' ? 'المسدد' : 'Encaissé'}</th>
                  <th className="py-2.5 px-3 text-center">{lang === 'ar' ? 'المتبقي (المتأخرات)' : 'Reste à Payer'}</th>
                  <th className="py-2.5 px-3 text-center">{t.status}</th>
                  <th className="py-2.5 px-3 text-center">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((std) => {
                  const remaining = Math.max(0, std.tuitionTotal - std.tuitionPaid);
                  const isFullyPaid = remaining === 0;

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">
                        <bdi dir="ltr">{std.matricule}</bdi>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {lang === 'ar' ? `${std.firstNameAr} ${std.lastNameAr}` : `${std.firstNameFr} ${std.lastNameFr}`}
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                          <PhoneNumber phone={std.guardianPhone} className="text-slate-500" />
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">
                        {lang === 'ar' ? std.classNameAr : std.classNameFr}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-700">
                        {formatMRU(std.tuitionTotal, lang)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-800">
                        {formatMRU(std.tuitionPaid, lang)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-black text-amber-900">
                        {formatMRU(remaining, lang)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            isFullyPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isFullyPaid ? (lang === 'ar' ? 'مسدد بالكامل' : 'Réglé') : (lang === 'ar' ? 'متأخرات' : 'En attente')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => {
                            setPaymentStudentId(std.id);
                            setIsPaymentModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {lang === 'ar' ? 'قبض دفعة' : 'Encaisser'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Operating Expenses */}
        {activeSubTab === 'expenses' && (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'بيان المصروف' : 'Désignation'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'التصنيف' : 'Catégorie'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'المستفيد' : 'Bénéficiaire'}</th>
                  <th className="py-2.5 px-3 text-center">{t.amount}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'المصادقة' : 'Approbation'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {lang === 'ar' ? exp.titleAr : exp.titleFr}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {exp.beneficiary}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-black text-red-700">
                      {formatMRU(exp.amount, lang)}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {exp.date}
                    </td>
                    <td className="py-3 px-3 text-slate-700 text-xs font-medium">
                      {exp.approvedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 block">
                  {lang === 'ar' ? 'إصدار وصل تحصيل رسوم جديد' : 'Nouveau Reçu de Versement'}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {lang === 'ar' ? 'تسجيل دفعة مدرسية رسمية بالأوقية' : 'Encaisser des Frais Scolaires (MRU)'}
                </h3>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'التلميذ المعني:' : 'Élève concerné :'}
                </label>
                <select
                  value={paymentStudentId}
                  onChange={(e) => setPaymentStudentId(e.target.value)}
                  required
                  className="w-full font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.matricule} - {lang === 'ar' ? `${s.firstNameAr} ${s.lastNameAr}` : `${s.firstNameFr} ${s.lastNameFr}`} ({lang === 'ar' ? s.classNameAr : s.classNameFr})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.amount} (MRU):
                  </label>
                  <input
                    type="number"
                    step="100"
                    min="100"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm font-mono font-bold p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.paymentMethod}:
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full font-medium p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden"
                  >
                    <option value="bankily">{t.bankily}</option>
                    <option value="masrvi">{t.masrvi}</option>
                    <option value="sedad">{t.sedad}</option>
                    <option value="cash">{t.cash}</option>
                    <option value="bank_transfer">{t.bankTransfer}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.monthCovered}:
                </label>
                <input
                  type="text"
                  required
                  value={paymentMonth}
                  onChange={(e) => setPaymentMonth(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                  placeholder="مثلاً: قسط شهر مارس 2025"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'ملاحظات وتفاصيل المعاملة:' : 'Observations :'}
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                  placeholder="رقم التحويل البنكي أو الهاتف..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {lang === 'ar' ? 'تأكيد وحفظ وطباعة الوصل' : 'Encaisser & Imprimer Reçu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-red-700 block">
                  {lang === 'ar' ? 'تسجيل نفقة تشغيلية' : 'Nouvelle Dépense'}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {lang === 'ar' ? 'إضافة مصروف إلى الدفتر اليومي' : 'Comptabiliser une Charge'}
                </h3>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'بيان المصروف (عربي):' : 'Libellé :'}
                </label>
                <input
                  type="text"
                  required
                  value={expenseTitleAr}
                  onChange={(e) => setExpenseTitleAr(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                  placeholder="مثلاً: صيانة أجهزة الحاسوب بقاعة الإعلام الآلي"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.amount} (MRU):
                  </label>
                  <input
                    type="number"
                    step="500"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm font-mono font-bold p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'التصنيف:' : 'Catégorie :'}
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full font-medium p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden"
                  >
                    <option value="supplies">أدوات وقرطاسية (Fournitures)</option>
                    <option value="utilities">كهرباء وماء وإنترنت (Charges)</option>
                    <option value="maintenance">صيانة وتجهيزات (Maintenance)</option>
                    <option value="salaries">أجور ومكافآت (Salaires)</option>
                    <option value="rent">إيجار (Loyer)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'الجهة المستفيدة:' : 'Bénéficiaire :'}
                </label>
                <input
                  type="text"
                  required
                  value={expenseBeneficiary}
                  onChange={(e) => setExpenseBeneficiary(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden"
                  placeholder="اسم الشركة أو الفني أو الجهة"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs cursor-pointer"
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
