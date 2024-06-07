import Cell from "../Cell";
import Piece from "./Piece";
import { Color } from "../../types";

class King extends Piece {
  public longCastlingPossible: boolean = true;
  public shortCastlingPossible: boolean = true;

  constructor(color: Color, cell: Cell) {
    super(color, cell, "k");
  }

  private targetReachable(target: Cell): boolean {
    return !target.piece || target.piece.color !== this.color;
  }

  public getMoveOptions(): Cell[] {
    const cells: Cell[] = [];

    const top = this.board.getCell([
      this.cell.coordinate[0] + 1,
      this.cell.coordinate[1],
    ]);
    if (top && this.targetReachable(top)) cells.push(top);

    const bottom = this.board.getCell([
      this.cell.coordinate[0] - 1,
      this.cell.coordinate[1],
    ]);
    if (bottom && this.targetReachable(bottom)) cells.push(bottom);

    const left = this.board.getCell([
      this.cell.coordinate[0],
      this.cell.coordinate[1] - 1,
    ]);
    if (left && this.targetReachable(left)) cells.push(left);

    const right = this.board.getCell([
      this.cell.coordinate[0],
      this.cell.coordinate[1] + 1,
    ]);
    if (right && this.targetReachable(right)) cells.push(right);

    const leftTop = this.board.getCell([
      this.cell.coordinate[0] - 1,
      this.cell.coordinate[1] - 1,
    ]);
    if (leftTop && this.targetReachable(leftTop)) cells.push(leftTop);

    const rightTop = this.board.getCell([
      this.cell.coordinate[0] - 1,
      this.cell.coordinate[1] + 1,
    ]);
    if (rightTop && this.targetReachable(rightTop)) cells.push(rightTop);

    const leftBottom = this.board.getCell([
      this.cell.coordinate[0] + 1,
      this.cell.coordinate[1] - 1,
    ]);
    if (leftBottom && this.targetReachable(leftBottom)) cells.push(leftBottom);

    const rightBottom = this.board.getCell([
      this.cell.coordinate[0] + 1,
      this.cell.coordinate[1] + 1,
    ]);
    if (rightBottom && this.targetReachable(rightBottom))
      cells.push(rightBottom);

    const oppositePieces = this.board.pieces.filter(
      (p) => p.color !== this.color
    );
    if (
      !this.moved &&
      !oppositePieces.some((p) => p.checkedMoveOptions.includes(this.cell))
    ) {
      const shortCastlingCoords: [number, number][] = [1, 2, 3].map((i) => [
        this.cell.coordinate[0],
        this.cell.coordinate[1] + i * (this.board.colorOnTop === "w" ? -1 : 1),
      ]);
      const longCastlingCoords: [number, number][] = [1, 2, 3, 4].map((i) => [
        this.cell.coordinate[0],
        this.cell.coordinate[1] + i * (this.board.colorOnTop === "w" ? 1 : -1),
      ]);
      const checkCastlingForCurrentMove = (coords: [number, number][]) => {
        const rookCell = this.board.getCell(coords[coords.length - 1]);
        if (rookCell?.piece && !rookCell.piece.moved) {
          if (coords.length === 3) {
            this.shortCastlingPossible = true;
          } else {
            this.longCastlingPossible = true;
          }
          const cells: Cell[] = [];
          for (let i = 0; i < coords.length - 1; i++) {
            const cell = this.board.getCell(coords[i]);
            if (cell) {
              if (cell.piece) return false;
              for (const p of oppositePieces) {
                if (p.checkedMoveOptions.includes(cell)) return false;
              }
              cells.push(cell);
            }
          }
          return cells.length === coords.length - 1;
        } else {
          if (coords.length === 3) {
            this.shortCastlingPossible = false;
          } else {
            this.longCastlingPossible = false;
          }
        }
        return false;
      };
      if (checkCastlingForCurrentMove(shortCastlingCoords)) {
        const shortCastlingCell = this.board.getCell([
          this.cell.coordinate[0],
          this.cell.coordinate[1] +
            2 * (this.board.colorOnTop === "w" ? -1 : 1),
        ]);
        if (shortCastlingCell) cells.push(shortCastlingCell);
      }
      if (checkCastlingForCurrentMove(longCastlingCoords)) {
        const longCastlingCell = this.board.getCell([
          this.cell.coordinate[0],
          this.cell.coordinate[1] +
            2 * (this.board.colorOnTop === "w" ? 1 : -1),
        ]);
        if (longCastlingCell) cells.push(longCastlingCell);
      }
    }

    if (this.moved) {
      this.longCastlingPossible = false;
      this.shortCastlingPossible = false;
    }

    this.moveOptions = cells;
    return cells;
  }
}

export default King;
