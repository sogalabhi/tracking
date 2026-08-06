import React, { useState } from 'react';
import { Download, Upload, RefreshCw, Settings, Database, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportBackupJSON } from '../../services/storage';

export function DataView() {
  const {
    items,
    topics,
    subtopics,
    sessions,
    plans,
    settings,
    updateSettings,
    handleResetDatabase,
    handleImportBackup
  } = useApp();

  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState(null);
  const [dDayInput, setDDayInput] = useState(settings.dDayDate || '');
  const [dDayTitleInput, setDDayTitleInput] = useState(settings.dDayTitle || '');
  const [targetHoursInput, setTargetHoursInput] = useState(settings.dailyTargetHours || 8);

  const handleExport = () => {
    exportBackupJSON({ items, topics, subtopics, sessions, plans, settings });
  };

  const handleImportSubmit = (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importJsonText);
      const success = handleImportBackup(parsed);
      if (success) {
        setImportStatus({ type: 'success', msg: 'Backup imported successfully!' });
        setImportJsonText('');
      } else {
        setImportStatus({ type: 'error', msg: 'Invalid JSON format. Requires items array.' });
      }
    } catch {
      setImportStatus({ type: 'error', msg: 'JSON Syntax Error. Please check pasted text.' });
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings({
      dDayDate: dDayInput,
      dDayTitle: dDayTitleInput,
      dailyTargetHours: parseInt(targetHoursInput, 10) || 8
    });
    setImportStatus({ type: 'success', msg: 'Settings updated successfully!' });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Data Management & Backup</h2>
          <p className="text-xs text-slate-400">Export JSON backups, paste topics/JSON, or configure D-Day countdown targets.</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg"
        >
          <Download className="w-4 h-4" /> Export Backup JSON
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-extrabold text-white">Target & Banner Settings</h3>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">D-Day Target Exam / OA Date:</label>
              <input
                type="date"
                value={dDayInput}
                onChange={(e) => setDDayInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">D-Day Title Banner:</label>
              <input
                type="text"
                value={dDayTitleInput}
                onChange={(e) => setDDayTitleInput(e.target.value)}
                placeholder="E.g. Target OA Deadline"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Daily Study Hour Target (Hours):</label>
              <input
                type="number"
                min={1}
                max={24}
                value={targetHoursInput}
                onChange={(e) => setTargetHoursInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow"
            >
              <Check className="w-4 h-4" /> Save Settings
            </button>
          </form>
        </div>

        {/* JSON Import & Database Reset */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Upload className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white">Import JSON Backup</h3>
          </div>

          <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Paste JSON Backup Payload:</label>
              <textarea
                rows={6}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='Paste raw backup JSON here...'
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>

            {importStatus && (
              <p
                className={`p-2.5 rounded-xl font-bold ${
                  importStatus.type === 'success'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}
              >
                {importStatus.msg}
              </p>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="submit"
                disabled={!importJsonText.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow"
              >
                <Upload className="w-4 h-4" /> Import Data
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset database to initial seed dataset? Unsaved changes will be lost.')) {
                    handleResetDatabase();
                  }
                }}
                className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-xl font-bold text-xs flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset to Seed Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
