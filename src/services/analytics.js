import { MISTAKE_TAGS } from '../data/seedData';

/**
 * Calculates current consecutive study streak (days with > 0 seconds logged)
 */
export function calculateStudyStreak(sessions = []) {
  if (!sessions.length) return 0;

  const datesWithLogs = new Set(
    sessions.map((s) => s.date).filter(Boolean)
  );

  let currentStreak = 0;
  const today = new Date();
  let checkDate = new Date(today);

  // Check today first, if no logs today, check yesterday to allow active streak
  const todayStr = checkDate.toISOString().split('T')[0];
  if (!datesWithLogs.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dStr = checkDate.toISOString().split('T')[0];
    if (datesWithLogs.has(dStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return currentStreak;
}

/**
 * Calculates total seconds logged for a given date YYYY-MM-DD
 */
export function getTotalSecondsForDate(sessions = [], dateStr) {
  return sessions
    .filter((s) => s.date === dateStr)
    .reduce((sum, s) => sum + (s.durationSeconds || 0), 0);
}

/**
 * Maps duration in seconds to Yeolpumta calendar intensity scale (0 to 4)
 * 0: 0h (gray)
 * 1: < 2h (light green/cyan)
 * 2: 2h - 5h (medium green/cyan)
 * 3: 5h - 8h (deep green/cyan)
 * 4: 8h+ (intense neon green/indigo)
 */
export function getHeatmapIntensityLevel(seconds) {
  const hours = seconds / 3600;
  if (hours <= 0) return 0;
  if (hours < 2) return 1;
  if (hours < 5) return 2;
  if (hours < 8) return 3;
  return 4;
}

/**
 * Returns breakdown of seconds logged per subject for a specific date or overall
 */
export function getSubjectTimeBreakdown(sessions = [], dateStr = null) {
  const filtered = dateStr ? sessions.filter((s) => s.date === dateStr) : sessions;
  const map = {};

  filtered.forEach((s) => {
    const sub = s.subjectId || 'dsa';
    map[sub] = (map[sub] || 0) + (s.durationSeconds || 0);
  });

  return map;
}

/**
 * Calculates mistake tag frequency stats
 */
export function getMistakeTagStats(items = []) {
  const counts = {};
  let totalWithTags = 0;

  MISTAKE_TAGS.forEach((t) => (counts[t.id] = 0));

  items.forEach((item) => {
    if (item.mistakeTag && counts[item.mistakeTag] !== undefined) {
      counts[item.mistakeTag]++;
      totalWithTags++;
    }
  });

  return MISTAKE_TAGS.map((tag) => ({
    ...tag,
    count: counts[tag.id] || 0,
    percentage: totalWithTags > 0 ? Math.round(((counts[tag.id] || 0) / totalWithTags) * 100) : 0
  })).sort((a, b) => b.count - a.count);
}

/**
 * Ranks topics by lowest average confidence score
 */
export function getWeakestTopics(topics = [], items = []) {
  return topics
    .map((topic) => {
      const topicItems = items.filter((i) => i.topicId === topic.id);
      if (!topicItems.length) return null;

      const totalConf = topicItems.reduce((acc, i) => acc + (i.confidence || 1), 0);
      const solvedCount = topicItems.filter((i) => i.done).length;
      const avgConf = Number((totalConf / topicItems.length).toFixed(1));

      return {
        ...topic,
        itemCount: topicItems.length,
        solvedCount,
        avgConfidence: avgConf
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.avgConfidence - b.avgConfidence);
}
