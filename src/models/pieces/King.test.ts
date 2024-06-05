import Game from "../Game";
import { cellDict, move } from "../../test/utils";
import King from "./King";
import Rook from "./Rook";

let game = new Game();
let board = game.controller.board;

beforeEach(() => {
  game = new Game();
  board = game.controller.board;
});

describe("King", () => {
  test("Initial position moves", () => {
    const c = cellDict(board);
    expect(c.e1.piece?.checkedMoveOptions.length).toBe(0);
  });

  test("Subsequent move options", () => {
    expect.assertions(24);
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    // a6
    move(c.a7, c.a6);
    const e1Options = c.e1.piece?.checkedMoveOptions || [];
    expect(e1Options.length).toBe(1);
    expect(e1Options.includes(c.e2)).toBeTruthy();
    if (c.e1.piece instanceof King) {
      expect(c.e1.piece.longCastlingPossible).toBeTruthy();
      expect(c.e1.piece.shortCastlingPossible).toBeTruthy();
    }
    // Ke2
    move(c.e1, c.e2);
    expect(c.e2.piece?.moved).toBeTruthy();
    if (c.e2.piece instanceof King) {
      expect(c.e2.piece.longCastlingPossible).toBeFalsy();
      expect(c.e2.piece.shortCastlingPossible).toBeFalsy();
    }
    // a5
    move(c.a6, c.a5);
    const e2Options = c.e2.piece?.checkedMoveOptions || [];
    expect(e2Options.length).toBe(4);
    expect(e2Options.includes(c.e1)).toBeTruthy();
    expect(e2Options.includes(c.e3)).toBeTruthy();
    expect(e2Options.includes(c.d3)).toBeTruthy();
    expect(e2Options.includes(c.f3)).toBeTruthy();
    // Ke3
    move(c.e2, c.e3);
    // a4
    move(c.a5, c.a4);
    let e3Options = c.e3.piece?.checkedMoveOptions || [];
    expect(e3Options.length).toBe(5);
    expect(e3Options.includes(c.d3)).toBeTruthy();
    expect(e3Options.includes(c.d4)).toBeTruthy();
    expect(e3Options.includes(c.e2)).toBeTruthy();
    expect(e3Options.includes(c.f3)).toBeTruthy();
    expect(e3Options.includes(c.f4)).toBeTruthy();
    // f3
    move(c.f2, c.f3);
    // a3
    move(c.a4, c.a3);
    // d3
    move(c.d2, c.d3);
    // b6
    move(c.b7, c.b6);
    e3Options = c.e3.piece?.checkedMoveOptions || [];
    expect(e3Options.length).toBe(5);
    expect(e3Options.includes(c.d4)).toBeTruthy();
    expect(e3Options.includes(c.d2)).toBeTruthy();
    expect(e3Options.includes(c.e2)).toBeTruthy();
    expect(e3Options.includes(c.f4)).toBeTruthy();
    expect(e3Options.includes(c.f2)).toBeTruthy();
  });

  test("Impossible move because of check", () => {
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    // d5
    move(c.d7, c.d5);
    // exd5
    move(c.e4, c.d5);
    // e6
    move(c.e7, c.e6);
    // Qe2
    move(c.d1, c.e2);
    const e6Options = c.e6.piece?.checkedMoveOptions || [];
    expect(e6Options.length).toBe(1);
    expect(e6Options.includes(c.e5)).toBeTruthy();
  });

  test("Short castling successful", () => {
    expect.assertions(8);
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    // a6
    move(c.a7, c.a6);
    // Nf3
    move(c.g1, c.f3);
    // a5
    move(c.a6, c.a5);
    // Bc4
    move(c.f1, c.c4);
    // a4
    move(c.a5, c.a4);
    const e1Options = c.e1.piece?.checkedMoveOptions || [];
    expect(e1Options.length).toBe(3);
    expect(e1Options.includes(c.e2)).toBeTruthy();
    expect(e1Options.includes(c.f1)).toBeTruthy();
    expect(e1Options.includes(c.g1)).toBeTruthy();
    // 0-0
    move(c.e1, c.g1);
    expect(c.g1.piece).toBeInstanceOf(King);
    expect(c.f1.piece).toBeInstanceOf(Rook);
    if (c.g1.piece instanceof King) {
      expect(c.g1.piece.shortCastlingPossible).toBeFalsy();
      expect(c.g1.piece.longCastlingPossible).toBeFalsy();
    }
  });

  test("Short castling blocked", () => {
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    // b6
    move(c.b7, c.b6);
    // Ba6
    move(c.f1, c.a6);
    // Bxa6
    move(c.c8, c.a6);
    // Nf3
    move(c.g1, c.f3);
    // c6
    move(c.c7, c.c6);
    expect(c.e1.piece?.checkedMoveOptions.length).toBe(0);
  })

  test("Long castling successful", () => {
    expect.assertions(8);
    const c = cellDict(board);
    // d4
    move(c.d2, c.d4);
    // a6
    move(c.a7, c.a6);
    // Be3
    move(c.c1, c.e3);
    // a5
    move(c.a6, c.a5);
    // Nc3
    move(c.b1, c.c3);
    // a4
    move(c.a5, c.a4);
    // Qd3
    move(c.d1, c.d3);
    // a3
    move(c.a4, c.a3);
    const e1Options = c.e1.piece?.checkedMoveOptions || [];
    expect(e1Options.length).toBe(3);
    expect(e1Options.includes(c.d1)).toBeTruthy();
    expect(e1Options.includes(c.d2)).toBeTruthy();
    expect(e1Options.includes(c.c1)).toBeTruthy();
    // 0-0-0
    move(c.e1, c.c1);
    expect(c.c1.piece).toBeInstanceOf(King);
    expect(c.d1.piece).toBeInstanceOf(Rook);
    if (c.c1.piece instanceof King) {
      expect(c.c1.piece.shortCastlingPossible).toBeFalsy();
      expect(c.c1.piece.longCastlingPossible).toBeFalsy();
    }
  });

  test("Long castling blocked", () => {
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    // d5
    move(c.d7, c.d5);
    // d4
    move(c.d2, c.d4);
    // Bg4
    move(c.c8, c.g4);
    // Qd3
    move(c.d1, c.d3);
    // e5
    move(c.e7, c.e5);
    // Nc3
    move(c.b1, c.c3);
    // f5
    move(c.f7, c.f5);
    // Bg5
    move(c.c1, c.g5);
    // c5
    move(c.c7, c.c5);
    const e1Options = c.e1.piece?.checkedMoveOptions || [];
    expect(e1Options.length).toBe(1);
    expect(e1Options.includes(c.d2)).toBeTruthy();
  });

  test("Check and mate", () => {
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
    const e8Options = c.e8.piece?.checkedMoveOptions || [];
    expect(game.controller.movesHistory.lastMove?.check).toBeTruthy();
    expect(e8Options.length).toBe(1);
    expect(e8Options.includes(c.d8)).toBeTruthy();
    let blackPieces = board.pieces.filter(
      (p) => p.color === "b" && p.name !== "k"
    );
    expect(
      blackPieces.every((p) => p.checkedMoveOptions.length === 0)
    ).toBeTruthy();
    // Kd8
    move(c.e8, c.d8);
    // Qxf8x
    move(c.f7, c.f8);
    expect(game.controller.movesHistory.lastMove?.mate).toBeTruthy();
    blackPieces = board.pieces.filter((p) => p.color === "b");
    expect(
      blackPieces.every((p) => p.checkedMoveOptions.length === 0)
    ).toBeTruthy();
  });
});
