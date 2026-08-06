import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Flame, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTotalSecondsForDate, getHeatmapIntensityLevel, calculateStudyStreak } from '../../services/analytics';
import { DayDetailModal } from './DayDetailModal';

export function CalendarView() {
  const { sessions } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(null);

  const streakDays = calculateStudyStreak(sessions);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // First day of month & days count
  const firstDayIdx = new Date(year, month, 1).getDay(); // 0 is Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Color mappings for intensity scale 0 to 4
  const getCellClasses = (level) => {
    switch (level) {
      case 1:
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/80';
      case 2:
        return 'bg-emerald-800/80 text-white border-emerald-600 hover:bg-emerald-700';
      case 3:
        return 'bg-emerald-600 text-white border-emerald-400 font-extrabold shadow-lg shadow-emerald-600/30';
      case 4:
        return 'bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white border-indigo-400 font-extrabold shadow-xl shadow-indigo-500/40 animate-pulse-subtle';
      default:
        return 'bg-slate-950 text-slate-500 border-slate-850 hover:bg-slate-900 hover:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white rounded-2xl shadow-lg shadow-indigo-600/30">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              {monthName}
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                Yeolpumta Heatmap
              </span>
            </h2>
            <p className="text-xs text-slate-400">Click any day cell to view 24h timeline and subject breakdown.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-950/40 border border-amber-800/50 rounded-xl text-xs font-bold text-amber-300">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Active Streak: {streakDays} days</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Month Heatmap Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        {/* Days of Week Row */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-extrabold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for padding before 1st of month */}
          {Array.from({ length: firstDayIdx }).map((_, idx) => (
            <div key={`empty_${idx}`} className="h-20 bg-slate-950/30 rounded-2xl border border-transparent" />
          ))}

          {/* Month Day Cells */}
          {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
            const dayNum = dayIdx + 1;
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
            const seconds = getTotalSecondsForDate(sessions, dateStr);
            const hours = (seconds / 3600).toFixed(1);
            const level = getHeatmapIntensityLevel(seconds);

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDateStr(dateStr)}
                className={`h-24 p-2.5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all ${getCellClasses(level)}`}
              >
                <div className="flex justify-between items-center text-xs font-extrabold">
                  <span>{dayNum}</span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold font-mono">
                    {seconds > 0 ? `${hours}h` : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded bg-slate-950 border border-slate-850" />
          <div className="w-3 h-3 rounded bg-emerald-950 border border-emerald-800" />
          <div className="w-3 h-3 rounded bg-emerald-800" />
          <div className="w-3 h-3 rounded bg-emerald-600" />
          <div className="w-3 h-3 rounded bg-gradient-to-tr from-indigo-600 to-emerald-500" />
          <span>More (8h+)</span>
        </div>
      </div>

      {selectedDateStr && (
        <DayDetailModal dateStr={selectedDateStr} onClose={() => setSelectedDateStr(null)} />
      )}
    </div>
  );
}
