import React, { useState, useRef, useMemo } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { TopicAccordion } from './TopicAccordion';
import { useApp } from '../../context/AppContext';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export function TrackerView() {
  const { selectedSubject, topics, subtopics, items } = useApp();
  const searchInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'not_done' | 'flagged' | 'low_conf' | 'never_revised'

  const currentSubjectTopics = useMemo(
    () => topics.filter((t) => t.subjectId === selectedSubject),
    [topics, selectedSubject]
  );

  const currentSubjectSubtopics = useMemo(
    () => subtopics.filter((st) => currentSubjectTopics.some((t) => t.id === st.topicId)),
    [subtopics, currentSubjectTopics]
  );

  const currentSubjectItems = useMemo(
    () => items.filter((i) => i.subjectId === selectedSubject),
    [items, selectedSubject]
  );

  const [expandAll, setExpandAll] = useState(false);

  // Filtered Items logic
  const filteredItems = useMemo(() => {
    return currentSubjectItems.filter((item) => {
      // Search text match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesNotes = (item.notes || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesNotes) return false;
      }

      // Filter Mode check
      if (filterMode === 'not_done') return !item.done;
      if (filterMode === 'flagged') return item.revisionFlag;
      if (filterMode === 'low_conf') return item.confidence <= 2;
      if (filterMode === 'never_revised') return item.done && (!item.attempts || item.attempts <= 1);

      return true;
    });
  }, [currentSubjectItems, searchQuery, filterMode]);

  // Hook up global keyboard shortcuts
  useKeyboardShortcuts({
    visibleItems: filteredItems,
    onFocusSearch: () => searchInputRef.current?.focus()
  });

  const forceOpenState = searchQuery.trim() ? true : expandAll ? true : null;

  return (
    <div className="space-y-6">
      {/* Sticky Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg sticky top-20 z-30 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems, keywords, or notes... (Press '/')"
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
          {/* Expand / Collapse All Toggle */}
          <button
            onClick={() => setExpandAll(!expandAll)}
            className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-400 font-semibold whitespace-nowrap transition-colors"
            title="Expand or collapse all topic accordions"
          >
            {expandAll ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Items' },
            { id: 'not_done', label: 'Not Started / Incomplete' },
            { id: 'flagged', label: '☑ Flagged Revision' },
            { id: 'low_conf', label: 'Confidence ≤ 2' },
            { id: 'never_revised', label: 'Never Revised' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterMode(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filterMode === f.id
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordions List */}
      <div>
        {currentSubjectTopics.map((topic) => {
          const topicSubtopics = currentSubjectSubtopics.filter((st) => st.topicId === topic.id);
          const topicItems = filteredItems.filter((i) => i.topicId === topic.id);
          if (!topicItems.length && filterMode !== 'all') return null;

          return (
            <TopicAccordion
              key={topic.id}
              topic={topic}
              subtopics={topicSubtopics}
              items={topicItems}
              forceOpen={forceOpenState}
            />
          );
        })}
      </div>
    </div>
  );
}
  