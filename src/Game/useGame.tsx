import { useState, useCallback } from "react";
import cloneDeep from "lodash/cloneDeep";

export const boardSize = 8;
export type Player = "Black" | "White";
export type File = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type Select = false | Piece;

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

    let rankIndex = this.rank.charCodeAt(0) - "1".charCodeAt(0);
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

  removed() {
    this.position = null;
  }

  abstract canMoveTo(gameState: GameState): Position[];
}
export type OptinalPiece = Piece | null;

export class Pawn extends Piece {
  type = "pawn";

  canMoveTo(gameState: GameState) {
    if (!this.position) {
      return [];
    }
    let canMoveTo: Position[] = [];
    for (let i = 1; i <= 2; i++) {
      if (
        i === 2 &&
        !(
          (this.player === "White" && this.position.rank === "2") ||
          (this.player === "Black" && this.position.rank === "7")
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
      } else {
        break;
      }
    }
    for (let direction of [
      [-1, 0],
      [1, 0],
    ]) {
      const nextPosition =
        this.player === "White"
          ? this.position.addNumber(direction[0], 1)
          : this.position.addNumber(direction[0], -1);
      if (
        nextPosition &&
        nextPosition.piece(gameState) &&
        nextPosition.piece(gameState)?.player !== this.player
      ) {
        canMoveTo.push(nextPosition);
      }
    }

    return canMoveTo;
  }
}

export class Knight extends Piece {
  type = "knight";
  canMoveTo(gameState: Piece[]) {
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
            if (
              nextPosition &&
              (!nextPosition.piece(gameState) ||
                nextPosition.piece(gameState)?.player !== this.player)
            ) {
              canMoveTo.push(nextPosition);
            }
          }
        }
      }
    }

    return canMoveTo;
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
        if (
          nextPosition &&
          (!nextPosition.piece(gameState) ||
            nextPosition.piece(gameState)?.player !== this.player)
        ) {
          canMoveTo.push(nextPosition);
        }
        if (!nextPosition || nextPosition.piece(gameState)) {
          break;
        }
      }
    }

    return canMoveTo;
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
        if (
          nextPosition &&
          (!nextPosition.piece(gameState) ||
            nextPosition.piece(gameState)?.player !== this.player)
        ) {
          canMoveTo.push(nextPosition);
        }
        if (!nextPosition || nextPosition.piece(gameState)) {
          break;
        }
      }
    }

    return canMoveTo;
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
        if (
          nextPosition &&
          (!nextPosition.piece(gameState) ||
            nextPosition.piece(gameState)?.player !== this.player)
        ) {
          canMoveTo.push(nextPosition);
        }
        if (!nextPosition || nextPosition.piece(gameState)) {
          break;
        }
      }
    }

    return canMoveTo;
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
      if (
        nextPosition &&
        (!nextPosition.piece(gameState) ||
          nextPosition.piece(gameState)?.player !== this.player)
      ) {
        canMoveTo.push(nextPosition);
      }
    }

    return canMoveTo;
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
  const [select, setSelect] = useState<Select>(false);
  const [isChecked, setIseCheckd] = useState<boolean>(false);

  const checkIsChecked = (player: Player, gameState: GameState): boolean => {
    const kingPosition = gameState.find(
      (piece) => piece.player === player && piece.type === "king"
    )?.position;
    if (!kingPosition) {
      return false;
    }
    return !!gameState.find(
      (piece) =>
        piece.player !== player && kingPosition.in(piece.canMoveTo(gameState))
    );
  };

  const handleClick = useCallback(
    (position: Position) => {
      return () => {
        if (!select) {
          const piece = position.piece(gameState);
          if (piece && piece.player === player) {
            setSelect(piece);
          }
        } else {
          if (position.in(select.canMoveTo(gameState))) {
            const gameStateClone = cloneDeep(gameState);
            gameStateClone
              .find((piece) => piece.equal(select))
              ?.moveTo(position);
            if (!checkIsChecked(player, gameStateClone)) {
              if (position.piece(gameState)) {
                position.piece(gameState)?.removed();
              }
              select.moveTo(position);
              setGameState(gameState);
              setPlayer(player === "White" ? "Black" : "White");

              setIseCheckd(
                checkIsChecked(
                  player === "White" ? "Black" : "White",
                  gameState
                )
              );
            }
          }

          setSelect(false);
        }
      };
    },
    [gameState, player, select]
  );

  return { gameState, select, player, isChecked, handleClick };
};

export default useGame;
