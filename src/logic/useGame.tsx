import { useState } from "react";

export const boardSize = 8;
export type Player = "Black" | "White";
export type File = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export class Position {
  file: File;
  rank: Rank;
  constructor(file: File, rank: Rank) {
    this.file = file;
    this.rank = rank;
  }

  equal(position: Position): boolean {
    return position.file === this.file && position.rank === this.rank;
  }

  in(positionList: Position[]): boolean {
    for (let postion of positionList) {
      if (postion.equal(this)) {
        return true;
      }
    }
    return false;
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

  piece(gameState: GameState): OptinalPiece {
    const piece = gameState.find((piece) => piece.position?.equal(this));
    if (piece) {
      return piece;
    }
    return null;
  }
}
export type OptionalPosition = Position | null;
export type GameState = Piece[];

export abstract class Piece {
  position: OptionalPosition;
  type: string = "piece";
  constructor(readonly player: Player, file: File, rank: Rank) {
    this.position = new Position(file, rank);
  }
  equal(piece: Piece): boolean {
    return (
      !!piece.position &&
      !!this.position &&
      piece.type === this.type &&
      piece.position.equal(this.position)
    );
  }

  moveTo(position: Position) {
    this.position = position;
  }
  moveToget(piece: Piece) {
    this.position = piece.position;
    piece.position = null;
  }
  abstract canMoveTo(gameState: GameState): Position[];
  abstract canMoveToGet(gameState: GameState): Position[];
}
export type OptinalPiece = Piece | null;

export class Pawn extends Piece {
  type = "pawn";

  canMoveTo(gameState: GameState) {
    if (!this.position) {
      return [];
    }
    let canMoveTo: Position[] = [];
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
      if (nextPosition && !nextPosition.piece(gameState)) {
        canMoveTo.push(nextPosition);
      }
    }
    return canMoveTo;
  }

  canMoveToGet(gameState: GameState): Position[] {
    if (!this.position) {
      return [];
    }
    let canMoveToGet: Position[] = [];
    for (let direction of [
      [-1, 1],
      [1, 1],
    ]) {
      const nextPosition =
        this.player === "White"
          ? this.position.addNumber(direction[0], direction[1])
          : this.position.addNumber(direction[0], -direction[1]);
      if (nextPosition && nextPosition.piece(gameState)) {
        canMoveToGet.push(nextPosition);
      }
    }
    return canMoveToGet;
  }
}

export class Knight extends Piece {
  type = "knight";
  canMoveTo(pieces: Piece[]) {
    if (!this.position) {
      return [];
    }
    let canMoveTo: Position[] = [];
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
              canMoveTo.push(nextPosition);
            }
          }
        }
      }
    }

    return canMoveTo;
  }
  canMoveToGet(gameState: GameState): Position[] {
    if (!this.position) {
      return [];
    }
    let canMoveToGet: Position[] = [];
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
            if (nextPosition && nextPosition.piece(gameState)) {
              canMoveToGet.push(nextPosition);
            }
          }
        }
      }
    }
    return canMoveToGet;
  }
}

export class Bishop extends Piece {
  type = "bishop";
  canMoveTo(gameState: GameState) {
    if (!this.position) {
      return [];
    }
    let canMoveTo: Position[] = [];
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
        if (!nextPosition || (nextPosition && nextPosition.piece(gameState))) {
          break;
        }
        canMoveTo.push(nextPosition);
      }
    }

    return canMoveTo;
  }
  canMoveToGet(gameState: GameState): Position[] {
    if (!this.position) {
      return [];
    }
    let canMoveToGet: Position[] = [];
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
        if (nextPosition.piece(gameState)) {
          canMoveToGet.push(nextPosition);
        }
        break;
      }
    }
    return canMoveToGet;
  }
}

