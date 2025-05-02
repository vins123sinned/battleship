import './styles.css';
import { createPlayer, disableBoard, displayBoards, updateBoard, updatePlayerTurn } from "./dom.js";

const playerOne = createPlayer('Player One', true);
const playerTwo = createPlayer('Player Two');

displayBoards(playerOne);
displayBoards(playerTwo);

disableBoard(playerOne);

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('column')) {
        const currentPlayer = playerOne.currentTurn ? playerTwo : playerOne;
        const currentBoard = currentPlayer.gameboard;
        const coordinate = event.target.dataset.coordinate.split(',');

        if (currentBoard.isAlreadyAttacked(coordinate)) return console.log('Already attacked');
        currentBoard.receiveAttack(coordinate);

        updateBoard(currentPlayer);
        updatePlayerTurn(playerOne, playerTwo);
    }
});
