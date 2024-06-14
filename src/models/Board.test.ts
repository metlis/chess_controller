import Game from "./Game";

let game = new Game();
let board = game.controller.board;

beforeEach(() => {
  game = new Game();
  board = game.controller.board;
});

describe("Board", () => {
  test("Cells number", () => {
    expect(board.cells.length).toBe(64);
  });

  test("Pieces number", () => {
    expect(board.pieces.length).toBe(32);
  });

  test("Cell grid", () => {
    expect(board.cellGrid.length).toBe(8);
    expect(board.cellGrid[0][0].color).toBe("w");
    expect(board.colorOnTop).toBe("b");
    board.onRotate();
    expect(board.cellGrid[0][0].color).toBe("w");
    expect(board.colorOnTop).toBe("w");
  });

  test("Get cell", () => {
    const pieces = ["r", "n", "b", "q", "k", "b", "n", "r"];
    for (let i = 0; i <= 7; i++) {
      const cell = board.getCell([0, i]);
      expect(cell?.piece?.name).toBe(pieces[i]);
      expect(cell?.piece?.color).toBe("b");
    }
    for (let i = 0; i <= 7; i++) {
      const cell = board.getCell([1, i]);
      expect(cell?.piece?.name).toBe("p");
      expect(cell?.piece?.color).toBe("b");
    }
    for (let i = 0; i <= 7; i++) {
      const cell = board.getCell([7, i]);
      expect(cell?.piece?.name).toBe(pieces[i]);
      expect(cell?.piece?.color).toBe("w");
    }
    for (let i = 0; i <= 7; i++) {
      const cell = board.getCell([6, i]);
      expect(cell?.piece?.name).toBe("p");
      expect(cell?.piece?.color).toBe("w");
    }
    board.onRotate();
    const piecesReversed = ["r", "n", "b", "k", "q", "b", "n", "r"];
    for (let i = 0; i <= 7; i++) {
      const cell = board.getCell([0, i]);
      expect(cell?.piece?.name).toBe(piecesReversed[i]);
      expect(cell?.piece?.color).toBe("w");
    }
    for (let i = 0; i <= 7; i++) {
      const cell = board.getCell([1, i]);
      expect(cell?.piece?.name).toBe("p");
      expect(cell?.piece?.color).toBe("w");
    }
    for (let i = 0; i <= 7; i++) {
      const cell = board.getCell([7, i]);
      expect(cell?.piece?.name).toBe(piecesReversed[i]);
      expect(cell?.piece?.color).toBe("b");
    }
    for (let i = 0; i <= 7; i++) {
      const cell = board.getCell([6, i]);
      expect(cell?.piece?.name).toBe("p");
      expect(cell?.piece?.color).toBe("b");
    }
  });

  test("Get cell by ID", () => {
    let cell = board.getCellByID('A4');
    expect(cell?.id).toBe('A4');
    cell = board.getCellByID('b8');
    expect(cell?.id).toBe('B8');
    cell = board.getCellByID('C10');
    expect(cell).toBeNull();
  })
});
