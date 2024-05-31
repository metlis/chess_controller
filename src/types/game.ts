import { Piece } from "./board";
import Cell from "../models/Cell";
import Move from "../models/Move";
import PromotionPiece from "../models/pieces/PromotionPiece";

export const GameEventTypeLiterals = [
  "game:switchActivePlayerPiecesDraggability",
  "game:pieceMoved",
  "game:pieceTouched",
  "game:promotionOptionSelected",
  "game:switchActivePlayer",
  "game:addMove",
  "game:checkMove",
  "game:cellClicked",
] as const;
export type GameEventType = (typeof GameEventTypeLiterals)[number];

export interface GameEventPayload {
  move?: [Piece, Cell] | Move;
  promotion?: PromotionPiece;
  piece?: Piece;
  cell?: Cell;
}
