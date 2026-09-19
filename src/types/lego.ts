export type BrickColor = "red" | "pink" | "white";
export type PuzzlePiece = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: BrickColor;
};
