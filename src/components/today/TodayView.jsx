import React from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowRight,
  Flame,
  Plus,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTimer } from '../../context/TimerContext';
import { getDueRevisionQueue } from '../../services/spacedRepetition';
import { getTotalSecondsForDate, getSubjectTimeBreakdown } from '../../services/analytics';
import { SUBJECTS } from '../../data/seedData';

export function TodayView() {
  const {
    items,
    plans,
    sessions,
    settings,
    setActiveTab,
    togglePlanCompleted,
    deletePlanItem,
    pushAllUnfinishedToTomorrow
  } = useApp();

  const { activeTimer, elapsedDisplaySeconds, startTimer, formatTime } = useTimer();

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySeconds = getTotalSecondsForDate(sessions, todayStr) + (activeTimer.isRunning ? elapsedDisplaySeconds : 0);
  const todayHours = (todaySeconds / 3600).toFixed(1);

  const dueQueue = getDueRevisionQueue(items, todayStr);
  const todayPlans = plans.filter((p) => p.date === todayStr);

  const subjectTimes = getSubjectTimeBreakdown(sessions, todayStr);

  const targetMin = settings.dailyTargetHours || 8;
  const targetMax = settings.dailyTargetMaxHours || 10;

  return (
    <div className="space-y-6">
      {/* Top Banner: Today Time Budget vs Target */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <CalendarCheck className="w-3.5 h-3.5" /> Today Dashboard
              </span>
              <span className="text-xs text-slate-400 font-mono">{todayStr}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Today Logged: <span className="text-emerald-400 font-mono">{todayHours}h</span>
              <span className="text-slate-400 font-normal text-lg"> / {targetMin}-{targetMax}h target</span>
            </h2>
            <p className="text-xs text-slate-400">
              Maintain focused stretches to reach your target OA readiness score today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('revision')}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-xl font-bold text-xs shadow-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Due Revisions ({dueQueue.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Today Ordered Task Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-extrabold text-white">Today's Focus Checklist</h3>
              </div>

              {todayPlans.some((p) => !p.completed) && (
                <button
                  onClick={pushAllUnfinishedToTomorrow}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Push Unfinished to Tomorrow →
                </button>
              )}
            </div>

            {todayPlans.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <p className="text-xs text-slate-400">
                  No tasks added to today's plan yet. Browse the <strong className="text-indigo-300">Tracker</strong> and click <kbd className="text-slate-300">+</kbd> to add items!
                </p>
                <button
                  onClick={() => setActiveTab('tracker')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Open Tracker Spreadsheet
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {todayPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      plan.completed
                        ? 'bg-slate-950/60 border-slate-850 opacity-60'
                        : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={plan.completed}
                        onChange={() => togglePlanCompleted(plan.id)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                      <span
                        className={`text-xs font-medium ${
                          plan.completed ? 'text-slate-500 line-through' : 'text-slate-200'
                        }`}
                      >
                        {plan.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deletePlanItem(plan.id)}
                        className="p-1 text-slate-600 hover:text-rose-400 transition-colors"
                        title="Remove task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Subject Hours Split */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-extrabold text-white">Subject Time Split</h3>
              </div>
            </div>

            <div className="space-y-3">
              {SUBJECTS.map((sub) => {
                const subSecs = subjectTimes[sub.id] || 0;
                const subHours = (subSecs / 3600).toFixed(1);
                const percent = todaySeconds > 0 ? Math.round((subSecs / todaySeconds) * 100) : 0;

                return (
                  <div key={sub.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{sub.name}</span>
                      <span className="font-mono text-indigo-300">{subHours}h ({percent}%)</span>
                    </div>
                    <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
