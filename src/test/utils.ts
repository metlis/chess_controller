import Cell from "../models/Cell";
import Board from "../models/Board";

interface CellDict {
  [key: string]: Cell;
}

export function cellDict(board: Board): CellDict {
  const dict: CellDict = {};
  const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];

  for (let y = 1; y <= 8; y++) {
    for (let i = 0; i <= 7; i++) {
      const name: string = columns[i] + y;
      const cell = board.getCell([8 - y, i]);
      if (cell) {
        dict[name] = cell;
      }
    }
  }
  return dict;
}

export function move(from: Cell, to: Cell) {
  from.board.game.controller.on("game:pieceMoved", {
    move: [from.piece!, to],
  });
}