export class Rook extends Piece {
  type = "rook";
  canMoveTo(gameState: GameState): Position[] {
    if (!this.position) {
      return [];
    }
    let canMoveTo: Position[] = [];
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
        if (!nextPosition || (nextPosition && nextPosition.piece(gameState))) {
          break;
        }
        canMoveTo.push(nextPosition);
      }
    }

    return canMoveTo;
  }
  canMoveToGet(gameState: GameState): Position[] {
    if (!this.position) {
      return [];
    }
    let canMoveToGet: Position[] = [];
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
        if (nextPosition.piece(gameState)) {
          canMoveToGet.push(nextPosition);
        }
      }
    }
    return canMoveToGet;
  }
}

export class Queen extends Piece {
  type = "queen";
  canMoveTo(gameState: GameState) {
    if (!this.position) {
      return [];
    }
    let canMoveTo: Position[] = [];
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
        if (!nextPosition || (nextPosition && nextPosition.piece(gameState))) {
          break;
        }
        canMoveTo.push(nextPosition);
      }
    }

    return canMoveTo;
  }
  canMoveToGet(gameState: GameState): Position[] {
    if (!this.position) {
      return [];
    }
    let canMoveToGet: Position[] = [];
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
        if (nextPosition.piece(gameState)) {
          canMoveToGet.push(nextPosition);
        }
      }
    }
    return canMoveToGet;
  }
}

export class King extends Piece {
  type = "king";
  canMoveTo(gameState: GameState) {
    if (!this.position) {
      return [];
    }
    let canMoveTo: Position[] = [];
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
      const nextPosition = this.position.addNumber(direction[0], direction[1]);
      if (!nextPosition || (nextPosition && nextPosition.piece(gameState))) {
        break;
      }
      canMoveTo.push(nextPosition);
    }

    return canMoveTo;
  }
  canMoveToGet(gameState: GameState): Position[] {
    if (!this.position) {
      return [];
    }
    let canMoveToGet: Position[] = [];
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
      const nextPosition = this.position.addNumber(direction[0], direction[1]);
      if (!nextPosition) {
        break;
      }
      if (nextPosition.piece(gameState)) {
        canMoveToGet.push(nextPosition);
      }
    }
    return canMoveToGet;
  }
}

const useGame = () => {
  const defaultGameState: GameState = [];

  for (let playler of ["White", "Black"] as const) {
    for (let file of ["A", "B", "C", "D", "E", "F", "G", "H"] as const) {
      const pawnRank = playler === "White" ? "2" : "7";
      defaultGameState.push(new Pawn(playler, file, pawnRank));
    }
    const rank = playler === "White" ? "1" : "8";
    for (let file of ["C", "F"] as const) {
      defaultGameState.push(new Knight(playler, file, rank));
    }
    for (let file of ["B", "G"] as const) {
      defaultGameState.push(new Bishop(playler, file, rank));
    }
    for (let file of ["A", "H"] as const) {
      defaultGameState.push(new Rook(playler, file, rank));
    }
    const queenFile = "D";
    defaultGameState.push(new Queen(playler, queenFile, rank));
    const kinfFile = "E";
    defaultGameState.push(new King(playler, kinfFile, rank));
  }

  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [player, setPlayer] = useState<Player>("White");

  type Select = false | Piece;
  const [select, setSelect] = useState<Select>(false);

  const playerChange = () => {
    setGameState(gameState);
    setPlayer(player === "White" ? "Black" : "White");
    setSelect(false);
  };

  const handleClick = (position: Position) => {
    if (!select) {
      const piece = position.piece(gameState);
      if (piece && piece.player === player) {
        setSelect(piece);
      }
    } else {
      if (position.in(select.canMoveTo(gameState))) {
        gameState.find((piece) => piece.equal(select))?.moveTo(position);
        playerChange();
      } else if (position.in(select.canMoveToGet(gameState))) {
        gameState.find((piece) => piece.equal(select))?.moveTo(position);
        playerChange();
      }
    }
  };

  return { gameState, select, player, handleClick };
};

export default useGame;
