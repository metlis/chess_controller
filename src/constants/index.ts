import { PiecesCoordinates, Row, Column, ColumnLetter, RowNumber } from "types";

export const PIECES_COORDINATES: PiecesCoordinates = {
  b: [
    [0, 2],
    [0, 5],
    [7, 2],
    [7, 5],
  ],
  k: [
    [0, 4],
    [7, 4],
  ],
  n: [
    [0, 1],
    [0, 6],
    [7, 1],
    [7, 6],
  ],
  p: [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [1, 7],
    [6, 0],
    [6, 1],
    [6, 2],
    [6, 3],
    [6, 4],
    [6, 5],
    [6, 6],
    [6, 7],
  ],
  r: [
    [0, 0],
    [0, 7],
    [7, 0],
    [7, 7],
  ],
  q: [
    [0, 3],
    [7, 3],
  ],
};

export const COLUMN_LETTERS: ColumnLetter[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
];

export const AXIS_VALUES: Row[] | Column[] = [0, 1, 2, 3, 4, 5, 6, 7];

export const ROW_NUMBERS: RowNumber[] = [8, 7, 6, 5, 4, 3, 2, 1];
