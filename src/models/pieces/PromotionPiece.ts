import type { Color, PieceCode, PieceName } from "../../types";
import Base from "../Base";
import Cell from "../Cell";

class PromotionPiece extends Base {
  public color: Color;
  public name: PieceName;
  public code: PieceCode;

  public constructor(color: Color, name: PieceName, cell: Cell) {
    super(cell.board);
    this.color = color;
    this.name = name;
    this.code = `${name}_${color}`;
  }

  public onSelected() {
    this.eventBridge.addEvent("game:promotionOptionSelected", {
      promotion: this,
    });
  }
}

export default PromotionPiece;
