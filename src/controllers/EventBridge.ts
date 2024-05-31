import Piece from "../models/pieces/Piece";
import Board from "../models/Board";
import Cell from "../models/Cell";
import {
  BoardEventType,
  BoardEventPayload,
  BoardEventFn,
  BoardEventTypeLiterals,
  GameEventType,
  GameEventPayload,
  GameEventTypeLiterals,
} from "../types";

type eventType = BoardEventType | GameEventType;
type eventPayload = BoardEventPayload | GameEventPayload;

class EventBridge {
  private board: Board | undefined;

  public init(board: Board) {
    this.board = board;
    return this;
  }

  private isBoardEvent(event: unknown): event is BoardEventType {
    return BoardEventTypeLiterals.some((e) => e === event);
  }

  private isBoardEventPayload(
    event: eventType,
    payload: eventPayload
  ): payload is BoardEventPayload {
    return this.isBoardEvent(event);
  }

  private dispatchBoardEvent<T extends { on: BoardEventFn }>(
    event: BoardEventType,
    items: T[],
    payload: BoardEventPayload = {}
  ): void {
    items.forEach((item: T) => item.on(event, payload));
  }

  private isGamedEvent(event: unknown): event is GameEventType {
    return GameEventTypeLiterals.some((e) => e === event);
  }

  private isGameEventPayload(
    event: eventType,
    payload: eventPayload
  ): payload is GameEventPayload {
    return this.isGamedEvent(event);
  }

  private dispatchGameEvent(
    event: GameEventType,
    payload: GameEventPayload = {}
  ) {
    this.board?.game.controller.on(event, payload);
  }

  public addEvent(event: eventType, payload: eventPayload = {}): void {
    if (this.isBoardEvent(event) && this.isBoardEventPayload(event, payload)) {
      this.dispatchBoardEvent(event, this.getItems(payload), payload);
    } else if (
      this.isGamedEvent(event) &&
      this.isGameEventPayload(event, payload)
    ) {
      this.dispatchGameEvent(event, payload);
    }
  }

  private getItems(payload: BoardEventPayload): (Piece | Cell)[] {
    if (payload.include) {
      return payload.include;
    } else if (payload.exclude?.length && payload.exclude[0] instanceof Piece) {
      return (
        this.board?.pieces.filter(
          (item) => !(payload.exclude || []).includes(item)
        ) || []
      );
    } else if (payload.exclude?.length && payload.exclude[0] instanceof Cell) {
      return (
        this.board?.cells.filter(
          (item) => !(payload.exclude || []).includes(item)
        ) || []
      );
    }
    return [];
  }
}

export default EventBridge;
