import React from 'react';
import { HelpCircle, Star, RotateCcw, Clock, BookOpen, Search, ShieldCheck, Keyboard, Target } from 'lucide-react';

export function HelpView() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-5 h-5" /> Help & Strategy Playbook
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          How Study Tracker OA Pro Works
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          Master your software engineering online assessment (OA) and interview preparation using scientific spaced repetition, structured curriculum tracking, and live timer session banking.
        </p>
      </div>

      {/* 1. Confidence Rating Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2 bg-amber-950/60 border border-amber-800/60 text-amber-400 rounded-xl">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">1. Confidence Rating Matrix (1 to 5 Stars)</h2>
            <p className="text-xs text-slate-400">How star ratings schedule future revision intervals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              stars: '1 Star',
              level: 'Need Practice',
              interval: '1 Day',
              desc: 'Required looking at editorials, had syntax errors, or exceeded time limits. Queued for review tomorrow.',
              color: 'border-rose-800/60 bg-rose-950/20 text-rose-300'
            },
            {
              stars: '2 Stars',
              level: 'Fair / With Hints',
              interval: '2 Days',
              desc: 'Overall logic was correct but required minor hints, debugging help, or was slow to implement.',
              color: 'border-amber-800/60 bg-amber-950/20 text-amber-300'
            },
            {
              stars: '3 Stars',
              level: 'Good / Solved',
              interval: '4 Days',
              desc: 'Solved completely independently within standard time limits (20-30 minutes).',
              color: 'border-indigo-800/60 bg-indigo-950/20 text-indigo-300'
            },
            {
              stars: '4 Stars',
              level: 'Strong / Optimal',
              interval: '7 Days (1 Wk)',
              desc: 'Optimal time and space complexities achieved effortlessly; edge cases handled cleanly.',
              color: 'border-blue-800/60 bg-blue-950/20 text-blue-300'
            },
            {
              stars: '5 Stars',
              level: 'Mastered',
              interval: '21 Days (3 Wks)',
              desc: 'Foundational pattern or problem you can explain and code flawlessly without hesitation.',
              color: 'border-emerald-800/60 bg-emerald-950/20 text-emerald-300'
            }
          ].map((c, i) => (
            <div key={i} className={`p-4 rounded-xl border ${c.color} flex flex-col justify-between`}>
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider mb-1">{c.stars}</div>
                <div className="font-extrabold text-sm text-white mb-2">{c.level}</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{c.desc}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">Next Review:</span>
                <span className="font-mono">{c.interval}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Revision Judgement Rules */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2 bg-rose-950/60 border border-rose-800/60 text-rose-400 rounded-xl">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">2. Revision Queue Judgement Rules</h2>
            <p className="text-xs text-slate-400">The 4 conditions that qualify an item for your daily revision queue</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase">
              <span>Rule 1</span> Manual Bookmark Flag
            </div>
            <h3 className="text-sm font-bold text-white">Manual Override Checkbox (Rev)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Checking the "Rev" box on any problem row forces the problem directly into your Revision Queue immediately, regardless of dates.
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase">
              <span>Rule 2</span> Scheduled Date Reached
            </div>
            <h3 className="text-sm font-bold text-white">Spaced Repetition Due Date</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When a solved problem reaches or passes its calculated next review date (nextDue &lt;= today), it enters your daily revision queue.
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase">
              <span>Rule 3</span> Unscheduled Solved Items
            </div>
            <h3 className="text-sm font-bold text-white">Completed Items Without Next Due Date</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Any completed problem item (done: true) that has not yet had a spaced repetition interval assigned is queued for first review.
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase">
              <span>Rule 4</span> Low Confidence Items
            </div>
            <h3 className="text-sm font-bold text-white">Confidence Level &lt;= 2</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Items rated 1 or 2 stars remain prioritized in your review queue until re-evaluated with higher confidence.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-slate-300">
          <strong className="text-white block mb-1">Queue Sorting Order:</strong>
          Items in the Revision View are ordered by decay urgency: manual bookmark flags appear first, followed by overdue items ordered by oldest due date ascending.
        </div>
      </div>

      {/* 3. Study Timer & Session Banking */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2 bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">3. Live Study Timer & Session Banking</h2>
            <p className="text-xs text-slate-400">Yeolpumta-style stopwatch timing for subjects, topics, and specific problems</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong className="text-white">Starting a Timer:</strong> Click the "Timer" button on any topic accordion or problem item row to start a live study block. The active timer widget appears in the top navigation bar.
          </p>
          <p>
            <strong className="text-white">Pause and Resume:</strong> Press <code className="bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-indigo-300 font-mono">Space</code> or click the Pause button in the top bar to pause timing during short breaks.
          </p>
          <p>
            <strong className="text-white">Banking Sessions:</strong> Click the Stop (Square) button to bank your logged study session. Banked hours automatically contribute to your daily study targets, streaks, and analytics charts.
          </p>
        </div>
      </div>

      {/* 4. Curriculum & Dataset Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2 bg-blue-950/60 border border-blue-800/60 text-blue-400 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">4. Curriculum & Problem Links</h2>
            <p className="text-xs text-slate-400">Official Striver A2Z DSA Sheet, SQL 50, ML, Pandas, and Core CS</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong className="text-white">473 Striver A2Z DSA Problems:</strong> Pre-loaded across 18 subtopics covering Arrays, Binary Search, Linked List, Recursion, Bit Manipulation, Stack & Queue, Sliding Window, Heaps, Greedy, Trees, Graphs, DP, and Tries.
          </p>
          <p>
            <strong className="text-white">Direct Problem Links:</strong> Every problem features an external link icon opening official LeetCode problem pages, TakeUForward article editorials, or video solution walkthroughs.
          </p>
          <p>
            <strong className="text-white">Clean Notes Editor:</strong> Click any problem row to open the inline notes editor to write approach summaries, time/space complexities, and key takeaways.
          </p>
        </div>
      </div>

      {/* 5. Data Security & Storage Policy */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2 bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">5. Data Storage & Backup Policy</h2>
            <p className="text-xs text-slate-400">LocalStorage persistence and JSON backup/restore</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong className="text-white">Local Persistence:</strong> All edits, notes, completion statuses, confidence ratings, and timer logs save instantly to browser LocalStorage.
          </p>
          <p>
            <strong className="text-white">Export/Import JSON:</strong> Open the <strong className="text-white">Data</strong> tab anytime to download a full JSON backup of your progress. You can import this JSON file on any device or browser to restore your entire state.
          </p>
        </div>
      </div>

      {/* 6. Keyboard Shortcuts Quick Reference */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2 bg-purple-950/60 border border-purple-800/60 text-purple-400 rounded-xl">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">6. Keyboard Shortcuts Quick Reference</h2>
            <p className="text-xs text-slate-400">Press ? anytime to open the shortcut modal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          {[
            { key: '/', label: 'Focus Search Bar in Tracker' },
            { key: 'Space', label: 'Pause / Resume Active Timer' },
            { key: '?', label: 'Open Keyboard Shortcuts Modal' },
            { key: '1', label: 'Switch to Today View' },
            { key: '2', label: 'Switch to Tracker View' },
            { key: '3', label: 'Switch to Planner View' },
            { key: '4', label: 'Switch to Revision View' },
            { key: '5', label: 'Switch to Calendar View' },
            { key: '6', label: 'Switch to Insights View' },
            { key: '7', label: 'Switch to Data & Settings View' },
            { key: 'Esc', label: 'Close Modals / Clear Search' }
          ].map((k, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
              <span className="text-slate-300">{k.label}</span>
              <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-indigo-300 rounded font-bold">{k.key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
