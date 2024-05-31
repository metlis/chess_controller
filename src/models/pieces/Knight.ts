import Piece from "./Piece";
import { Color } from "../../types";
import Cell from "../Cell";

class Knight extends Piece {
  constructor(color: Color, cell: Cell) {
    super(color, cell, "n");
  }

  public getMoveOptions(): Cell[] {
    const cells: Cell[] = [];

    const _ = (colOffset: number, rowOffset: number) => {
      const columns: number[] = [];
      if (this.cell.coordinate[1] - colOffset >= 0) {
        columns.push(this.cell.coordinate[1] - colOffset);
      }
      if (this.cell.coordinate[1] + colOffset <= 7) {
        columns.push(this.cell.coordinate[1] + colOffset);
      }

      columns.forEach((column) => {
        const rows: number[] = [];
        if (this.cell.coordinate[0] - rowOffset >= 0) {
          rows.push(this.cell.coordinate[0] - rowOffset);
        }
        if (this.cell.coordinate[0] + rowOffset <= 7) {
          rows.push(this.cell.coordinate[0] + rowOffset);
        }

        rows.forEach((row) => {
          const target: Cell | null = this.board.getCell([row, column]);
          if (
            target &&
            this.cell.piece &&
            (target.piece === null ||
              target.piece.color !== this.cell.piece.color)
          ) {
            cells.push(target);
          }
        });
      });
    };

    _(1, 2);
    _(2, 1);

    this.moveOptions = cells;
    return cells;
  }
}

export default Knight;
