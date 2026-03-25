import { THEMES, THEME_KEYS } from "../constants";

export default function ThemePicker({ open, current, onSelect, onClose }) {
  if (!open) return null;
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal theme-modal" role="dialog" aria-modal="true">
        <h2>Choisir un theme</h2>
        <div className="theme-grid">
          {THEME_KEYS.map((key) => {
            const t = THEMES[key];
            return (
              <button
                key={key}
                className={`theme-btn${current === key ? " active" : ""}`}
                onClick={() => onSelect(key)}
              >
                <span className="theme-icon">{t.icon}</span>
                <span className="theme-label">{t.label}</span>
                <div className="theme-preview">
                  {t.emojis.slice(0, 6).join(" ")}
                </div>
              </button>
            );
          })}
        </div>
        <button className="btn ghost" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}
