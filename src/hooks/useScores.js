import { useCallback } from "react";

const MAX = 5;
const key = (size) => `mem-scores-v2-${size}`;

export function useScores() {
  const getScores = useCallback((size) => {
    try { return JSON.parse(localStorage.getItem(key(size)) || "[]"); } catch { return []; }
  }, []);

  const addScore = useCallback((size, { ms, time, moves }) => {
    const prev = getScores(size);
    const isRecord = prev.length === 0 || ms < prev[0].ms || (ms === prev[0].ms && moves < prev[0].moves);
    const entry = { ms, time, moves, date: new Date().toLocaleDateString("fr") };
    const updated = [...prev, entry].sort((a, b) => a.ms - b.ms || a.moves - b.moves).slice(0, MAX);
    localStorage.setItem(key(size), JSON.stringify(updated));
    return { isRecord, scores: updated };
  }, [getScores]);

  return { getScores, addScore };
}
