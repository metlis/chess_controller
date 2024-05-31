import Board from "models/Board";
import Game from "models/Game";
import EventBridge from "controllers/EventBridge";

export function start(): void {
  const game = new Game();
  const eventBridge = new EventBridge();
  const board = new Board(game, eventBridge);
  board.init();
  console.log("Board cells: ", board.cells);
}

start();
