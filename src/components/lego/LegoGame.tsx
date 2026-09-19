"use client";
import { useRef, useState } from "react";
import type { PointerEvent, CSSProperties } from "react";
import { GRID, pieces, trayOrder } from "@/data/legoPuzzle";
import { useLegoPuzzle } from "@/hooks/useLegoPuzzle";
import LegoBrick from "./LegoBrick";
import LegoBoard from "./LegoBoard";
import PuzzleProgress from "./PuzzleProgress";
import PuzzleComplete from "./PuzzleComplete";
type Drag = {
  id: string;
  pointer: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
};
export default function LegoGame({ onReveal }: { onReveal: () => void }) {
  const { placed, ready, place, reset, completed } = useLegoPuzzle();
  const board = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [shaking, setShaking] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  function start(e: PointerEvent<HTMLButtonElement>, id: string) {
    if (dragRef.current || placed.includes(id) || e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const next = {
      id,
      pointer: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      dy: 0,
    };
    dragRef.current = next;
    setDrag(next);
  }
  function move(e: PointerEvent<HTMLButtonElement>) {
    const d = dragRef.current;
    if (!d || d.pointer !== e.pointerId) return;
    e.preventDefault();
    const next = { ...d, dx: e.clientX - d.startX, dy: e.clientY - d.startY };
    dragRef.current = next;
    setDrag(next);
  }
  function finish(e: PointerEvent<HTMLButtonElement>, cancel = false) {
    const d = dragRef.current;
    if (!d || d.pointer !== e.pointerId) return;
    const p = pieces.find((p) => p.id === d.id)!;
    const b = board.current?.getBoundingClientRect();
    const r = e.currentTarget.getBoundingClientRect();
    if (
      !cancel &&
      b &&
      Math.hypot(
        r.left +
          r.width / 2 -
          (b.left + ((p.x + p.width / 2) * b.width) / GRID),
        r.top +
          r.height / 2 -
          (b.top + ((p.y + p.height / 2) * b.height) / GRID),
      ) < Math.max(30, (b.width / GRID) * 1.25)
    ) {
      place(p.id);
      setAnnouncement(`Piece ${p.id.toUpperCase()} placed.`);
    } else {
      setShaking(p.id);
      setAnnouncement("Almost! Match the letter on the heart and try again.");
      setTimeout(() => setShaking(null), 400);
    }
    dragRef.current = null;
    setDrag(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  }
  if (!ready) return <p>Gathering your pieces…</p>;
  return (
    <section className="game fade-in">
      <PuzzleProgress count={placed.length} total={pieces.length} />
      <LegoBoard placed={placed} boardRef={board} completed={completed} />
      {completed ? (
        <PuzzleComplete onReveal={onReveal} />
      ) : (
        <>
          <div className="piece-tray">
            {trayOrder.map((id) => {
              const p = pieces.find((p) => p.id === id)!;
              const locked = placed.includes(id);
              return (
                <div className="piece-slot" key={id}>
                  {!locked && (
                    <button
                      aria-label={`Drag piece ${id.toUpperCase()}`}
                      data-piece={id}
                      className={`draggable ${drag?.id === id ? "dragging" : ""} ${shaking === id ? "shake" : ""}`}
                      style={
                        {
                          "--brick-width": p.width,
                          "--brick-height": p.height,
                          transform:
                            drag?.id === id
                              ? `translate(${drag.dx}px,${drag.dy}px) scale(1.06)`
                              : undefined,
                        } as CSSProperties
                      }
                      onPointerDown={(e) => start(e, id)}
                      onPointerMove={move}
                      onPointerUp={(e) => finish(e)}
                      onPointerCancel={(e) => finish(e, true)}
                      onLostPointerCapture={(e) => {
                        if (dragRef.current) finish(e, true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          place(id);
                          setAnnouncement(`Piece ${id.toUpperCase()} placed.`);
                        }
                      }}
                    >
                      <LegoBrick {...p} />
                      <span className="piece-letter">{id.toUpperCase()}</span>
                    </button>
                  )}
                  {locked && (
                    <span className="slot-heart" aria-hidden="true">
                      ♡
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="drag-hint">Drag the pieces to the correct spot.</p>
          <p className="match-hint">
            Match the little letters. Take your time. ♡
          </p>
          <span className="sr-only">
            Keyboard: focus a piece and press Enter to place it.
          </span>
        </>
      )}
      <span className="sr-only" role="status">
        {announcement}
      </span>
      {process.env.NODE_ENV === "development" && (
        <button className="dev-reset" onClick={reset}>
          Reset puzzle (development)
        </button>
      )}
    </section>
  );
}
