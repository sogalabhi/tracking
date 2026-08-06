import React, { useState } from 'react';
import { ExternalLink, MessageSquare, Plus, Play, RotateCcw, CheckSquare, Square } from 'lucide-react';
import { DifficultyBadge, MistakeBadge } from '../common/Badge';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { ItemNotesEditor } from './ItemNotesEditor';
import { MISTAKE_TAGS } from '../../data/seedData';
import { useApp } from '../../context/AppContext';
import { useTimer } from '../../context/TimerContext';

export function ItemRow({ item, isSelected = false }) {
  const {
    toggleDone,
    toggleRevisionFlag,
    setConfidence,
    addItemToTodayPlan,
    setSelectedItemId
  } = useApp();

  const { startTimer, activeTimer } = useTimer();
  const [showNotes, setShowNotes] = useState(false);

  const mistakeTagObj = MISTAKE_TAGS.find((t) => t.id === item.mistakeTag);

  return (
    <div
      onClick={() => setSelectedItemId(item.id)}
      className={`group border-b border-slate-800/60 transition-all ${
        isSelected ? 'bg-indigo-950/30 ring-1 ring-indigo-500/40' : 'hover:bg-slate-800/40'
      }`}
    >
      <div className="flex items-center justify-between p-2.5 text-xs gap-3 overflow-x-auto">
        {/* Checkboxes & Title */}
        <div className="flex items-center gap-3 min-w-[300px] flex-1">
          {/* Done Checkbox ☑ */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDone(item.id);
            }}
            className="text-slate-400 hover:text-emerald-400 transition-colors"
            title="Mark Done (d)"
          >
            {item.done ? (
              <CheckSquare className="w-4 h-4 text-emerald-400 fill-emerald-950" />
            ) : (
              <Square className="w-4 h-4 text-slate-600 hover:text-slate-400" />
            )}
          </button>

          {/* Revision Checkbox ☑ Rev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleRevisionFlag(item.id);
            }}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
              item.revisionFlag
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/60'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-amber-400'
            }`}
            title="Flag for Manual Revision (r)"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Rev</span>
          </button>

          {/* Title & Link */}
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${item.done ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                {item.title}
              </span>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-500 hover:text-indigo-400"
                  title="Open Problem Link"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Difficulty Pill */}
        <div className="w-20 hidden sm:block">
          <DifficultyBadge difficulty={item.difficulty} />
        </div>

        {/* Confidence Meter 1-5 */}
        <div className="w-28 flex items-center justify-center">
          <ConfidenceMeter
            rating={item.confidence}
            onChange={(rating) => setConfidence(item.id, rating)}
          />
        </div>

        {/* Mistake Tag Badge */}
        <div className="w-32 hidden md:block truncate">
          {mistakeTagObj && <MistakeBadge label={mistakeTagObj.label} />}
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-1.5">
          {/* Notes Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowNotes(!showNotes);
            }}
            className={`p-1 rounded text-xs flex items-center gap-1 border transition-colors ${
              item.notes || item.mistakeTag
                ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title="Notes (n)"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          {/* Start Timer on Item */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              startTimer(item.subjectId, item.topicId, item.title, item.id, item.title);
            }}
            className={`p-1 rounded text-xs border transition-colors ${
              activeTimer.itemId === item.id
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-emerald-400'
            }`}
            title="Start Timer for this Item"
          >
            <Play className="w-3.5 h-3.5" />
          </button>

          {/* Add to Today Plan */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addItemToTodayPlan(item);
            }}
            className="p-1 rounded bg-slate-900 hover:bg-indigo-600 text-slate-500 hover:text-white border border-slate-800 transition-colors"
            title="Add to Today Plan (t)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Notes Editor */}
      {showNotes && <ItemNotesEditor item={item} onClose={() => setShowNotes(false)} />}
    </div>
  );
}
