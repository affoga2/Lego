import { pieces, GRID } from "@/data/legoPuzzle";
import LegoBrick from "./LegoBrick";
import type { Ref } from "react";
export default function LegoBoard({
  placed,
  boardRef,
  preview = false,
  completed = false,
}: {
  placed: string[];
  boardRef?: Ref<HTMLDivElement>;
  preview?: boolean;
  completed?: boolean;
}) {
  return (
    <div
      ref={boardRef}
      className={`lego-board ${completed ? "heart-completed" : ""}`}
      aria-label="Heart puzzle baseplate"
      data-testid="lego-board"
    >
      <div className="base-studs">
        {Array.from({ length: GRID * GRID }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      {pieces.map((p) => (
        <div
          key={p.id}
          data-target={p.id}
          className={`board-piece ${preview || placed.includes(p.id) ? "placed" : "outline"}`}
          style={{
            left: `${(p.x / GRID) * 100}%`,
            top: `${(p.y / GRID) * 100}%`,
            width: `${(p.width / GRID) * 100}%`,
            height: `${(p.height / GRID) * 100}%`,
          }}
        >
          {preview || placed.includes(p.id) ? (
            <LegoBrick {...p} />
          ) : (
            <span>{p.id.toUpperCase()}</span>
          )}
        </div>
      ))}
    </div>
  );
}
