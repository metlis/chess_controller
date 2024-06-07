import Piece from "./Piece";
import { Color } from "../../types";
import Cell from "../Cell";

class Pawn extends Piece {
  constructor(color: Color, cell: Cell) {
    super(color, cell, "p");
  }

  private get movingUp(): boolean {
    return this.color !== this.board.colorOnTop;
  }

  public getMoveOptions(): Cell[] {
    const cells: Cell[] = [];

    const left = this.board.getCell([
      this.cell.coordinate[0] + 1 * (this.movingUp ? -1 : 1),
      this.cell.coordinate[1] - 1,
    ]);
    if (left && left.piece && left.piece.color !== this.color) {
      cells.push(left);
    }

    const singleStraight = this.board.getCell([
      this.cell.coordinate[0] + 1 * (this.movingUp ? -1 : 1),
      this.cell.coordinate[1],
    ]);
    if (singleStraight && !singleStraight.piece) {
      cells.push(singleStraight);
    }

    const doubleStraight = this.board.getCell([
      this.cell.coordinate[0] + 2 * (this.movingUp ? -1 : 1),
      this.cell.coordinate[1],
    ]);
    if (
      !this.moved &&
      doubleStraight &&
      !doubleStraight.piece &&
      singleStraight &&
      !singleStraight.piece
    ) {
      cells.push(doubleStraight);
    }

    const right = this.board.getCell([
      this.cell.coordinate[0] + 1 * (this.movingUp ? -1 : 1),
      this.cell.coordinate[1] + 1,
    ]);
    if (right && right.piece && right.piece.color !== this.color) {
      cells.push(right);
    }

    const lastMove = this.gameController.lastMove;
    if (
      lastMove?.piece.name === "p" &&
      lastMove.to.coordinate[0] === this.cell.coordinate[0] &&
      Math.abs(lastMove.from.coordinate[0] - lastMove.to.coordinate[0]) === 2 &&
      (lastMove.to.coordinate[1] === this.cell.coordinate[1] - 1 ||
        lastMove.to.coordinate[1] === this.cell.coordinate[1] + 1)
    ) {
      const cell = this.board.getCell([
        lastMove.to.coordinate[0] + (this.movingUp ? -1 : 1),
        lastMove.to.coordinate[1],
      ]);
      if (cell) {
        cells.push(cell);
      }
    }

    this.moveOptions = cells;
    return cells;
  }
}

export default Pawn;
