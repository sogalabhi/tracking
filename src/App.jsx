import React from 'react';
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
import { ShortcutModal } from './components/common/ShortcutModal';
import { ActiveTimerModal } from './components/timer/ActiveTimerModal';

function MainContent() {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {activeTab === 'today' && <TodayView />}
      {activeTab === 'tracker' && <TrackerView />}
      {activeTab === 'planner' && <PlannerView />}
      {activeTab === 'revision' && <RevisionView />}
      {activeTab === 'calendar' && <CalendarView />}
      {activeTab === 'insights' && <InsightsView />}
      {activeTab === 'data' && <DataView />}
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <TimerProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <MainContent />
          </div>
          <ShortcutModal />
          <ActiveTimerModal />
        </div>
      </TimerProvider>
    </AppProvider>
  );
}
