import { useReducer, useCallback, useRef, useEffect } from "react";
import { buildDeck } from "../constants";

function createState(gridSize, theme) {
  const { deck, totalPairs } = buildDeck(gridSize, theme);
  return { deck, totalPairs, revealed: new Set(), matched: new Set(), moves: 0, phase: "idle" };
}

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return createState(action.gridSize, action.theme);
    case "REVEAL":
      return {
        ...state,
        phase: state.phase === "idle" ? "playing" : state.phase,
        revealed: new Set([...state.revealed, action.idx]),
      };
    case "MATCH": {
      const newMatched = new Set([...state.matched, action.first, action.second]);
      const newRevealed = new Set([...state.revealed]);
      newRevealed.delete(action.first); newRevealed.delete(action.second);
      return {
        ...state,
        matched: newMatched,
        revealed: newRevealed,
        moves: state.moves + 1,
        phase: newMatched.size / 2 >= state.totalPairs ? "won" : "playing",
      };
    }
    case "NO_MATCH": {
      const newRevealed = new Set([...state.revealed]);
      newRevealed.delete(action.first); newRevealed.delete(action.second);
      return { ...state, revealed: newRevealed, moves: state.moves + 1 };
    }
    default: return state;
  }
}

export function useGame(gridSize, theme, callbacksRef) {
  const [state, dispatch] = useReducer(reducer, null, () => createState(gridSize, theme));
  const pendingRef = useRef(null);
  const lockedRef = useRef(false);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; });

  const init = useCallback(() => {
    dispatch({ type: "INIT", gridSize, theme });
    pendingRef.current = null;
    lockedRef.current = false;
  }, [gridSize, theme]);

  useEffect(() => { init(); }, [init]);

  const flip = useCallback((idx) => {
    const s = stateRef.current;
    if (lockedRef.current || s.matched.has(idx) || s.revealed.has(idx) || s.deck[idx] === null) return;

    callbacksRef.current?.onFlip?.();
    dispatch({ type: "REVEAL", idx });

    if (pendingRef.current === null) {
      pendingRef.current = idx;
      return;
    }

    const first = pendingRef.current;
    pendingRef.current = null;
    lockedRef.current = true;
    const isMatch = s.deck[first] === s.deck[idx];

    if (isMatch) {
      setTimeout(() => {
        dispatch({ type: "MATCH", first, second: idx });
        lockedRef.current = false;
        callbacksRef.current?.onMatch?.();
      }, 300);
    } else {
      setTimeout(() => {
        dispatch({ type: "NO_MATCH", first, second: idx });
        lockedRef.current = false;
        callbacksRef.current?.onMiss?.();
      }, 700);
    }
  }, [callbacksRef]);

  return { ...state, init, flip };
}
