import DiagonallyVerticallyHorizontallyMovingPiece from "./DiagonallyVerticallyHorizontallyMovingPiece";
import Cell from "../Cell";
import { Color } from "../../types";

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
