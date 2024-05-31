import Move from "./Move";
import Piece from "./pieces/Piece";
import King from "./pieces/King";
import Base from "./Base";
import Refreshable from "../mixins/Refreshable";
import { Color } from "../types";

type snapshots = { [color in Color]: string[] };

class MovesHistory extends Refreshable(Base) {
  private stack: Move[] = [];
  private snapshots: snapshots = { b: [], w: [] };
  private pointer: number = -1;
  public winner: Color | undefined | null = undefined;

  public get lastMove(): Move {
    return this.stack[this.pointer];
  }

  public get visibleMoveNo(): number {
    return Math.floor(this.pointer / 2);
  }

  public get lastMoveIsWhite(): boolean {
    return this.pointer % 2 === 0;
  }

  public addMove(move: Move, showMove: boolean = false) {
    if (showMove) this.switchLastMoveVisibility(true);
    this.stack.push(move);
    this.pointer++;
    if (showMove) {
      this.refreshComponent();
      this.switchLastMoveVisibility();
    }
  }

  private switchLastMoveVisibility(hide = false) {
    if (this.lastMove) {
      this.eventBridge.addEvent("cell:switchState", {
        include: [this.lastMove.from, this.lastMove.to],
        cellState: hide ? "default" : "lastMove",
      });
    }
  }

  private switchCellsToDefault() {
    this.eventBridge.addEvent("cell:switchState", {
      include: this.board.cells,
      cellState: "default",
    });
  }

  private switchPendingPromotion() {
    if (this.gameController.pendingPromotion) {
      if (!this.gameController.pendingPromotion.undone) {
        this.gameController.pendingPromotion.undo();
      } else if (
        this.gameController.pendingPromotion.undone &&
        this.pointer === this.stack.length - 1
      ) {
        this.gameController.pendingPromotion.redo();
      }
    }
  }

  public switchCheckVisibility(fromHistory = false) {
    if (!this.lastMove) return;
    if (!fromHistory) this.lastMove.checkCheckMate(this.winner !== undefined);
    if (!this.lastMove.check) {
      if (this.lastMove.piece instanceof King) return;
      const kingsCells = this.board.pieces
        .filter((piece) => piece instanceof King)
        .map((piece) => piece.cell);
      if (kingsCells.length) {
        this.eventBridge.addEvent("cell:switchState", {
          include: kingsCells,
          cellState: "default",
        });
      }
    } else {
      const king = this.board.pieces.filter(
        (piece) =>
          piece.color !== this.lastMove.piece.color && piece instanceof King
      )[0];
      if (king) {
        this.eventBridge.addEvent("cell:switchState", {
          include: [king.cell],
          cellState: "checked",
        });
      }
    }
  }

  public removeMove() {
    const move = this.stack.pop();
    if (move) {
      move.undoMove();
      this.pointer--;
    }
  }

  private takePiecesSnapshot(player: Color, pieces: Piece[]): string {
    const sortedPieces = [...pieces].sort((a, b) =>
      a.cell.id.localeCompare(b.cell.id)
    );
    const stripped: object = sortedPieces.map((piece) => ({
      cell: piece.cell.id,
      name: piece.name,
      color: piece.color,
      moveOptions: piece.moveOptions
        .map((cell) => cell.id)
        .sort((a, b) => a.localeCompare(b)),
      ...(piece instanceof King
        ? {
            longCastlingPossible: piece.longCastlingPossible,
            shortCastlingPossible: piece.shortCastlingPossible,
          }
        : {}),
    }));
    const snapshot = JSON.stringify(stripped);
    this.snapshots[player].push(snapshot);
    return snapshot;
  }

  public isThreefoldRepetition(player: Color, pieces: Piece[]): boolean {
    const snapshot = this.takePiecesSnapshot(player, pieces);
    let count = 0;
    this.snapshots[player].forEach((s) => {
      if (s === snapshot) count++;
    });
    return count === 3;
  }

