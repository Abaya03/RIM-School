import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatMRU, numberToWordsMauritanian } from '../../utils/academicUtils';
import { PhoneNumber } from '../common/PhoneNumber';
import { Printer, X, CheckCircle, QrCode, Landmark, Receipt } from 'lucide-react';

export const OfficialReceiptView: React.FC = () => {
  const {
    selectedReceiptId,
    setSelectedReceiptId,
    payments,
    schoolInfo,
    lang,
    t,
  } = useApp();

  const payment = payments.find((p) => p.id === selectedReceiptId);
  if (!selectedReceiptId || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Top Control Bar */}
        <div className="no-print bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs sm:text-sm">
              {lang === 'ar'
                ? `وصل دفع مدرسي رسمي: ${payment.receiptNumber}`
                : `Reçu Officiel de Paiement : ${payment.receiptNumber}`}
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
              onClick={() => setSelectedReceiptId(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 sm:p-8 bg-white text-slate-900 print-page text-xs font-sans">
          {/* Header */}
          <div className="border-b-2 border-emerald-800 pb-3 mb-4 flex justify-between items-start">
            <div className="flex items-center gap-3">
              {schoolInfo.logoUrl ? (
                <div className="w-12 h-12 rounded-lg border border-slate-200 p-1 bg-white flex items-center justify-center shrink-0">
                  <img src={schoolInfo.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
              ) : null}
              <div className="space-y-0.5">
                <div className="font-extrabold text-sm sm:text-base text-emerald-950">
                  {schoolInfo.nameAr}
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  {schoolInfo.nameFr}
                </div>
                <div className="text-[10px] text-slate-500 flex flex-wrap items-center gap-1">
                  <span>{schoolInfo.cityAr} •</span>
                  <span>{lang === 'ar' ? 'هاتف:' : 'Tél :'}</span>
                  <PhoneNumber phone={schoolInfo.phone} className="text-slate-700 font-bold" />
                  {schoolInfo.whatsapp && (
                    <>
                      <span>• واتساب:</span>
                      <PhoneNumber phone={schoolInfo.whatsapp} className="text-emerald-800 font-bold" />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-end">
              <div className="inline-block px-2.5 py-1 bg-emerald-50 border border-emerald-300 rounded font-mono font-black text-xs sm:text-sm text-emerald-900">
                <bdi dir="ltr">N° {payment.receiptNumber}</bdi>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {lang === 'ar' ? 'التاريخ: ' : 'Date : '} <bdi dir="ltr">{payment.paymentDate}</bdi>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-3">
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 bg-slate-100 inline-block px-6 py-1 rounded-full border border-slate-200">
              {lang === 'ar' ? 'وصل تسديد رسوم مدرسية' : 'REÇU DE VERSEMENT SCOLAIRE'}
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {lang === 'ar' ? `الجمهورية الإسلامية الموريتانية • السنة الدراسية: ${schoolInfo.currentYear}` : `République Islamique de Mauritanie • Année : ${schoolInfo.currentYear}`}
            </p>
          </div>

          {/* Details Body */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 my-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">
                  {lang === 'ar' ? 'استلمنا من التلميذ(ة):' : 'Reçu de l’élève :'}
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {lang === 'ar' ? payment.studentNameAr : payment.studentNameFr}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">
                  {lang === 'ar' ? 'رقم التسجيل (Matricule):' : 'N° Matricule :'}
                </span>
                <span className="font-mono font-bold text-emerald-800">
                  <bdi dir="ltr">{payment.matricule}</bdi>
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">
                  {lang === 'ar' ? 'القسم المدرسي:' : 'Classe :'}
                </span>
                <span className="font-bold text-slate-800">
                  {lang === 'ar' ? payment.classNameAr : payment.classNameFr}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">
                  {lang === 'ar' ? 'طريقة السداد:' : 'Mode de Paiement :'}
                </span>
                <span className="font-semibold text-slate-800 uppercase">
                  {payment.paymentMethod === 'bankily' && 'بنكيلي (Bankily)'}
                  {payment.paymentMethod === 'masrvi' && 'مصرفي (Masrvi)'}
                  {payment.paymentMethod === 'sedad' && 'السداد (Sedad)'}
                  {payment.paymentMethod === 'cash' && 'نقداً (Caisse)'}
                  {payment.paymentMethod === 'bank_transfer' && 'تحويل مصرفي'}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <span className="text-slate-500 text-[10px] block">
                {lang === 'ar' ? 'مقابل (بيان الدفعة):' : 'Motif du versement :'}
              </span>
              <span className="font-medium text-slate-900">
                {payment.monthCovered || (lang === 'ar' ? 'أقساط الدراسة الشهرية' : 'Frais de scolarité')}
              </span>
            </div>

            {/* Amount Box */}
            <div className="bg-emerald-100/70 border border-emerald-300 rounded-lg p-3 text-center">
              <span className="text-xs text-emerald-900 block font-medium">
                {lang === 'ar' ? 'المبلغ الإجمالي المسدد بالأوقية الموريتانية:' : 'Montant Total Versé en MRU :'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-950 font-mono my-0.5">
                {formatMRU(payment.amount, lang)}
              </div>
              <div className="text-[11px] font-semibold text-emerald-800 italic">
                "{numberToWordsMauritanian(payment.amount, lang)}"
              </div>
            </div>
          </div>

          {/* Footer with Signatures & Barcode */}
          <div className="grid grid-cols-3 gap-4 pt-3 items-end">
            <div className="text-center">
              <div className="text-[10px] text-slate-500 mb-6">
                {lang === 'ar' ? 'توقيع ولي الأمر' : 'Signature du Déposant'}
              </div>
              <div className="text-[9px] text-slate-400 italic">
                {lang === 'ar' ? '(المودع)' : '(Client)'}
              </div>
            </div>

            {/* QR Code Verification Stamp */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center text-slate-700">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <span className="text-[8px] font-mono text-slate-500 mt-1">
                AUTH: {payment.receiptNumber}
              </span>
            </div>

            <div className="text-center">
              <div className="text-[10px] text-slate-500 mb-1">
                {lang === 'ar' ? 'الخزينة والمحاسبة (تأشيرة وختم)' : 'Cachet de la Caisse'}
              </div>
              {/* Official Cashier Stamp */}
              <div className="inline-block p-1.5 rounded-full border border-dashed border-emerald-700 text-emerald-900 text-[8px] font-black uppercase rotate-3 bg-emerald-50/50 max-w-[150px]">
                <div className="line-clamp-1">{schoolInfo.nameFr.toUpperCase()}</div>
                <div className="text-emerald-800 font-bold">★ PAYÉ / سدد ★</div>
                <div>{payment.cashierName.split(' ')[0]}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
