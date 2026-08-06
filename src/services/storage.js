import { INITIAL_SEED_DATA } from '../data/seedData';

const STORAGE_KEYS = {
  ITEMS: 'study_tracker_items_v1',
  TOPICS: 'study_tracker_topics_v1',
  SUBTOPICS: 'study_tracker_subtopics_v1',
  TIME_SESSIONS: 'study_tracker_sessions_v1',
  DAILY_PLANS: 'study_tracker_plans_v1',
  SETTINGS: 'study_tracker_settings_v1'
};

export const DEFAULT_SETTINGS = {
  dailyTargetHours: 8,
  dailyTargetMaxHours: 10,
  dDayDate: '2026-10-15', // Configurable target exam/OA date
  dDayTitle: 'Upcoming OAs & Placements',
  coldRecallGateDefault: true,
  idleTimeoutMinutes: 10,
  autoAdvanceOnHotkey: true
};

export function loadInitialAppData() {
  try {
    const rawItems = localStorage.getItem(STORAGE_KEYS.ITEMS);
    const rawTopics = localStorage.getItem(STORAGE_KEYS.TOPICS);
    const rawSubtopics = localStorage.getItem(STORAGE_KEYS.SUBTOPICS);
    const rawSessions = localStorage.getItem(STORAGE_KEYS.TIME_SESSIONS);
    const rawPlans = localStorage.getItem(STORAGE_KEYS.DAILY_PLANS);
    const rawSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

    return {
      items: rawItems ? JSON.parse(rawItems) : INITIAL_SEED_DATA.items,
      topics: rawTopics ? JSON.parse(rawTopics) : INITIAL_SEED_DATA.topics,
      subtopics: rawSubtopics ? JSON.parse(rawSubtopics) : INITIAL_SEED_DATA.subtopics,
      sessions: rawSessions ? JSON.parse(rawSessions) : [],
      plans: rawPlans ? JSON.parse(rawPlans) : [],
      settings: rawSettings ? { ...DEFAULT_SETTINGS, ...JSON.parse(rawSettings) } : DEFAULT_SETTINGS
    };
  } catch (err) {
    console.error('Failed loading local storage app data, fallback to seed', err);
    return {
      items: INITIAL_SEED_DATA.items,
      topics: INITIAL_SEED_DATA.topics,
      subtopics: INITIAL_SEED_DATA.subtopics,
      sessions: [],
      plans: [],
      settings: DEFAULT_SETTINGS
    };
  }
}

export function saveItemsToStorage(items) {
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
}

export function saveTopicsToStorage(topics, subtopics) {
  localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
  localStorage.setItem(STORAGE_KEYS.SUBTOPICS, JSON.stringify(subtopics));
}

export function saveSessionsToStorage(sessions) {
  localStorage.setItem(STORAGE_KEYS.TIME_SESSIONS, JSON.stringify(sessions));
}

export function savePlansToStorage(plans) {
  localStorage.setItem(STORAGE_KEYS.DAILY_PLANS, JSON.stringify(plans));
}

export function saveSettingsToStorage(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
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
  localStorage.removeItem(STORAGE_KEYS.ITEMS);
  localStorage.removeItem(STORAGE_KEYS.TOPICS);
  localStorage.removeItem(STORAGE_KEYS.SUBTOPICS);
  localStorage.removeItem(STORAGE_KEYS.TIME_SESSIONS);
  localStorage.removeItem(STORAGE_KEYS.DAILY_PLANS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  return loadInitialAppData();
}
