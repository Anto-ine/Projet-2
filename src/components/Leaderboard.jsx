import { SIZES } from "../constants";

export default function Leaderboard({ open, gridSize, getScores, onClose }) {
  return (
    <aside className="drawer" aria-hidden={!open}>
      <div className="drawer-inner">
        <div className="drawer-head">
          <h3>🏆 Meilleurs scores</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Fermer">✕</button>
        </div>
        <div className="lb-content">
          {SIZES.map((size) => {
            const scores = getScores(size);
            return (
              <div key={size} className={`lb-section${size === gridSize ? " active" : ""}`}>
                <h4 className="lb-size">{size}×{size}</h4>
                {scores.length === 0 ? (
                  <p className="muted lb-empty">Aucun score</p>
                ) : (
                  <table className="lb-table">
                    <thead>
                      <tr><th>#</th><th>Temps</th><th>Coups</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {scores.map((s, i) => (
                        <tr key={i} className={i === 0 && size === gridSize ? "lb-best" : ""}>
                          <td>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</td>
                          <td>{s.time}</td>
                          <td>{s.moves}c</td>
                          <td>{s.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
