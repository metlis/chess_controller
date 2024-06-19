import Board from "./Board";

class Base {
  public readonly board: Board;
  public hook: Function = (...args: any[]): any => {};

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
