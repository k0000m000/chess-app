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

    piece(pieces: Piece[]): OptinalPiece {
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
  type OptinalPiece = Piece | null;

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
        if (nextPosition && !nextPosition.piece(pieces)) {
          positionsCanMoveTo.push(nextPosition);
        }
      }
      return positionsCanMoveTo;
    }

    picesCanGet(pieces: Piece[]): Piece[] {
      if (!this.position) {
        return [];
      }
      let piecesCanGet: Piece[] = [];
      for (let direction of [
        [-1, 1],
        [1, 1],
      ]) {
        const nextPosition =
          this.player === "White"
            ? this.position.addNumber(direction[0], direction[1])
            : this.position.addNumber(direction[0], -direction[1]);
        if (nextPosition) {
          const getPiece = nextPosition.piece(pieces);
          if (getPiece) {
            piecesCanGet.push(getPiece);
          }
        }
      }
      return piecesCanGet;
    }
  }

  class Knight extends Piece {
    type = "knight";
    positionsCanMoveTo(pieces: Piece[]) {
      if (!this.position) {
        return [];
      }
      let positionsCanMoveTo: Position[] = [];
      for (let direction of [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]) {
        for (let i of [1, 2]) {
          for (let j of [1, 2]) {
            if (i !== j) {
              const nextPosition = this.position.addNumber(
                i * direction[0],
                j * direction[1]
              );
              if (nextPosition && !nextPosition.piece(pieces)) {
                positionsCanMoveTo.push(nextPosition);
              }
            }
          }
        }
      }

      return positionsCanMoveTo;
    }
    picesCanGet(pieces: Piece[]): Piece[] {
      if (!this.position) {
        return [];
      }
      let piecesCanGet: Piece[] = [];
      for (let direction of [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]) {
        for (let i of [1, 2]) {
          for (let j of [1, 2]) {
            if (i !== j) {
              const nextPosition = this.position.addNumber(
                i * direction[0],
                j * direction[1]
              );
              if (nextPosition) {
                const getPiece = nextPosition.piece(pieces);
                if (getPiece) {
                  piecesCanGet.push(getPiece);
                }
              }
            }
          }
        }
      }
      return piecesCanGet;
    }
  }

  class Bishop extends Piece {
    type = "bishop";
    positionsCanMoveTo(pieces: Piece[]) {
      if (!this.position) {
        return [];
      }
      let positionsCanMoveTo: Position[] = [];
      for (let direction of [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]) {
        for (let i = 1; i < boardSize; i++) {
          const nextPosition = this.position.addNumber(
            i * direction[0],
            i * direction[1]
          );
          if (!nextPosition || (nextPosition && nextPosition.piece(pieces))) {
            break;
          }
          positionsCanMoveTo.push(nextPosition);
        }
      }

      return positionsCanMoveTo;
    }
    picesCanGet(pieces: Piece[]): Piece[] {
      if (!this.position) {
        return [];
      }
      let piecesCanGet: Piece[] = [];
      for (let direction of [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]) {
        for (let i = 1; i < boardSize; i++) {
          const nextPosition = this.position.addNumber(
            i * direction[0],
            i * direction[1]
          );
          if (!nextPosition) {
            break;
          }
          const pieceGet = nextPosition.piece(pieces);
          if (pieceGet) {
            piecesCanGet.push(pieceGet);
            break;
          }
        }
      }
      return piecesCanGet;
    }
  }

  class Rook extends Piece {
    type = "rook";
    positionsCanMoveTo(pieces: Piece[]) {
      if (!this.position) {
        return [];
      }
      let positionsCanMoveTo: Position[] = [];
      for (let direction of [
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
      ]) {
        for (let i = 1; i < boardSize; i++) {
          const nextPosition = this.position.addNumber(
            i * direction[0],
            i * direction[1]
          );
          if (!nextPosition || (nextPosition && nextPosition.piece(pieces))) {
            break;
          }
          positionsCanMoveTo.push(nextPosition);
        }
      }

      return positionsCanMoveTo;
    }
    picesCanGet(pieces: Piece[]): Piece[] {
      if (!this.position) {
        return [];
      }
      let piecesCanGet: Piece[] = [];
      for (let direction of [
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
      ]) {
        for (let i = 1; i < boardSize; i++) {
          const nextPosition = this.position.addNumber(
            i * direction[0],
            i * direction[1]
          );
          if (!nextPosition) {
            break;
          }
          const pieceGet = nextPosition.piece(pieces);
          if (pieceGet) {
            piecesCanGet.push(pieceGet);
            break;
          }
        }
      }
      return piecesCanGet;
    }
  }

  class Queen extends Piece {
    type = "queen";
    positionsCanMoveTo(pieces: Piece[]) {
      if (!this.position) {
        return [];
      }
      let positionsCanMoveTo: Position[] = [];
      for (let direction of [
        [-1, 1],
        [1, -1],
        [1, 1],
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
      ]) {
        for (let i = 1; i < boardSize; i++) {
          const nextPosition = this.position.addNumber(
            i * direction[0],
            i * direction[1]
          );
          if (!nextPosition || (nextPosition && nextPosition.piece(pieces))) {
            break;
          }
          positionsCanMoveTo.push(nextPosition);
        }
      }

      return positionsCanMoveTo;
    }
    picesCanGet(pieces: Piece[]): Piece[] {
      if (!this.position) {
        return [];
      }
      let piecesCanGet: Piece[] = [];
      for (let direction of [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
      ]) {
        for (let i = 1; i < boardSize; i++) {
          const nextPosition = this.position.addNumber(
            i * direction[0],
            i * direction[1]
          );
          if (!nextPosition) {
            break;
          }
          const pieceGet = nextPosition.piece(pieces);
          if (pieceGet) {
            piecesCanGet.push(pieceGet);
            break;
          }
        }
      }
      return piecesCanGet;
    }
  }

  class King extends Piece {
    type = "king";
    positionsCanMoveTo(pieces: Piece[]) {
      if (!this.position) {
        return [];
      }
      let positionsCanMoveTo: Position[] = [];
      for (let direction of [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
      ]) {
        const nextPosition = this.position.addNumber(
          direction[0],
          direction[1]
        );
        if (!nextPosition || (nextPosition && nextPosition.piece(pieces))) {
          break;
        }
        positionsCanMoveTo.push(nextPosition);
      }

      return positionsCanMoveTo;
    }
    picesCanGet(pieces: Piece[]): Piece[] {
      if (!this.position) {
        return [];
      }
      let piecesCanGet: Piece[] = [];
      for (let direction of [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
      ]) {
        const nextPosition = this.position.addNumber(
          direction[0],
          direction[1]
        );
        if (!nextPosition) {
          break;
        }
        const pieceGet = nextPosition.piece(pieces);
        if (pieceGet) {
          piecesCanGet.push(pieceGet);
          break;
        }
      }
      return piecesCanGet;
    }
  }

  return <></>;
};

export default Game;
