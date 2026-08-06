import React, { useState } from 'react';
import { MISTAKE_TAGS } from '../../data/seedData';
import { useApp } from '../../context/AppContext';
import { Check, Tag, ExternalLink, Code2 } from 'lucide-react';

export function ItemNotesEditor({ item, onClose }) {
  const { updateItemDetails } = useApp();
  const [notesText, setNotesText] = useState(item.notes || '');
  const [selectedMistakeTag, setSelectedMistakeTag] = useState(item.mistakeTag || null);
  const [urlInput, setUrlInput] = useState(item.url || '');
  const [showSyntaxHint, setShowSyntaxHint] = useState(false);

  const handleSave = () => {
    updateItemDetails(item.id, {
      notes: notesText,
      mistakeTag: selectedMistakeTag,
      url: urlInput
    });
    if (onClose) onClose();
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 my-2 text-xs space-y-4 shadow-inner">
      {/* Syntax Hint reveal if keyword */}
      {item.syntaxHint && (
        <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" /> Syntax Reference
            </span>
            <button
              onClick={() => setShowSyntaxHint(!showSyntaxHint)}
              className="text-[10px] text-indigo-400 hover:underline"
            >
              {showSyntaxHint ? 'Hide' : 'Reveal Hint'}
            </button>
          </div>
          {showSyntaxHint && (
            <pre className="font-mono text-xs text-indigo-200 bg-slate-900 p-2 rounded border border-indigo-900/60 overflow-x-auto">
              {item.syntaxHint}
            </pre>
          )}
        </div>
      )}

      {/* Mistake Tag Picker */}
      <div>
        <label className="block text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-rose-400" /> Categorize Mistake / Stumble Reason:
        </label>
        <div className="flex flex-wrap gap-2">
          {MISTAKE_TAGS.map((tag) => {
            const isSelected = selectedMistakeTag === tag.id;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedMistakeTag(isSelected ? null : tag.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  isSelected
                    ? `${tag.color} ring-1 ring-white/20`
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes Textarea */}
      <div>
        <label className="block text-[11px] font-bold text-slate-400 mb-1">
          Approach Notes & Key Insight:
        </label>
        <textarea
          rows={3}
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          placeholder="E.g. Use 2-pointer sliding window. Maintain character frequency map. Watch out for edge case when k=0..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-xs"
        />
      </div>

      {/* Resource URL Input */}
      <div>
        <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
          <ExternalLink className="w-3 h-3" /> Problem / Doc Link:
        </label>
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://leetcode.com/problems/..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-xs"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/60">
        <button
          onClick={handleSave}
          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs shadow-md shadow-indigo-600/20"
        >
          <Check className="w-3.5 h-3.5" /> Save Notes
        </button>
      </div>
    </div>
  );
}
