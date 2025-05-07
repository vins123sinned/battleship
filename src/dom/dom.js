import { gameController, players } from "../index.js";
import { Player } from "../player.js";
import { displayBoard, disableBoard, enableBoard, removeEmptyBoard, removeRandomizeButtons, hideBoard, setupHideBoard } from "./board.js";
import { randomizeShips, populateGameboard } from "./helpers.js";
import { cellClickHandler } from "./events.js";

export function createPlayer(name, currentTurn = false) {
    const player = new Player(name, currentTurn);

    const shipCoordinates = randomizeShips(player.gameboard);

    populateGameboard(shipCoordinates, player.gameboard);

    return player;
}

/* Game Controller Functions */

export function gameStart() {
    const startBoard = document.querySelector('.start-board');
    const gameOptionsDiv = document.createElement('div');
    const gameOptionsHeading = document.createElement('h2');
    const playerOption = document.createElement('button');
    const computerOption = document.createElement('button');
    const startButton = document.createElement('button');
    const overlay = document.createElement('div');

    playerOption.type = 'button';
    computerOption.type = 'button';
    startButton.type = 'button';

    gameOptionsHeading.textContent = 'Opponent';
    playerOption.textContent = 'Player';
    computerOption.textContent = 'Computer';
    startButton.textContent = 'Start Game';

    gameOptionsDiv.classList.add('game-options-div');
    gameOptionsHeading.classList.add('game-options-heading');
    playerOption.classList.add('player-option', 'current-option');
    computerOption.classList.add('computer-option');
    startButton.classList.add('start-button');
    overlay.classList.add('start-overlay');

    gameOptionsDiv.appendChild(gameOptionsHeading);
    gameOptionsDiv.appendChild(playerOption);
    gameOptionsDiv.appendChild(computerOption);
    gameOptionsDiv.appendChild(startButton);

    startBoard.appendChild(gameOptionsDiv);
    startBoard.appendChild(overlay);

    playerOption.addEventListener('click', () => {
        if (computerOption.classList.contains('current-option')) computerOption.classList.remove('current-option');
        playerOption.classList.add('current-option');
    });

    computerOption.addEventListener('click', () => {
        if (playerOption.classList.contains('current-option')) playerOption.classList.remove('current-option');
        computerOption.classList.add('current-option');
    });

    startButton.addEventListener('click', () => {
        const currentOption = document.querySelector('.current-option');

        removeEmptyBoard();
        removeRandomizeButtons();

        if (currentOption.textContent === 'Player') {
            playerGame();
        } else if (currentOption.textContent === 'Computer') {
            computerGame();
        }
    });
}

function computerGame() {
    const { playerOne } = players;

    players.playerTwo = createPlayer('Computer');
    displayBoard(players.playerTwo);
    disableBoard(playerOne);

    document.addEventListener('click', cellClickHandler);
}

function playerGame() {
    players.currentPlayer = players.playerOne;
    players.playerTwo = createPlayer('Player Two');
    const { playerOne, playerTwo } = players;

    displayBoard(playerTwo, true);
    setupHideBoard(playerOne);
}

export function checkGameOver(playerOne, playerTwo) {
    if (playerOne.gameboard.allShipsSunk()) {
        gameOver(playerTwo.name);
    } else if (playerTwo.gameboard.allShipsSunk()) {
        gameOver(playerOne.name);
    }
}

function gameOver(winner) {
    const overlay = document.createElement('div');
    const gameOverDiv = document.createElement('div');
    const gameOverHeading = document.createElement('h1');
    const gameOverResult = document.createElement('h2');
    const newGameButton = document.createElement('button');

    newGameButton.type = 'button';
    gameOverHeading.textContent = 'Game Over!';
    gameOverResult.textContent = `${winner} has won.`;
    newGameButton.textContent = 'New game';

    overlay.classList.add('overlay');
    gameOverDiv.classList.add('game-over-div');
    gameOverHeading.classList.add('game-over-heading');
    gameOverResult.classList.add('game-over-result');
    newGameButton.classList.add('new-game-button');

    newGameButton.addEventListener('click', () => {
        overlay.remove();
        gameOverDiv.remove();
        resetGame();
    });

    gameOverDiv.appendChild(gameOverHeading);
    gameOverDiv.appendChild(gameOverResult);
    gameOverDiv.appendChild(newGameButton);

    document.body.appendChild(overlay);
    document.body.appendChild(gameOverDiv);
}

function resetGame() {
    const boards = document.querySelector('.boards');
    boards.replaceChildren();

    document.body.removeEventListener('click', cellClickHandler);

    gameController();
}

export function updatePlayerTurn(playerOne, playerTwo) {
    const currentPlayer = playerOne.currentTurn ? playerOne : playerTwo;
    const nextPlayer = playerOne.currentTurn ? playerTwo: playerOne;

    currentPlayer.currentTurn = false;
    nextPlayer.currentTurn = true;

    disableBoard(nextPlayer);
    enableBoard(currentPlayer);
}