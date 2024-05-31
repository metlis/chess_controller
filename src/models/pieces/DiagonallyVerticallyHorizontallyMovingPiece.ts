import Piece from "./Piece";
import Cell from "../Cell";

abstract class DiagonallyVerticallyHorizontallyMovingPiece extends Piece {
  private targetReachable(target: Cell): boolean {
    return !target.piece || target.piece.color !== this.color;
  }

  protected getDiagonalMoveOptions(): Cell[] {
    const cells: Cell[] = [];

    const topLeft: [number, number] = [
      this.cell.coordinate[0] - 1,
      this.cell.coordinate[1] - 1,
    ];
    while (topLeft[0] >= 0 && topLeft[1] >= 0) {
      const target = this.board.getCell(topLeft);
      if (target && this.targetReachable(target)) cells.push(target);
      if (target?.piece) break;
      topLeft[0] = topLeft[0] - 1;
      topLeft[1] = topLeft[1] - 1;
    }

    const topRight: [number, number] = [
      this.cell.coordinate[0] - 1,
      this.cell.coordinate[1] + 1,
    ];
    while (topRight[0] >= 0 && topRight[1] <= 7) {
      const target = this.board.getCell(topRight);
      if (target && this.targetReachable(target)) cells.push(target);
      if (target?.piece) break;
      topRight[0] = topRight[0] - 1;
      topRight[1] = topRight[1] + 1;
    }

    const bottomRight: [number, number] = [
      this.cell.coordinate[0] + 1,
      this.cell.coordinate[1] + 1,
    ];
    while (bottomRight[0] <= 7 && bottomRight[1] <= 7) {
      const target = this.board.getCell(bottomRight);
      if (target && this.targetReachable(target)) cells.push(target);
      if (target?.piece) break;
      bottomRight[0] = bottomRight[0] + 1;
      bottomRight[1] = bottomRight[1] + 1;
    }

    const bottomLeft: [number, number] = [
      this.cell.coordinate[0] + 1,
      this.cell.coordinate[1] - 1,
    ];
    while (bottomLeft[0] <= 7 && bottomLeft[1] >= 0) {
      const target = this.board.getCell(bottomLeft);
      if (target && this.targetReachable(target)) cells.push(target);
      if (target?.piece) break;
      bottomLeft[0] = bottomLeft[0] + 1;
      bottomLeft[1] = bottomLeft[1] - 1;
    }

    return cells;
  }

  protected getVerticalHorizontalMoveOptions(): Cell[] {
    const cells: Cell[] = [];

    let top = this.cell.coordinate[0] - 1;
    while (top >= 0) {
      const target = this.board.getCell([top, this.cell.coordinate[1]]);
      if (target && this.targetReachable(target)) cells.push(target);
      if (target?.piece) break;
      top--;
    }

    let bottom = this.cell.coordinate[0] + 1;
    while (bottom <= 7) {
      const target = this.board.getCell([bottom, this.cell.coordinate[1]]);
      if (target && this.targetReachable(target)) cells.push(target);
      if (target?.piece) break;
      bottom++;
    }

    let left = this.cell.coordinate[1] - 1;
    while (left >= 0) {
      const target = this.board.getCell([this.cell.coordinate[0], left]);
      if (target && this.targetReachable(target)) cells.push(target);
      if (target?.piece) break;
      left--;
    }

    let right = this.cell.coordinate[1] + 1;
    while (right <= 7) {
      const target = this.board.getCell([this.cell.coordinate[0], right]);
      if (target && this.targetReachable(target)) cells.push(target);
      if (target?.piece) break;
      right++;
    }

    return cells;
  }
}

export default DiagonallyVerticallyHorizontallyMovingPiece;
