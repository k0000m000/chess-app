import { type } from "@testing-library/user-event/dist/type";
import { useState } from "react";

const Game: React.FC = () => {
  type Playler = "Black" | "White";
  type File = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
  type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

  class Position {
    constructor(private file: File, private rank: Rank) {}
  }
  type OptionalPosition = Position | null;

  abstract class Piece {
    protected position: OptionalPosition;
    constructor(private readonly color: Playler, file: File, rank: Rank) {
      this.position = new Position(file, rank);
    }
    abstract type: string;
    moveTo(position: Position) {
      this.position = position;
    }
    get(piece: Piece) {
      this.position = piece.position;
      piece.position = null;
    }
    abstract PositionsCanMove(): Position[];
    abstract PicesCanGet(): Piece[];
  }

  return <></>;
};

export default Game;
