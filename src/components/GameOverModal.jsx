export default function GameOverModal({ matched, totalPairs, onReplay }) {
  return (
    <div className="overlay">
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-icon">⏰</div>
        <h2>Temps ecoulé !</h2>
        <p>Tu as trouvé <strong>{matched} / {totalPairs}</strong> paires.</p>
        <p className="muted">Essaie encore, tu peux faire mieux !</p>
        <div className="modal-actions">
          <button className="btn" onClick={onReplay} autoFocus>Réessayer</button>
        </div>
      </div>
    </div>
  );
}
