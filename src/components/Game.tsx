import { type } from "@testing-library/user-event/dist/type";
import { useState } from "react";
import { idText } from "typescript";

const Game: React.FC = () => {
  const boardSize = 8;
  type Playler = "Black" | "White";
  type File = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
  type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
  type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

  //mapをつくるもしくはnextを作る
  // const fileToIndex = (file: File): Index => {
  //   return file.charCodeAt(0) as Index;
  // };
  // const indexToFile = (index: Index): File => {
  //   return "ABCDEFGH"[index] as File;
  // };
  // const rankToIndex = (rank: Rank): Index => {
  //   return (Number(rank) - 1) as Index;
  // };
  // const indexToRank = (index: Index): File => {
  //   return "012345678"[index] as File;
  // };

  class Position {
    file: Index;
    rank: Index;
    constructor(file: Index, rank: Index) {
      this.file = file;
      this.rank = rank;
    }
  }
  type OptionalPosition = Position | null;

  abstract class Piece {
    position: OptionalPosition;
    constructor(readonly player: Playler, file: Index, rank: Index) {
      this.position = { file, rank };
    }
    abstract type: string;
    moveTo(position: Position) {
      this.position = position;
    }
    get(piece: Piece) {
      this.position = piece.position;
      piece.position = null;
    }
    abstract positionsCanMoveTo(pieces: Piece[]): OptionalPosition[];
    abstract picesCanGet(board: Board): Piece[];
  }
  type OptinalPice = Piece | null;
  type Board = [
    [
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice
    ],
    [
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice
    ],
    [
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice
    ],
    [
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice
    ],
    [
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice
    ],
    [
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice
    ],
    [
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice
    ],
    [
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice,
      OptinalPice
    ]
  ];
  const piecesToBoard = (pieces: Piece[]): Board => {
    let board: Board = Array(boardSize).fill(
      Array(boardSize).fill(null)
    ) as Board;
    for (let piece of pieces) {
      if (!piece.position) {
        continue;
      }
      board[piece.position.file][piece.position.rank] = piece;
    }
    return board;
  };

  class Pawn extends Piece {
    type = "pawn";
    positionsCanMoveTo(pieces: Piece[]) {
      if (!this.position) {
        return [null];
      }
      let positionsCanMoveTo: Position[] = [];
      if (this.player == "White") {
        const nextPosition: Position = new Position(
          this.position.file,
          this.position.rank
        );
      }
      return [];
    }
  }

  return <></>;
};

export default Game;
