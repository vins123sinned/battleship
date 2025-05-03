import './styles.css';
import { createPlayer, disableBoard, displayBoard, updateBoard, updatePlayerTurn, gameOver, gameStart, displayEmptyBoard } from "./dom.js";

function gameController() {
    const playerOne = createPlayer('Player One', true);
    let playerTwo;

    displayBoard(playerOne);
    displayEmptyBoard();
    //displayBoard(playerTwo);

    disableBoard(playerOne);

    gameStart();

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
    
            checkGameOver(playerOne, playerTwo);
        }
    });
}

function checkGameOver(playerOne, playerTwo) {
    if (playerOne.gameboard.allShipsSunk()) {
        gameOver(playerTwo.name);
    } else if (playerTwo.gameboard.allShipsSunk()) {
        gameOver(playerOne.name);
    }
}

gameController();

const startBoard = document.querySelector('.start-board');
const gameOptionsDiv = document.createElement('div');
const gameOptionsHeading = document.createElement('h2');
const playerOption = document.createElement('button');
const computerOption = document.createElement('button');
const startButton = document.createElement('button');

playerOption.type = 'button';
computerOption.type = 'button';
startButton.type = 'button';

gameOptionsHeading.textContent = 'Opponent';
playerOption.textContent = 'Player';
computerOption.textContent = 'Computer';
startButton.textContent = 'Start Game';

gameOptionsDiv.classList.add('game-options-div');
gameOptionsHeading.classList.add('game-options-heading');
playerOption.classList.add('player-option');
computerOption.classList.add('computer-option');
startButton.classList.add('start-button');

playerOption.addEventListener('click', () => {
    console.log('player');
});

computerOption.addEventListener('click', () => {
    console.log('computer!');
})

startButton.addEventListener('click', () => {
    console.log('Start game');
})

gameOptionsDiv.appendChild(gameOptionsHeading);
gameOptionsDiv.appendChild(playerOption);
gameOptionsDiv.appendChild(computerOption);
gameOptionsDiv.appendChild(startButton);

startBoard.appendChild(gameOptionsDiv);