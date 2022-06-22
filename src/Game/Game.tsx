import React, { useState } from "react";
import styled from "styled-components";

import useGame, {
  GameState,
  Position,
  File,
  Rank,
  boardSize,
  OptinalPiece,
} from "./useGame";

const Game: React.FC = () => {
  const { gameState, select, handleClick } = useGame();

  return <Board gameState={gameState} onClick={handleClick}></Board>;
};

interface BoardProps {
  gameState: GameState;
  onClick: (position: Position) => React.MouseEventHandler<HTMLAnchorElement>;
}

const Board: React.FC<BoardProps> = (props) => {
  const fileList: File[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const rankList: Rank[] = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const squares = rankList.map((rank) =>
    fileList.map((file) => {
      const position = new Position(file, rank);
      return (
        <Square
          piece={position.piece(props.gameState)}
          onClick={props.onClick(position)}
        />
      );
    })
  );

  const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(${boardSize}, 1fr);
    width: 320px;
  `;
  return <Wrapper>{squares}</Wrapper>;
};

interface SquareProps {
  piece: OptinalPiece;
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
}

const Square: React.FC<SquareProps> = (props) => {
  // ジェネリックでよりよく書ける
  let visual = "";
  if (props.piece) {
    if (props.piece.type === "pawn") {
      visual = "P";
    } else if (props.piece.type === "knight") {
      visual = "N";
    } else if (props.piece.type === "bishop") {
      visual = "B";
    } else if (props.piece.type === "rook") {
      visual = "R";
    } else if (props.piece.type === "queen") {
      visual = "Q";
    } else if (props.piece.type === "king") {
      visual = "K";
    }
  }

  const Wrapper = styled.div`
    border: 1px solid #999;
    float: left;
    font-size: 24px;
    font-weight: bold;
    height: 40px;
    margin: 0px;
    padding: 0;
    text-align: center;
    width: 40px;
  `;

  return <Wrapper>{visual}</Wrapper>;
};

export default Game;