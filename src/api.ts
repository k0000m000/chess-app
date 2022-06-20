const sizeOfBowrd = 8;

type move = [Number, Number];
interface Piece {
  name: string;
  moves: move[];
  numbre: number;
}

const pawn: Piece = {
  name: "pawn",
  moves: [[0, 1]],
  numbre: 8,
};

let knightMove: move[] = [];
for (let i of [1, 2]) {
  for (let j of [1, 2]) {
    if (i !== j) {
      knightMove.push([-i, -i]);
      knightMove.push([-i, i]);
      knightMove.push([i, -i]);
      knightMove.push([i, i]);
    }
  }
}
const knight: Piece = {
  name: "knight",
  moves: knightMove,
  numbre: 2,
};

let bishopMove: move[] = [];
for (let i = 1; i <= sizeOfBowrd - 1; i++) {
  bishopMove.push([-i, -i]);
  bishopMove.push([-i, i]);
  bishopMove.push([i, -i]);
  bishopMove.push([i, i]);
}
const bishop: Piece = {
  name: "bishop",
  moves: bishopMove,
  numbre: 2,
};

let rookMove: move[] = [];
for (let i = 1; i <= sizeOfBowrd - 1; i++) {
  rookMove.push([-i, 0]);
  rookMove.push([0, -i]);
  rookMove.push([i, 0]);
  rookMove.push([0, i]);
}
const rook: Piece = {
  name: "rook",
  moves: rookMove,
  numbre: 2,
};

let queenMove: move[] = [];
for (let i = 1; i <= sizeOfBowrd - 1; i++) {
  queenMove.push([-i, -i]);
  queenMove.push([-i, i]);
  queenMove.push([i, -i]);
  queenMove.push([i, i]);
  queenMove.push([-i, 0]);
  queenMove.push([0, -i]);
  queenMove.push([i, 0]);
  queenMove.push([0, i]);
}
const queen: Piece = {
  name: "queen",
  moves: queenMove,
  numbre: 1,
};

let kingMove: move[] = [];
for (let i of [-1, 0, 1]) {
  for (let j of [-1, 0, 1]) {
    if (i !== 0 || j !== 0) {
      kingMove.push([i, j]);
    }
  }
}
const king: Piece = {
  name: "king",
  moves: kingMove,
  numbre: 1,
};
