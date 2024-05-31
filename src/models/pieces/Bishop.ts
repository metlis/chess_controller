import DiagonallyVerticallyHorizontallyMovingPiece from "models/pieces/DiagonallyVerticallyHorizontallyMovingPiece";
import Cell from "models/Cell";
import { Color } from "types";

class Bishop extends DiagonallyVerticallyHorizontallyMovingPiece {
  constructor(color: Color, cell: Cell) {
    super(color, cell, "b");
  }

  getMoveOptions(): Cell[] {
    this.moveOptions = this.getDiagonalMoveOptions();
    return this.moveOptions;
  }
}

export default Bishop;