  public get printableMoves() {
    const moves: [string, string?][] = [];
    let whiteMove: string | null = null;
    let blackMove: string | null = null;

    const constructStr = (move: Move) => {
      if (move.castling) {
        return move.castling === 1 ? "0-0" : "0-0-0";
      }
      let str: string;
      if (move.promotion) {
        str = `${
          move.capture ? move.from.id.replace(/[0-9]/g, "x").toLowerCase() : ""
        }${move.to.id.toLowerCase()}=${move.piece.name.toUpperCase()}`;
      } else if (
        (move.capture && move.piece.name === "p") ||
        move.enPassantCell
      ) {
        str = `${move.from.id
          .replace(/[0-9]/g, "x")
          .toLowerCase()}${move.to.id.toLowerCase()}`;
      } else {
        str = `${move.piece.name.toUpperCase()}${
          move.longNotation
            ? move.from.id.replace(/[0-9]/g, "").toLowerCase()
            : ""
        }${move.capture ? "x" : ""}${move.to.id.toLowerCase()}`;
      }
      if (move.mate) {
        str += "x";
      } else if (move.check) {
        str += "+";
      }
      return str.replace("P", "");
    };

    for (let i = 0; i < this.stack.length; i++) {
      if (!whiteMove) {
        whiteMove = constructStr(this.stack[i]);
        if (i === this.stack.length - 1) moves.push([whiteMove]);
      } else {
        blackMove = constructStr(this.stack[i]);
        moves.push([whiteMove, blackMove]);
        whiteMove = null;
        blackMove = null;
      }
    }
    return moves;
  }

  public async copyMoves() {
    let str = "";
    const moves = this.printableMoves;
    moves.forEach((move, index) => {
      str += `${index + 1}. `;
      str += `${move[0]}`;
      if (move[1]) {
        str += ` ${move[1]}${index !== moves.length - 1 ? " " : ""}`;
      }
    });
    if (this.winner !== undefined) {
      str += "\n";
      if (this.winner === "w") {
        str += "1 - 0";
      } else if (this.winner === "b") {
        str += "0 - 1";
      } else {
        str += "1/2 - 1/2";
      }
    }
    await navigator.clipboard.writeText(str);
  }

  public setWinner(winner: Color | undefined | null) {
    this.winner = winner;
  }

  private switchDraggabilityOnBackwardsRewind() {
    if (
      this.pointer === this.stack.length - 1 &&
      !this.gameController.pendingPromotion?.undone
    ) {
      this.eventBridge.addEvent("game:switchActivePlayerPiecesDraggability");
    }
  }

  public goBack() {
    if (this.pointer === -1) return;
    this.switchPendingPromotion();
    this.switchDraggabilityOnBackwardsRewind();
    this.switchLastMoveVisibility(true);
    this.switchCheckVisibility(true);
    this.lastMove.undoMove(true);
    this.pointer--;
    this.switchLastMoveVisibility();
    this.switchCheckVisibility(true);
    this.refreshComponent();
  }

  public goToStart() {
    if (this.pointer === -1) return;
    this.switchPendingPromotion();
    this.switchDraggabilityOnBackwardsRewind();
    while (this.pointer > -1) {
      this.lastMove.undoMove();
      this.pointer--;
    }
    this.switchCellsToDefault();
    this.refreshComponent();
  }

  public goForward() {
    if (this.pointer === this.stack.length - 1) return;
    this.switchLastMoveVisibility(true);
    this.pointer++;
    this.lastMove.init();
    this.switchLastMoveVisibility();
    this.switchCheckVisibility(true);
    if (this.pointer === this.stack.length - 1) {
      this.eventBridge.addEvent("game:switchActivePlayerPiecesDraggability");
    }
    this.switchPendingPromotion();
    this.refreshComponent();
  }

  public goToEnd() {
    if (this.pointer === this.stack.length - 1) return;
    while (this.pointer < this.stack.length - 1) {
      this.pointer++;
      this.lastMove.init();
    }
    this.switchCellsToDefault();
    this.switchLastMoveVisibility();
    this.switchCheckVisibility(true);
    this.eventBridge.addEvent("game:switchActivePlayerPiecesDraggability");
    this.switchPendingPromotion();
    this.refreshComponent();
  }
}

export default MovesHistory;
