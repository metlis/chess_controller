import Game from "../Game";
import { cellDict, move } from "../../test/utils";

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
});
