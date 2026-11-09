import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DirectorDashboard } from './components/dashboard/DirectorDashboard';
import { StudentsModule } from './components/students/StudentsModule';
import { GradesModule } from './components/grades/GradesModule';
import { FinanceModule } from './components/finance/FinanceModule';
import { AttendanceModule } from './components/attendance/AttendanceModule';
import { TeachersModule } from './components/teachers/TeachersModule';
import { CommunicationModule } from './components/communication/CommunicationModule';
import { CalendarModule } from './components/calendar/CalendarModule';
import { DatabaseSchemaView } from './components/schema/DatabaseSchemaView';
import { SchoolSettingsModule } from './components/settings/SchoolSettingsModule';
import { AcademicStructureModule } from './components/academic/AcademicStructureModule';
import { OfficialBulletinView } from './components/bulletin/OfficialBulletinView';
import { OfficialReceiptView } from './components/finance/OfficialReceiptView';

const MainContent: React.FC = () => {
  const { activeTab, lang } = useApp();

  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans selection:bg-emerald-100 selection:text-emerald-950 text-slate-800"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && <DirectorDashboard />}
          {activeTab === 'students' && <StudentsModule />}
          {activeTab === 'grades' && <GradesModule />}
          {activeTab === 'finance' && <FinanceModule />}
          {activeTab === 'attendance' && <AttendanceModule />}
          {activeTab === 'teachers' && <TeachersModule />}
          {activeTab === 'academic' && <AcademicStructureModule />}
          {activeTab === 'communication' && <CommunicationModule />}
          {activeTab === 'calendar' && <CalendarModule />}
          {activeTab === 'settings' && <SchoolSettingsModule />}
          {activeTab === 'schema' && <DatabaseSchemaView />}
        </main>
      </div>

      {/* Official Modals with Printable Layouts */}
      <OfficialBulletinView />
      <OfficialReceiptView />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
