import React from 'react';
import {
  Code2,
  Database,
  Brain,
  Table,
  Cpu,
  Layers,
  Play,
  CheckCircle2,
  BarChart2,
  Clock
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SUBJECTS } from '../../data/seedData';
import { useApp } from '../../context/AppContext';
import { useTimer } from '../../context/TimerContext';
import { getTotalSecondsForDate } from '../../services/analytics';

const ICON_MAP = {
  Code2,
  Database,
  Brain,
  Table,
  Cpu,
  Layers
};

export function Sidebar() {
  const { selectedSubject, setSelectedSubject, items, sessions } = useApp();
  const { startTimer, activeTimer } = useTimer();
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarNow = new Date();
  const todayStr = `${sidebarNow.getFullYear()}-${String(sidebarNow.getMonth() + 1).padStart(2, '0')}-${String(sidebarNow.getDate()).padStart(2, '0')}`;
  const todaySeconds = getTotalSecondsForDate(sessions, todayStr);

  const handleSelectSubject = (subId) => {
    setSelectedSubject(subId);
    if (location.pathname !== '/tracker') {
      navigate('/tracker');
    }
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 hidden md:flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-6">
        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Subjects & Modules
          </h2>
          <div className="space-y-1">
            {SUBJECTS.map((sub) => {
              const IconComponent = ICON_MAP[sub.icon] || Code2;
              const isSelected = selectedSubject === sub.id;
              const subItems = items.filter((i) => i.subjectId === sub.id);
              const solvedCount = subItems.filter((i) => i.done).length;

              return (
                <div
                  key={sub.id}
                  onClick={() => handleSelectSubject(sub.id)}
                  className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600/15 border border-indigo-500/40 text-white'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-white'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold truncate">{sub.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {solvedCount} / {subItems.length} solved
                      </p>
                    </div>
                  </div>

                  {/* Quick Start Timer button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startTimer(sub.id, null, sub.name);
                    }}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      activeTimer.subjectId === sub.id
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                        : 'bg-slate-800/80 hover:bg-emerald-600 hover:text-white text-slate-400 border-slate-700'
                    }`}
                    title={`Start Yeolpumta Timer for ${sub.name}`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar Footer Stats Summary */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Solved Total
          </span>
          <span className="font-mono font-bold text-slate-200">
            {items.filter((i) => i.done).length} / {items.length}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Today Logged
          </span>
          <span className="font-mono font-bold text-indigo-300">
            {(todaySeconds / 3600).toFixed(1)} hrs
          </span>
        </div>
      </div>
    </aside>
  );
}
