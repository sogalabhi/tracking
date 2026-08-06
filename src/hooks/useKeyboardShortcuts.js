import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTimer } from '../context/TimerContext';

export function useKeyboardShortcuts({ visibleItems = [], onFocusSearch = null, onToggleNotes = null }) {
  const {
    selectedItemId,
    setSelectedItemId,
    toggleDone,
    toggleRevisionFlag,
    setConfidence,
    addItemToTodayPlan,
    setShowShortcutModal,
    settings
  } = useApp();

  const { activeTimer, pauseTimer, resumeTimer } = useTimer();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger hotkeys if user is typing in an input/textarea
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setShowShortcutModal((prev) => !prev);
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        if (onFocusSearch) onFocusSearch();
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        if (activeTimer.isRunning) {
          pauseTimer();
        } else if (activeTimer.subjectId || activeTimer.topicId) {
          resumeTimer();
        }
        return;
      }

      if (!visibleItems.length) return;

      const currentIndex = visibleItems.findIndex((item) => item.id === selectedItemId);

      const advanceToNextRow = () => {
        if (settings.autoAdvanceOnHotkey && currentIndex >= 0 && currentIndex < visibleItems.length - 1) {
          setSelectedItemId(visibleItems[currentIndex + 1].id);
        }
      };

      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = currentIndex < visibleItems.length - 1 ? currentIndex + 1 : 0;
        setSelectedItemId(visibleItems[nextIdx].id);
        return;
      }

      if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = currentIndex > 0 ? currentIndex - 1 : visibleItems.length - 1;
        setSelectedItemId(visibleItems[prevIdx].id);
        return;
      }

      if (!selectedItemId) return;
      const targetItem = visibleItems.find((i) => i.id === selectedItemId);
      if (!targetItem) return;

      if (e.key === 'd') {
        e.preventDefault();
        toggleDone(selectedItemId);
        advanceToNextRow();
        return;
      }

      if (e.key === 'r') {
        e.preventDefault();
        toggleRevisionFlag(selectedItemId);
        advanceToNextRow();
        return;
      }

      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        setConfidence(selectedItemId, parseInt(e.key, 10));
        advanceToNextRow();
        return;
      }

      if (e.key === 'n') {
        e.preventDefault();
        if (onToggleNotes) onToggleNotes(selectedItemId);
        return;
      }

      if (e.key === 't') {
        e.preventDefault();
        addItemToTodayPlan(targetItem);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    visibleItems,
    selectedItemId,
    setSelectedItemId,
    toggleDone,
    toggleRevisionFlag,
    setConfidence,
    addItemToTodayPlan,
    setShowShortcutModal,
    activeTimer,
    pauseTimer,
    resumeTimer,
    onFocusSearch,
    onToggleNotes,
    settings.autoAdvanceOnHotkey
  ]);
}
