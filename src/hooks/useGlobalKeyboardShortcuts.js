import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTimer } from '../context/TimerContext';

export function useGlobalKeyboardShortcuts() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    showShortcutModal,
    setShowShortcutModal,
    selectedItemId,
    setSelectedItemId
  } = useApp();
  const { activeTimer, pauseTimer, resumeTimer } = useTimer();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setShowShortcutModal((prev) => !prev);
        return;
      }

      if (e.key === 'Escape') {
        if (showShortcutModal) {
          setShowShortcutModal(false);
          return;
        }
        if (selectedItemId) {
          setSelectedItemId(null);
          return;
        }
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

      const pageMap = {
        '1': '/today',
        '2': '/tracker',
        '3': '/planner',
        '4': '/revision',
        '5': '/calendar',
        '6': '/insights',
        '7': '/data',
        '8': '/help'
      };

      if (e.altKey && pageMap[e.key]) {
        e.preventDefault();
        navigate(pageMap[e.key]);
        return;
      }

      if (!selectedItemId && pageMap[e.key]) {
        e.preventDefault();
        navigate(pageMap[e.key]);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    navigate,
    location.pathname,
    showShortcutModal,
    setShowShortcutModal,
    selectedItemId,
    setSelectedItemId,
    activeTimer,
    pauseTimer,
    resumeTimer
  ]);
}
