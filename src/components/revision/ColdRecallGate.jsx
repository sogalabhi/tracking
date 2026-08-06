import React, { useState } from 'react';
import { Lock, Unlock, Eye, ExternalLink } from 'lucide-react';

export function ColdRecallGate({ item, onClearGate }) {
  const [recallInput, setRecallInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (recallInput.trim()) {
      setIsUnlocked(true);
      if (onClearGate) onClearGate();
    }
  };

  if (isUnlocked) {
    return (
      <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-emerald-400 font-bold border-b border-slate-800 pb-2">
          <span className="flex items-center gap-1.5">
            <Unlock className="w-4 h-4 text-emerald-400" /> Active Recall Unlocked!
          </span>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-indigo-400 hover:underline"
            >
              LeetCode Link <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div>
          <p className="text-[11px] font-bold text-slate-400 mb-1">Your Stated Approach:</p>
          <p className="text-xs font-mono text-emerald-300 bg-slate-900 p-2 rounded border border-slate-800">
            "{recallInput}"
          </p>
        </div>

        {item.notes && (
          <div>
            <p className="text-[11px] font-bold text-slate-400 mb-1">Official Notes / Solution:</p>
            <p className="text-xs text-slate-200 bg-slate-900 p-2.5 rounded border border-slate-800 font-mono whitespace-pre-wrap">
              {item.notes}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border border-indigo-500/40 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 border-b border-slate-800 pb-2">
        <Lock className="w-4 h-4 text-indigo-400" /> Cold Recall Gate
        <span className="text-[10px] text-slate-400 font-normal">
          (State your 1-line approach before viewing notes)
        </span>
      </div>

      <form onSubmit={handleUnlock} className="space-y-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1">
            What is the core pattern & approach for <strong className="text-white">{item.title}</strong>?
          </label>
          <input
            type="text"
            value={recallInput}
            onChange={(e) => setRecallInput(e.target.value)}
            placeholder="E.g. Binary search on answer space, bounds 1 to max(arr)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!recallInput.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-bold text-xs shadow-md"
          >
            <Eye className="w-3.5 h-3.5" /> Reveal Solution Notes
          </button>
        </div>
      </form>
    </div>
  );
}
