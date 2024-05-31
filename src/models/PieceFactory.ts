import Pawn from "./pieces/Pawn";
import Bishop from "./pieces/Bishop";
import Knight from "./pieces/Knight";
import Rook from "./pieces/Rook";
import Queen from "./pieces/Queen";
import King from "./pieces/King";
import Cell from "./Cell";
import type { PieceName, Piece, Color } from "../types";

class PieceFactory {
  create(name: PieceName, color: Color, cell: Cell): Piece {
    let instance: Piece;
    switch (name) {
      case "b":
        instance = new Bishop(color, cell);
        break;
      case "k":
        instance = new King(color, cell);
        break;
      case "n":
        instance = new Knight(color, cell);
        break;
      case "p":
        instance = new Pawn(color, cell);
        break;
      case "r":
        instance = new Rook(color, cell);
        break;
      case "q":
        instance = new Queen(color, cell);
        break;
      default:
        throw new Error("Invalid parameter");
    }
    return instance;
  }
}

export default PieceFactory;
