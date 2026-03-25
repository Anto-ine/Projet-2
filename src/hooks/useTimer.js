import { useState, useCallback, useRef } from "react";
import { fmt } from "../constants";

export function useTimer(mode = "classic", limit = 60000) {
  const [elapsed, setElapsed] = useState(0);
  const t0Ref = useRef(null);
  const tickRef = useRef(null);

  const start = useCallback(() => {
    if (tickRef.current) return;
    t0Ref.current = performance.now() - elapsed;
    tickRef.current = setInterval(() => {
      setElapsed(performance.now() - t0Ref.current);
    }, 100);
  }, [elapsed]);

  const stop = useCallback(() => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
  }, []);

  const reset = useCallback(() => {
    stop();
    setElapsed(0);
    t0Ref.current = null;
  }, [stop]);

  const displayMs = mode === "countdown" ? Math.max(0, limit - elapsed) : elapsed;
  const display = fmt(displayMs);
  const timeUp = mode === "countdown" && elapsed >= limit;

  return { elapsed, display, start, stop, reset, timeUp };
}
