import Board from "../models/Board";
import Game from "../models/Game";
import Move from "../models/Move";
import MovesHistory from "../models/MovesHistory";
import PendingPromotion from "../models/PendingPromotion";
import { Color, GameEventPayload, GameEventType, Piece } from "../types";
import EventBridge from "./EventBridge";

class GameController {
  private readonly game: Game;
  public readonly board: Board;
  public readonly eventBridge: EventBridge;
  private activePlayer: Color = "b";
  public movesHistory: MovesHistory;
  public pendingPromotion: PendingPromotion | null = null;
  private gameOver: boolean = false;
  private pieceTouched: Piece | null = null;

  constructor(game: Game) {
    this.game = game;
    this.eventBridge = new EventBridge();
    this.board = new Board(this.game, this.eventBridge);
    this.movesHistory = new MovesHistory(this.board);
  }

  public init() {
    this.board.init();
    this.switchActivePlayer();
  }

  public get idlePlayer(): Color {
    return this.activePlayer === "b" ? "w" : "b";
  }

  public get lastMove(): Move {
    return this.movesHistory.lastMove;
  }

  public on(event: GameEventType, payload: GameEventPayload = {}): void {
    switch (event) {
      case "game:pieceMoved":
        this.onPieceMove(payload);
        break;
      case "game:promotionOptionSelected":
        this.pendingPromotion?.optionSelected(payload);
        this.pendingPromotion = null;
        break;
      case "game:switchActivePlayerPiecesDraggability":
        this.switchActivePlayerPiecesDraggability();
        break;
      case "game:switchActivePlayer":
        this.switchActivePlayer();
        break;
      case "game:addMove":
        if (payload.move instanceof Move) {
          this.movesHistory.addMove(payload.move, true);
        }
        break;
      case "game:checkMove":
        this.checkMove(payload);
        break;
      case "game:pieceTouched":
        if (payload.piece) {
          this.pieceTouched = payload.piece;
        }
        break;
      case "game:cellClicked":
        this.onCellClick(payload);
        break;
      default:
        throw new Error("Invalid event name");
    }
  }

  private onPieceMove(payload: GameEventPayload): void {
    if (payload.move instanceof Array) {
      const [piece, to] = payload.move;
      if (
        piece &&
        to &&
        piece.checkedMoveOptions.includes(to) &&
        piece.color === this.activePlayer
      ) {
        if (piece.name === "p" && [0, 7].includes(to.coordinate[0])) {
          this.pendingPromotion = new PendingPromotion(piece, to);
          return;
        }
        this.movesHistory.addMove(new Move(piece, to), true);
        this.switchActivePlayerPiecesDraggability();
        this.switchActivePlayer();
      } else if (piece) {
        piece.recenter();
      }
    }
  }

  private onCellClick(payload: GameEventPayload) {
    if (
      payload.cell &&
      this.pieceTouched?.checkedMoveOptions.includes(payload.cell)
    ) {
      this.eventBridge.addEvent(
        "piece:changeDraggability",
        this.pieceTouched?.draggabilityPayload
      );
      this.eventBridge.addEvent("cell:switchState", {
        include: this.pieceTouched.checkedMoveOptions,
        cellState: "default",
      });
      this.onPieceMove({ move: [this.pieceTouched, payload.cell] });
      this.pieceTouched = null;
    }
  }

  private switchActivePlayer(): void {
    this.activePlayer = this.idlePlayer;
    this.getPossibleMoves(this.idlePlayer);
    this.movesHistory.switchCheckVisibility();
    this.getPossibleMoves(this.activePlayer);
    if (!this.isGameOver) this.switchActivePlayerPiecesDraggability();
    this.movesHistory.switchCheckVisibility();
  }

  private switchActivePlayerPiecesDraggability(): void {
    this.eventBridge.addEvent("piece:changeDraggability", {
      include: this.board.pieces.filter(
        (piece) => piece.color === this.activePlayer
      ),
    });
  }

  private getPossibleMoves(color: Color): void {
    this.eventBridge.addEvent("piece:getMoveOptions", {
      include: this.board.pieces.filter((piece) => piece.color === color),
    });
  }

  private get isCheck(): boolean {
    const resultsContainer: Piece[] = [];
    this.eventBridge.addEvent("piece:detectCheck", {
      include: this.board.pieces.filter(
        (piece) => piece.color === this.idlePlayer
      ),
      resultsContainer,
    });
    return resultsContainer.length > 0;
  }

  private get activePlayerHasMoveOptions(): boolean {
    const resultsContainer: Piece[] = [];
    this.eventBridge.addEvent("piece:detectHasMoveOptions", {
      include: this.board.pieces.filter(
        (piece) => piece.color === this.activePlayer
      ),
      resultsContainer,
    });
    return resultsContainer.length > 0;
  }

  public get isGameOver(): boolean {
    if (this.gameOver) return true;
    if (
      this.movesHistory.isThreefoldRepetition(
        this.activePlayer,
        this.board.pieces
      )
    ) {
      this.movesHistory.setWinner(null);
      this.gameOver = true;
    }
    if (!this.activePlayerHasMoveOptions) {
      this.getPossibleMoves(this.idlePlayer);
      if (this.isCheck) {
        this.movesHistory.setWinner(this.idlePlayer);
      } else {
        this.movesHistory.setWinner(null);
      }
      this.gameOver = true;
    }
    return this.gameOver;
  }

  private checkMove(payload: GameEventPayload): void {
    if (payload.move instanceof Array && !this.gameOver) {
      const move: Move = new Move(...payload.move);
      this.movesHistory.addMove(move);
      this.getPossibleMoves(this.idlePlayer);
      if (!this.isCheck) {
        this.movesHistory.removeMove();
        move.piece.addCheckedMoveOption(payload.move[1]);
      } else {
        this.movesHistory.removeMove();
      }
    }
  }
}

export default GameController;
