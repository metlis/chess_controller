import Game from "../models/Game";
import Cell from "../models/Cell";
import King from "../models/pieces/King";
import Piece from "../models/pieces/Piece";

interface ProcessedMove {
  cellID: string;
  isShortCastling: boolean;
  isLongCastling: boolean;
  isCheck: boolean;
  isMate: boolean;
  pieceName: string;
  prevColumn: string;
  isPromotion: boolean;
  isCapture: boolean;
  promotionPiece: string;
}

export const checkMoveHistoryStr = (str: String): Boolean => {
  if (!str) return false;
  const moves: string[] = str.replaceAll(" ", "").split(";");
  if (!moves.length) return false;
  const atomicMoves: string[] = [];
  for (let i = 0; i < moves.length; i++) {
    const [whites, blacks, ...rest] = moves[i].split(",");
    if (!whites) return false;
    if (!blacks && i !== moves.length - 1) return false;
    if (rest.length) return false;
    atomicMoves.push(whites);
    if (blacks) atomicMoves.push(blacks);
  }

  const game = new Game();
  for (let i = 0; i < atomicMoves.length; i++) {
    let move = _processMove(atomicMoves[i]);

    const moveOption = _getMoveOption(game, move);
    if (!moveOption) {
      return false;
    }
    const [to, piece] = moveOption;
    const from = piece.cell;
    game.controller.on("game:pieceMoved", {
      move: [piece, to],
    });

    if (game.controller.pendingPromotion) {
      const promotionCell = game.controller.board.cells.find(
        (c) =>
          c.promotionPiece?.name.toUpperCase() ===
          move.promotionPiece.toUpperCase()
      );
      if (promotionCell && promotionCell.promotionPiece) {
        game.controller.on("game:promotionOptionSelected", {
          promotion: promotionCell.promotionPiece,
        });
      }
    }

    const lastMove = game.controller.lastMove;
    if (
      !lastMove ||
      (!move.isPromotion && lastMove.piece !== piece) ||
      lastMove.to !== to ||
      lastMove.from !== from ||
      (move.isPromotion &&
        (!lastMove.promotion ||
          lastMove.piece.name.toUpperCase() !==
            move.promotionPiece.toUpperCase())) ||
      (move.isShortCastling && lastMove.castling !== 1) ||
      (move.isLongCastling && lastMove.castling !== 2) ||
      (move.isCapture && !lastMove.capture) ||
      (move.isCheck && !lastMove.check) ||
      (move.isMate && !lastMove.mate)
    ) {
      return false;
    }
  }

  return true;
};

const _processMove = (m: string): ProcessedMove => {
  let move = m;
  let cellID = "";
  let isShortCastling = false;
  let isLongCastling = false;
  let isCheck = false;
  let isMate = false;
  let pieceName = "";
  let prevColumn = "";
  let isPromotion = false;
  let isCapture = false;
  let promotionPiece = "";

  if (move.slice(-1) === "x") {
    // mote
    isMate = true;
    move = move.slice(0, -1);
  } else if (move.slice(-1) === "+") {
    // check
    isCheck = true;
    move = move.slice(0, -1);
  }

  if (move.slice(-2, -1) === "=") {
    // promotion
    isPromotion = true;
    promotionPiece = move.slice(-1);
    move = move.slice(0, -2);
  }

  if (move === "0-0") {
    // short castling
    isShortCastling = true;
    pieceName = "k";
    prevColumn = "e";
  } else if (move === "0-0-0") {
    // long castling
    isLongCastling = true;
    pieceName = "k";
    prevColumn = "e";
  } else if (move.length === 2) {
    // pawn move
    pieceName = "p";
    cellID = move;
  } else if (move.length === 3) {
    // other piece move
    pieceName = move[0];
    cellID = move.slice(1);
  } else if (move.length === 4 && move[1] === "x") {
    // capture
    isCapture = true;
    if (move[0].toUpperCase() === move[0]) {
      // other piece
      pieceName = move[0];
    } else {
      // pawn
      pieceName = "p";
      prevColumn = move[0];
    }
    cellID = move.slice(2);
  } else if (move.length === 4 && !move.includes("x")) {
    // other piece move long notation
    pieceName = move[0];
    prevColumn = move[1];
    cellID = move.slice(2);
  } else if (move.length === 5 && move[2] === "x") {
    // other piece capture long notation
    isCapture = true;
    pieceName = move[0];
    prevColumn = move[1];
    cellID = move.slice(3);
  }

  return {
    cellID,
    isShortCastling,
    isLongCastling,
    isCheck,
    isMate,
    pieceName,
    prevColumn,
    isPromotion,
    isCapture,
    promotionPiece,
  };
};

const _getMoveOption = (
  game: Game,
  move: ProcessedMove
): [Cell, Piece] | null => {
  const pieces = game.controller.board.pieces.filter(
    (p) => p.color !== game.controller.idlePlayer
  );

  const moveOptions: Cell[] = [];
  let movePiece: Piece | null = null;

  if (move.isShortCastling || move.isLongCastling) {
    const king = pieces.find((p) => p.name === "k");
    if (!(king instanceof King)) return null;
    const targetCell = game.controller.board.getCell([
      king.cell.coordinate[0],
      king.cell.coordinate[1] + 2 * (move.isShortCastling ? 1 : -1),
    ]);
    if (!targetCell || !king.checkedMoveOptions.includes(targetCell)) {
      return null;
    }
    moveOptions.push(targetCell);
    movePiece = king;
  } else {
    for (let piece of pieces) {
      let found = false;
      for (let option of piece.checkedMoveOptions) {
        if (
          option.id.toUpperCase() === move.cellID.toUpperCase() &&
          piece.name.toLowerCase() === move.pieceName.toLowerCase()
        ) {
          if (
            !move.prevColumn ||
            piece.cell.id.toLowerCase().includes(move.prevColumn.toLowerCase())
          ) {
            moveOptions.push(option);
            movePiece = piece;
            found = true;
            break;
          }
        }
      }
      if (found) break;
    }
  }

  if (moveOptions.length !== 1 || !movePiece) return null;
  return [moveOptions[0], movePiece];
};
