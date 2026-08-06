import React, { useState } from 'react';
import { X, Trash2, Plus, Clock, BarChart2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSubjectTimeBreakdown, getTotalSecondsForDate } from '../../services/analytics';
import { SUBJECTS } from '../../data/seedData';
import { SessionEditor } from './SessionEditor';

export function DayDetailModal({ dateStr, onClose }) {
  const { sessions, deleteSession, settings } = useApp();
  const [showEditor, setShowEditor] = useState(false);

  const daySessions = sessions.filter((s) => s.date === dateStr);
  const totalSeconds = getTotalSecondsForDate(sessions, dateStr);
  const totalHours = (totalSeconds / 3600).toFixed(1);
  const subjectTimes = getSubjectTimeBreakdown(sessions, dateStr);

  const targetMin = settings.dailyTargetHours || 8;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Day Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Day Breakdown
            </span>
            <h3 className="text-xl font-extrabold text-white font-mono">{dateStr}</h3>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">{totalHours}h</span>
            <p className="text-xs text-slate-400 font-mono">Target: {targetMin}h</p>
          </div>
        </div>

        {/* Per-Subject Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-indigo-400" /> Subject Hours Split
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {SUBJECTS.map((sub) => {
              const secs = subjectTimes[sub.id] || 0;
              const hrs = (secs / 3600).toFixed(1);
              return (
                <div key={sub.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">{sub.name}</span>
                  <span className="font-mono font-bold text-indigo-300">{hrs}h</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 24-Hour Timeline Strip */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" /> 24-Hour Day Timeline Strip
          </h4>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="grid grid-cols-24 gap-0.5 h-6 rounded bg-slate-900 overflow-hidden">
              {Array.from({ length: 24 }).map((_, hourIdx) => {
                const hourHasSession = daySessions.some((s) => {
                  if (!s.startTime) return false;
                  const h = new Date(s.startTime).getHours();
                  return h === hourIdx;
                });
                return (
                  <div
                    key={hourIdx}
                    className={`h-full border-r border-slate-950 text-[8px] font-mono text-slate-600 flex items-center justify-center ${
                      hourHasSession ? 'bg-emerald-500 shadow-emerald-500/50 shadow-inner' : 'bg-slate-900/60'
                    }`}
                    title={`Hour ${hourIdx}:00`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Logged Time Blocks ({daySessions.length})
            </h4>
            <button
              onClick={() => setShowEditor(true)}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-bold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Manual Time
            </button>
          </div>

          {daySessions.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">No sessions recorded on this date.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {daySessions.map((s) => (
                <div
                  key={s.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-indigo-300 uppercase text-[10px]">{s.subjectId}</span>
                    <p className="text-slate-200 font-semibold">{s.note || 'Study Session'}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-emerald-400">
                      {Math.round(s.durationSeconds / 60)} mins
                    </span>
                    <button
                      onClick={() => deleteSession(s.id)}
                      className="p-1 text-slate-600 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showEditor && <SessionEditor dateStr={dateStr} onClose={() => setShowEditor(false)} />}
      </div>
    </div>
  );
}
