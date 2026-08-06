import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loadInitialAppData,
  saveItemsToStorage,
  saveSessionsToStorage,
  savePlansToStorage,
  saveSettingsToStorage,
  resetAppToSeedData
} from '../services/storage';
import { calculateNextDue, getTodayDateString } from '../services/spacedRepetition';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [data, setData] = useState(() => loadInitialAppData());
  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'tracker' | 'planner' | 'revision' | 'calendar' | 'insights' | 'data'
  const [selectedSubject, setSelectedSubject] = useState('dsa');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showShortcutModal, setShowShortcutModal] = useState(false);

  // Sync to local storage
  useEffect(() => {
    saveItemsToStorage(data.items);
  }, [data.items]);

  useEffect(() => {
    saveSessionsToStorage(data.sessions);
  }, [data.sessions]);

  useEffect(() => {
    savePlansToStorage(data.plans);
  }, [data.plans]);

  useEffect(() => {
    saveSettingsToStorage(data.settings);
  }, [data.settings]);

  // Actions
  const toggleDone = (itemId) => {
    const todayStr = getTodayDateString();
    setData((prev) => {
      const updated = prev.items.map((item) => {
        if (item.id === itemId) {
          const nextDone = !item.done;
          const nextConf = nextDone ? Math.max(item.confidence, 3) : item.confidence;
          const nextStatus = nextDone ? 'solved_clean' : 'not_started';
          return {
            ...item,
            done: nextDone,
            status: nextStatus,
            confidence: nextConf,
            attempts: nextDone ? (item.attempts || 0) + 1 : item.attempts,
            lastTouched: todayStr,
            nextDue: calculateNextDue(nextConf, new Date())
          };
        }
        return item;
      });
      return { ...prev, items: updated };
    });
  };

  const toggleRevisionFlag = (itemId) => {
    setData((prev) => {
      const updated = prev.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            revisionFlag: !item.revisionFlag,
            lastTouched: getTodayDateString()
          };
        }
        return item;
      });
      return { ...prev, items: updated };
    });
  };

  const setConfidence = (itemId, rating) => {
    const todayStr = getTodayDateString();
    setData((prev) => {
      const updated = prev.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            confidence: rating,
            lastTouched: todayStr,
            nextDue: calculateNextDue(rating, new Date())
          };
        }
        return item;
      });
      return { ...prev, items: updated };
    });
  };

  const updateItemDetails = (itemId, { notes, mistakeTag, difficulty, title, url }) => {
    setData((prev) => {
      const updated = prev.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            notes: notes !== undefined ? notes : item.notes,
            mistakeTag: mistakeTag !== undefined ? mistakeTag : item.mistakeTag,
            difficulty: difficulty !== undefined ? difficulty : item.difficulty,
            title: title !== undefined ? title : item.title,
            url: url !== undefined ? url : item.url,
            lastTouched: getTodayDateString()
          };
        }
        return item;
      });
      return { ...prev, items: updated };
    });
  };

  const addItemToTodayPlan = (item) => {
    const todayStr = getTodayDateString();
    const newPlan = {
      id: `plan_${Date.now()}`,
      date: todayStr,
      itemId: item?.id || null,
      title: item?.title || 'Custom Study Session',
      subjectId: item?.subjectId || selectedSubject,
      completed: false,
      order: data.plans.filter((p) => p.date === todayStr).length + 1
    };

    setData((prev) => ({
      ...prev,
      plans: [...prev.plans, newPlan]
    }));
  };

  const togglePlanCompleted = (planId) => {
    setData((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => (p.id === planId ? { ...p, completed: !p.completed } : p))
    }));
  };

  const deletePlanItem = (planId) => {
    setData((prev) => ({
      ...prev,
      plans: prev.plans.filter((p) => p.id !== planId)
    }));
  };

  const pushPlanToTomorrow = (planId) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    setData((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => (p.id === planId ? { ...p, date: tomorrowStr } : p))
    }));
  };

  const pushAllUnfinishedToTomorrow = () => {
    const todayStr = getTodayDateString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    setData((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => (p.date === todayStr && !p.completed ? { ...p, date: tomorrowStr } : p))
    }));
  };

  const logCompletedSession = (session) => {
    const newSession = {
      id: `sess_${Date.now()}`,
      date: getTodayDateString(),
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      ...session
    };

    setData((prev) => ({
      ...prev,
      sessions: [newSession, ...prev.sessions]
    }));
  };

  const deleteSession = (sessionId) => {
    setData((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.id !== sessionId)
    }));
  };

  const updateSettings = (newSettings) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const handleResetDatabase = () => {
    const reset = resetAppToSeedData();
    setData(reset);
  };

  const handleImportBackup = (importedData) => {
    if (!importedData || !importedData.items) return false;
    setData({
      items: importedData.items || [],
      topics: importedData.topics || data.topics,
      subtopics: importedData.subtopics || data.subtopics,
      sessions: importedData.sessions || [],
      plans: importedData.plans || [],
      settings: importedData.settings || data.settings
    });
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        items: data.items,
        topics: data.topics,
        subtopics: data.subtopics,
        sessions: data.sessions,
        plans: data.plans,
        settings: data.settings,
        activeTab,
        setActiveTab,
        selectedSubject,
        setSelectedSubject,
        selectedItemId,
        setSelectedItemId,
        showShortcutModal,
        setShowShortcutModal,
        toggleDone,
        toggleRevisionFlag,
        setConfidence,
        updateItemDetails,
        addItemToTodayPlan,
        togglePlanCompleted,
        deletePlanItem,
        pushPlanToTomorrow,
        pushAllUnfinishedToTomorrow,
        logCompletedSession,
        deleteSession,
        updateSettings,
        handleResetDatabase,
        handleImportBackup
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
