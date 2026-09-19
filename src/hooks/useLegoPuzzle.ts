"use client";
import { useCallback, useEffect, useState } from "react";
import { pieces } from "@/data/legoPuzzle";
const KEY = "lego-love-puzzle-progress";
const COMPLETE = "lego-love-puzzle-completed";

export function clearLegoPuzzleProgress() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(COMPLETE);
  } catch {}
}

export function useLegoPuzzle() {
  const [placed, setPlaced] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const data: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(data))
        setPlaced([
          ...new Set(
            data.filter(
              (id): id is string =>
                typeof id === "string" && pieces.some((p) => p.id === id),
            ),
          ),
        ]);
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(placed));
      localStorage.setItem(COMPLETE, String(placed.length === pieces.length));
    } catch {}
  }, [placed, ready]);
  const place = useCallback(
    (id: string) => setPlaced((old) => (old.includes(id) ? old : [...old, id])),
    [],
  );
  const reset = () => {
    setPlaced([]);
    clearLegoPuzzleProgress();
  };
  return {
    placed,
    ready,
    place,
    reset,
    completed: placed.length === pieces.length,
  };
}
