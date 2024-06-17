import Pawn from "../models/pieces/Pawn";
import Bishop from "../models/pieces/Bishop";
import Knight from "../models/pieces/Knight";
import Rook from "../models/pieces/Rook";
import Queen from "../models/pieces/Queen";
import King from "../models/pieces/King";
import Cell from "../models/Cell";

export type Color = "b" | "w";
export type Row = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Column = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Coordinate = [Row, Column];
export type Piece = Bishop | King | Knight | Pawn | Rook | Queen;
export type PieceName = "b" | "k" | "n" | "p" | "r" | "q";
export type PieceCode = `${PieceName}_${Color}`;

export const BoardEventTypeLiterals = [
  "cell:switchState",
  "piece:changeDraggability",
  "piece:getMoveOptions",
  "piece:detectCheck",
  "piece:detectHasMoveOptions",
] as const;
export type BoardEventType = (typeof BoardEventTypeLiterals)[number];

export type BoardEventFn = (
  event: BoardEventType,
  payload?: BoardEventPayload
) => void;

export interface BoardEventPayload {
  exclude?: (Piece | Cell)[];
  include?: (Piece | Cell)[];
  cellState?: CellState;
  resultsContainer?: (Piece | Cell)[];
}

export type PiecesCoordinates = {
  [key in PieceName]: Coordinate[];
};

export type ColumnLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type RowNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type CellID = `${ColumnLetter}${RowNumber}`;
export type CellState =
  | "default"
  | "checked"
  | "lastMove"
  | "moveOption"
  | "promotionOption";
