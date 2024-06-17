import Base from "../Base";
import Cell from "../Cell";
import Refreshable from "../../mixins/Refreshable";
import {
  Color,
  BoardEventPayload,
  BoardEventType,
  PieceCode,
  PieceName,
} from "../../types";

abstract class Piece extends Refreshable(Base) {
  public cell: Cell;
  public readonly color: Color;
  public readonly name: PieceName;
  public readonly code: PieceCode;
  public moved: boolean = false;
  public moveOptions: Cell[] = [];
  public checkedMoveOptions: Cell[] = [];
  public draggable: boolean = false;
  private touched: boolean = false;

  protected constructor(color: Color, cell: Cell, name: PieceName) {
    super(cell.board);
    this.cell = cell;
    this.color = color;
    this.name = name;
    this.code = `${name}_${color}`;
    cell.piece = this;
  }

  abstract getMoveOptions(): Cell[];

  public on(event: BoardEventType, payload: BoardEventPayload = {}): void {
    switch (event) {
      case "piece:changeDraggability":
        this.changeDraggability(this.refreshComponent.bind(this));
        break;
      case "piece:getMoveOptions":
        this.getMoveOptions();
        this.checkMoveOptions();
        break;
      case "piece:detectCheck":
        this.detectCheck(payload);
        break;
      case "piece:detectHasMoveOptions":
        this.detectHasMoveOptions(payload);
        break;
      default:
        throw new Error("Invalid event name");
    }
  }

  private changeDraggability(callback: Function = () => null): void {
    this.draggable = !this.draggable;
    this.touched = false;
    callback();
  }

  public get draggabilityPayload(): BoardEventPayload {
    return {
      exclude: [
        this,
        ...this.board.pieces.filter((piece) => piece.color !== this.color),
      ],
    };
  }

  public onDragStart(): void {
    if (this.touched) return;
    this.eventBridge.addEvent(
      "piece:changeDraggability",
      this.draggabilityPayload
    );
    this.eventBridge.addEvent("cell:switchState", {
      include: this.checkedMoveOptions,
      cellState: "moveOption",
    });
  }

  public onDragStop(offset: { x: number; y: number }): void {
    const to = this.board.getCell([
      this.cell.coordinate[0] + offset.y,
      this.cell.coordinate[1] + offset.x,
    ]);
    if (!to) {
      this.recenter();
      return;
    }
    if (this.isTouchedAndNotMovedCorrectly(to)) {
      this.recenter();
      this.touched = true;
      this.eventBridge.addEvent("game:pieceTouched", { piece: this });
      return;
    }
    this.eventBridge.addEvent(
      "piece:changeDraggability",
      this.draggabilityPayload
    );
    this.eventBridge.addEvent("cell:switchState", {
      include: this.checkedMoveOptions,
      cellState: "default",
    });
    this.eventBridge.addEvent("game:pieceMoved", { move: [this, to] });
  }

  private isTouchedAndNotMovedCorrectly(to: Cell): boolean {
    if (this.checkedMoveOptions.length) {
      if (
        to === this.cell ||
        (to !== this.cell && !this.checkedMoveOptions.includes(to))
      ) {
        return true;
      }
    }
    return false;
  }

  public recenter(): void {
    this.draggable = false;
    this.refreshComponent();
    setTimeout(() => {
      this.draggable = true;
      this.refreshComponent();
    }, 0);
  }

  protected checkMoveOptions() {
    if (this.color === this.gameController.idlePlayer) return;
    this.checkedMoveOptions = [];
    this.moveOptions.forEach((option) =>
      this.eventBridge.addEvent("game:checkMove", { move: [this, option] })
    );
  }

  public addCheckedMoveOption(option: Cell) {
    this.checkedMoveOptions.push(option);
  }

  public detectCheck(payload: BoardEventPayload = {}) {
    this.moveOptions.forEach((option) => {
      if (option.piece?.name === "k" && payload.resultsContainer) {
        payload.resultsContainer.push(this);
        return;
      }
    });
  }

  public detectHasMoveOptions(payload: BoardEventPayload = {}) {
    if (this.checkedMoveOptions.length && payload.resultsContainer) {
      payload.resultsContainer.push(this);
    }
  }
}

export default Piece;
