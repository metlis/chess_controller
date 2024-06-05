import Game from "../Game";
import { cellDict, move } from "../../test/utils";

let game = new Game();
let board = game.controller.board;

beforeEach(() => {
  game = new Game();
  board = game.controller.board;
});

describe("Queen", () => {
  test("Initial position moves", () => {
    const c = cellDict(board);
    expect(c.d1.piece?.checkedMoveOptions.length).toBe(0);
  });

  test("Subsequent move options", () => {
    const c = cellDict(board);
    // d4
    move(c.d2, c.d4);
    // a6
    move(c.a7, c.a6);
    const d1Options = c.d1.piece?.checkedMoveOptions || [];
    expect(d1Options.length).toBe(2);
    expect(d1Options.includes(c.d2)).toBeTruthy();
    expect(d1Options.includes(c.d3)).toBeTruthy();
    // Qd3
    move(c.d1, c.d3);
    expect(c.d3.piece?.moved).toBeTruthy();
    // a5
    move(c.a6, c.a5);
    const d3Options = c.d3.piece?.checkedMoveOptions || [];
    expect(d3Options.length).toBe(16);
    expect(d3Options.includes(c.a6)).toBeTruthy();
    expect(d3Options.includes(c.a3)).toBeTruthy();
    expect(d3Options.includes(c.b5)).toBeTruthy();
    expect(d3Options.includes(c.b3)).toBeTruthy();
    expect(d3Options.includes(c.c3)).toBeTruthy();
    expect(d3Options.includes(c.c4)).toBeTruthy();
    expect(d3Options.includes(c.d2)).toBeTruthy();
    expect(d3Options.includes(c.d1)).toBeTruthy();
    expect(d3Options.includes(c.e3)).toBeTruthy();
    expect(d3Options.includes(c.e4)).toBeTruthy();
    expect(d3Options.includes(c.f5)).toBeTruthy();
    expect(d3Options.includes(c.f3)).toBeTruthy();
    expect(d3Options.includes(c.g3)).toBeTruthy();
    expect(d3Options.includes(c.g6)).toBeTruthy();
    expect(d3Options.includes(c.h7)).toBeTruthy();
    expect(d3Options.includes(c.h3)).toBeTruthy();
  });
});
