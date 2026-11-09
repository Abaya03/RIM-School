import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolInfo, Trimestre } from '../../types';
import { PhoneNumber } from '../common/PhoneNumber';
import { toLatinDigits } from '../../utils/numberUtils';
import {
  Building2,
  Upload,
  Image as ImageIcon,
  Phone,
  Mail,
  Globe,
  MapPin,
  ShieldCheck,
  Check,
  RotateCcw,
  FileText,
  CreditCard,
  Calendar,
  Sparkles,
  Eye,
  Save,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Trash2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const SchoolSettingsModule: React.FC = () => {
  const {
    schoolInfo,
    updateSchoolInfo,
    resetSchoolInfo,
    setSelectedBulletinStudentId,
    setSelectedReceiptId,
    students,
    payments,
    lang,
    t,
  } = useApp();

  // Local form state cloned from context
  const [formData, setFormData] = useState<SchoolInfo>({ ...schoolInfo });
  const [activeSubTab, setActiveSubTab] = useState<'identity' | 'location' | 'contacts' | 'direction' | 'finances' | 'academic'>('identity');
  const [isSaved, setIsSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);

  // Preset Mauritanian School Badges (SVG Data URIs)
  const presetBadges = [
    {
      id: 'crest_academic',
      titleAr: 'شعار الهلال والنجمة مع الكتاب (الرمز الوطني التقليدي)',
      titleFr: 'Croissant, Étoile & Livre (Traditionnel)',
      svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="56" fill="%23065f46" stroke="%23f59e0b" stroke-width="4"/><circle cx="60" cy="60" r="48" fill="%23047857" stroke="%23fbbf24" stroke-width="1.5" stroke-dasharray="3 3"/><path d="M40 70c8-4 16-4 20 2 4-6 12-6 20-2v-24c-8-4-16-4-20 2-4-6-12-6-20-2v24z" fill="%23ffffff" stroke="%23f59e0b" stroke-width="2"/><path d="M60 48v24" stroke="%23065f46" stroke-width="2"/><path d="M60 22a10 10 0 0 1 7 3 9 9 0 0 0-5 2 9 9 0 0 0 2 5 10 10 0 0 1-4-10z" fill="%23f59e0b"/><polygon points="60,25 61.5,29 65.5,29.5 62.5,32 63.5,36 60,33.5 56.5,36 57.5,32 54.5,29.5 58.5,29" fill="%23f59e0b"/><text x="60" y="96" font-size="9" font-family="Arial" font-weight="bold" fill="%23fef3c7" text-anchor="middle">R.I. MAURITANIE</text></svg>`,
    },
    {
      id: 'crest_shield',
      titleAr: 'درع التميز الأكاديمي مع غصني الزيتون',
      titleFr: 'Bouclier Académique & Lauriers',
      svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><path d="M60 12 L96 28 C96 68 60 104 60 104 C60 104 24 68 24 28 Z" fill="%230f172a" stroke="%2310b981" stroke-width="4"/><path d="M60 20 L88 32 C88 64 60 94 60 94 C60 94 32 64 32 32 Z" fill="%23064e3b"/><circle cx="60" cy="52" r="18" fill="%23f59e0b"/><polygon points="60,40 63,47 71,48 65,53 67,61 60,56 53,61 55,53 49,48 57,47" fill="%23ffffff"/><path d="M46 76c6 4 22 4 28 0" stroke="%23fef3c7" stroke-width="3" stroke-linecap="round"/><text x="60" y="86" font-size="8" font-family="Arial" font-weight="900" fill="%23a7f3d0" text-anchor="middle">EXCELLENCE</text></svg>`,
    },
    {
      id: 'crest_modern',
      titleAr: 'شعار نخبوي هندسي حديث باللون الزمردي والذهبي',
      titleFr: 'Emblème Moderne Géométrique Émeraude',
      svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><polygon points="60,10 105,35 105,85 60,110 15,85 15,35" fill="%23047857" stroke="%23fbbf24" stroke-width="4"/><polygon points="60,18 97,39 97,81 60,102 23,81 23,39" fill="%23064e3b"/><text x="60" y="58" font-size="28" font-family="serif" font-weight="900" fill="%23fbbf24" text-anchor="middle">أمل</text><text x="60" y="74" font-size="11" font-family="Arial" font-weight="bold" fill="%23ecfdf5" text-anchor="middle">AL-AMAL</text><circle cx="60" cy="85" r="3" fill="%23fbbf24"/></svg>`,
    },
    {
      id: 'crest_torch',
      titleAr: 'شعلة المعرفة والنور التربوي',
      titleFr: 'Flambeau du Savoir & Sciences',
      svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="54" fill="%231e293b" stroke="%2338bdf8" stroke-width="4"/><circle cx="60" cy="60" r="46" fill="%230f172a"/><path d="M60 30c-4 8 0 14-4 18 6 1 10-6 10-10 0-4-3-6-6-8z" fill="%23f97316"/><path d="M57 38c-2 4 0 7-2 9 3 0 5-3 5-5 0-2-1-3-3-4z" fill="%23fde047"/><path d="M54 52h12l-2 32h-8z" fill="%2394a3b8"/><rect x="52" y="48" width="16" height="4" rx="2" fill="%23cbd5e1"/><text x="60" y="100" font-size="9" font-family="Arial" font-weight="bold" fill="%23e2e8f0" text-anchor="middle">EDUCATION</text></svg>`,
    },
  ];

  // Detect changes against saved schoolInfo
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(schoolInfo);

  const handleInputChange = (field: keyof SchoolInfo, value: any) => {
    let finalValue = value;
    if (
      typeof value === 'string' &&
      ['phone', 'phoneSecondary', 'whatsapp', 'directorPhone', 'taxNumber', 'commercialReg', 'licenseNumber', 'currentYear'].includes(field)
    ) {
      finalValue = toLatinDigits(value);
    }
    setFormData((prev) => ({
      ...prev,
      [field]: finalValue,
    }));
    setIsSaved(false);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSchoolInfo(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetToDefaults = () => {
    resetSchoolInfo();
    // After reset, re-populate formData with defaults
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  // Image Upload handler for Logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert(lang === 'ar' ? 'حجم ملف الشعار يتجاوز 2 ميجابايت. يرجى اختيار صورة أصغر.' : 'Le fichier logo dépasse 2 Mo. Veuillez choisir une image plus petite.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      handleInputChange('logoUrl', result);
    };
    reader.readAsDataURL(file);
  };

  // Image Upload handler for Official Stamp
  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      handleInputChange('stampUrl', result);
    };
    reader.readAsDataURL(file);
  };

  // Quick test triggers
  const handlePreviewBulletin = () => {
    const sampleStudent = students[0];
    if (sampleStudent) {
      // Save changes first so bulletin displays new info immediately
      updateSchoolInfo(formData);
      setSelectedBulletinStudentId(sampleStudent.id);
    }
  };

  const handlePreviewReceipt = () => {
    const samplePayment = payments[0];
    if (samplePayment) {
      updateSchoolInfo(formData);
      setSelectedReceiptId(samplePayment.id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Module Title Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {lang === 'ar' ? 'إعدادات المؤسسة والهوية المدرسية' : "Paramètres & Identité de l'Établissement"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {lang === 'ar' ? 'الإدارة العامة' : 'Direction'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {lang === 'ar'
                ? 'تخصيص بيانات المؤسسة، الترويسات الرسمية، أرقام التواصل، الشعار، والختم لكشوف الدرجات ووصولات القبض'
                : 'Personnalisation des coordonnées officielles, en-têtes ministériels, logo, cachet et comptes pour bulletins & reçus'}
            </p>
          </div>
        </div>

        {/* Global Save and Reset Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title={lang === 'ar' ? 'استعادة القيم الافتراضية' : 'Restaurer les valeurs par défaut'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'القيم الافتراضية' : 'Défaut'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={!hasChanges && !isSaved}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer ${
              hasChanges
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                : isSaved
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>
              {isSaved
                ? lang === 'ar'
                  ? 'تم الحفظ بنجاح!'
                  : 'Enregistré avec succès !'
                : lang === 'ar'
                ? 'حفظ التعديلات'
                : 'Enregistrer'}
            </span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">
                {lang === 'ar' ? 'تأكيد استعادة الإعدادات الافتراضية' : 'Confirmer la réinitialisation'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {lang === 'ar'
                ? 'هل أنت متأكد من استعادة كافة البيانات الأولية للمؤسسة (مجمع الأمل، النواكشوط الغربية، أرقام التواصل الافتراضية)؟ سيتم إلغاء أي تعديلات مخصصة قمت بحفظها.'
                : "Êtes-vous sûr de vouloir restaurer les paramètres par défaut de l'établissement ? Vos modifications actuelles seront réinitialisées."}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                {lang === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmReset(false);
                  handleResetToDefaults();
                }}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                {lang === 'ar' ? 'نعم، استعادة الافتراضي' : 'Oui, restaurer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Layout: Settings Navigation + Form Controls + Live Letterhead Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Sub-navigation Tabs (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Sub-tabs Navigation */}
          <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveSubTab('identity')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'identity'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الهوية والشعار' : 'Identité & Logo'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('location')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'location'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{lang === 'ar' ? 'التبعية والعنوان' : 'Tutelle & Adresse'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('contacts')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'contacts'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>{lang === 'ar' ? 'أرقام الاتصال' : 'Téléphones'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('direction')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'direction'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الإدارة والختم' : 'Direction & Sceau'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('finances')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'finances'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الحسابات المالية' : 'Comptes & FinTech'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('academic')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'academic'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === 'ar' ? 'السنة والكشوف' : 'Année & Bulletins'}</span>
            </button>
          </div>

          {/* Form Content Body */}
          <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            {/* SUB-TAB 1: Identity & Logo */}
            {activeSubTab === 'identity' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'ar' ? 'الهوية الرسمية وشعار المؤسسة' : "Identité officielle et armoiries de l'établissement"}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'ar'
                      ? 'الاسم يظهر على كافة الكشوفات والشهادات المدرسية الموجهة للوزارة والأولياء'
                      : 'Le nom figurera sur tous les documents officiels, certificats et bulletins de notes'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'اسم المؤسسة بالعربية *' : "Nom de l'établissement (Arabe) *"}
                    </label>
                    <input
                      type="text"
                      value={formData.nameAr}
                      onChange={(e) => handleInputChange('nameAr', e.target.value)}
                      placeholder="مثال: مجمع الأمل التربوي الخاص"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'اسم المؤسسة بالفرنسية *' : "Nom de l'établissement (Français) *"}
                    </label>
                    <input
                      type="text"
                      value={formData.nameFr}
                      onChange={(e) => handleInputChange('nameFr', e.target.value)}
                      placeholder="Ex: Complexe Scolaire Privé Al-Amal"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'شعار المؤسسة التربوي (العربية)' : 'Devise / Slogan (Arabe)'}
                    </label>
                    <input
                      type="text"
                      value={formData.mottoAr || ''}
                      onChange={(e) => handleInputChange('mottoAr', e.target.value)}
                      placeholder="مثال: التربية الرشيدة • المعرفة الراسخة • الأخلاق الفاضلة"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'شعار المؤسسة (بالفرنسية)' : 'Devise / Slogan (Français)'}
                    </label>
                    <input
                      type="text"
                      value={formData.mottoFr || ''}
                      onChange={(e) => handleInputChange('mottoFr', e.target.value)}
                      placeholder="Ex: Excellence • Discipline • Savoir"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === 'ar' ? 'رقم الاعتماد / الترخيص الوزاري (وزارة التهذيب الوطني)' : "Numéro d'Agrément MEN / Arrêté ministériel"}
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber || ''}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    placeholder="مثال: قرار وزاري رقم 0482/و.ت.و/2016"
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {lang === 'ar'
                      ? 'يظهر رقم الاعتماد في الترويسات الرسمية وشهادات التسجيل والنجاح'
                      : "Le numéro d'arrêté figure sur les attestations d'inscription et de scolarité"}
                  </span>
                </div>

                {/* Logo Customization & Presets */}
                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        {lang === 'ar' ? 'شعار المؤسسة (Logo)' : "Logo de l'établissement"}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'ar'
                          ? 'يمكنك رفع شعار خاص بالمؤسسة (PNG/JPEG/SVG) أو اختيار أحد القوالب الموريتانية الجاهزة'
                          : 'Téléversez votre logo personnalisé ou sélectionnez un modèle prédéfini'}
                      </p>
                    </div>

                    {formData.logoUrl && (
                      <button
                        type="button"
                        onClick={() => handleInputChange('logoUrl', '')}
                        className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'إزالة الشعار' : 'Supprimer'}</span>
                      </button>
                    )}
                  </div>

                  {/* Upload Box */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-2 shrink-0 overflow-hidden">
                      {formData.logoUrl ? (
                        <img
                          src={formData.logoUrl}
                          alt="School Logo Preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full rounded-lg bg-emerald-700 text-white flex flex-col items-center justify-center font-black">
                          <span className="text-amber-300 text-base leading-none">★</span>
                          <span className="text-[10px] uppercase font-bold tracking-tighter mt-1">R.I.M</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-start space-y-2">
                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleLogoUpload}
                          accept="image/png, image/jpeg, image/svg+xml"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'رفع صورة الشعار من الجهاز' : 'Téléverser le logo'}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'ar'
                          ? 'الصيغ المدعومة: PNG, JPG, SVG بمقاس مربع موصى به (500×500 بكسل)'
                          : 'Formats supportés : PNG, JPG, SVG (Recommandé : 500x500 px)'}
                      </p>
                    </div>
                  </div>

                  {/* Preset Badges Selection */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      {lang === 'ar' ? 'أو اختر أحد النماذج الموريتانية الجاهزة:' : 'Ou choisissez un modèle prédéfini :'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {presetBadges.map((badge) => (
                        <button
                          key={badge.id}
                          type="button"
                          onClick={() => handleInputChange('logoUrl', badge.svg)}
                          className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all cursor-pointer ${
                            formData.logoUrl === badge.svg
                              ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <img src={badge.svg} alt={badge.titleFr} className="w-12 h-12 object-contain" />
                          <span className="text-[10px] font-bold text-slate-800 line-clamp-1">
                            {lang === 'ar' ? badge.titleAr.split('(')[0] : badge.titleFr}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: Location & DREN */}
            {activeSubTab === 'location' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'ar' ? 'التبعية الإدارية والعنوان الجغرافي' : 'Tutelle Administrative & Localisation'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'ar'
                      ? 'تحدد الإدارة الجهوية للتهذيب الوطني (DREN) والمقاطعة التابعة لها المؤسسة'
                      : "Direction Régionale de l'Éducation Nationale et rattachement territorial"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'الإدارة الجهوية (DREN) بالعربية *' : 'DREN de rattachement (Arabe) *'}
                    </label>
                    <input
                      type="text"
                      value={formData.drenAr}
                      onChange={(e) => handleInputChange('drenAr', e.target.value)}
                      placeholder="مثال: الإدارة الجهوية للتهذيب الوطني - نواكشوط الغربية"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'الإدارة الجهوية (DREN) بالفرنسية *' : 'DREN de rattachement (Français) *'}
                    </label>
                    <input
                      type="text"
                      value={formData.drenFr}
                      onChange={(e) => handleInputChange('drenFr', e.target.value)}
                      placeholder="Ex: DREN Nouakchott Ouest"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'الولاية (Wilaya)' : 'Wilaya'}
                    </label>
                    <select
                      value={formData.wilayaAr || 'نواكشوط الغربية'}
                      onChange={(e) => {
                        const val = e.target.value;
                        const wilayaMap: Record<string, string> = {
                          'نواكشوط الغربية': 'Nouakchott Ouest',
                          'نواكشوط الشمالية': 'Nouakchott Nord',
                          'نواكشوط الجنوبية': 'Nouakchott Sud',
                          'داخلت نواذيبو': 'Dakhlet Nouadhibou',
                          'اترارزة': 'Trarza',
                          'لبراكنة': 'Brakna',
                          'تكانت': 'Tagant',
                          'آدرار': 'Adrar',
                          'تيرس زمور': 'Tiris Zemmour',
                          'إينشيري': 'Inchiri',
                          'الحوض الشرقي': 'Hodh Ech Chargui',
                          'الحوض الغربي': 'Hodh El Gharbi',
                          'لعصابة': 'Assaba',
                          'غيديماغا': 'Guidimakha',
                          'كوركول': 'Gorgol',
                        };
                        handleInputChange('wilayaAr', val);
                        handleInputChange('wilayaFr', wilayaMap[val] || val);
                      }}
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                    >
                      <option value="نواكشوط الغربية">نواكشوط الغربية (Nouakchott Ouest)</option>
                      <option value="نواكشوط الشمالية">نواكشوط الشمالية (Nouakchott Nord)</option>
                      <option value="نواكشوط الجنوبية">نواكشوط الجنوبية (Nouakchott Sud)</option>
                      <option value="داخلت نواذيبو">داخلت نواذيبو (Dakhlet Nouadhibou)</option>
                      <option value="اترارزة">اترارزة (Trarza)</option>
                      <option value="لبراكنة">لبراكنة (Brakna)</option>
                      <option value="آدرار">آدرار (Adrar)</option>
                      <option value="تيرس زمور">تيرس زمور (Tiris Zemmour)</option>
                      <option value="إينشيري">إينشيري (Inchiri)</option>
                      <option value="الحوض الشرقي">الحوض الشرقي (Hodh Ech Chargui)</option>
                      <option value="الحوض الغربي">الحوض الغربي (Hodh El Gharbi)</option>
                      <option value="لعصابة">لعصابة (Assaba)</option>
                      <option value="تكانت">تكانت (Tagant)</option>
                      <option value="كوركول">كوركول (Gorgol)</option>
                      <option value="غيديماغا">غيديماغا (Guidimakha)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'المقاطعة (Moughataa)' : 'Moughataa'}
                    </label>
                    <input
                      type="text"
                      value={formData.moughataaAr || ''}
                      onChange={(e) => {
                        handleInputChange('moughataaAr', e.target.value);
                      }}
                      placeholder="مثال: تفرغ زينة / لكصر / عرفات"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'المدينة (العربية)' : 'Ville (Arabe)'}
                    </label>
                    <input
                      type="text"
                      value={formData.cityAr}
                      onChange={(e) => handleInputChange('cityAr', e.target.value)}
                      placeholder="نواكشوط"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'المدينة (الفرنسية)' : 'Ville (Français)'}
                    </label>
                    <input
                      type="text"
                      value={formData.cityFr}
                      onChange={(e) => handleInputChange('cityFr', e.target.value)}
                      placeholder="Nouakchott"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'العنوان التفصيلي (بالعربية)' : 'Adresse détaillée (Arabe)'}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.addressAr}
                      onChange={(e) => handleInputChange('addressAr', e.target.value)}
                      placeholder="مثال: شارع الشيخ زايد، قرب ملتقى طرق صباح، تفرغ زينة"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'العنوان التفصيلي (بالفرنسية)' : 'Adresse détaillée (Français)'}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.addressFr}
                      onChange={(e) => handleInputChange('addressFr', e.target.value)}
                      placeholder="Ex: Avenue Cheikh Zayed, près Carrefour Sabah, Tevragh-Zeina"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: Contacts & Phones */}
            {activeSubTab === 'contacts' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'ar' ? 'أرقام الاتصال وقنوات التواصل الرسمية' : 'Téléphones et canaux de communication'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'ar'
                      ? 'الأرقام الظاهرة على وصولات القبض والإشعارات وبطاقات التلاميذ'
                      : 'Numéros affichés sur les reçus de paiement et messages aux parents'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lang === 'ar' ? 'رقم الهاتف الرئيسي *' : 'Téléphone Principal *'}</span>
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+222 45 25 18 90"
                      className="w-full text-xs font-mono text-left px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white phone-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lang === 'ar' ? 'رقم الهاتف الثانوي' : 'Téléphone Secondaire'}</span>
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={formData.phoneSecondary || ''}
                      onChange={(e) => handleInputChange('phoneSecondary', e.target.value)}
                      placeholder="+222 36 20 40 10"
                      className="w-full text-xs font-mono text-left px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white phone-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5 text-emerald-800">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{lang === 'ar' ? 'رقم الواتساب الرسمي للمؤسسة (WhatsApp)' : 'Numéro WhatsApp Officiel'}</span>
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={formData.whatsapp || ''}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      placeholder="+222 46 80 90 10"
                      className="w-full text-xs font-mono text-left px-3.5 py-2.5 rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-emerald-50/20 phone-field"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {lang === 'ar' ? 'يستخدم لروابط إرسال إشعارات كشوف الدرجات للأولياء' : 'Pour le partage instantané des résultats'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lang === 'ar' ? 'البريد الإلكتروني الرسمي *' : 'Courriel Officiel *'}</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="direction@alamal-rim.edu.mr"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lang === 'ar' ? 'الموقع الإلكتروني أو صفحة الفيسبوك' : 'Site Web ou Page Officielle'}</span>
                  </label>
                  <input
                    type="text"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="www.alamal-scolaire.mr"
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>
            )}

            {/* SUB-TAB 4: Direction & Stamp */}
            {activeSubTab === 'direction' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'ar' ? 'إدارة المؤسسة وخاتم التوقيع الرسمي' : 'Direction générale & Sceau administratif'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'ar'
                      ? 'اسم المدير والختم الإداري المصادق به على كشوف الدرجات والشهادات المدرسية'
                      : 'Nom du Directeur et cachet humide pour authentifier les relevés'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'اسم المدير العام (العربية)' : 'Nom du Directeur (Arabe)'}
                    </label>
                    <input
                      type="text"
                      value={formData.directorNameAr || ''}
                      onChange={(e) => handleInputChange('directorNameAr', e.target.value)}
                      placeholder="د. محمد ولد الشيخ عبد الله"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'اسم المدير العام (الفرنسية)' : 'Nom du Directeur (Français)'}
                    </label>
                    <input
                      type="text"
                      value={formData.directorNameFr || ''}
                      onChange={(e) => handleInputChange('directorNameFr', e.target.value)}
                      placeholder="Dr. Mohamed Cheikh Abdallahi"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'هاتف المدير المباشر' : 'Téléphone direct du Directeur'}
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={formData.directorPhone || ''}
                      onChange={(e) => handleInputChange('directorPhone', e.target.value)}
                      placeholder="+222 22 10 30 40"
                      className="w-full text-xs font-mono text-left px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white phone-field"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'اسم الناظر / Censeur' : 'Nom du Censeur des Études'}
                    </label>
                    <input
                      type="text"
                      value={formData.censeurNameAr || ''}
                      onChange={(e) => handleInputChange('censeurNameAr', e.target.value)}
                      placeholder="أ. أحمد سالم ولد المصطفى"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>

                {/* Stamp Management */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        {lang === 'ar' ? 'ختم الإدارة الرسمي (Cachet de la Direction)' : 'Cachet humide officiel'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'ar'
                          ? 'يُطبع الختم في خانة توقيع الإدارة أسفل كشوف النقاط ووصولات القبض'
                          : 'Apposé au bas des bulletins scolaires et reçus de scolarité'}
                      </p>
                    </div>

                    {formData.stampUrl && (
                      <button
                        type="button"
                        onClick={() => handleInputChange('stampUrl', '')}
                        className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'إزالة الختم المخصص' : 'Supprimer'}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-700/60 bg-white flex flex-col items-center justify-center p-2 text-center text-emerald-900 shadow-xs shrink-0">
                      {formData.stampUrl ? (
                        <img src={formData.stampUrl} alt="Official Stamp" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="flex flex-col items-center justify-center scale-90">
                          <span className="text-[8px] font-bold text-slate-500">ختم الإدارة</span>
                          <span className="text-[10px] font-black text-emerald-900 leading-tight">
                            {formData.nameAr.slice(0, 16)}
                          </span>
                          <span className="text-[8px] text-slate-400">المدير العام</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <input
                        type="file"
                        ref={stampInputRef}
                        onChange={handleStampUpload}
                        accept="image/png, image/jpeg"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => stampInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {lang === 'ar' ? 'رفع صورة الختم (PNG شفاف)' : 'Téléverser le cachet (PNG)'}
                      </button>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'ar' ? 'إذا لم ترفع ختماً، سيتم رسم الختم الإداري الأوتوماتيكي باسم المؤسسة' : 'Génération automatique si aucune image fournie'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 5: FinTech & Accounts */}
            {activeSubTab === 'finances' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'ar' ? 'حسابات الدفع الإلكتروني والبنكي بموريتانيا' : 'Comptes FinTech & Bancaires Mauritanie'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'ar'
                      ? 'تظهر أرقام الحسابات على وصولات الرسوم لتسهيل سداد الأولياء عبر التطبيقات المصرفية'
                      : 'Coordonnées de paiement affichées sur les reçus pour le règlement dématérialisé'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-200">
                    <label className="block text-xs font-bold text-orange-900 mb-1.5">
                      {lang === 'ar' ? 'حساب بنكيلي (Bankily) *' : 'Compte Bankily *'}
                    </label>
                    <input
                      type="text"
                      value={formData.bankilyNumber || ''}
                      onChange={(e) => handleInputChange('bankilyNumber', e.target.value)}
                      placeholder="46 80 90 10"
                      className="w-full text-xs font-mono font-bold px-3 py-2 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                    />
                    <span className="text-[10px] text-orange-700 mt-1 block">بنك المعاملات الإسلامية (BIM)</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200">
                    <label className="block text-xs font-bold text-blue-900 mb-1.5">
                      {lang === 'ar' ? 'حساب مصرفي (Masrvi)' : 'Compte Masrvi'}
                    </label>
                    <input
                      type="text"
                      value={formData.masrviNumber || ''}
                      onChange={(e) => handleInputChange('masrviNumber', e.target.value)}
                      placeholder="36 20 40 10"
                      className="w-full text-xs font-mono font-bold px-3 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    />
                    <span className="text-[10px] text-blue-700 mt-1 block">البنك الموريتاني للتجارة الدولية (BMCI)</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <label className="block text-xs font-bold text-emerald-900 mb-1.5">
                      {lang === 'ar' ? 'حساب سداد (Sedad)' : 'Compte Sedad'}
                    </label>
                    <input
                      type="text"
                      value={formData.sedadNumber || ''}
                      onChange={(e) => handleInputChange('sedadNumber', e.target.value)}
                      placeholder="22 10 30 40"
                      className="w-full text-xs font-mono font-bold px-3 py-2 rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                    />
                    <span className="text-[10px] text-emerald-700 mt-1 block">بنك الأمانة (Banque El Amana)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'اسم البنك المعتمد' : 'Banque domiciliataire'}
                    </label>
                    <input
                      type="text"
                      value={formData.bankAccountName || ''}
                      onChange={(e) => handleInputChange('bankAccountName', e.target.value)}
                      placeholder="البنك الإسلامي الموريتاني (BIM)"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'رقم الحساب البنكي (RIB)' : 'Relevé d’Identité Bancaire (RIB)'}
                    </label>
                    <input
                      type="text"
                      value={formData.bankRib || ''}
                      onChange={(e) => handleInputChange('bankRib', e.target.value)}
                      placeholder="0010 0234 5678 9012 34"
                      className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'تسمية العملة (العربية)' : 'Devise (Arabe)'}
                    </label>
                    <input
                      type="text"
                      value={formData.currencyAr}
                      onChange={(e) => handleInputChange('currencyAr', e.target.value)}
                      placeholder="أوقية (MRU)"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'تسمية العملة (الفرنسية)' : 'Devise (Français)'}
                    </label>
                    <input
                      type="text"
                      value={formData.currencyFr}
                      onChange={(e) => handleInputChange('currencyFr', e.target.value)}
                      placeholder="MRU (Ouguiya)"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 6: Academic & Bulletins */}
            {activeSubTab === 'academic' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'ar' ? 'السنة الدراسية والترويسات الرسمية' : 'Année Scolaire & Mentions Légales'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'ar'
                      ? 'تحديد السنة النشطة وملاحظة الاعتماد المطبوعة أسفل كشوف النقاط'
                      : 'Année active et mentions officielles sur les bulletins et diplômes'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'السنة الدراسية النشطة *' : 'Année Scolaire Active *'}
                    </label>
                    <input
                      type="text"
                      value={formData.currentYear}
                      onChange={(e) => handleInputChange('currentYear', e.target.value)}
                      placeholder="2024 - 2025"
                      className="w-full text-xs font-bold font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {lang === 'ar' ? 'الثلاثي الافتراضي الفعّال' : 'Trimestre Actif'}
                    </label>
                    <select
                      value={formData.currentTrimestre}
                      onChange={(e) => handleInputChange('currentTrimestre', Number(e.target.value) as Trimestre)}
                      className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                    >
                      <option value={1}>{lang === 'ar' ? 'الثلاثي الأول (Trimestre 1)' : '1er Trimestre'}</option>
                      <option value={2}>{lang === 'ar' ? 'الثلاثي الثاني (Trimestre 2)' : '2ème Trimestre'}</option>
                      <option value={3}>{lang === 'ar' ? 'الثلاثي الثالث (Trimestre 3)' : '3ème Trimestre'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === 'ar' ? 'ملاحظة التذييل على كشوف النقاط (العربية)' : 'Mention officielle en bas de bulletin (Arabe)'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.bulletinHeaderNoteAr || ''}
                    onChange={(e) => handleInputChange('bulletinHeaderNoteAr', e.target.value)}
                    placeholder="مؤسسة تعليمية حرة معتمدة رسمياً لدى وزارة التهذيب الوطني وإصلاح النظام التعليمي"
                    className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === 'ar' ? 'ملاحظة التذييل على كشوف النقاط (الفرنسية)' : 'Mention officielle en bas de bulletin (Français)'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.bulletinHeaderNoteFr || ''}
                    onChange={(e) => handleInputChange('bulletinHeaderNoteFr', e.target.value)}
                    placeholder="Établissement privé agréé par le Ministère de l’Éducation Nationale"
                    className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* Bottom Save Action */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {hasChanges ? (
                  <span className="text-amber-600 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    {lang === 'ar' ? 'لديك تعديلات غير محفوظة' : 'Modifications non enregistrées'}
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    {lang === 'ar' ? 'كافة البيانات محفوظة ومحدثة' : 'Toutes les données sont synchronisées'}
                  </span>
                )}
              </span>

              <button
                type="submit"
                disabled={!hasChanges && !isSaved}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
                  hasChanges
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : isSaved
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>
                  {isSaved
                    ? lang === 'ar'
                      ? 'تم الحفظ!'
                      : 'Enregistré !'
                    : lang === 'ar'
                    ? 'حفظ وتحديث معلومات المؤسسة'
                    : 'Enregistrer les modifications'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Letterhead & Official Document Preview (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Official Letterhead Preview Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                  {lang === 'ar' ? 'معاينة فورية للترويسة الرسمية' : 'Aperçu En-tête Officiel'}
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                A4 Live
              </span>
            </div>

            {/* Simulated Paper Header */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-800 space-y-3 font-sans">
              <div className="grid grid-cols-3 gap-1 text-center items-center pb-2 border-b border-slate-300">
                {/* Right side in Arabic */}
                <div className="text-start leading-tight space-y-0.5">
                  <p className="font-bold text-[9px] text-slate-900">الجمهورية الإسلامية الموريتانية</p>
                  <p className="text-[8px] text-slate-600">شرف - إخاء - عدل</p>
                  <p className="text-[8px] font-medium text-emerald-900 line-clamp-1">{formData.drenAr}</p>
                  <p className="font-black text-[10px] text-slate-900 line-clamp-1">{formData.nameAr}</p>
                </div>

                {/* Logo Center */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full border border-emerald-800 bg-white p-0.5 flex items-center justify-center overflow-hidden shadow-2xs">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="text-amber-600 font-bold text-sm leading-none">★</span>
                    )}
                  </div>
                  <span className="text-[8px] font-bold text-slate-600 mt-0.5">{formData.currentYear}</span>
                </div>

                {/* Left side in French */}
                <div className="text-end leading-tight space-y-0.5">
                  <p className="font-bold text-[9px] text-slate-900">R.I. Mauritanie</p>
                  <p className="text-[8px] text-slate-600">Honneur - Frat. - Justice</p>
                  <p className="text-[8px] font-medium text-emerald-900 line-clamp-1">{formData.drenFr}</p>
                  <p className="font-black text-[10px] text-slate-900 line-clamp-1">{formData.nameFr}</p>
                </div>
              </div>

              {/* Contacts & Approval info */}
              <div className="space-y-1 text-[9px] text-slate-600">
                <div className="flex items-center justify-between">
                  <span>{lang === 'ar' ? 'الهاتف:' : 'Tél :'}</span>
                  <PhoneNumber phone={formData.phone} className="font-bold text-slate-800" />
                  <span>{formData.cityAr}</span>
                </div>
                {formData.whatsapp && (
                  <div className="flex items-center justify-between text-emerald-800 font-medium">
                    <span>WhatsApp:</span>
                    <PhoneNumber phone={formData.whatsapp} className="font-bold text-emerald-900" />
                  </div>
                )}
                {formData.licenseNumber && (
                  <p className="text-[8px] text-slate-500 italic line-clamp-1 border-t border-slate-200 pt-1">
                    {formData.licenseNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Testing Buttons */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'اختبار ظهور التعديلات في الوثائق:' : 'Tester le rendu sur les documents :'}
              </span>

              <button
                type="button"
                onClick={handlePreviewBulletin}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'معاينة كشف درجات تجريبي' : 'Aperçu Bulletin Trimestriel'}</span>
              </button>

              <button
                type="button"
                onClick={handlePreviewReceipt}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-emerald-600 hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'ar' ? 'معاينة وصل قبض مدرسي' : 'Aperçu Reçu de Paiement'}</span>
              </button>
            </div>
          </div>

          {/* Quick Mauritania Education Fact Box */}
          <div className="bg-emerald-900 text-white rounded-2xl p-5 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles className="w-4 h-4" />
              <h4 className="font-bold text-xs">
                {lang === 'ar' ? 'المعايير المعتمدة للتعليم الحر بموريتانيا' : 'Conformité Règlementaire MEN'}
              </h4>
            </div>
            <p className="text-[11px] text-emerald-100 leading-relaxed">
              {lang === 'ar'
                ? 'وفقاً لمقتضيات القانون التوجيهي لإصلاح النظام التعليمي الوطني، يجب أن تتضمن كافة الكشوفات الصادرة عن المؤسسات الحرة اسم الإدارة الجهوية للتهذيب ورقم الترخيص الوزاري والاسم المعتمد.'
                : "Conformément à la Loi d'Orientation du système éducatif national, tout document scolaire doit stipuler la DREN de tutelle, le N° d'Agrément ministériel et la dénomination officielle."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
