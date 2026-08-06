import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useApp } from './AppContext';

const TIMER_STORAGE_KEY = 'study_tracker_active_timer_v1';

const TimerContext = createContext(null);

export function TimerProvider({ children }) {
  const { logCompletedSession, settings } = useApp();

  const [activeTimer, setActiveTimer] = useState(() => {
    try {
      const saved = localStorage.getItem(TIMER_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            isRunning: false,
            subjectId: null,
            topicId: null,
            topicName: null,
            itemId: null,
            itemTitle: null,
            startTime: null,
            accumulatedSeconds: 0
          };
    } catch {
      return {
        isRunning: false,
        subjectId: null,
        topicId: null,
        topicName: null,
        itemId: null,
        itemTitle: null,
        startTime: null,
        accumulatedSeconds: 0
      };
    }
  });

  const [elapsedDisplaySeconds, setElapsedDisplaySeconds] = useState(0);
  const [showIdleModal, setShowIdleModal] = useState(false);
  const [idleGapSeconds, setIdleGapSeconds] = useState(0);
  const lastActiveTimestampRef = useRef(Date.now());

  // Save state to localStorage whenever timer state changes
  useEffect(() => {
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(activeTimer));
  }, [activeTimer]);

  // Timer Tick Engine
  useEffect(() => {
    let interval = null;

    if (activeTimer.isRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        const start = activeTimer.startTime || now;
        const currentRunSecs = Math.floor((now - start) / 1000);
        setElapsedDisplaySeconds(activeTimer.accumulatedSeconds + currentRunSecs);
      }, 1000);
    } else {
      setElapsedDisplaySeconds(activeTimer.accumulatedSeconds);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  // Tab Idle & Visibility Change Detector (10 min threshold from grill-me)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lastActiveTimestampRef.current = Date.now();
      } else if (activeTimer.isRunning) {
        const now = Date.now();
        const awayMs = now - lastActiveTimestampRef.current;
        const awaySecs = Math.floor(awayMs / 1000);
        const thresholdSecs = (settings.idleTimeoutMinutes || 10) * 60;

        if (awaySecs >= thresholdSecs) {
          setIdleGapSeconds(awaySecs);
          setShowIdleModal(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeTimer, settings.idleTimeoutMinutes]);

  const bankCurrentTimerSession = () => {
    if (!activeTimer.subjectId && !activeTimer.topicId) return;

    let finalSecs = activeTimer.accumulatedSeconds;
    if (activeTimer.isRunning && activeTimer.startTime) {
      finalSecs += Math.floor((Date.now() - activeTimer.startTime) / 1000);
    }

    if (finalSecs > 10) {
      // Bank if session > 10s
      logCompletedSession({
        subjectId: activeTimer.subjectId || 'dsa',
        topicId: activeTimer.topicId,
        itemId: activeTimer.itemId,
        durationSeconds: finalSecs,
        note: activeTimer.itemTitle ? `Studied: ${activeTimer.itemTitle}` : `Topic: ${activeTimer.topicName || 'General Session'}`
      });
    }
  };

  const startTimer = (subjectId, topicId = null, topicName = null, itemId = null, itemTitle = null) => {
    // If a timer is currently running, bank it first!
    if (activeTimer.isRunning || activeTimer.accumulatedSeconds > 0) {
      bankCurrentTimerSession();
    }

    const now = Date.now();
    setActiveTimer({
      isRunning: true,
      subjectId,
      topicId,
      topicName,
      itemId,
      itemTitle,
      startTime: now,
      accumulatedSeconds: 0
    });
  };

  const pauseTimer = () => {
    if (!activeTimer.isRunning) return;
    const now = Date.now();
    const currentRun = Math.floor((now - (activeTimer.startTime || now)) / 1000);

    setActiveTimer((prev) => ({
      ...prev,
      isRunning: false,
      startTime: null,
      accumulatedSeconds: prev.accumulatedSeconds + currentRun
    }));
  };

  const resumeTimer = () => {
    if (activeTimer.isRunning) return;
    setActiveTimer((prev) => ({
      ...prev,
      isRunning: true,
      startTime: Date.now()
    }));
  };

  const stopAndBankTimer = () => {
    bankCurrentTimerSession();
    setActiveTimer({
      isRunning: false,
      subjectId: null,
      topicId: null,
      topicName: null,
      itemId: null,
      itemTitle: null,
      startTime: null,
      accumulatedSeconds: 0
    });
    setElapsedDisplaySeconds(0);
  };

  const handleTrimIdleGap = (subtractGap) => {
    setShowIdleModal(false);
    if (subtractGap && idleGapSeconds > 0) {
      // Adjust start time to subtract idle gap
      setActiveTimer((prev) => {
        if (!prev.startTime) return prev;
        return {
          ...prev,
          startTime: prev.startTime + idleGapSeconds * 1000
        };
      });
    }
  };

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TimerContext.Provider
      value={{
        activeTimer,
        elapsedDisplaySeconds,
        showIdleModal,
        idleGapSeconds,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopAndBankTimer,
        handleTrimIdleGap,
        formatTime
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be used within a TimerProvider');
  return ctx;
}
