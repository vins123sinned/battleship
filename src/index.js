import './styles.css';
import { createPlayer, disableBoard, displayBoards, updateBoard, updatePlayerTurn, gameOver } from "./dom.js";

function gameController() {
    
}

const playerOne = createPlayer('Player One', true);
const playerTwo = createPlayer('Player Two');

displayBoards(playerOne);
displayBoards(playerTwo);

disableBoard(playerOne);

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('column')) {
        const currentPlayer = playerOne.currentTurn ? playerTwo : playerOne;
        const currentBoard = currentPlayer.gameboard;
        const coordinate = event.target.dataset.coordinate.split(',').map(Number);

        if (currentBoard.isAlreadyAttacked(coordinate)) return;
        currentBoard.receiveAttack(coordinate);

        updateBoard(currentPlayer);
        updatePlayerTurn(playerOne, playerTwo);

        // computer makes move
        if (playerTwo.currentTurn === true) {
            playerOne.gameboard.receiveAttack(playerOne.gameboard.chooseRandomCoordinate());
            updateBoard(playerOne);
            updatePlayerTurn(playerOne, playerTwo);
        };

        checkGameOver();
    }
});

function checkGameOver() {
    if (playerOne.gameboard.allShipsSunk()) {
        gameOver(playerTwo.name);
    } else if (playerTwo.gameboard.allShipsSunk()) {
        gameOver(playerOne.name);
    }
}