import Game from "../models/Game";
import { move, cellDict } from "../test/utils";

let game = new Game();
let board = game.controller.board;

beforeEach(() => {
  game = new Game();
  board = game.controller.board;
});

describe("GameController", () => {
  test("Idle player", () => {
    expect(game.controller.idlePlayer).toBe("b");
  });

  test("Idle player changed", () => {
    const c = cellDict(board);
    move(c.e2, c.e4);
    expect(game.controller.idlePlayer).toBe("w");
  });

  test("Whites win", () => {
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    // e5
    move(c.e7, c.e5);
    // Qh5
    move(c.d1, c.h5);
    // h6
    move(c.h7, c.h6);
    // Bc4
    move(c.f1, c.c4);
    // Bc5
    move(c.f8, c.c5);
    // Qxf7x
    move(c.h5, c.f7);
    expect(game.controller.isGameOver).toBeTruthy();
    expect(game.controller.movesHistory.winner).toBe("w");
  });

  test("Blacks win", () => {
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    // e5
    move(c.e7, c.e5);
    // Nf3
    move(c.g1, c.f3);
    // Qh4
    move(c.d8, c.h4);
    // Nc3
    move(c.b1, c.c3);
    // Bc5
    move(c.f8, c.c5);
    // Bc4
    move(c.f1, c.c4);
    // Qxf2x
    move(c.h4, c.f2);
    expect(game.controller.isGameOver).toBeTruthy();
    expect(game.controller.movesHistory.winner).toBe("b");
  });

  test("Draw", () => {
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    // e4
    move(c.d7, c.d6);
    // Qh5
    move(c.d1, c.h5);
    // Kd7
    move(c.e8, c.d7);
    // Qh7
    move(c.h5, c.h7);
    // Kc6
    move(c.d7, c.c6);
    // Qh8
    move(c.h7, c.h8);
    // Kc6
    move(c.c6, c.b6);
    // Qg8
    move(c.h8, c.g8);
    // Ka5
    move(c.b6, c.a5);
    // Qg7
    move(c.g8, c.g7);
    // Kb6
    move(c.a5, c.b6);
    // Qf8
    move(c.g7, c.f8);
    // Ka5
    move(c.b6, c.a5);
    // Qf7
    move(c.f8, c.f7);
    // Kb6
    move(c.a5, c.b6);
    // Qe7
    move(c.f7, c.e7);
    // Ka5
    move(c.b6, c.a5);
    // Qd8
    move(c.e7, c.d8);
    // Kb6
    move(c.a5, c.b6);
    // Qc8
    move(c.d8, c.c8);
    // Ka5
    move(c.b6, c.a5);
    // Qb8
    move(c.c8, c.b8);
    // Kb6
    move(c.a5, c.b6);
    // Qa8
    move(c.b8, c.a8);
    // Ka5
    move(c.b6, c.a5);
    // Qa7+
    move(c.a8, c.a7);
    // Kb4
    move(c.a5, c.b4);
    // Qa7+
    move(c.a7, c.b7);
    // Ka4
    move(c.b4, c.a4);
    // Qc7
    move(c.b7, c.c7);
    // Kb4
    move(c.a4, c.b4);
    // Qd6
    move(c.c7, c.d6);
    // Ka4
    move(c.b4, c.a4);
    // Qc5
    move(c.d6, c.c5);
    expect(game.controller.isGameOver).toBeTruthy();
    expect(game.controller.movesHistory.winner).toBeNull();
  });

  test("Impossible move", () => {
    const c = cellDict(board);
    move(c.e2, c.e5);
    expect(game.controller.movesHistory.lastMove).toBeUndefined();
  });

  test("Player moving twice fail", () => {
    const c = cellDict(board);
    move(c.e2, c.e4);
    move(c.e4, c.e5);
    const lastMove = game.controller.lastMove;
    expect(lastMove.from).toEqual(c.e2);
    expect(lastMove.to).toEqual(c.e4);
    expect(lastMove.piece).toEqual(c.e4.piece);
    expect(game.controller.idlePlayer).toBe("w");
  });

  test("Threefold repetition", () => {
    const c = cellDict(board);
    // Nf3
    move(c.g1, c.f3);
    // Nf6
    move(c.g8, c.f6);
    // Nd4
    move(c.f3, c.d4);
    // Nd5
    move(c.f6, c.d5);
    // Nf3
    move(c.d4, c.f3);
    // Nf6
    move(c.d5, c.f6);
    // Nd4
    move(c.f3, c.d4);
    // Nd5
    move(c.f6, c.d5);
    // Nf3
    move(c.d4, c.f3);
    // Nf6
    move(c.d5, c.f6);
    expect(game.controller.isGameOver).toBeTruthy();
    expect(game.controller.movesHistory.winner).toBeNull();
  });
});
