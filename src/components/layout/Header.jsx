import {
  CalendarDays,
  LayoutGrid,
  CalendarCheck,
  RotateCcw,
  BarChart3,
  Database,
  Flame,
  Play,
  Pause,
  Square,
  HelpCircle,
  Clock,
  Target,
  Sun,
  Moon
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTimer } from '../../context/TimerContext';
import { getDueRevisionQueue } from '../../services/spacedRepetition';
import { getTotalSecondsForDate, calculateStudyStreak } from '../../services/analytics';

export function Header() {
  const {
    items,
    sessions,
    settings,
    theme,
    toggleTheme,
    setShowShortcutModal
  } = useApp();

  const location = useLocation();

  const {
    activeTimer,
    elapsedDisplaySeconds,
    pauseTimer,
    resumeTimer,
    stopAndBankTimer,
    formatTime
  } = useTimer();

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySeconds = getTotalSecondsForDate(sessions, todayStr) + (activeTimer.isRunning ? elapsedDisplaySeconds : 0);
  const todayHours = (todaySeconds / 3600).toFixed(1);
  const targetMin = settings.dailyTargetHours || 8;
  const targetMax = settings.dailyTargetMaxHours || 10;

  const dueQueueCount = getDueRevisionQueue(items, todayStr).length;
  const streakDays = calculateStudyStreak(sessions);

  // D-Day Days calculation
  let dDayCount = null;
  if (settings.dDayDate) {
    const target = new Date(settings.dDayDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    dDayCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const tabs = [
    { id: 'today', label: 'Today', icon: CalendarCheck, path: '/today' },
    { id: 'tracker', label: 'Tracker', icon: LayoutGrid, path: '/tracker' },
    { id: 'planner', label: 'Planner', icon: CalendarDays, path: '/planner' },
    { id: 'revision', label: 'Revision', icon: RotateCcw, badge: dueQueueCount, path: '/revision' },
    { id: 'calendar', label: 'Calendar', icon: Clock, path: '/calendar' },
    { id: 'insights', label: 'Insights', icon: BarChart3, path: '/insights' },
    { id: 'data', label: 'Data', icon: Database, path: '/data' },
    { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Streak */}
          <div className="flex items-center gap-3">
            <Link to="/today" className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-md text-white">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                  Study Tracker
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                    OA Pro
                  </span>
                </h1>
              </div>
            </Link>

            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs font-bold"
              title={`${streakDays} consecutive day streak`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{streakDays}d Streak</span>
            </div>
          </div>

          {/* Active Timer Pill Widget */}
          <div className="flex-1 max-w-md">
            {activeTimer.subjectId || activeTimer.topicId ? (
              <div className="flex items-center justify-between bg-slate-950 border border-indigo-500/40 rounded-xl px-3 py-1.5 shadow-lg shadow-indigo-950/30 animate-pulse-border">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <div className="truncate text-xs">
                    <span className="font-semibold text-indigo-300 uppercase tracking-wider text-[10px]">
                      {activeTimer.subjectId}
                    </span>
                    <p className="text-slate-200 font-bold truncate">
                      {activeTimer.itemTitle || activeTimer.topicName || 'Studying...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-2">
                  <span className="font-mono text-sm font-extrabold text-emerald-400 tracking-wider">
                    {formatTime(elapsedDisplaySeconds)}
                  </span>
                  <div className="flex items-center gap-1">
                    {activeTimer.isRunning ? (
                      <button
                        onClick={pauseTimer}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300"
                        title="Pause Timer (Space)"
                      >
                        <Pause className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={resumeTimer}
                        className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
                        title="Resume Timer (Space)"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={stopAndBankTimer}
                      className="p-1 rounded bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300"
                      title="Stop and Bank Session"
                    >
                      <Square className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Daily Target Progress Bar */
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Target className="w-3 h-3 text-indigo-400" /> Today:
                    <strong className="text-slate-200">{todayHours}h</strong> / {targetMin}-{targetMax}h target
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {Math.min(Math.round((todayHours / targetMin) * 100), 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min((todayHours / targetMin) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* D-Day Countdown & Hotkey Button */}
          <div className="flex items-center gap-3">
            {dDayCount !== null && (
              <div
                className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-rose-950/30 border border-rose-800/40 rounded-lg text-xs"
                title={settings.dDayTitle}
              >
                <span className="text-slate-400">{settings.dDayTitle || 'D-Day'}:</span>
                <span className="font-mono font-extrabold text-rose-400 text-sm">
                  {dDayCount > 0 ? `${dDayCount} days` : 'TODAY!'}
                </span>
              </div>
            )}

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors flex items-center justify-center"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Pastel Light'} Mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => setShowShortcutModal(true)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Keyboard Shortcuts (?)"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800/60 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path || (tab.path === '/today' && location.pathname === '/');
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-indigo-700' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
