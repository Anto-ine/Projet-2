import { SIZES } from "../constants";

export default function Header({
  time, moves, best, gridSize, mode, soundEnabled, timeUp,
  onRestart, onCycleSize, onToggleMode, onToggleSound, onOpenLeaderboard, onOpenThemes,
}) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <h1 className="title">&#129504; Memory</h1>

        <div className="hud">
          <div className={`pill${mode === "countdown" && timeUp ? " pill-danger" : mode === "countdown" ? " pill-countdown" : ""}`}>
            {mode === "countdown" ? "⏳" : "⏱️"} <span>{time}</span>
          </div>
          <div className="pill">🫳 <span>{moves}</span></div>
          <div className="pill pill-muted">
            🏆 {best ? `${best.time} / ${best.moves}c` : "—"}
          </div>
        </div>

        <div className="header-actions">
          <button className="btn" onClick={onRestart} title="Rejouer">↺ Rejouer</button>
          <button className="btn ghost" onClick={onCycleSize} title="Taille de grille">
            {gridSize}×{gridSize}
          </button>
          <button
            className={`btn ghost${mode === "countdown" ? " active" : ""}`}
            onClick={onToggleMode}
            title="Mode chrono"
          >
            {mode === "countdown" ? "⏳ Chrono" : "♾️ Classique"}
          </button>
          <button className="icon-btn" onClick={onOpenThemes} title="Themes">🎨</button>
          <button className="icon-btn" onClick={onOpenLeaderboard} title="Scores">🏆</button>
          <button className="icon-btn" onClick={onToggleSound} title="Son">
            {soundEnabled ? "🔊" : "🔇"}
          </button>
        </div>
      </div>
    </header>
  );
}
