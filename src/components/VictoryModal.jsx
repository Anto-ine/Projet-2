export default function VictoryModal({ time, moves, isRecord, onReplay, onClose }) {
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Victoire">
        <div className="modal-icon">🎉</div>
        <h2>Bravo !</h2>
        <p>Temps : <strong>{time}</strong> &nbsp;·&nbsp; Coups : <strong>{moves}</strong></p>
        {isRecord && (
          <p className="record">🏆 Nouveau meilleur score !</p>
        )}
        <div className="modal-actions">
          <button className="btn" onClick={onReplay} autoFocus>Rejouer</button>
          <button className="btn ghost" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}
