import GameController from "../controllers/GameController";

class Game {
  public controller: GameController;

  public constructor() {
    this.controller = new GameController(this);
    this.controller.init();
  }
}

export default Game;
