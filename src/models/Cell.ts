import type {
  Color,
  Piece,
  PieceName,
  CellID,
  Coordinate,
  BoardEventType,
  BoardEventPayload,
  CellState,
} from "types";
import Base from "models/Base";
import Board from "models/Board";
import PromotionPiece from "models/pieces/PromotionPiece";
import Refreshable from "mixins/Refreshable";
import { COLUMN_LETTERS, ROW_NUMBERS } from "../constants";

class Cell extends Refreshable(Base) {
  public id: CellID;
  public readonly color: Color;
  public coordinate: Coordinate;
  public piece: Piece | null;
  public promotionPiece: PromotionPiece | null = null;
  public state: CellState = "default";

  constructor(color: Color, coordinate: Coordinate, board: Board) {
    super(board);
    this.id = `${COLUMN_LETTERS[coordinate[1]]}${ROW_NUMBERS[coordinate[0]]}`;
    this.color = color;
    this.coordinate = coordinate;
    this.piece = null;
  }

  public on(event: BoardEventType, payload: BoardEventPayload = {}): void {
    switch (event) {
      case "cell:switchState":
        this.switchState(payload);
        break;
      default:
        throw new Error("Invalid event name");
    }
  }

  private showPromotionOptions() {
    let pieceName: PieceName | null = null;
    let pieceColor: Color | null = null;
    if ([0, 7].includes(this.coordinate[0])) {
      pieceName = "q";
    } else if ([1, 6].includes(this.coordinate[0])) {
      pieceName = "r";
    } else if ([2, 5].includes(this.coordinate[0])) {
      pieceName = "b";
    } else if ([3, 4].includes(this.coordinate[0])) {
      pieceName = "n";
    }
    if (pieceName) {
      pieceColor =
        this.coordinate[0] < 4
          ? this.board.colorOnTop === "b"
            ? "w"
            : "b"
          : this.board.colorOnTop === "b"
          ? "b"
          : "w";
      this.promotionPiece = new PromotionPiece(pieceColor, pieceName, this);
      this.refreshComponent();
    }
  }

  private hidePromotionOptions() {
    this.promotionPiece = null;
  }

  public onClick() {
    this.eventBridge.addEvent("game:cellClicked", { cell: this });
  }

  private switchState(payload: BoardEventPayload = {}) {
    if (payload.cellState) {
      if (payload.cellState === "promotionOption") {
        this.showPromotionOptions();
      } else if (
        payload.cellState === "default" &&
        this.state === "promotionOption"
      ) {
        this.hidePromotionOptions();
      }
      this.state = payload.cellState;
      this.refreshComponent();
    }
  }
}

export default Cell;
