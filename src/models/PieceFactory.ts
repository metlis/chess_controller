import Pawn from "models/pieces/Pawn";
import Bishop from "models/pieces/Bishop";
import Knight from "models/pieces/Knight";
import Rook from "models/pieces/Rook";
import Queen from "models/pieces/Queen";
import King from "models/pieces/King";
import Cell from "models/Cell";
import type { PieceName, Piece, Color } from "types";

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
