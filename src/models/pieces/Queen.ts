import DiagonallyVerticallyHorizontallyMovingPiece from "./DiagonallyVerticallyHorizontallyMovingPiece";
import { Color } from "../../types";
import Cell from "../Cell";

class Queen extends DiagonallyVerticallyHorizontallyMovingPiece {
  constructor(color: Color, cell: Cell) {
    super(color, cell, "q");
  }

  public getMoveOptions(): Cell[] {
    this.moveOptions = [
      ...this.getDiagonalMoveOptions(),
      ...this.getVerticalHorizontalMoveOptions(),
    ];
    return this.moveOptions;
  }
}

export default Queen;
