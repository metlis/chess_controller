import Cell from "./Cell";
import Piece from "./pieces/Piece";
import Base from "./Base";
import King from "./pieces/King";

type Promotion = {
  from: Cell;
  piece: Piece;
  prevToPiece: Piece | null;
};

class Move extends Base {
  public piece: Piece;
  public from: Cell;
  public to: Cell;
  public promotion: Promotion | null = null;
  public prevToPiece: Piece | null = null;
  public prevMoved: boolean = false;
  public enPassantCell: Cell | null = null;
  private enPassantPiece: Piece | null = null;
  private castledRook: Piece | null = null;
  private prevCastlingRookCell: Cell | null = null;
  public castling: 1 | 2 | null = null;
  public capture: boolean = false;
  public check: boolean = false;
  public mate: boolean = false;
  public longNotation: boolean = false;

  public constructor(piece: Piece, to: Cell, promotion?: Promotion) {
    super(piece.cell.board);
    this.piece = piece;
    this.to = to;
    this.from = promotion ? promotion.from : piece.cell;
    this.prevToPiece = promotion ? promotion.prevToPiece : to.piece;
    this.prevMoved = piece.moved;
    this.promotion = promotion || null;
    this.init();
  }

  public init() {
    this.checkEnPassant(this.piece, this.to);
    this.checkCastling(this.piece, this.to);
    this.checkLongNotationRequired(this.piece, this.to);
    this.checkCapture(this.to, this.promotion);
    this.to.piece = this.piece;
    this.piece.cell = this.to;
    this.from.piece = null;
    this.piece.moved = true;
    this.to.refreshComponent();
    this.from.refreshComponent();
  }

  private checkEnPassant(piece: Piece, to: Cell) {
    if (
      piece.name === "p" &&
      to.coordinate[1] !== piece.cell.coordinate[1] &&
      !to.piece
    ) {
      const cell = piece.board.getCell([
        piece.cell.coordinate[0],
        to.coordinate[1],
      ]);
      if (cell) {
        this.enPassantPiece = cell.piece;
        this.enPassantCell = cell;
        cell.piece = null;
        cell.refreshComponent();
      }
    }
  }

  private checkCastling(piece: Piece, to: Cell) {
    if (!(piece instanceof King)) return;
    const _ = (oldCellOffset: number, newCellOffset: number) => {
      this.prevCastlingRookCell = this.board.getCell([
        piece.cell.coordinate[0],
        piece.cell.coordinate[1] + oldCellOffset,
      ]);
      const rook = this.prevCastlingRookCell?.piece;
      if (rook) {
        const newRookCell = this.board.getCell([
          rook.cell.coordinate[0],
          rook.cell.coordinate[1] + newCellOffset,
        ]);
        if (newRookCell && this.prevCastlingRookCell) {
          this.castledRook = rook;
          rook.cell = newRookCell;
          newRookCell.piece = rook;
          this.prevCastlingRookCell.piece = null;
          rook.cell.refreshComponent();
          this.prevCastlingRookCell.refreshComponent();
        }
      }
    };

    const rotation = this.board.colorOnTop === "b" ? 1 : -1;
    if (to.coordinate[1] - piece.cell.coordinate[1] === 2 * rotation) {
      _(3 * rotation, -2 * rotation);
      this.castling = 1;
    } else if (to.coordinate[1] - piece.cell.coordinate[1] === -2 * rotation) {
      _(-4 * rotation, 3 * rotation);
      this.castling = 2;
    }
  }

  public checkCheckMate(gameOver = false) {
    if (this.piece.moveOptions.some((op: Cell) => op.piece?.name === "k")) {
      this.check = true;
      if (gameOver) this.mate = true;
    }
  }

  private checkLongNotationRequired(piece: Piece, to: Cell) {
    this.longNotation = this.board.pieces.some(
      (p) =>
        p !== piece &&
        p.color === piece.color &&
        p.checkedMoveOptions.some((op) => op === to && p.name === piece.name)
    );
  }

  private checkCapture(to: Cell, promotion?: Promotion | null) {
    if (promotion) {
      this.capture = promotion.from.coordinate[1] !== to.coordinate[1];
    } else if (to.piece) {
      this.capture = true;
    }
  }

  public undoMove(refreshComponents = false) {
    if (this.promotion) {
      this.promotion.from.piece = this.promotion.piece;
      if (refreshComponents) this.promotion.from.refreshComponent();
    } else {
      this.piece.cell = this.from;
      this.from.piece = this.piece;
    }
    this.to.piece = this.prevToPiece;
    this.piece.moved = this.prevMoved;

    if (refreshComponents) {
      this.from.refreshComponent();
      this.to.refreshComponent();
    }

    if (this.enPassantCell && this.enPassantPiece) {
      this.enPassantCell.piece = this.enPassantPiece;
      if (refreshComponents) this.enPassantCell.refreshComponent();
    }

    if (this.castledRook && this.prevCastlingRookCell) {
      this.castledRook.cell.piece = null;
      if (refreshComponents) this.castledRook.cell.refreshComponent();
      this.castledRook.cell = this.prevCastlingRookCell;
      if (refreshComponents) this.castledRook.cell.refreshComponent();
      this.castledRook.cell.piece = this.castledRook;
    }
  }
}

export default Move;
