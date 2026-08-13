import React, { useState } from 'react';
import { Calendar, Plus, ArrowRight, CheckCircle2, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUBJECTS } from '../../data/seedData';

export function PlannerView() {
  const {
    plans,
    togglePlanCompleted,
    deletePlanItem,
    pushPlanToTomorrow,
    addItemToTodayPlan
  } = useApp();

  const [customTaskTitle, setCustomTaskTitle] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('dsa');

  // Generate date strip for 7 days starting today (Aug 6)
  const daysList = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    daysList.push({ dateStr, dayLabel });
  }

  const handleAddCustomTask = (e) => {
    e.preventDefault();
    if (!customTaskTitle.trim()) return;
    addItemToTodayPlan({
      title: customTaskTitle.trim(),
      subjectId: selectedSubjectId
    });
    setCustomTaskTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Planner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">7-Day Study Planner</h2>
            <p className="text-xs text-slate-400">Order tasks day-by-day. Reshuffle without broken time-block stress.</p>
          </div>
        </div>

        {/* Quick Add Custom Task Form */}
        <form onSubmit={handleAddCustomTask} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={customTaskTitle}
            onChange={(e) => setCustomTaskTitle(e.target.value)}
            placeholder="Add custom plan item for Today..."
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full md:w-64"
          />
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
      </div>

      {/* 7 Day Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {daysList.map((day) => {
          const dayPlans = plans.filter((p) => p.date === day.dateStr);

          return (
            <div
              key={day.dateStr}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-extrabold text-xs text-indigo-300 uppercase tracking-wider">
                    {day.dayLabel}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {dayPlans.filter((p) => p.completed).length}/{dayPlans.length}
                  </span>
                </div>

                <div className="space-y-2 min-h-[120px]">
                  {dayPlans.length === 0 ? (
                    <p className="text-[11px] text-white text-center py-8 italic">
                      No tasks planned
                    </p>
                  ) : (
                    dayPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                          plan.completed
                            ? 'bg-slate-950/60 border-slate-850 opacity-60'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={plan.completed}
                            onChange={() => togglePlanCompleted(plan.id)}
                            className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 cursor-pointer"
                          />
                          <span
                            className={`truncate ${
                              plan.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'
                            }`}
                          >
                            {plan.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => pushPlanToTomorrow(plan.id)}
                            className="p-1 text-slate-500 hover:text-amber-400"
                            title="Push to Next Day"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deletePlanItem(plan.id)}
                            className="p-1 text-slate-600 hover:text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
