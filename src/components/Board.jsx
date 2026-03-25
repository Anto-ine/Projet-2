import Card from "./Card";

export default function Board({ deck, revealed, matched, gridSize, onFlip }) {
  return (
    <div
      className="board"
      role="grid"
      aria-label="Jeu de Memory"
      style={{ "--cols": gridSize }}
    >
      {deck.map((emoji, idx) => (
        <Card
          key={idx}
          index={idx}
          emoji={emoji}
          isFlipped={revealed.has(idx)}
          isMatched={matched.has(idx)}
          gridSize={gridSize}
          totalCards={deck.length}
          onFlip={onFlip}
        />
      ))}
    </div>
  );
}
