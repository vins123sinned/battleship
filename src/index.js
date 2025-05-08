import "./styles.css";
import { createPlayer, gameStart } from "./dom/dom.js";
import { displayBoard, displayEmptyBoard } from "./dom/board.js";

export const players = {
  currentPlayer: null,
  playerOne: null,
  playerTwo: null,
};

export function gameController() {
  players.playerOne = createPlayer("Player One", true);
  players.currentPlayer = players.playerOne;

  displayBoard(players.playerOne, true);
  displayEmptyBoard();

  gameStart();
}

gameController();
