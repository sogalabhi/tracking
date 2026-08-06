import React from 'react';
import { BarChart3, AlertTriangle, Tag, Clock, Award, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getWeakestTopics, getMistakeTagStats } from '../../services/analytics';
import { ConfidenceMeter } from '../common/ConfidenceMeter';

export function InsightsView() {
  const { topics, items, sessions } = useApp();

  const weakTopics = getWeakestTopics(topics, items);
  const mistakeStats = getMistakeTagStats(items);

  const totalSolved = items.filter((i) => i.done).length;
  const totalLoggedSecs = sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  const totalLoggedHours = (totalLoggedSecs / 3600).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" /> Performance & Analytics
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Study Diagnostic Insights
          </h2>
          <p className="text-xs text-slate-400">
            Pinpoint failure patterns, weak topic decay, and hours vs output efficiency.
          </p>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Problems Solved</p>
            <h3 className="text-2xl font-extrabold text-white font-mono">{totalSolved} / {items.length}</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Time Invested</p>
            <h3 className="text-2xl font-extrabold text-indigo-300 font-mono">{totalLoggedHours} Hours</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weakest Topic</p>
            <h3 className="text-sm font-extrabold text-rose-300 truncate max-w-[160px]">
              {weakTopics[0]?.name || 'None'}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mistake Tag Breakdown (Reason Analysis) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Tag className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-extrabold text-white">Mistake & Failure Breakdown</h3>
          </div>

          <div className="space-y-4">
            {mistakeStats.map((tag) => (
              <div key={tag.id} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{tag.label}</span>
                  <span className="font-mono text-rose-300">
                    {tag.count} misses ({tag.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${tag.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Confidence Ranking */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Target className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-extrabold text-white">Topics Ranked by Confidence</h3>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {weakTopics.map((topic) => (
              <div
                key={topic.id}
                className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-white">{topic.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {topic.solvedCount} / {topic.itemCount} solved
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-indigo-300">
                    {topic.avgConfidence} / 5.0
                  </span>
                  <ConfidenceMeter rating={Math.round(topic.avgConfidence)} readOnly />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
