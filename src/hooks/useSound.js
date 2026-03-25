import { useState, useCallback, useRef } from "react";

function makeCtx() {
  try { return new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; }
}

function tone(ctx, freq, dur, type = "sine", vol = 0.25) {
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch {}
}

export function useSound() {
  const [enabled, setEnabled] = useState(
    () => localStorage.getItem("mem-sound") !== "false"
  );
  const ctxRef = useRef(null);

  const ctx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = makeCtx();
    return ctxRef.current;
  }, []);

  const play = useCallback((type) => {
    if (!enabled) return;
    const c = ctx();
    switch (type) {
      case "flip":
        tone(c, 480, 0.08); break;
      case "match":
        tone(c, 523, 0.1); setTimeout(() => tone(c, 659, 0.1), 100); setTimeout(() => tone(c, 784, 0.18), 200); break;
      case "miss":
        tone(c, 200, 0.18, "sawtooth", 0.18); break;
      case "win":
        [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(c, f, 0.25, "sine", 0.35), i * 140)); break;
      case "timeup":
        tone(c, 180, 0.6, "sawtooth", 0.35); break;
    }
  }, [enabled, ctx]);

  const toggle = useCallback(() => {
    setEnabled((e) => { const n = !e; localStorage.setItem("mem-sound", String(n)); return n; });
  }, []);

  return { play, enabled, toggle };
}
