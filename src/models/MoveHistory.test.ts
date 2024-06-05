import Game from "../models/Game";
import { move, cellDict } from "../test/utils";

let game = new Game();
let board = game.controller.board;

beforeEach(() => {
  game = new Game();
  board = game.controller.board;
});

describe("MoveHistory", () => {
  test("Printable moves", () => {
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    // c6
    move(c.c7, c.c6);
    // Qh5
    move(c.d1, c.h5);
    // Qc7
    move(c.d8, c.c7);
    // Bc4
    move(c.f1, c.c4);
    // b6
    move(c.b7, c.b6);
    // Qxf7+
    move(c.h5, c.f7);
    // Kd8
    move(c.e8, c.d8);
    // Qxf8x
    move(c.f7, c.f8);
    const moves = game.controller.movesHistory.printableMoves;
    expect(moves.length).toBe(5);
    expect(moves[0][0]).toBe("e4");
    expect(moves[0][1]).toBe("c6");
    expect(moves[1][0]).toBe("Qh5");
    expect(moves[1][1]).toBe("Qc7");
    expect(moves[2][0]).toBe("Bc4");
    expect(moves[2][1]).toBe("b6");
    expect(moves[3][0]).toBe("Qxf7+");
    expect(moves[3][1]).toBe("Kd8");
    expect(moves[4][0]).toBe("Qxf8x");
  });

  test("Check is visible", () => {
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    // c6
    move(c.c7, c.c6);
    // Qh5
    move(c.d1, c.h5);
    // Qc7
    move(c.d8, c.c7);
    // Bc4
    move(c.f1, c.c4);
    // b6
    move(c.b7, c.b6);
    // Qxf7+
    move(c.h5, c.f7);
    const king = game.controller.board.pieces.find(
      (p) => p.name === "k" && p.color === "b"
    )!;
    expect(king.cell.state).toBe("checked");
    // Kd8
    move(c.e8, c.d8);
    expect(king.cell.state).toBe("lastMove");
  });

  test("Navigate through moves", () => {
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    // e4
    move(c.c7, c.c6);
    // Qh5
    move(c.d1, c.h5);
    // Qc7
    move(c.d8, c.c7);
    // Bc4
    move(c.f1, c.c4);
    // b6
    move(c.b7, c.b6);
    // Qxf7+
    move(c.h5, c.f7);
    game.controller.movesHistory.goToStart();
    expect(game.controller.movesHistory.lastMove).toBeUndefined();
    game.controller.movesHistory.goForward();
    expect(
      game.controller.movesHistory.lastMove?.from.id === "E2" &&
        game.controller.movesHistory.lastMove?.to.id === "E4"
    ).toBeTruthy();
    game.controller.movesHistory.goForward();
    expect(
      game.controller.movesHistory.lastMove?.from.id === "C7" &&
        game.controller.movesHistory.lastMove?.to.id === "C6"
    ).toBeTruthy();
    game.controller.movesHistory.goBack();
    expect(
      game.controller.movesHistory.lastMove?.from.id === "E2" &&
        game.controller.movesHistory.lastMove?.to.id === "E4"
    ).toBeTruthy();
    game.controller.movesHistory.goToEnd();
    expect(
      game.controller.movesHistory.lastMove?.from.id === "H5" &&
        game.controller.movesHistory.lastMove?.to.id === "F7"
    ).toBeTruthy();
  });
});
