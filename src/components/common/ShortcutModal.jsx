import React from 'react';
import { X, Command } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ShortcutModal() {
  const { showShortcutModal, setShowShortcutModal } = useApp();

  if (!showShortcutModal) return null;

  const shortcuts = [
    { key: 'j / Down', desc: 'Move selection cursor down' },
    { key: 'k / Up', desc: 'Move selection cursor up' },
    { key: 'd', desc: 'Toggle Done (auto-advances to next row)' },
    { key: 'r', desc: 'Toggle Revision flag ☑ Rev (auto-advances)' },
    { key: '1 - 5', desc: 'Set confidence rating (auto-advances)' },
    { key: 'n', desc: 'Open / close notes editor for selected item' },
    { key: '/', desc: 'Focus global search filter' },
    { key: 't', desc: 'Add selected item to Today planner' },
    { key: 'Space', desc: 'Pause / Resume active topic timer' },
    { key: '?', desc: 'Toggle keyboard shortcut menu' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={() => setShowShortcutModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
            <Command className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Keyboard Shortcuts</h3>
            <p className="text-xs text-slate-400">Master fast 2-tap study logging</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-1">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs"
            >
              <span className="text-slate-300">{s.desc}</span>
              <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 text-indigo-300 font-mono font-bold rounded shadow-inner">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-500">Press <kbd className="text-slate-300">Esc</kbd> or click X to close</p>
        </div>
      </div>
    </div>
  );
}
