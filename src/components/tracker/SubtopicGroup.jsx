import React from 'react';
import { ItemRow } from './ItemRow';
import { useApp } from '../../context/AppContext';

export function SubtopicGroup({ subtopic, items }) {
  const { selectedItemId } = useApp();

  if (!items.length) return null;

  return (
    <div className="mb-4 bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-slate-950/80 px-3 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span>{subtopic.name}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          {items.filter((i) => i.done).length} / {items.length} done
        </span>
      </div>

      <div className="divide-y divide-slate-800/40">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} isSelected={selectedItemId === item.id} />
        ))}
      </div>
    </div>
  );
}
