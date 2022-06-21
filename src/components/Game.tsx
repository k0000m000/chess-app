import { type } from "@testing-library/user-event/dist/type";
import { useState } from "react";
import { idText } from "typescript";

const Game: React.FC = () => {
  const boardSize = 8;
  type Playler = "Black" | "White";
  type File = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
  type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
  type OptinalFile = File | null;
  type OptinalRank = Rank | null;

  class Position {
    file: File;
    rank: Rank;
    constructor(file: File, rank: Rank) {
      this.file = file;
      this.rank = rank;
    }
    addNumber(fileNumber: number, rankNumber: number): OptionalPosition {
      let fileIndex = this.file.charCodeAt(0) - "A".charCodeAt(0);
      fileIndex += fileNumber;
      let rankIndex = this.rank.charCodeAt(0) - "0".charCodeAt(0);
      rankIndex += rankNumber;
      const fileMap: File[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
      const rankMap: Rank[] = ["1", "2", "3", "4", "5", "6", "7", "8"];
      if (fileMap[fileIndex] && rankMap[rankIndex]) {
        return new Position(fileMap[fileIndex], rankMap[rankIndex]);
      }
      return null;
    }

    pieceExists(pieces: Piece[]): OptinalPice {
      for (let piece of pieces) {
        if (this === piece.position) {
          return piece;
        }
      }
      return null;
    }
  }
  type OptionalPosition = Position | null;

  abstract class Piece {
    position: OptionalPosition;
    constructor(readonly player: Playler, file: File, rank: Rank) {
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
    abstract positionsCanMoveTo(pieces: Piece[]): Position[];
    abstract picesCanGet(pieces: Piece[]): Piece[];
  }
  type OptinalPice = Piece | null;
  class Pawn extends Piece {
    type = "pawn";
    positionsCanMoveTo(pieces: Piece[]) {
      if (!this.position) {
        return [];
      }
      let positionsCanMoveTo: Position[] = [];
      for (let i = 0; i <= 2; i++) {
        if (
          i === 2 &&
          !(
            (this.player === "White" && this.position.rank === "2") ||
            (this.player === "Black" && this.position.rank === "6")
          )
        ) {
          break;
        }
        const nextPosition =
          this.player === "White"
            ? this.position.addNumber(0, i)
            : this.position.addNumber(0, -i);
        if (!nextPosition || nextPosition.pieceExists(pieces)) {
          break;
        }
        positionsCanMoveTo.push(nextPosition);
      }
      return positionsCanMoveTo;
    }
  }

  return <></>;
};

export default Game;
