import React, { useState } from 'react';
import { X, Plus, Clock } from 'lucide-react';
import { SUBJECTS } from '../../data/seedData';
import { useApp } from '../../context/AppContext';

export function SessionEditor({ dateStr, onClose }) {
  const { logCompletedSession } = useApp();
  const [subjectId, setSubjectId] = useState('dsa');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [noteText, setNoteText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (durationMinutes <= 0) return;

    logCompletedSession({
      date: dateStr,
      subjectId,
      durationSeconds: durationMinutes * 60,
      note: noteText.trim() || 'Manual Time Entry'
    });

    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Log Study Session</h3>
            <p className="text-xs text-slate-400">Date: {dateStr}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Subject:</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Duration (Minutes):</label>
            <input
              type="number"
              min={1}
              max={720}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Notes / Topic:</label>
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="E.g. Practiced Sliding Window mediums & revised ML boosting notes"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-1 shadow"
            >
              <Plus className="w-4 h-4" /> Save Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
