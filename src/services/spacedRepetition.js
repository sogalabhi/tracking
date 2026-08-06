export const CONFIDENCE_INTERVALS = {
  1: 1,  // 1 day
  2: 2,  // 2 days
  3: 4,  // 4 days
  4: 7,  // 1 week
  5: 21  // 3 weeks
};

/**
 * Calculates next due date based on confidence level & touched date
 */
export function calculateNextDue(confidence = 1, baseDate = new Date()) {
  const daysToAdd = CONFIDENCE_INTERVALS[confidence] || 1;
  const target = new Date(baseDate);
  target.setDate(target.getDate() + daysToAdd);
  return target.toISOString().split('T')[0];
}

/**
 * Returns formatted YYYY-MM-DD for today
 */
export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Evaluates whether an item is due for revision under spaced repetition or manual flag.
 */
export function isItemDueForRevision(item, todayStr = getTodayDateString()) {
  if (item.revisionFlag) return true; // Manual override checkbox ☑ Rev
  if (!item.done) return false;
  if (!item.nextDue) return false;
  return item.nextDue <= todayStr;
}

/**
 * Returns all items due for revision sorted by decay urgency (oldest due first)
 */
export function getDueRevisionQueue(items, todayStr = getTodayDateString()) {
  return items
    .filter((item) => isItemDueForRevision(item, todayStr))
    .sort((a, b) => {
      // Manual flags first, then by nextDue date ascending
      if (a.revisionFlag && !b.revisionFlag) return -1;
      if (!a.revisionFlag && b.revisionFlag) return 1;
      const dateA = a.nextDue || '1970-01-01';
      const dateB = b.nextDue || '1970-01-01';
      return dateA.localeCompare(dateB);
    });
}
