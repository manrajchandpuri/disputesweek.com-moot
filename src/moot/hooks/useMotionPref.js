import { createContext, useContext, useEffect, useState } from "react";

const KEY = "iidw-moot-still";
export const MotionContext = createContext({ still: false, setStill: () => {} });

function readStored() {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch (e) {
    return false;
  }
}

// Combines the OS reduced-motion setting with the "View without animation" toggle.
export function useMotionState() {
  const [osReduced, setOsReduced] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [userStill, setUserStill] = useState(readStored);

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setOsReduced(query.matches);
    update();
    query.addEventListener ? query.addEventListener("change", update) : query.addListener(update);
    return () => {
      query.removeEventListener ? query.removeEventListener("change", update) : query.removeListener(update);
    };
  }, []);

  const setStill = (value) => {
    setUserStill(value);
    try {
      window.localStorage.setItem(KEY, value ? "1" : "0");
    } catch (e) {
      // Storage can be blocked. The toggle still works for this visit.
    }
  };

  return { still: osReduced || userStill, userStill, setStill };
}

export function useMotion() {
  return useContext(MotionContext);
}
