import Base from "./Base";
import Piece from "./pieces/Piece";
import Cell from "./Cell";
import PieceFactory from "./PieceFactory";
import Move from "./Move";
import { GameEventPayload, Row } from "../types";

class PendingPromotion extends Base {
  private readonly piece: Piece;
  private readonly prevToPiece: Piece | null;
  private readonly from: Cell;
  private readonly to: Cell;
  private promotionCells: Cell[] = [];
  public undone: boolean = false;

  constructor(piece: Piece, to: Cell) {
    super(to.board);
    this.piece = piece;
    this.to = to;
    this.from = piece.cell;
    this.prevToPiece = to.piece;
    this.init();
  }

  private init() {
    const promotionCells: Cell[] = [];
    let rows: Row[] = this.to.coordinate[0] === 0 ? [0, 1, 2, 3] : [4, 5, 6, 7];
    rows.forEach((i) => {
      const cell = this.piece.board.getCell([i, this.to.coordinate[1]]);
      if (cell) {
        promotionCells.push(cell);
      }
    });
    this.promotionCells = promotionCells;
    this.from.piece = null;
    this.from.hook("cell:update");
    this.showOptions();
  }

  private showOptions() {
    this.eventBridge.addEvent("game:switchActivePlayerPiecesDraggability");
    this.eventBridge.addEvent("cell:switchState", {
      include: this.promotionCells,
      cellState: "promotionOption",
    });
  }

  public optionSelected(payload: GameEventPayload) {
    this.eventBridge.addEvent("cell:switchState", {
      include: this.promotionCells,
      cellState: "default",
    });
    if (payload.promotion) {
      const piece: Piece = new PieceFactory().create(
        payload.promotion.name,
        payload.promotion.color,
        this.to
      );
      const move: Move = new Move(piece, this.to, {
        from: this.from,
        piece: this.piece,
        prevToPiece: this.prevToPiece,
      });
      this.eventBridge.addEvent("game:addMove", { move });
      this.eventBridge.addEvent("game:switchActivePlayer");
    }
  }

  public undo() {
    this.from.piece = this.piece;
    this.piece.cell = this.from;
    this.to.piece = this.prevToPiece;
    this.undone = true;
    this.from.hook("cell:update");
    this.eventBridge.addEvent("cell:switchState", {
      include: this.promotionCells,
      cellState: "default",
    });
    this.eventBridge.addEvent("piece:changeDraggability", {
      include: [this.piece],
    });
  }

  public redo() {
    this.init();
    this.undone = false;
  }
}

export default PendingPromotion;
