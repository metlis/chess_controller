import Board from "models/Board";

class Base {
  public readonly board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  public get eventBridge() {
    return this.board.eventBridge;
  }

  public get gameController() {
    return this.board.game.controller;
  }
}

export default Base;
