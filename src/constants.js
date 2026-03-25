export const SIZES = [4, 5, 6, 8];

export const COUNTDOWN_LIMITS = { 4: 60000, 5: 90000, 6: 120000, 8: 210000 };

export const THEMES = {
  animaux: {
    label: "Animaux",
    icon: "🐾",
    emojis: ["🐱","🐶","🦊","🐼","🐸","🐵","🐨","🦁","🐯","🐮","🐷","🐔","🐧","🦄","🐙","🐳","🐝","🦋","🦀","🦜","🦎","🐢","🦆","🐻","🐺","🐰","🐹","🦥","🦦","🦩","🦚","🦫","🐿️","🦔","🐬","🦭"],
  },
  food: {
    label: "Nourriture",
    icon: "🍕",
    emojis: ["🍕","🍔","🌮","🍜","🍣","🍩","🍪","🎂","🍓","🍇","🍊","🍋","🍎","🍑","🥑","🥦","🌽","🍄","🧁","🥐","🍰","🍭","🍦","🥗","🥙","🌭","🥨","🧆","🥞","🫐","🍒","🍌","🍍","🧀","🥝","🥕"],
  },
  espace: {
    label: "Espace",
    icon: "🚀",
    emojis: ["🚀","⭐","🌙","🌍","🪐","☀️","🌟","💫","🌠","🔭","🛸","🌌","🛰️","☄️","🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🪨","🌐","🔮","💎","⚡","💥","✨","🎇","🎆","🪄","🌀","👾","🤖","🌃"],
  },
  sports: {
    label: "Sports",
    icon: "⚽",
    emojis: ["⚽","🏀","🏈","⚾","🎾","🏐","🏉","🎱","🏓","🏸","🥊","🏹","🎯","⛳","🏊","🧗","🤸","🏋️","🚴","🏄","🧘","🤼","🤺","🥋","🏇","🎿","⛷️","🏂","🤿","🪂","🏌️","🤾","🏒","🥅","🎣","🏆"],
  },
  emoji: {
    label: "Visages",
    icon: "😀",
    emojis: ["😀","😂","🥰","😎","🤔","😴","🥳","🤯","😱","🤩","🥺","😤","🤣","😇","🥸","🤑","🫠","😏","😌","🤗","🤭","🤫","🤥","😬","😮","😲","🤢","🤮","🤧","😷","🥵","🥶","😵","😡","🤠","🎃"],
  },
};

export const THEME_KEYS = Object.keys(THEMES);

const pad = (n) => String(n).padStart(2, "0");
export const fmt = (ms) =>
  `${pad(Math.floor(ms / 60000))}:${pad(Math.floor(ms / 1000) % 60)}`;

function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function buildDeck(size, themeKey) {
  const cells = size * size;
  const pairs = Math.floor(cells / 2);
  const emojis = shuffle([...(THEMES[themeKey]?.emojis || THEMES.animaux.emojis)]).slice(0, pairs);
  const deck = shuffle([...emojis, ...emojis]);
  if (cells % 2 === 1) deck.push(null);
  return { deck, totalPairs: pairs };
}
