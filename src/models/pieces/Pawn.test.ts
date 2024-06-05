import Game from "../Game";
import Pawn from "./Pawn";
import PendingPromotion from "../PendingPromotion";
import PromotionPiece from "./PromotionPiece";
import Queen from "./Queen";
import { cellDict, move } from "../../test/utils";

let game = new Game();
let board = game.controller.board;

beforeEach(() => {
  game = new Game();
  board = game.controller.board;
});

describe("Pawn", () => {
  test("Initial moves", () => {
    expect.assertions(48);
    for (let i = 0; i <= 7; i++) {
      const cell = board.getCell([6, i]);
      if (cell && cell.piece instanceof Pawn) {
        expect(cell.piece.checkedMoveOptions.length).toBe(2);
        const c1 = board.getCell([5, i]);
        const c2 = board.getCell([4, i]);
        if (c1 && c2) {
          expect(cell.piece.checkedMoveOptions.includes(c1)).toBeTruthy();
          expect(cell.piece.checkedMoveOptions.includes(c2)).toBeTruthy();
        }
      }
    }
    const c = cellDict(board);
    move(c.e2, c.e4);
    for (let i = 0; i <= 7; i++) {
      const cell = board.getCell([1, i]);
      if (cell && cell.piece instanceof Pawn) {
        expect(cell.piece.checkedMoveOptions.length).toBe(2);
        const c1 = board.getCell([2, i]);
        const c2 = board.getCell([3, i]);
        if (c1 && c2) {
          expect(cell.piece.checkedMoveOptions.includes(c1)).toBeTruthy();
          expect(cell.piece.checkedMoveOptions.includes(c2)).toBeTruthy();
        }
      }
    }
  });

  test("Subsequent move options", () => {
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    expect(c.e4.piece?.moved).toBeTruthy();
    // d5
    move(c.d7, c.d5);
    let e4moveOptions = c.e4.piece?.checkedMoveOptions || [];
    expect(e4moveOptions.includes(c.d5)).toBeTruthy();
    expect(e4moveOptions.includes(c.e5)).toBeTruthy();
    // d4
    move(c.d2, c.d4);
    // f5
    move(c.f7, c.f5);
    e4moveOptions = c.e4.piece?.checkedMoveOptions || [];
    expect(e4moveOptions.includes(c.d5)).toBeTruthy();
    expect(e4moveOptions.includes(c.e5)).toBeTruthy();
    expect(e4moveOptions.includes(c.f5)).toBeTruthy();
  });

  test("En passant", () => {
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    // f6
    move(c.f7, c.f6);
    // e5
    move(c.e4, c.e5);
    // f5
    move(c.f6, c.f5);
    expect(c.e5.piece?.checkedMoveOptions.includes(c.f6)).toBeFalsy();
    // d4
    move(c.d2, c.d4);
    // d5
    move(c.d7, c.d5);
    expect(c.e5.piece?.checkedMoveOptions.includes(c.d6)).toBeTruthy();
    // exd6
    move(c.e5, c.d6);
    expect(c.d5.piece).toBeNull();
    expect(c.d6.piece).toBeInstanceOf(Pawn);
  });

  test("Promotion", () => {
    const c = cellDict(board);
    // e4
    move(c.e2, c.e4);
    // d5
    move(c.d7, c.d5);
    // exd5
    move(c.e4, c.d5);
    // c6
    move(c.c7, c.c6);
    // dxc6
    move(c.d5, c.c6);
    // f6
    move(c.f7, c.f6);
    // cxb7
    move(c.c6, c.b7);
    // f5
    move(c.f6, c.f5);
    // bxa8=Q
    move(c.b7, c.a8);
    expect(board.game.controller.pendingPromotion).toBeInstanceOf(
      PendingPromotion
    );
    expect(
      c.a8.promotionPiece instanceof PromotionPiece &&
        c.a7.promotionPiece instanceof PromotionPiece &&
        c.a6.promotionPiece instanceof PromotionPiece &&
        c.a5.promotionPiece instanceof PromotionPiece
    ).toBeTruthy();
    expect(c.a8.promotionPiece?.name).toBe("q");
    expect(c.a7.promotionPiece?.name).toBe("r");
    expect(c.a6.promotionPiece?.name).toBe("b");
    expect(c.a5.promotionPiece?.name).toBe("n");
    c.a8.promotionPiece?.onSelected();
    expect(c.b7.piece).toBeNull();
    expect(c.a8.piece).toBeInstanceOf(Queen);
    expect(c.a8.promotionPiece).toBeNull();
    expect(c.a7.promotionPiece).toBeNull();
    expect(c.a6.promotionPiece).toBeNull();
    expect(c.a5.promotionPiece).toBeNull();
  });
});
