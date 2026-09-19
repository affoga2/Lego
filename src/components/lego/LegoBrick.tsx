import type { CSSProperties } from "react";
import type { BrickColor } from "@/types/lego";
export default function LegoBrick({
  width = 2,
  height = 2,
  color = "red",
  className = "",
  style,
}: {
  width?: number;
  height?: number;
  color?: BrickColor;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={`lego-brick ${color} ${className}`}
      style={{
        ...style,
        gridTemplateColumns: `repeat(${width},1fr)`,
        gridTemplateRows: `repeat(${height},1fr)`,
      }}
    >
      {Array.from({ length: width * height }, (_, i) => (
        <i className="stud" key={i} />
      ))}
    </span>
  );
}
