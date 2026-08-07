import { INITIAL_SEED_DATA } from '../data/seedData';
import { db } from './firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

export const DEFAULT_SETTINGS = {
  dailyTargetHours: 8,
  dailyTargetMaxHours: 10,
  dDayDate: '2026-10-15',
  dDayTitle: 'Upcoming OAs & Placements',
  coldRecallGateDefault: true,
  idleTimeoutMinutes: 10,
  autoAdvanceOnHotkey: true,
  theme: 'dark'
};

export function loadInitialAppData() {
  return {
    items: INITIAL_SEED_DATA.items,
    topics: INITIAL_SEED_DATA.topics,
    subtopics: INITIAL_SEED_DATA.subtopics,
    sessions: [],
    plans: INITIAL_SEED_DATA.plans || [],
    settings: DEFAULT_SETTINGS
  };
}

// Background Firestore persistence helpers
export async function syncItemToFirestore(item) {
  try {
    if (item && item.id) {
      await setDoc(doc(db, 'items', item.id), item, { merge: true });
    }
  } catch (err) {
    console.error('Failed to sync item to Firestore:', err);
  }
}

export async function syncPlanToFirestore(plan) {
  try {
    if (plan && plan.id) {
      await setDoc(doc(db, 'plans', plan.id), plan, { merge: true });
    }
  } catch (err) {
    console.error('Failed to sync plan to Firestore:', err);
  }
}

export async function deletePlanFromFirestore(planId) {
  try {
    if (planId) {
      await deleteDoc(doc(db, 'plans', planId));
    }
  } catch (err) {
    console.error('Failed to delete plan from Firestore:', err);
  }
}

export async function syncSessionToFirestore(session) {
  try {
    if (session && session.id) {
      await setDoc(doc(db, 'sessions', session.id), session, { merge: true });
    }
  } catch (err) {
    console.error('Failed to sync session to Firestore:', err);
  }
}

export async function syncSettingsToFirestore(settings) {
  try {
    if (settings) {
      await setDoc(doc(db, 'settings', 'user_settings'), settings, { merge: true });
    }
  } catch (err) {
    console.error('Failed to sync settings to Firestore:', err);
  }
}

export function exportBackupJSON(appState) {
  const payload = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    items: appState.items,
    topics: appState.topics,
    subtopics: appState.subtopics,
    sessions: appState.sessions,
    plans: appState.plans,
    settings: appState.settings
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `study_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function resetAppToSeedData() {
  return loadInitialAppData();
}
