import type { Color, PieceImage, PieceName } from "../../types";
import Base from "../Base";
import Cell from "../Cell";

class PromotionPiece extends Base {
  public color: Color;
  public name: PieceName;
  public image: PieceImage;

  public constructor(color: Color, name: PieceName, cell: Cell) {
    super(cell.board);
    this.color = color;
    this.name = name;
    this.image = `${name}_${color}.svg`;
  }

  public onSelected() {
    this.eventBridge.addEvent("game:promotionOptionSelected", {
      promotion: this,
    });
  }
}

export default PromotionPiece;
