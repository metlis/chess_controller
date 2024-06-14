import { checkMoveHistoryStr } from "./moveChecker";

describe("Move checker", () => {
  test("Whites win", () => {
    expect(checkMoveHistoryStr("e4,e5;Qh5,Bc5;Bc4,Nf6;Qxf7x")).toBeTruthy();
  });

  test("Blacks win", () => {
    expect(checkMoveHistoryStr("e4,e5;Bc4,Bc5;Nf3,Qh4;Nc3,Qxf2x")).toBeTruthy();
  });

  test("Check", () => {
    expect(checkMoveHistoryStr("e4,e5;Bc4,Bc5;Qh5,Qh4;Qxf7+,Kd8")).toBeTruthy();
  });

  test("Incorrect pawn moves sequence", () => {
    expect(checkMoveHistoryStr("e4,e5;e5")).toBeFalsy();
  });

  test("Incorrect enpassant", () => {
    expect(checkMoveHistoryStr("e4,d6;e5,d5;exd6")).toBeFalsy();
  });

  test("Correct short castling", () => {
    expect(checkMoveHistoryStr("e4,e5;Bc4,Bc5;Nf3,Nf6;0-0,0-0")).toBeTruthy();
  });

  test("Incorrect short castling", () => {
    expect(checkMoveHistoryStr("e4,b6;Ba6,Bxa6;Nf3,Nf6;0-0")).toBeFalsy();
  });

  test("Correct long castling", () => {
    expect(
      checkMoveHistoryStr("d4,d5;Bf4,Bf5;Nc3,Nc6;Qd3,Qd6;0-0-0,0-0-0")
    ).toBeTruthy();
  });

  test("Incorrect long castling", () => {
    expect(
      checkMoveHistoryStr("e4,d5;Nc3,c5;Qg4,Bxg4;d4,c4;Bg5,Nf6;0-0-0")
    ).toBeFalsy();
  });

  test("Piece promotion", () => {
    expect(
      checkMoveHistoryStr("a4,b5;axb5,a6;bxa6,Bb7;axb7,Nc6;bxa8=Q")
    ).toBeTruthy();
  });

  test("Piece promotion with mate", () => {
    expect(
      checkMoveHistoryStr("h4,g5;hxg5,h6;gxh6,Bg7;hxg7,Nf6;Rh2,Ne4;gxh8=Qx")
    ).toBeTruthy();
  });

  test("Knight long notation", () => {
    expect(
      checkMoveHistoryStr("Nf3,Nf6;Nc3,Nc6;Nb5,Ng4;Nbd4,Nce5")
    ).toBeTruthy();
  });

  test("Knight long notation 2", () => {
    expect(checkMoveHistoryStr("Nf3,d5;Nc3,d4;Nb5,Nf6;Nbxd4")).toBeTruthy();
  });

  test("Pawn long notation", () => {
    expect(checkMoveHistoryStr("e4,d5;c4,e5;exd5,c5;d6")).toBeTruthy();
  });

  test("Incorrect syntax 1", () => {
    expect(checkMoveHistoryStr("e4,e5,Bc4,Bc5;Nf3,Nf6;0-0,0-0")).toBeFalsy();
  });

  test("Incorrect syntax 2", () => {
    expect(checkMoveHistoryStr("e4;e5,Bc4,Bc5;Nf3,Nf6;0-0,0-0")).toBeFalsy();
  });

  test("Incorrect syntax 3", () => {
    expect(checkMoveHistoryStr("e4;e5;Bc4,Bc5;Nf3,Nf6;0-0,0-0")).toBeFalsy();
  });

  test("Incorrect syntax 4", () => {
    expect(checkMoveHistoryStr("e4;e5;Bc4,Bc5;Nf3,Nf6;0-0,0-0;")).toBeFalsy();
  });

  test("Empty string", () => {
    expect(checkMoveHistoryStr("")).toBeFalsy();
  });

  test("Incorrect cells", () => {
    expect(checkMoveHistoryStr("e4;e9;Bc4,Bc5;Nf3,Nf6")).toBeFalsy();
  });
});
