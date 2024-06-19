import Cell from "./Cell";
import Piece from "./pieces/Piece";
import Game from "./Game";
import PieceFactory from "./PieceFactory";
import EventBridge from "../controllers/EventBridge";
import {
  Color,
  Coordinate,
  PieceName,
  Row,
  Column,
  ColumnLetter,
  PiecesCoordinates,
} from "../types";
import { PIECES_COORDINATES, COLUMN_LETTERS, AXIS_VALUES } from "../constants";

class Board {
  public game: Game;
  public readonly cellGrid: Cell[][] = [];
  private readonly piecesCoordinates: PiecesCoordinates = PIECES_COORDINATES;
  public readonly columnLetters: ColumnLetter[] = COLUMN_LETTERS;
  public eventBridge: EventBridge;
  public colorOnTop: Color;
  public hook: Function = (...args: any[]): any => {};

  public constructor(
    game: Game,
    eventBridge: EventBridge,
    colorOnTop: Color = "b"
  ) {
    this.game = game;
    this.eventBridge = eventBridge.init(this);
    this.colorOnTop = colorOnTop;
  }

  public init() {
    this.createCells();
    this.populateCells();
    if (this.colorOnTop === "w") {
      this.rotateBoard();
    }
    this.hook("board:init");
  }

  public get cells() {
    const cells: Cell[] = [];
    for (let row of this.cellGrid) {
      row.forEach((cell) => cells.push(cell));
    }
    return cells;
  }

  public get pieces() {
    const pieces: Piece[] = [];
    for (let row of this.cellGrid) {
      row.forEach((cell) => {
        if (cell.piece) {
          pieces.push(cell.piece);
        }
      });
    }
    return pieces;
  }

  private createCells(): Cell[][] {
    let color: Color = "w";
    const rows: Row[] = AXIS_VALUES;
    const columns: Column[] = AXIS_VALUES;
    for (let row of rows) {
      this.cellGrid[row] = [];
      for (let column of columns) {
        const coordinate: Coordinate = [row, column];
        this.cellGrid[row][column] = new Cell(color, coordinate, this);
        if (column !== 7) {
          color = color === "w" ? "b" : "w";
        }
      }
    }
    return this.cellGrid;
  }

  private populateCells(): Cell[][] {
    const factory: PieceFactory = new PieceFactory();
    let p: PieceName;
    for (p in this.piecesCoordinates) {
      const coordinates: Coordinate[] = this.piecesCoordinates[p];
      // eslint-disable-next-line no-loop-func
      coordinates.forEach(([y, x]: Coordinate, index) => {
        const color: Color = index < coordinates.length / 2 ? "b" : "w";
        factory.create(p, color, this.cellGrid[y][x]);
      });
    }
    return this.cellGrid;
  }

  private rotateBoard(): Cell[][] {
    const rows: Row[] = AXIS_VALUES;
    const columns: Column[] = AXIS_VALUES;
    this.cellGrid.reverse();
    for (let row of rows) {
      this.cellGrid[row].reverse();
      for (let column of columns) {
        this.cellGrid[row][column].coordinate = [row, column];
      }
    }
    return this.cellGrid;
  }

  public getCell(coordinate: [number, number]): Cell | null {
    if (
      coordinate[0] < 0 ||
      coordinate[0] > 7 ||
      coordinate[1] < 0 ||
      coordinate[1] > 7
    ) {
      return null;
    }
    return this.cellGrid[coordinate[0]][coordinate[1]];
  }

  public getCellByID(cellID: string): Cell | null {
    const cell = this.cells.find(
      (c) => c.id === cellID.toLowerCase() || c.id === cellID.toUpperCase()
    );
    if (!cell) return null;
    return cell;
  }

  public onRotate() {
    this.colorOnTop = this.colorOnTop === "b" ? "w" : "b";
    this.rotateBoard();
    this.hook("board:rotate");
  }
}

export default Board;
