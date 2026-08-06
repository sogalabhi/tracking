import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { TimerProvider } from './context/TimerContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { TodayView } from './components/today/TodayView';
import { TrackerView } from './components/tracker/TrackerView';
import { PlannerView } from './components/planner/PlannerView';
import { RevisionView } from './components/revision/RevisionView';
import { CalendarView } from './components/calendar/CalendarView';
import { InsightsView } from './components/insights/InsightsView';
import { DataView } from './components/data/DataView';
import { HelpView } from './components/help/HelpView';
import { ShortcutModal } from './components/common/ShortcutModal';
import { ActiveTimerModal } from './components/timer/ActiveTimerModal';
import { useGlobalKeyboardShortcuts } from './hooks/useGlobalKeyboardShortcuts';

function MainContent() {
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <Routes>
        <Route path="/" element={<Navigate to="/today" replace />} />
        <Route path="/today" element={<TodayView />} />
        <Route path="/tracker" element={<TrackerView />} />
        <Route path="/planner" element={<PlannerView />} />
        <Route path="/revision" element={<RevisionView />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/insights" element={<InsightsView />} />
        <Route path="/data" element={<DataView />} />
        <Route path="/help" element={<HelpView />} />
        <Route path="*" element={<Navigate to="/today" replace />} />
      </Routes>
    </main>
  );
}

function AppShell() {
  const { theme } = useApp();
  useGlobalKeyboardShortcuts();

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === 'light'
        ? 'theme-light bg-[#f4f8ff] text-slate-900 selection:bg-pink-300'
        : 'theme-dark bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white'
    }`}>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <MainContent />
      </div>
      <ShortcutModal />
      <ActiveTimerModal />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <TimerProvider>
          <AppShell />
        </TimerProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
