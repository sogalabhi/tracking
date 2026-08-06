import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Play } from 'lucide-react';
import { SubtopicGroup } from './SubtopicGroup';
import { useTimer } from '../../context/TimerContext';

export function TopicAccordion({ topic, subtopics, items, forceOpen = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const { startTimer, activeTimer } = useTimer();

  const isExpanded = forceOpen !== null ? forceOpen : isOpen;

  const totalCount = items.length;
  const solvedCount = items.filter((i) => i.done).length;
  const percent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <div className="mb-6 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
      {/* Accordion Header */}
      <div
        onClick={() => setIsOpen(!isExpanded)}
        className="p-4 bg-slate-900 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-all border-b border-slate-800/60"
      >
        <div className="flex items-center gap-3">
          <div className="text-slate-400">
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              {topic.name}
              <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded-full">
                {solvedCount}/{totalCount}
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Topic Progress Bar */}
          <div className="w-32 hidden sm:block">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Progress</span>
              <span>{percent}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Start Topic Timer */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              startTimer(topic.subjectId, topic.id, topic.name);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              activeTimer.topicId === topic.id
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                : 'bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 border-slate-700'
            }`}
            title={`Start Yeolpumta timer for ${topic.name}`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden md:inline">Timer</span>
          </button>
        </div>
      </div>

      {/* Accordion Body */}
      {isExpanded && (
        <div className="p-4 bg-slate-950/40">
          {subtopics.map((subtopic) => {
            const subItems = items.filter((i) => i.subtopicId === subtopic.id);
            return <SubtopicGroup key={subtopic.id} subtopic={subtopic} items={subItems} />;
          })}
        </div>
      )}
    </div>
  );
}
