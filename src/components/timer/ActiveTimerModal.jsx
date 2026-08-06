import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { useTimer } from '../../context/TimerContext';

export function ActiveTimerModal() {
  const { showIdleModal, idleGapSeconds, handleTrimIdleGap } = useTimer();

  if (!showIdleModal) return null;

  const gapMins = Math.round(idleGapSeconds / 60);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-white">Timer Away Gap Detected</h3>
          <p className="text-xs text-slate-400">
            Your browser tab was inactive for approximately <strong className="text-amber-300 font-mono">{gapMins} minutes</strong>.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleTrimIdleGap(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-800/40 font-bold text-xs rounded-xl"
          >
            Subtract {gapMins}m Gap
          </button>
          <button
            onClick={() => handleTrimIdleGap(false)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Keep Full Time
          </button>
        </div>
      </div>
    </div>
  );
}
