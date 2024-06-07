import Game from "../Game";
import { cellDict, move } from "../../test/utils";
import King from "./King";

let game = new Game();
let board = game.controller.board;

beforeEach(() => {
  game = new Game();
  board = game.controller.board;
});

describe("Rook", () => {
  test("Initial position moves", () => {
    const c = cellDict(board);
    expect(c.a1.piece?.checkedMoveOptions.length).toBe(0);
  });

  test("Subsequent move options", () => {
    const c = cellDict(board);
    // a4
    move(c.a2, c.a4);
    // a6
    move(c.a7, c.a6);
    const a1Options = c.a1.piece?.checkedMoveOptions || [];
    expect(a1Options.length).toBe(2);
    expect(a1Options.includes(c.a2)).toBeTruthy();
    expect(a1Options.includes(c.a3)).toBeTruthy();
    // Ra3
    move(c.a1, c.a3);
    expect(c.a3.piece?.moved).toBeTruthy();
    // a5
    move(c.a6, c.a5);
    const a3Options = c.a3.piece?.checkedMoveOptions || [];
    expect(a3Options.length).toBe(9);
    expect(a3Options.includes(c.b3)).toBeTruthy();
    expect(a3Options.includes(c.c3)).toBeTruthy();
    expect(a3Options.includes(c.d3)).toBeTruthy();
    expect(a3Options.includes(c.e3)).toBeTruthy();
    expect(a3Options.includes(c.f3)).toBeTruthy();
    expect(a3Options.includes(c.g3)).toBeTruthy();
    expect(a3Options.includes(c.h3)).toBeTruthy();
    expect(a3Options.includes(c.a2)).toBeTruthy();
    expect(a3Options.includes(c.a1)).toBeTruthy();
    // Rb3
    move(c.a3, c.b3);
    // b5
    move(c.b7, c.b5);
    const b3Options = c.b3.piece?.checkedMoveOptions || [];
    expect(b3Options.length).toBe(9);
    expect(b3Options.includes(c.a3)).toBeTruthy();
    expect(b3Options.includes(c.c3)).toBeTruthy();
    expect(b3Options.includes(c.d3)).toBeTruthy();
    expect(b3Options.includes(c.e3)).toBeTruthy();
    expect(b3Options.includes(c.f3)).toBeTruthy();
    expect(b3Options.includes(c.g3)).toBeTruthy();
    expect(b3Options.includes(c.h3)).toBeTruthy();
    expect(b3Options.includes(c.b4)).toBeTruthy();
    expect(b3Options.includes(c.b5)).toBeTruthy();
  });

  test("Rook movement disables short castling", () => {
    expect.assertions(4);
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    // e5
    move(c.e7, c.e5);
    // Bc4
    move(c.f1, c.c4);
    // Bc5
    move(c.f8, c.c5);
    // Nf3
    move(c.g1, c.f3);
    // Nf6
    move(c.g8, c.f6);
    // Rg1
    move(c.h1, c.g1);
    // Rg8
    move(c.h8, c.g8);
    // Rh1
    move(c.g1, c.h1);
    // Rh8
    move(c.g8, c.h8);
    if (c.e1.piece instanceof King) {
      expect(c.e1.piece.longCastlingPossible).toBeTruthy();
      expect(c.e1.piece.shortCastlingPossible).toBeFalsy();
    }
    if (c.e8.piece instanceof King) {
      expect(c.e8.piece.longCastlingPossible).toBeTruthy();
      expect(c.e8.piece.shortCastlingPossible).toBeFalsy();
    }
  });

  test("Rook movement disables long castling", () => {
    expect.assertions(4);
    const c = cellDict(board);
    // d4
    move(c.d2, c.d4);
    // d5
    move(c.d7, c.d5);
    // Bf4
    move(c.c1, c.f4);
    // Bf5
    move(c.c8, c.f5);
    // Nc3
    move(c.b1, c.c3);
    // Nc6
    move(c.b8, c.c6);
    // Rc1
    move(c.a1, c.c1);
    // Rc8
    move(c.a8, c.c8);
    // Ra1
    move(c.c1, c.a1);
    // Ra8
    move(c.c8, c.a8);
    if (c.e1.piece instanceof King) {
      expect(c.e1.piece.longCastlingPossible).toBeFalsy();
      expect(c.e1.piece.shortCastlingPossible).toBeTruthy();
    }
    if (c.e8.piece instanceof King) {
      expect(c.e8.piece.longCastlingPossible).toBeFalsy();
      expect(c.e8.piece.shortCastlingPossible).toBeTruthy();
    }
  });
});
