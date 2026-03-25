import { useCallback } from "react";

export default function Card({ emoji, index, isFlipped, isMatched, gridSize, totalCards, onFlip }) {
  const handleKey = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onFlip(index); }
    const c = gridSize;
    if (e.key === "ArrowRight") document.querySelector(`[data-idx="${(index+1) % totalCards}"]`)?.focus();
    if (e.key === "ArrowLeft")  document.querySelector(`[data-idx="${(index-1+totalCards) % totalCards}"]`)?.focus();
    if (e.key === "ArrowDown")  document.querySelector(`[data-idx="${(index+c) % totalCards}"]`)?.focus();
    if (e.key === "ArrowUp")    document.querySelector(`[data-idx="${(index-c+totalCards) % totalCards}"]`)?.focus();
  }, [index, gridSize, totalCards, onFlip]);

  if (emoji === null) return <div className="card-placeholder" />;

  return (
    <button
      className={`card${isFlipped || isMatched ? " flipped" : ""}${isMatched ? " matched" : ""}`}
      data-idx={index}
      aria-label={isFlipped || isMatched ? `Carte : ${emoji}` : "Carte fermee"}
      disabled={isMatched}
      onClick={() => onFlip(index)}
      onKeyDown={handleKey}
    >
      <div className="face front">🎴</div>
      <div className="face back">{emoji}</div>
    </button>
  );
}
