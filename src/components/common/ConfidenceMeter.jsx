import React from 'react';

export function ConfidenceMeter({ rating = 1, onChange, readOnly = false }) {
  const levels = [1, 2, 3, 4, 5];

  const getColor = (level) => {
    if (level > rating) return 'bg-slate-800 border-slate-700';
    if (rating <= 2) return 'bg-amber-500 border-amber-400 shadow-amber-500/20';
    if (rating <= 4) return 'bg-indigo-500 border-indigo-400 shadow-indigo-500/20';
    return 'bg-emerald-500 border-emerald-400 shadow-emerald-500/30';
  };

  return (
    <div className="flex items-center gap-1">
      {levels.map((lvl) => (
        <button
          key={lvl}
          type="button"
          disabled={readOnly}
          onClick={(e) => {
            e.stopPropagation();
            if (onChange) onChange(lvl);
          }}
          title={`Set Confidence ${lvl}/5 (${lvl === 1 ? 'decay 1d' : lvl === 2 ? 'decay 2d' : lvl === 3 ? 'decay 4d' : lvl === 4 ? 'decay 7d' : 'decay 21d'})`}
          className={`w-2.5 h-2.5 rounded-full border transition-all ${getColor(lvl)} ${
            readOnly ? 'cursor-default' : 'hover:scale-125 cursor-pointer'
          }`}
        />
      ))}
    </div>
  );
}
