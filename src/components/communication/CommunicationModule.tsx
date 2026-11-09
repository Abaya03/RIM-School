import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolAnnouncement } from '../../types';
import { PhoneNumber } from '../common/PhoneNumber';
import {
  Megaphone,
  PlusCircle,
  Bell,
  Send,
  Calendar,
  Users,
  CheckCircle2,
  MessageSquare,
  Edit3,
  Trash2,
  Search,
  Filter,
  RotateCcw,
  Share2,
  Copy,
  AlertCircle,
  Check,
} from 'lucide-react';

export const CommunicationModule: React.FC = () => {
  const {
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    resetAnnouncements,
    students,
    schoolInfo,
    lang,
    t,
    showToast,
  } = useApp();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<SchoolAnnouncement | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAudience, setFilterAudience] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // SMS Broadcast state
  const [smsText, setSmsText] = useState('');
  const [smsTarget, setSmsTarget] = useState<'all_parents' | 'debtors' | 'teachers'>('all_parents');
  const [smsSentNotice, setSmsSentNotice] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Announcement Form State
  const [titleAr, setTitleAr] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [contentFr, setContentFr] = useState('');
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('normal');
  const [targetAudience, setTargetAudience] = useState<'all' | 'parents' | 'teachers' | 'students'>('all');
  const [author, setAuthor] = useState(lang === 'ar' ? 'الإدارة العامة' : 'La Direction');
  const [annDate, setAnnDate] = useState(new Date().toISOString().split('T')[0]);

  // Edit Form State
  const [editTitleAr, setEditTitleAr] = useState('');
  const [editTitleFr, setEditTitleFr] = useState('');
  const [editContentAr, setEditContentAr] = useState('');
  const [editContentFr, setEditContentFr] = useState('');
  const [editPriority, setEditPriority] = useState<'normal' | 'important' | 'urgent'>('normal');
  const [editTargetAudience, setEditTargetAudience] = useState<'all' | 'parents' | 'teachers' | 'students'>('all');
  const [editAuthor, setEditAuthor] = useState('');
  const [editDate, setEditDate] = useState('');

  const handleOpenAddModal = () => {
    setTitleAr('');
    setTitleFr('');
    setContentAr('');
    setContentFr('');
    setPriority('normal');
    setTargetAudience('all');
    setAuthor(lang === 'ar' ? 'الإدارة العامة' : 'La Direction');
    setAnnDate(new Date().toISOString().split('T')[0]);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (ann: SchoolAnnouncement) => {
    setEditingAnnouncement(ann);
    setEditTitleAr(ann.titleAr);
    setEditTitleFr(ann.titleFr);
    setEditContentAr(ann.contentAr);
    setEditContentFr(ann.contentFr);
    setEditPriority(ann.priority);
    setEditTargetAudience(ann.targetAudience);
    setEditAuthor(ann.author || (lang === 'ar' ? 'الإدارة العامة' : 'La Direction'));
    setEditDate(ann.date);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim() || !contentAr.trim()) return;

    addAnnouncement({
      titleAr: titleAr.trim(),
      titleFr: titleFr.trim() || titleAr.trim(),
      contentAr: contentAr.trim(),
      contentFr: contentFr.trim() || contentAr.trim(),
      date: annDate || new Date().toISOString().split('T')[0],
      targetAudience,
      priority,
      author: author.trim() || (lang === 'ar' ? 'الإدارة العامة' : 'La Direction'),
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEditAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement || !editTitleAr.trim() || !editContentAr.trim()) return;

    updateAnnouncement(editingAnnouncement.id, {
      titleAr: editTitleAr.trim(),
      titleFr: editTitleFr.trim() || editTitleAr.trim(),
      contentAr: editContentAr.trim(),
      contentFr: editContentFr.trim() || editContentAr.trim(),
      priority: editPriority,
      targetAudience: editTargetAudience,
      author: editAuthor.trim() || (lang === 'ar' ? 'الإدارة العامة' : 'La Direction'),
      date: editDate,
    });

    setEditingAnnouncement(null);
  };

  const handleConfirmDelete = (id: string) => {
    deleteAnnouncement(id);
    setDeletingId(null);
  };

  const handleSendBroadcastSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsText.trim()) return;

    setSmsSentNotice(true);
    setTimeout(() => {
      setSmsSentNotice(false);
      setSmsText('');
    }, 3500);
  };

  const handleCopyText = (ann: SchoolAnnouncement) => {
    const text = `${ann.titleAr}\n${ann.contentAr}\n\n${schoolInfo.nameAr}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(ann.id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(lang === 'ar' ? 'تم نسخ نص التعميم بنجاح' : 'Texte copié avec succès');
  };

  const handleShareWhatsApp = (ann: SchoolAnnouncement) => {
    const text = encodeURIComponent(`*${schoolInfo.nameAr}*\n*${ann.titleAr}*\n\n${ann.contentAr}\n\nالتاريخ: ${ann.date}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Filtered Announcements
  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.titleFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.contentAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.contentFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.author?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAudience = filterAudience === 'all' || ann.targetAudience === filterAudience;
    const matchesPriority = filterPriority === 'all' || ann.priority === filterPriority;

    return matchesSearch && matchesAudience && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <Megaphone className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'ar' ? 'إدارة التعاميم، المناشير، والإشعارات المدرسية' : 'Gestion des Circulaires & Communications'}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {t.communication}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'ar'
              ? 'إمكانية إضافة، تعديل، وتصحيح التعاميم والمناشير المدرسية، مع أدوات البث المباشر عبر الرسائل والواتساب.'
              : 'Création, modification et correction des circulaires officielles, affichage et diffusion multicanale.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={resetAnnouncements}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            title={lang === 'ar' ? 'استعادة التعاميم الافتراضية' : 'Restaurer les circulaires par défaut'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'استعادة الافتراضية' : 'Restaurer'}</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إضافة تعميم جديد' : 'Nouvelle Circulaire'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute top-2.5 start-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث في التعاميم والمناشير...' : 'Rechercher une circulaire...'}
            className="w-full ps-9 pe-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-emerald-600 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-semibold">{lang === 'ar' ? 'الجمهور:' : 'Public:'}</span>
            <select
              value={filterAudience}
              onChange={(e) => setFilterAudience(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold outline-hidden cursor-pointer"
            >
              <option value="all">{lang === 'ar' ? 'كافة الفئات' : 'Tous'}</option>
              <option value="parents">{lang === 'ar' ? 'أولياء الأمور' : 'Parents'}</option>
              <option value="teachers">{lang === 'ar' ? 'الأساتذة' : 'Enseignants'}</option>
              <option value="students">{lang === 'ar' ? 'التلاميذ' : 'Élèves'}</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">{lang === 'ar' ? 'الأولوية:' : 'Priorité:'}</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold outline-hidden cursor-pointer"
            >
              <option value="all">{lang === 'ar' ? 'كل المستويات' : 'Tous'}</option>
              <option value="urgent">{lang === 'ar' ? 'عاجل وهام' : 'Urgent'}</option>
              <option value="important">{lang === 'ar' ? 'هام' : 'Important'}</option>
              <option value="normal">{lang === 'ar' ? 'عادي' : 'Normal'}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Digital Bulletin Board with Edit/Delete capabilities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'ar' ? 'لوحة التعاميم والمناشير المعتمدة' : 'Circulaires & Avis Officiels'}</span>
              <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {filteredAnnouncements.length}
              </span>
            </h3>

            <span className="text-[11px] text-slate-500">
              {lang === 'ar' ? 'انقر على زر القلم لتعديل وتصحيح أي تعميم' : 'Cliquez sur modifier pour corriger un avis'}
            </span>
          </div>

          {filteredAnnouncements.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">
                {lang === 'ar' ? 'لا توجد تعاميم تطابق معايير البحث' : 'Aucune circulaire trouvée'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterAudience('all');
                  setFilterPriority('all');
                }}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                {lang === 'ar' ? 'إعادة ضبط التصفية' : 'Réinitialiser les filtres'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 hover:shadow-xs transition-all relative group"
                >
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ann.priority === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : ann.priority === 'important'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {ann.priority === 'urgent' && (lang === 'ar' ? 'عاجل وهام' : 'Urgent')}
                        {ann.priority === 'important' && (lang === 'ar' ? 'هام' : 'Important')}
                        {ann.priority === 'normal' && (lang === 'ar' ? 'إعلان عادي' : 'Normal')}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {ann.date}
                      </span>
                      {ann.author && (
                        <span className="text-[10px] text-slate-400">
                          • {ann.author}
                        </span>
                      )}
                    </div>

                    {/* Action buttons: Edit, Delete, Copy, Share */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyText(ann)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title={lang === 'ar' ? 'نسخ النص' : 'Copier le texte'}
                      >
                        {copiedId === ann.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleShareWhatsApp(ann)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title={lang === 'ar' ? 'مشاركة عبر واتساب' : 'Partager sur WhatsApp'}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(ann)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold transition-colors cursor-pointer"
                        title={lang === 'ar' ? 'تعديل وتصحيح هذا التعميم' : 'Modifier cette circulaire'}
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'تعديل' : 'Modifier'}</span>
                      </button>

                      <button
                        onClick={() => setDeletingId(ann.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        title={lang === 'ar' ? 'حذف التعميم' : 'Supprimer'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {lang === 'ar' ? ann.titleAr : ann.titleFr}
                    </h4>

                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold shrink-0">
                      {ann.targetAudience === 'all' && (lang === 'ar' ? 'الجميع' : 'Tous')}
                      {ann.targetAudience === 'parents' && (lang === 'ar' ? 'أولياء الأمور' : 'Parents')}
                      {ann.targetAudience === 'teachers' && (lang === 'ar' ? 'الأساتذة' : 'Enseignants')}
                      {ann.targetAudience === 'students' && (lang === 'ar' ? 'التلاميذ' : 'Élèves')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {lang === 'ar' ? ann.contentAr : ann.contentFr}
                  </p>

                  {/* Dual language preview if different */}
                  {lang === 'ar' && ann.titleFr && ann.titleFr !== ann.titleAr && (
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-sans italic">
                      <span className="font-semibold not-italic">Version Française: </span>
                      {ann.titleFr} — {ann.contentFr}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Instant SMS Broadcast & WhatsApp Tools */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'ar' ? 'بث رسالة نصية SMS جماعية' : 'Envoi SMS Groupé'}</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'ar'
                ? 'إرسال إشعار فوري لهواتف أولياء الأمور عبر شبكات الاتصال الوطنية الموريتانية (Mauritel, Chinguitel, Mattel).'
                : 'Diffusion instantanée par SMS aux numéros de tous les parents d’élèves.'}
            </p>

            <form onSubmit={handleSendBroadcastSms} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'المستلمون:' : 'Destinataires :'}
                </label>
                <select
                  value={smsTarget}
                  onChange={(e) => setSmsTarget(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:border-emerald-600 outline-hidden"
                >
                  <option value="all_parents">
                    {lang === 'ar' ? `جميع أولياء الأمور (${students.length} ولي أمر)` : `Tous les parents (${students.length})`}
                  </option>
                  <option value="debtors">
                    {lang === 'ar' ? 'أولياء التلاميذ ذوي المتأخرات المالية' : 'Parents avec impayés'}
                  </option>
                  <option value="teachers">
                    {lang === 'ar' ? 'طاقم الأساتذة والمعلمين' : 'Corps professoral'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'نص الرسالة القصيرة:' : 'Texte du SMS :'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? `${schoolInfo.nameAr}: نلفت عنايتكم الكريمة إلى أن امتحانات الفصل تنطلق يوم...`
                      : `${schoolInfo.nameFr}: Les examens débutent le...`
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden resize-none font-sans"
                />
              </div>

              <div className="text-[11px] text-slate-400 flex justify-between items-center">
                <span>{smsText.length} حرفاً (حوالي {Math.ceil(smsText.length / 70) || 1} SMS)</span>
                <PhoneNumber phone={schoolInfo.phone} className="text-slate-400" />
              </div>

              {smsSentNotice && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{lang === 'ar' ? 'تم إرسال الرسالة بنجاح إلى شبكة الاتصالات!' : 'Message diffusé avec succès !'}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إرسال الرسائل الآن' : 'Diffuser le SMS'}</span>
              </button>
            </form>
          </div>

          {/* WhatsApp Channel Guidance */}
          <div className="bg-emerald-950 text-white rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs text-emerald-300">
              <Share2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'قناة الواتساب الرسمية للمؤسسة' : 'Canal WhatsApp Officiel'}</span>
            </div>
            <div className="text-[11px] text-emerald-100 leading-relaxed space-y-1">
              <p>
                {lang === 'ar' ? 'رقم الواتساب الإداري المعتمد للمؤسسة:' : "Numéro WhatsApp de l'établissement :"}
              </p>
              <div className="py-1">
                <PhoneNumber
                  phone={schoolInfo.whatsapp || schoolInfo.phone}
                  className="text-emerald-300 font-bold text-xs bg-emerald-900/60 px-2 py-1 rounded-md"
                />
              </div>
              <p className="text-slate-300 text-[10px]">
                {lang === 'ar'
                  ? 'يمكنك استخدام زر المشاركة على أي تعميم لإرساله مباشرة إلى مجموعات الأقسام وأولياء الأمور.'
                  : 'Utilisez le bouton de partage pour diffuser directement vos avis.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Announcement Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'ar' ? 'نشر تعميم مدرسي جديد' : 'Nouvelle Circulaire'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'عنوان التعميم بالعربية:' : 'Titre en Arabe :'}
                </label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                  placeholder="مثال: جدول امتحانات البكالوريا التجريبية"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'العنوان بالفرنسية (Titre en Français):' : 'Titre en Français :'}
                </label>
                <input
                  type="text"
                  value={titleFr}
                  onChange={(e) => setTitleFr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                  placeholder="Ex: Calendrier du Bac Blanc"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'درجة الأهمية:' : 'Priorité :'}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden font-semibold"
                  >
                    <option value="normal">{lang === 'ar' ? 'عادي (Normal)' : 'Normal'}</option>
                    <option value="important">{lang === 'ar' ? 'هام (Important)' : 'Important'}</option>
                    <option value="urgent">{lang === 'ar' ? 'عاجل وفوري (Urgent)' : 'Urgent'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الفئة المستهدفة:' : 'Audience cible :'}
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden font-semibold"
                  >
                    <option value="all">{lang === 'ar' ? 'الجميع (Tous)' : 'Tous'}</option>
                    <option value="parents">{lang === 'ar' ? 'أولياء الأمور (Parents)' : 'Parents'}</option>
                    <option value="teachers">{lang === 'ar' ? 'هيئة التدريس (Enseignants)' : 'Enseignants'}</option>
                    <option value="students">{lang === 'ar' ? 'التلاميذ (Élèves)' : 'Élèves'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'تاريخ النشر:' : 'Date de publication :'}
                  </label>
                  <input
                    type="date"
                    value={annDate}
                    onChange={(e) => setAnnDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الجهة المصدرة:' : 'Émetteur :'}
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                    placeholder="مثال: الإدارة العامة، الناظر العام"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'نص التعميم (عربي):' : 'Contenu en Arabe :'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={contentAr}
                  onChange={(e) => setContentAr(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                  placeholder="أدخل النص الكامل للتعميم..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'نص التعميم بالفرنسية (اختياري):' : 'Contenu en Français (optionnel) :'}
                </label>
                <textarea
                  rows={2}
                  value={contentFr}
                  onChange={(e) => setContentFr(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                  placeholder="Version française du communiqué..."
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
                  {lang === 'ar' ? 'نشر التعميم' : 'Publier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / Correct Announcement Modal */}
      {editingAnnouncement && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'ar' ? 'تعديل وتصحيح التعميم المدرسي' : 'Modifier & Corriger la Circulaire'}</span>
              </h3>
              <button
                onClick={() => setEditingAnnouncement(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'عنوان التعميم بالعربية:' : 'Titre en Arabe :'}
                </label>
                <input
                  type="text"
                  required
                  value={editTitleAr}
                  onChange={(e) => setEditTitleAr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'العنوان بالفرنسية (Titre en Français):' : 'Titre en Français :'}
                </label>
                <input
                  type="text"
                  value={editTitleFr}
                  onChange={(e) => setEditTitleFr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'درجة الأهمية:' : 'Priorité :'}
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden font-semibold"
                  >
                    <option value="normal">{lang === 'ar' ? 'عادي (Normal)' : 'Normal'}</option>
                    <option value="important">{lang === 'ar' ? 'هام (Important)' : 'Important'}</option>
                    <option value="urgent">{lang === 'ar' ? 'عاجل وفوري (Urgent)' : 'Urgent'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الفئة المستهدفة:' : 'Audience cible :'}
                  </label>
                  <select
                    value={editTargetAudience}
                    onChange={(e) => setEditTargetAudience(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 outline-hidden font-semibold"
                  >
                    <option value="all">{lang === 'ar' ? 'الجميع (Tous)' : 'Tous'}</option>
                    <option value="parents">{lang === 'ar' ? 'أولياء الأمور (Parents)' : 'Parents'}</option>
                    <option value="teachers">{lang === 'ar' ? 'هيئة التدريس (Enseignants)' : 'Enseignants'}</option>
                    <option value="students">{lang === 'ar' ? 'التلاميذ (Élèves)' : 'Élèves'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'تاريخ النشر:' : 'Date de publication :'}
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'الجهة المصدرة:' : 'Émetteur :'}
                  </label>
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'نص التعميم (عربي):' : 'Contenu en Arabe :'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={editContentAr}
                  onChange={(e) => setEditContentAr(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'نص التعميم بالفرنسية:' : 'Contenu en Français :'}
                </label>
                <textarea
                  rows={3}
                  value={editContentFr}
                  onChange={(e) => setEditContentFr(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-hidden font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAnnouncement(null)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {lang === 'ar' ? 'حفظ التعديلات' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'ar' ? 'تأكيد حذف التعميم' : 'Confirmer la suppression'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ar'
                  ? 'هل أنت متأكد من رغبتك في حذف هذا التعميم من اللوحة المدرسية نهائياً؟'
                  : 'Êtes-vous sûr de vouloir supprimer définitivement cette circulaire ?'}
              </p>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl text-xs transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDelete(deletingId)}
                className="px-4 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                {lang === 'ar' ? 'نعم، حذف التعميم' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
