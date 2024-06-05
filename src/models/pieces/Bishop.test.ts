import Game from "../Game";
import { cellDict, move } from "../../test/utils";

let game = new Game();
let board = game.controller.board;

beforeEach(() => {
  game = new Game();
  board = game.controller.board;
});

describe("Bishop", () => {
  test("Initial position moves", () => {
    const c = cellDict(board);
    expect(c.f1.piece?.checkedMoveOptions.length).toBe(0);
  });

  test("Subsequent move options", () => {
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    // e5
    move(c.e7, c.e5);
    const f1Options = c.f1.piece?.checkedMoveOptions || [];
    expect(f1Options.length).toBe(5);
    expect(f1Options.includes(c.e2)).toBeTruthy();
    expect(f1Options.includes(c.d3)).toBeTruthy();
    expect(f1Options.includes(c.c4)).toBeTruthy();
    expect(f1Options.includes(c.b5)).toBeTruthy();
    expect(f1Options.includes(c.a6)).toBeTruthy();
    // Bc4
    move(c.f1, c.c4);
    // f5
    move(c.f7, c.f5);
    expect(c.c4.piece?.moved).toBeTruthy();
    const c4Options = c.c4.piece?.checkedMoveOptions || [];
    expect(c4Options.length).toBe(10);
    expect(c4Options.includes(c.a6)).toBeTruthy();
    expect(c4Options.includes(c.b5)).toBeTruthy();
    expect(c4Options.includes(c.b3)).toBeTruthy();
    expect(c4Options.includes(c.d5)).toBeTruthy();
    expect(c4Options.includes(c.e6)).toBeTruthy();
    expect(c4Options.includes(c.f7)).toBeTruthy();
    expect(c4Options.includes(c.g8)).toBeTruthy();
    expect(c4Options.includes(c.d3)).toBeTruthy();
    expect(c4Options.includes(c.e2)).toBeTruthy();
    expect(c4Options.includes(c.f1)).toBeTruthy();
  });
});
