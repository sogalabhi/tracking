import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loadInitialAppData,
  syncItemToFirestore,
  syncPlanToFirestore,
  deletePlanFromFirestore,
  syncSessionToFirestore,
  syncSettingsToFirestore,
  resetAppToSeedData
} from '../services/storage';
import { db } from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { calculateNextDue, getTodayDateString } from '../services/spacedRepetition';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [data, setData] = useState(() => loadInitialAppData());
  const [activeTab, setActiveTab] = useState('today');
  const [selectedSubject, setSelectedSubject] = useState('dsa');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showShortcutModal, setShowShortcutModal] = useState(false);

  // Real-time Firestore Subscriptions for all domains
  useEffect(() => {
    const unsubPlans = onSnapshot(collection(db, 'plans'), (snap) => {
      if (!snap.empty) {
        const remote = [];
        snap.forEach((d) => remote.push(d.data()));
        setData((prev) => ({ ...prev, plans: remote }));
      }
    });

    const unsubItems = onSnapshot(collection(db, 'items'), (snap) => {
      if (!snap.empty) {
        const itemMap = new Map();
        snap.forEach((d) => itemMap.set(d.id, d.data()));
        setData((prev) => {
          const merged = prev.items.map((i) => (itemMap.has(i.id) ? { ...i, ...itemMap.get(i.id) } : i));
          return { ...prev, items: merged };
        });
      }
    });

    const unsubSessions = onSnapshot(collection(db, 'sessions'), (snap) => {
      if (!snap.empty) {
        const remote = [];
        snap.forEach((d) => remote.push(d.data()));
        setData((prev) => ({ ...prev, sessions: remote }));
      }
    });

    const unsubSettings = onSnapshot(collection(db, 'settings'), (snap) => {
      if (!snap.empty) {
        const setSnap = snap.docs.find((d) => d.id === 'user_settings');
        if (setSnap) {
          setData((prev) => ({ ...prev, settings: { ...prev.settings, ...setSnap.data() } }));
        }
      }
    });

    return () => {
      unsubPlans();
      unsubItems();
      unsubSessions();
      unsubSettings();
    };
  }, []);

  // Optimistic Mutations + Background Firestore Sync
  const toggleDone = (itemId) => {
    const todayStr = getTodayDateString();
    let updatedItem = null;

    setData((prev) => {
      const updated = prev.items.map((item) => {
        if (item.id === itemId) {
          const nextDone = !item.done;
          const nextConf = nextDone ? Math.max(item.confidence, 3) : item.confidence;
          const nextStatus = nextDone ? 'completed' : 'not_started';
          updatedItem = {
            ...item,
            done: nextDone,
            status: nextStatus,
            confidence: nextConf,
            attempts: nextDone ? (item.attempts || 0) + 1 : item.attempts,
            lastTouched: todayStr,
            nextDue: calculateNextDue(nextConf, new Date())
          };
          return updatedItem;
        }
        return item;
      });
      return { ...prev, items: updated };
    });

    if (updatedItem) {
      syncItemToFirestore(updatedItem);
    }
  };

  const toggleRevisionFlag = (itemId) => {
    let updatedItem = null;
    setData((prev) => {
      const updated = prev.items.map((item) => {
        if (item.id === itemId) {
          updatedItem = {
            ...item,
            revisionFlag: !item.revisionFlag,
            lastTouched: getTodayDateString()
          };
          return updatedItem;
        }
        return item;
      });
      return { ...prev, items: updated };
    });

    if (updatedItem) {
      syncItemToFirestore(updatedItem);
    }
  };

  const setConfidence = (itemId, rating) => {
    const todayStr = getTodayDateString();
    let updatedItem = null;
    setData((prev) => {
      const updated = prev.items.map((item) => {
        if (item.id === itemId) {
          updatedItem = {
            ...item,
            confidence: rating,
            lastTouched: todayStr,
            nextDue: calculateNextDue(rating, new Date())
          };
          return updatedItem;
        }
        return item;
      });
      return { ...prev, items: updated };
    });

    if (updatedItem) {
      syncItemToFirestore(updatedItem);
    }
  };

  const updateItemDetails = (itemId, { notes, mistakeTag, difficulty, title, url }) => {
    let updatedItem = null;
    setData((prev) => {
      const updated = prev.items.map((item) => {
        if (item.id === itemId) {
          updatedItem = {
            ...item,
            notes: notes !== undefined ? notes : item.notes,
            mistakeTag: mistakeTag !== undefined ? mistakeTag : item.mistakeTag,
            difficulty: difficulty !== undefined ? difficulty : item.difficulty,
            title: title !== undefined ? title : item.title,
            url: url !== undefined ? url : item.url,
            lastTouched: getTodayDateString()
          };
          return updatedItem;
        }
        return item;
      });
      return { ...prev, items: updated };
    });

    if (updatedItem) {
      syncItemToFirestore(updatedItem);
    }
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

    syncPlanToFirestore(newPlan);
  };

  const togglePlanCompleted = (planId) => {
    let updatedPlan = null;
    setData((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => {
        if (p.id === planId) {
          updatedPlan = { ...p, completed: !p.completed };
          return updatedPlan;
        }
        return p;
      })
    }));

    if (updatedPlan) {
      syncPlanToFirestore(updatedPlan);
    }
  };

  const deletePlanItem = (planId) => {
    setData((prev) => ({
      ...prev,
      plans: prev.plans.filter((p) => p.id !== planId)
    }));
    deletePlanFromFirestore(planId);
  };

  const pushPlanToTomorrow = (planId) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    let updatedPlan = null;

    setData((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => {
        if (p.id === planId) {
          updatedPlan = { ...p, date: tomorrowStr };
          return updatedPlan;
        }
        return p;
      })
    }));

    if (updatedPlan) {
      syncPlanToFirestore(updatedPlan);
    }
  };

  const pushAllUnfinishedToTomorrow = () => {
    const todayStr = getTodayDateString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    setData((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => {
        if (p.date === todayStr && !p.completed) {
          const updated = { ...p, date: tomorrowStr };
          syncPlanToFirestore(updated);
          return updated;
        }
        return p;
      })
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

    syncSessionToFirestore(newSession);
  };

  const deleteSession = (sessionId) => {
    setData((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.id !== sessionId)
    }));
    deletePlanFromFirestore(sessionId);
  };

  const updateSettings = (newSettings) => {
    const merged = { ...data.settings, ...newSettings };
    setData((prev) => ({
      ...prev,
      settings: merged
    }));
    syncSettingsToFirestore(merged);
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

  const toggleTheme = () => {
    const newTheme = data.settings.theme === 'light' ? 'dark' : 'light';
    const updatedSettings = { ...data.settings, theme: newTheme };
    setData((prev) => ({
      ...prev,
      settings: updatedSettings
    }));
    syncSettingsToFirestore(updatedSettings);
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
        theme: data.settings.theme || 'dark',
        toggleTheme,
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
