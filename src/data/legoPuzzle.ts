import type { PuzzlePiece } from "@/types/lego";
export const GRID = 12;
export const pieces: PuzzlePiece[] = [
  { id: "a", x: 2, y: 1, width: 3, height: 2, color: "pink" },
  { id: "b", x: 7, y: 1, width: 3, height: 2, color: "pink" },
  { id: "c", x: 1, y: 3, width: 3, height: 2, color: "pink" },
  { id: "d", x: 4, y: 3, width: 2, height: 2, color: "red" },
  { id: "e", x: 6, y: 3, width: 2, height: 2, color: "red" },
  { id: "f", x: 8, y: 3, width: 3, height: 2, color: "pink" },
  { id: "g", x: 2, y: 5, width: 3, height: 2, color: "red" },
  { id: "h", x: 5, y: 5, width: 2, height: 2, color: "red" },
  { id: "i", x: 7, y: 5, width: 3, height: 2, color: "red" },
  { id: "j", x: 4, y: 7, width: 2, height: 2, color: "pink" },
  { id: "k", x: 6, y: 7, width: 2, height: 2, color: "red" },
  { id: "l", x: 5, y: 9, width: 2, height: 1, color: "pink" },
];
export const trayOrder = [
  "h",
  "a",
  "j",
  "f",
  "d",
  "l",
  "b",
  "i",
  "e",
  "c",
  "k",
  "g",
];
export const letterPatterns: Record<string, string[]> = {
  I: ["111", "010", "010", "010", "111"],
  U: ["101", "101", "101", "101", "111"],
  L: ["100", "100", "100", "100", "111"],
  O: ["111", "101", "101", "101", "111"],
  V: ["101", "101", "101", "101", "010"],
  E: ["111", "100", "110", "100", "111"],
  Y: ["101", "101", "010", "010", "010"],
};
