import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, Sparkles, Filter, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getDueRevisionQueue } from '../../services/spacedRepetition';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { DifficultyBadge } from '../common/Badge';
import { ColdRecallGate } from './ColdRecallGate';

export function RevisionView() {
  const { items, setConfidence, toggleDone, toggleRevisionFlag } = useApp();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'manual' | 'auto'

  const dueQueue = getDueRevisionQueue(items);

  const filteredQueue = dueQueue.filter((item) => {
    if (activeTab === 'manual') return item.revisionFlag;
    if (activeTab === 'auto') return !item.revisionFlag && item.done;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" /> Spaced Repetition Queue
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {dueQueue.length} Items Due for Revision Today
          </h2>
          <p className="text-xs text-slate-400">
            Beat memory decay before interviews. Updating confidence stretches interval automatically.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: `All Due (${dueQueue.length})` },
            { id: 'manual', label: '☑ Manual Flags' },
            { id: 'auto', label: 'Auto Spaced Decay' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                activeTab === tab.id
                  ? 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Due Items List */}
      {filteredQueue.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Revision Queue Completely Clean!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You are 100% up to date on your spaced repetition intervals. Great work!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQueue.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white">{item.title}</span>
                    <DifficultyBadge difficulty={item.difficulty} />
                    {item.revisionFlag && (
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                        Manual Flag
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Subject: {item.subjectId?.toUpperCase()} · Last Touched: {item.lastTouched || 'Never'} · Next Due: {item.nextDue || 'Today'}
                  </p>
                </div>

                {/* Rating & Resolve Action */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 mb-1">New Confidence:</span>
                    <ConfidenceMeter
                      rating={item.confidence}
                      onChange={(r) => {
                        setConfidence(item.id, r);
                        if (item.revisionFlag) toggleRevisionFlag(item.id);
                      }}
                    />
                  </div>

                  <button
                    onClick={() => {
                      setConfidence(item.id, Math.min(item.confidence + 1, 5));
                      if (item.revisionFlag) toggleRevisionFlag(item.id);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Mark Reviewed
                  </button>
                </div>
              </div>

              {/* Cold Recall Gate */}
              <ColdRecallGate item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
