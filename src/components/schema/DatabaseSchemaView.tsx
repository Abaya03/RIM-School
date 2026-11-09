import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Database,
  Server,
  Layers,
  Code2,
  WifiOff,
  ShieldCheck,
  Zap,
  CheckCircle,
  Copy,
} from 'lucide-react';

export const DatabaseSchemaView: React.FC = () => {
  const { lang, t } = useApp();
  const [copied, setCopied] = useState(false);

  const sqlSchemaScript = `-- ==========================================================
-- نظام إدارة مدرسة موريتانية (Complexe Scolaire Mauritanie)
-- مخطط قاعدة بيانات علائقية متوافقة مع معايير وزارة التهذيب الوطني
-- PostgreSQL / MySQL DDL Schema
-- ==========================================================

-- 1. جدول المؤسسة والإعدادات العامة
CREATE TABLE schools (
    id VARCHAR(36) PRIMARY KEY,
    name_ar VARCHAR(150) NOT NULL,
    name_fr VARCHAR(150) NOT NULL,
    dren_ar VARCHAR(100) NOT NULL, -- الإدارة الجهوية للتهذيب الوطني
    dren_fr VARCHAR(100) NOT NULL,
    wilaya VARCHAR(50) NOT NULL,    -- نواكشوط الغربية، الشمالية، داخلت نواذيبو...
    moughataa VARCHAR(50) NOT NULL, -- تفرغ زينة، تيارت، عرفات...
    phone VARCHAR(30),
    current_school_year VARCHAR(20) DEFAULT '2024-2025'
);

-- 2. جدول المستخدمين والأدوار (RBAC)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('director', 'censeur', 'teacher', 'accountant', 'parent')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. جدول الأقسام والفصول الدراسية
CREATE TABLE classes (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) NOT NULL,      -- e.g. 7D1, 7C, 4AS1, 6AF
    name_ar VARCHAR(100) NOT NULL,
    name_fr VARCHAR(100) NOT NULL,
    cycle VARCHAR(20) CHECK (cycle IN ('fundamental', 'college', 'lycee')),
    stream VARCHAR(10) CHECK (stream IN ('D', 'C', 'LM', 'LO', 'general')),
    level_order INT NOT NULL,       -- 1..6 (Primary), 1..4 (College), 5..7 (Lycee)
    room_number VARCHAR(20)
);

-- 4. جدول المواد التعليمية
CREATE TABLE subjects (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    name_fr VARCHAR(100) NOT NULL,
    is_core_science BOOLEAN DEFAULT FALSE
);

-- 5. جدول مصفوفة المواد والمعاملات حسب القسم والشعبة (Mauritanian Coefficients)
CREATE TABLE class_subjects (
    id VARCHAR(36) PRIMARY KEY,
    class_id VARCHAR(36) REFERENCES classes(id) ON DELETE CASCADE,
    subject_id VARCHAR(36) REFERENCES subjects(id) ON DELETE CASCADE,
    coefficient INT NOT NULL DEFAULT 1,  -- e.g. SN in 7D = 8, Math in 7C = 9
    teacher_id VARCHAR(36),
    hours_per_week INT DEFAULT 4,
    UNIQUE(class_id, subject_id)
);

-- 6. جدول التلاميذ (الملف المركزي)
CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY,
    matricule VARCHAR(30) UNIQUE NOT NULL, -- e.g. RIM-2024-0101
    national_id_nni VARCHAR(10) UNIQUE,    -- الرقم الوطني الموريتاني للتعريف
    first_name_ar VARCHAR(50) NOT NULL,
    last_name_ar VARCHAR(50) NOT NULL,
    first_name_fr VARCHAR(50) NOT NULL,
    last_name_fr VARCHAR(50) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    birth_date DATE NOT NULL,
    birth_place_ar VARCHAR(50),
    birth_place_fr VARCHAR(50),
    class_id VARCHAR(36) REFERENCES classes(id),
    guardian_name_ar VARCHAR(100) NOT NULL,
    guardian_phone VARCHAR(20) NOT NULL,   -- للرسائل النصية وتطبيقات الدفع
    tuition_total NUMERIC(10,2) DEFAULT 0, -- بالأوقية الموريتانية MRU
    tuition_paid NUMERIC(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active'
);

-- 7. جدول النقاط والتقييمات الفصلية (Devoir 1, Devoir 2, Composition)
CREATE TABLE grades (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) REFERENCES students(id) ON DELETE CASCADE,
    class_id VARCHAR(36) REFERENCES classes(id),
    subject_id VARCHAR(36) REFERENCES subjects(id),
    trimestre INT CHECK (trimestre IN (1, 2, 3)),
    devoir_1 NUMERIC(4,2) CHECK (devoir_1 >= 0 AND devoir_1 <= 20),
    devoir_2 NUMERIC(4,2) CHECK (devoir_2 >= 0 AND devoir_2 <= 20),
    composition NUMERIC(4,2) CHECK (composition >= 0 AND composition <= 20),
    -- الصيغة الموريتانية: (D1 + D2 + 2 * Compo) / 4
    moyenne_matiere NUMERIC(4,2) GENERATED ALWAYS AS (
        (COALESCE(devoir_1, 0) + COALESCE(devoir_2, 0) + 2 * COALESCE(composition, 0)) / 4.0
    ) STORED,
    appreciation_ar VARCHAR(255),
    appreciation_fr VARCHAR(255),
    UNIQUE(student_id, subject_id, trimestre)
);

-- 8. جدول الحضور والمواظبة اليومية
CREATE TABLE attendance (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) REFERENCES students(id) ON DELETE CASCADE,
    class_id VARCHAR(36) REFERENCES classes(id),
    date DATE NOT NULL,
    status VARCHAR(25) CHECK (status IN ('present', 'absent_unjustified', 'absent_justified', 'late')),
    notes VARCHAR(255),
    sms_notification_sent BOOLEAN DEFAULT FALSE
);

-- 9. جدول الرسوم والمقبوضات (الخزينة الموريتانية بالأوقية MRU)
CREATE TABLE payments (
    id VARCHAR(36) PRIMARY KEY,
    receipt_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. REC-2025-0101
    student_id VARCHAR(36) REFERENCES students(id),
    amount NUMERIC(10,2) NOT NULL,              -- MRU
    payment_date DATE NOT NULL,
    payment_method VARCHAR(25) CHECK (payment_method IN ('bankily', 'masrvi', 'sedad', 'cash', 'bank_transfer')),
    payment_type VARCHAR(30),
    month_covered VARCHAR(50),
    cashier_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. جدول المصاريف التشغيلية
CREATE TABLE expenses (
    id VARCHAR(36) PRIMARY KEY,
    title_ar VARCHAR(150) NOT NULL,
    title_fr VARCHAR(150) NOT NULL,
    category VARCHAR(30) CHECK (category IN ('salaries', 'rent', 'utilities', 'supplies', 'maintenance')),
    amount NUMERIC(10,2) NOT NULL, -- MRU
    date DATE NOT NULL,
    beneficiary VARCHAR(100),
    approved_by VARCHAR(100)
);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchemaScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <Server className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'ar' ? 'البنية التقنية وقواعد البيانات المهيكلة (PostgreSQL Schema)' : 'Architecture Technique & Schéma Relationnel'}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {t.schemaAndArchitecture}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'ar'
              ? 'مخطط الجداول العلائقية الرسمي، العلاقات بين الكيانات، وتوصيات النشر في البيئة الموريتانية.'
              : 'Schéma relationnel SQL normalisé (3NF), contraintes d’intégrité et déploiement.'}
          </p>
        </div>

        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? (lang === 'ar' ? 'تم نسخ SQL' : 'SQL Copié') : (lang === 'ar' ? 'نسخ كود SQL Schema' : 'Copier SQL')}</span>
        </button>
      </div>

      {/* Deployment & Mauritanian Infrastructure Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
            <WifiOff className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'ar' ? 'مراعاة ضعف وسرعة الإنترنت' : 'Offline-First & PWA'}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'ar'
              ? 'الاعتماد على التخزين المؤقت IndexedDB عبر Service Workers للسماح للأساتذة برصد الحضور والنقاط دون اتصال، والمزامنة التلقائية عند عودة الشبكة.'
              : 'Mise en cache locale IndexedDB pour saisie hors-ligne des notes et présence, synchronisation différée.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
            <Zap className="w-4 h-4 text-teal-700" />
            <span>{lang === 'ar' ? 'بوابات الدفع الوطنية (Fintech RIM)' : 'Passerelles Fintech RIM'}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'ar'
              ? 'تجهيز واجهات ربط مباشرة (Webhooks/API) مع بوابات الدفع الموريتانية الأكثر انتشاراً: بنكيلي (Bankily)، مصرفي (Masrvi)، والسداد (Sedad).'
              : 'Intégration des APIs et webhooks pour la réconciliation automatique des paiements mobiles locaux.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>{lang === 'ar' ? 'الامتثال لمعايير وزارة التهذيب' : 'Conformité MEN'}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'ar'
              ? 'صيغ المعاملات الرسمية وحساب المعدلات متطابقة بدقة مع النماذج الرسمية لمفتشية التعليم الثانوي والأساسي بموريتانيا.'
              : 'Formules de calcul, coefficients et mentions rigoureusement conformes aux décrets ministériels.'}
          </p>
        </div>
      </div>

      {/* SQL Script Viewer */}
      <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Code2 className="w-4 h-4" />
            <span>schema_mauritania_school.sql (PostgreSQL 15+)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">10 Relational Tables (3NF)</span>
        </div>
        <div className="p-4 overflow-x-auto max-h-[500px]">
          <pre className="font-mono text-xs text-emerald-300 leading-relaxed">
            {sqlSchemaScript}
          </pre>
        </div>
      </div>
    </div>
  );
};
