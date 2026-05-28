"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Hook that triggers a callback after a period of user inactivity.
 *
 * Monitors mouse, keyboard, touch, and scroll events.
 * Resets the timer on any user interaction.
 *
 * @param onIdle - Callback to execute when user goes idle
 * @param timeoutMs - Inactivity threshold in milliseconds (default: 30 min)
 */
export function useIdleTimeout(
  onIdle: () => void,
  timeoutMs: number = 30 * 60 * 1000
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onIdleRef = useRef(onIdle);

  // Keep callback ref updated without causing re-renders
  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onIdleRef.current();
    }, timeoutMs);
  }, [timeoutMs]);

  useEffect(() => {
    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ];

    // Start the timer
    resetTimer();

    // Reset on user activity
    const handleActivity = () => resetTimer();
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]);
}
