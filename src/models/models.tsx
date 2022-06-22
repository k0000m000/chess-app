const boardSize = 8;
type Playler = "Black" | "White";
type File = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
class Position {
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
    for (let piece of gameState) {
      if (piece.position) {
        const file = piece.position.file;
        const rank = piece.position.rank;
        if (piece.position.equal(this)) {
          return piece;
        }
      }
    }
    return null;
  }
}
type OptionalPosition = Position | null;
type GameState = Piece[];

abstract class Piece {
  position: OptionalPosition;
  type: string = "piece";
  constructor(readonly player: Playler, file: File, rank: Rank) {
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
  get(piece: Piece) {
    this.position = piece.position;
    piece.position = null;
  }
  abstract positionsCanMoveTo(gameState: GameState): Position[];
  abstract picesCanGet(gameState: GameState): Piece[];
}
type OptinalPiece = Piece | null;

class Pawn extends Piece {
  type = "pawn";

  positionsCanMoveTo(gameState: GameState) {
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
      if (nextPosition && !nextPosition.piece(gameState)) {
        positionsCanMoveTo.push(nextPosition);
      }
    }
    return positionsCanMoveTo;
  }

  picesCanGet(gameState: GameState): Piece[] {
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
        const getPiece = nextPosition.piece(gameState);
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
  positionsCanMoveTo(gameState: GameState) {
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
        if (!nextPosition || (nextPosition && nextPosition.piece(gameState))) {
          break;
        }
        positionsCanMoveTo.push(nextPosition);
      }
    }

    return positionsCanMoveTo;
  }
  picesCanGet(gameState: GameState): Piece[] {
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
        const pieceGet = nextPosition.piece(gameState);
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
  positionsCanMoveTo(gameState: GameState) {
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
        if (!nextPosition || (nextPosition && nextPosition.piece(gameState))) {
          break;
        }
        positionsCanMoveTo.push(nextPosition);
      }
    }

    return positionsCanMoveTo;
  }
  picesCanGet(gameState: GameState): Piece[] {
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
        const pieceGet = nextPosition.piece(gameState);
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
  positionsCanMoveTo(gameState: GameState) {
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
        if (!nextPosition || (nextPosition && nextPosition.piece(gameState))) {
          break;
        }
        positionsCanMoveTo.push(nextPosition);
      }
    }

    return positionsCanMoveTo;
  }
  picesCanGet(gameState: GameState): Piece[] {
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
        const pieceGet = nextPosition.piece(gameState);
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
  positionsCanMoveTo(gameState: GameState) {
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
      const nextPosition = this.position.addNumber(direction[0], direction[1]);
      if (!nextPosition || (nextPosition && nextPosition.piece(gameState))) {
        break;
      }
      positionsCanMoveTo.push(nextPosition);
    }

    return positionsCanMoveTo;
  }
  picesCanGet(gameState: GameState): Piece[] {
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
      const nextPosition = this.position.addNumber(direction[0], direction[1]);
      if (!nextPosition) {
        break;
      }
      const pieceGet = nextPosition.piece(gameState);
      if (pieceGet) {
        piecesCanGet.push(pieceGet);
        break;
      }
    }
    return piecesCanGet;
  }
}
