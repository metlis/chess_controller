import DiagonallyVerticallyHorizontallyMovingPiece from "./DiagonallyVerticallyHorizontallyMovingPiece";
import { Color } from "../../types";
import Cell from "../Cell";

class Rook extends DiagonallyVerticallyHorizontallyMovingPiece {
  constructor(color: Color, cell: Cell) {
    super(color, cell, "r");
  }

  public getMoveOptions(): Cell[] {
    this.moveOptions = this.getVerticalHorizontalMoveOptions();
    return this.moveOptions;
  }
}

export default Rook;
