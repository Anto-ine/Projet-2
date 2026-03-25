import { useState, useEffect, useRef, useCallback } from "react";
import { SIZES, COUNTDOWN_LIMITS, fmt } from "./constants";
import { useGame } from "./hooks/useGame";
import { useTimer } from "./hooks/useTimer";
import { useScores } from "./hooks/useScores";
import { useSound } from "./hooks/useSound";
import Header from "./components/Header";
import Board from "./components/Board";
import VictoryModal from "./components/VictoryModal";
import GameOverModal from "./components/GameOverModal";
import Leaderboard from "./components/Leaderboard";
import ThemePicker from "./components/ThemePicker";
import Confetti from "./components/Confetti";
import "./App.css";

export default function App() {
  const [gridSize, setGridSize] = useState(() => {
    const s = parseInt(localStorage.getItem("mem-size") || "4", 10);
    return SIZES.includes(s) ? s : 4;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem("mem-theme") || "animaux");
  const [mode, setMode] = useState("classic");
  const [lbOpen, setLbOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [winResult, setWinResult] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const { play, enabled: soundEnabled, toggle: toggleSound } = useSound();
  const { getScores, addScore } = useScores();
  const timer = useTimer(mode, COUNTDOWN_LIMITS[gridSize]);
  const timerRef = useRef(timer);
  useEffect(() => { timerRef.current = timer; });

  const callbacksRef = useRef({
    onFlip: () => { play("flip"); timerRef.current.start(); },
    onMatch: () => play("match"),
    onMiss: () => play("miss"),
  });
  useEffect(() => {
    callbacksRef.current = {
      onFlip: () => { play("flip"); timerRef.current.start(); },
      onMatch: () => play("match"),
      onMiss: () => play("miss"),
    };
  }, [play]);

  const { deck, revealed, matched, moves, phase, init, flip } = useGame(gridSize, theme, callbacksRef);
  const movesRef = useRef(moves);
  useEffect(() => { movesRef.current = moves; });

  // Victory
  useEffect(() => {
    if (phase !== "won") return;
    timer.stop();
    play("win");
    const elapsed = timerRef.current.elapsed;
    const time = fmt(elapsed);
    const m = movesRef.current;
    const { isRecord } = addScore(gridSize, { ms: elapsed, time, moves: m });
    setWinResult({ isRecord, time, moves: m });
  }, [phase]); // eslint-disable-line

  // Countdown timeout
  useEffect(() => {
    if (timer.timeUp && phase === "playing") {
      timer.stop();
      play("timeup");
      setGameOver(true);
    }
  }, [timer.timeUp, phase]); // eslint-disable-line

  const reset = useCallback(() => {
    timerRef.current.reset();
    setWinResult(null);
    setGameOver(false);
    init();
  }, [init]);

  const handleSizeChange = useCallback(() => {
    const next = SIZES[(SIZES.indexOf(gridSize) + 1) % SIZES.length];
    setGridSize(next);
    localStorage.setItem("mem-size", String(next));
  }, [gridSize]);

  const handleThemeSelect = useCallback((key) => {
    setTheme(key);
    localStorage.setItem("mem-theme", key);
    setThemeOpen(false);
    timerRef.current.reset();
    setWinResult(null);
    setGameOver(false);
  }, []);

  const handleToggleMode = useCallback(() => {
    setMode((m) => (m === "classic" ? "countdown" : "classic"));
    timerRef.current.reset();
    setWinResult(null);
    setGameOver(false);
    init();
  }, [init]);

  const handleFlip = useCallback((idx) => {
    if (winResult || gameOver) return;
    flip(idx);
  }, [flip, winResult, gameOver]);

  return (
    <>
      <Header
        time={timer.display}
        moves={moves}
        best={getScores(gridSize)[0]}
        gridSize={gridSize}
        mode={mode}
        soundEnabled={soundEnabled}
        timeUp={timer.timeUp}
        onRestart={reset}
        onCycleSize={handleSizeChange}
        onToggleMode={handleToggleMode}
        onToggleSound={toggleSound}
        onOpenLeaderboard={() => setLbOpen(true)}
        onOpenThemes={() => setThemeOpen(true)}
      />

      <main className="container board-wrap">
        <Board
          deck={deck}
          revealed={revealed}
          matched={matched}
          gridSize={gridSize}
          onFlip={handleFlip}
        />
      </main>

      <footer className="site-footer">
        <div className="container muted">Fleches pour naviguer &nbsp;·&nbsp; Entree/Espace pour retourner</div>
      </footer>

      {winResult && (
        <VictoryModal
          time={winResult.time}
          moves={winResult.moves}
          isRecord={winResult.isRecord}
          onReplay={reset}
          onClose={() => setWinResult(null)}
        />
      )}

      {gameOver && (
        <GameOverModal
          matched={matched.size / 2}
          totalPairs={Math.floor((gridSize * gridSize) / 2)}
          onReplay={reset}
        />
      )}

      <Leaderboard
        open={lbOpen}
        gridSize={gridSize}
        getScores={getScores}
        onClose={() => setLbOpen(false)}
      />

      <ThemePicker
        open={themeOpen}
        current={theme}
        onSelect={handleThemeSelect}
        onClose={() => setThemeOpen(false)}
      />

      <Confetti active={!!winResult} />
    </>
  );
}
