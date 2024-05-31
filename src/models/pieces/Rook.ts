import DiagonallyVerticallyHorizontallyMovingPiece from "models/pieces/DiagonallyVerticallyHorizontallyMovingPiece";
import { Color } from "types";
import Cell from "models/Cell";

class Rook extends DiagonallyVerticallyHorizontallyMovingPiece {
  constructor(color: Color, cell: Cell) {
    super(color, cell, "r");
  }

  getMoveOptions(): Cell[] {
    this.moveOptions = this.getVerticalHorizontalMoveOptions();
    return this.moveOptions;
  }
}

export default Rook;
