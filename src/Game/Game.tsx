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
  const { gameState, select, player, handleClick } = useGame();
  return <Board gameState={gameState} onClick={handleClick}></Board>;
};

interface BoardProps {
  gameState: GameState;
  onClick: (position: Position) => React.MouseEventHandler<HTMLButtonElement>;
}

const Board: React.FC<BoardProps> = (props) => {
  const fileList: File[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const rankList: Rank[] = ["8", "7", "6", "5", "4", "3", "2", "1"];

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
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Square: React.FC<SquareProps> = (props) => {
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

  const Square = styled.button`
    border: 1px solid #999;
    background: #c0c0c0;
    float: left;
    font-size: 24px;
    fonr-color: ${props.piece?.player === "White" ? "#fff" : "#000"}
    font-weight: bold;
    height: 40px;
    margin: 0px;
    padding: 0;
    text-align: center;
    width: 40px;
  `;

  return <Square onClick={props.onClick}>{visual}</Square>;
};

export default Game;
