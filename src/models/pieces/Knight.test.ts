import Game from "../Game";
import { cellDict, move } from "../../test/utils";

let game = new Game();
let board = game.controller.board;

beforeEach(() => {
  game = new Game();
  board = game.controller.board;
});

describe("Knight", () => {
  test("Initial position moves", () => {
    const c = cellDict(board);
    const b1Options = c.b1.piece?.checkedMoveOptions || [];
    expect(b1Options.length).toBe(2);
    expect(b1Options.includes(c.a3)).toBeTruthy();
    expect(b1Options.includes(c.c3)).toBeTruthy();
  });

  test("Subsequent move options", () => {
    const c = cellDict(board);
    // Nc3
    move(c.b1, c.c3);
    // a6
    move(c.a7, c.a6);
    expect(c.c3.piece?.moved).toBeTruthy();
    const c3Options = c.c3.piece?.checkedMoveOptions || [];
    expect(c3Options.length).toBe(5);
    expect(c3Options.includes(c.b1)).toBeTruthy();
    expect(c3Options.includes(c.a4)).toBeTruthy();
    expect(c3Options.includes(c.b5)).toBeTruthy();
    expect(c3Options.includes(c.d5)).toBeTruthy();
    expect(c3Options.includes(c.e4)).toBeTruthy();
    // Nd5
    move(c.c3, c.d5);
    // a5
    move(c.a6, c.a5);
    const d5Options = c.d5.piece?.checkedMoveOptions || [];
    expect(d5Options.length).toBe(8);
    expect(d5Options.includes(c.e7)).toBeTruthy();
    expect(d5Options.includes(c.f6)).toBeTruthy();
    expect(d5Options.includes(c.f4)).toBeTruthy();
    expect(d5Options.includes(c.e3)).toBeTruthy();
    expect(d5Options.includes(c.c3)).toBeTruthy();
    expect(d5Options.includes(c.b4)).toBeTruthy();
    expect(d5Options.includes(c.b6)).toBeTruthy();
    expect(d5Options.includes(c.c7)).toBeTruthy();
  });
});
