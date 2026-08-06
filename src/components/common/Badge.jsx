import React from 'react';

export function DifficultyBadge({ difficulty }) {
  if (!difficulty) return null;

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  if (difficulty === 'Easy') colorClasses = 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50';
  if (difficulty === 'Medium') colorClasses = 'bg-amber-950/60 text-amber-400 border-amber-800/50';
  if (difficulty === 'Hard') colorClasses = 'bg-rose-950/60 text-rose-400 border-rose-800/50';

  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${colorClasses}`}>
      {difficulty}
    </span>
  );
}

export function MistakeBadge({ label }) {
  if (!label) return null;
  return (
    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-rose-950/40 text-rose-300 border border-rose-800/40">
      {label}
    </span>
  );
}
