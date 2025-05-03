import './styles.css';
import { createPlayer, disableBoard, displayBoard, gameStart, displayEmptyBoard } from "./dom.js";

export const players = {
    playerOne: null,
    playerTwo: null,
}

export function gameController() {
    players.playerOne = createPlayer('Player One', true);

    displayBoard(players.playerOne);
    displayEmptyBoard();

    disableBoard(players.playerOne);
    gameStart();
}

gameController();