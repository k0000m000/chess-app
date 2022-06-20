import { type } from "@testing-library/user-event/dist/type";
import { useState } from "react";

const Game: React.FC = () => {
  const boardSize = 8;
  type Coproduct<T extends Record<keyof any, {}>> = {
    [K in keyof T]: Record<"type", K> & T[K];
  }[keyof T];
  type Individual<
    TCoproduct extends Record<"type", keyof any>,
    Tag extends TCoproduct["type"]
  > = Extract<TCoproduct, Record<"type", Tag>>;

  // もっと良い型定義を考える
  type Piece = Coproduct<{
    whitePawn: { kind: "pawn"; player: "white" };
    whiteKnight: { kind: "knight"; player: "white" };
    whiteBishop: { kind: "bishop"; player: "white" };
    whiteRook: { kind: "rook"; player: "white" };
    whiteQueen: { kind: "queen"; player: "white" };
    whiteKing: { kind: "king"; player: "white" };
    blackPawn: { kind: "pawn"; player: "black" };
    blackKnight: { kind: "knight"; player: "black" };
    blackBishop: { kind: "bishop"; player: "black" };
    blackRook: { kind: "rook"; player: "black" };
    blackQueen: { kind: "queen"; player: "black" };
    blackKing: { kind: "king"; player: "black" };
  }>;
  type OptinalPiece = Piece | null;

  type Board = [
    [
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece
    ],
    [
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece
    ],
    [
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece
    ],
    [
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece
    ],
    [
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece
    ],
    [
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece
    ],
    [
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece
    ],
    [
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece,
      OptinalPiece
    ]
  ];
  type Index = [number, number];

  type Pawn = Individual<Piece, "whitePawn"> | Individual<Piece, "blackPawn">;

  const canMove = (piece: Piece, current: Index, board: Board): Index[] => {
    if (!piece) {
      return [];
    }
    const checkInBoard = (index: Index): Boolean => {
      return (
        0 <= index[0] &&
        index[0] < boardSize &&
        0 <= index[1] &&
        index[1] < boardSize
      );
    };
    const checkNextIsNull = (index: Index): Boolean => {
      return !board[index[0]][index[1]];
    };

    let canMove: Index[] = [];
    switch (piece.kind) {
      case "pawn": {
        if (piece.player === "white") {
          const next: Index = [current[0], current[1] + 1];
          if (checkInBoard(next) && checkNextIsNull(next)) {
            canMove.push(next);
          }
        } else {
          const next: Index = [current[0], current[1] - 1];
          if (checkInBoard(next) && checkNextIsNull(next)) {
            canMove.push(next);
          }
        }

        return canMove;
      }
      case "knight": {
        for (let direction of [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ]) {
          for (let i of [1, 2]) {
            for (let j of [1, 2]) {
              if (i !== j) {
                const next: Index = [
                  current[0] + i * direction[0],
                  current[1] + j * direction[1],
                ];
                if (checkInBoard(next) && checkNextIsNull(next)) {
                  canMove.push(next);
                }
              }
            }
          }
        }
        return canMove;
      }
      case "bishop": {
        for (let direction of [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ]) {
          for (let i = 1; i < boardSize; i++) {
            const next: Index = [
              current[0] + i * direction[0],
              i * direction[0],
            ];
            if (!checkInBoard(next) || checkNextIsNull(next)) {
              break;
            }
            canMove.push(next);
          }
        }
        return canMove;
      }
      case "rook": {
        for (let direction of [
          [-1, 0],
          [0, -1],
          [0, 1],
          [1, 0],
        ]) {
          for (let i = 1; i < boardSize; i++) {
            const next: Index = [
              current[0] + i * direction[0],
              i * direction[0],
            ];
            if (!checkInBoard(next) || checkNextIsNull(next)) {
              break;
            }
            canMove.push(next);
          }
        }
        return canMove;
      }
      case "queen": {
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
            const next: Index = [
              current[0] + i * direction[0],
              i * direction[0],
            ];
            if (!checkInBoard(next) || checkNextIsNull(next)) {
              break;
            }
            canMove.push(next);
          }
        }
        return canMove;
      }
      case "king": {
        for (let i of [-1, 0, 1]) {
          for (let j of [-1, 0, 1]) {
            if (!i || !j) {
              const next: Index = [current[0] + i, current[1] + j];
              if (checkInBoard(next) && checkNextIsNull(next)) {
                canMove.push(next);
              }
            }
          }
        }
        return canMove;
      }
    }
  };

  const canGet = (piece: Piece, current: Index, board: Board): Index[] => {
    if (!piece) {
      return [];
    }
    const checkInBoard = (index: Index): Boolean => {
      return (
        0 <= index[0] &&
        index[0] < boardSize &&
        0 <= index[1] &&
        index[1] < boardSize
      );
    };
    const checkNextIsPiece = (index: Index): Boolean => {
      return !!board[index[0]][index[1]];
    };

    let canGet: Index[] = [];
    switch (piece.kind) {
      case "pawn": {
        if (piece.player === "white") {
          const next: Index = [current[0], current[1] + 1];
          if (checkInBoard(next) && checkNextIsPiece(next)) {
            canGet.push(next);
          }
        } else {
          const next: Index = [current[0], current[1] - 1];
          if (checkInBoard(next) && checkNextIsPiece(next)) {
            canGet.push(next);
          }
        }
        return canGet;
      }
      case "knight": {
        for (let direction of [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ]) {
          for (let i of [1, 2]) {
            for (let j of [1, 2]) {
              if (i !== j) {
                const next: Index = [
                  current[0] + i * direction[0],
                  current[1] + j * direction[1],
                ];
                if (checkInBoard(next) && checkNextIsPiece(next)) {
                  canGet.push(next);
                }
              }
            }
          }
        }
        return canGet;
      }
      case "bishop": {
        for (let direction of [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ]) {
          for (let i = 1; i < boardSize; i++) {
            const next: Index = [
              current[0] + i * direction[0],
              i * direction[0],
            ];
            if (!checkInBoard(next)) {
              break;
            }
            if (checkNextIsPiece(next)) {
              canGet.push(next);
              break;
            }
          }
        }
        return canGet;
      }
      case "rook": {
        for (let direction of [
          [-1, 0],
          [0, -1],
          [0, 1],
          [1, 0],
        ]) {
          for (let i = 1; i < boardSize; i++) {
            const next: Index = [
              current[0] + i * direction[0],
              i * direction[0],
            ];
            if (!checkInBoard(next)) {
              break;
            }
            if (checkNextIsPiece(next)) {
              canGet.push(next);
              break;
            }
          }
        }
        return canGet;
      }
      case "queen": {
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
            const next: Index = [
              current[0] + i * direction[0],
              i * direction[0],
            ];
            if (!checkInBoard(next)) {
              break;
            }
            if (checkNextIsPiece(next)) {
              canGet.push(next);
              break;
            }
          }
        }
        return canGet;
      }
      case "king": {
        for (let i of [-1, 0, 1]) {
          for (let j of [-1, 0, 1]) {
            if (!i || !j) {
              const next: Index = [current[0] + i, current[1] + j];
              if (checkInBoard(next) && checkNextIsPiece(next)) {
                canGet.push(next);
              }
            }
          }
        }
        return canGet;
      }
    }
  };

  const defaultBoard: Board = [
    [null, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
    [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
    [null, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
    [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
    [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
    [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
    [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
    [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
  ];

  const [currentBoard, setCurrentBoard] = useState<Board>();

  return <></>;
};

export default Game;
