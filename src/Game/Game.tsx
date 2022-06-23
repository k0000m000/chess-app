import React, { useState } from "react";
import styled from "styled-components";

import useGame, {
  GameState,
  Position,
  File,
  Rank,
  boardSize,
  OptinalPiece,
  Select,
} from "./useGame";

const Game: React.FC = () => {
  const { gameState, select, player, handleClick } = useGame();
  return (
    <div>
      <h1>{`${player} turn`}</h1>
      <Board
        gameState={gameState}
        select={select}
        onClick={handleClick}
      ></Board>
    </div>
  );
};

interface BoardProps {
  gameState: GameState;
  select: Select;
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
          position={position}
          isSelected={props.select && !!props.select.position?.equal(position)}
          canMoveTo={
            props.select && position.in(props.select.canMoveTo(props.gameState))
          }
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
  position: Position;
  isSelected: boolean;
  canMoveTo: boolean;
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
    color: ${props.piece?.player === "White" ? "#ffffff" : "#000000"};
    text-shadow: 1px 1px #000000;
    border: 1px solid #999;
    background: ${props.isSelected
      ? "#ff8c00"
      : props.canMoveTo
      ? "#ffa500"
      : (props.position.file.charCodeAt(0) +
          props.position.rank.charCodeAt(0)) %
          2 ===
        0
      ? "#8b4513"
      : "#f5deb3"};
    font-size: 24px;
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
