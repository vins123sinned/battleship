import { gameController, players } from "../index.js";
import { Player } from "../player.js";
import { displayBoard, disableBoard, enableBoard, removeEmptyBoard, removeRandomizeButtons, hideBoard, setupHideBoard } from "./board.js";
import { randomizeShips, populateGameboard } from "./helpers.js";
import { cellClickHandler, playerGameStart, switchTurns } from "./events.js";

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

        document.addEventListener('click', cellClickHandler);
    });
}

function computerGame() {
    const { playerOne } = players;

    players.playerTwo = createPlayer('Computer');
    displayBoard(players.playerTwo);
    disableBoard(playerOne);
}

function playerGame() {
    players.playerTwo = createPlayer('Player Two');
    players.currentPlayer = players.playerTwo;
    const { playerOne, playerTwo } = players;

    displayBoard(playerTwo, true);
    setupHideBoard(playerOne);
}

export function showPassScreen() {
    const passDiv = document.createElement('div');
    const passHeading = document.createElement('h1');
    const passPara = document.createElement('p');
    const passButton = document.createElement('button');
    const overlay = document.createElement('div');

    passButton.type = 'button';
    passHeading.textContent = 'Pass Your Device!';
    passPara.textContent = 'When you\'re ready, click the button!';
    passButton.textContent = 'Start Turn';

    passDiv.classList.add('pass-div');
    passHeading.classList.add('pass-heading');
    passPara.classList.add('pass-para');
    passButton.classList.add('pass-button');
    overlay.classList.add('pass-overlay');

    passDiv.appendChild(passHeading)
    passDiv.appendChild(passPara);
    passDiv.append(passButton);

    document.body.appendChild(passDiv);
    document.body.appendChild(overlay);

    // add transition to pass screen
    void overlay.offsetWidth;
    overlay.classList.add('show');

    passButton.addEventListener('click', switchTurns);
}

export function removePassScreen() {
    const passDiv = document.querySelector('.pass-div');
    const overlay = document.querySelector('.pass-overlay');

    passDiv.remove();
    overlay.remove();
}

export function showIntermissionDiv(player) {
    const gameboard = document.querySelector(`[data-player="${player.name}"]`);

    gameboard.classList.add('grayed-out');
    gameboard.querySelectorAll('.column').forEach((column) => {
        column.classList.add('disabled');
    });

    const intermissionDiv = document.createElement('div');
    const intermissionHeading = document.createElement('h2');
    const intermissionPara = document.createElement('p');
    const intermissionButton = document.createElement('button');
    const overlay = document.createElement('div');

    intermissionButton.type = 'button';
    intermissionHeading.textContent = 'Place your ships';
    intermissionPara.textContent = 'When you\'re ready, click the button!';
    intermissionButton.textContent = 'Start game';

    intermissionDiv.classList.add('intermission-div');
    intermissionHeading.classList.add('intermission-heading');
    intermissionPara.classList.add('intermission-para');
    intermissionButton.classList.add('intermission-button');
    overlay.classList.add('intermission-overlay');

    intermissionDiv.appendChild(intermissionHeading)
    intermissionDiv.appendChild(intermissionPara);
    intermissionDiv.append(intermissionButton);

    gameboard.appendChild(intermissionDiv);
    gameboard.appendChild(overlay);

    intermissionButton.addEventListener('click', playerGameStart);
}

export function removeIntermissionDiv(player) {
    const gameboard = document.querySelector(`[data-player="${player.name}"]`);
    const intermissionDiv = document.querySelector('.intermission-div');
    const overlay = document.querySelector('.intermission-overlay');

    gameboard.classList.remove('grayed-out');
    intermissionDiv.remove();
    overlay.remove();
}

export function checkGameOver(playerOne, playerTwo) {
    if (playerOne.gameboard.allShipsSunk()) {
        gameOver(playerTwo.name);
    } else if (playerTwo.gameboard.allShipsSunk()) {
        gameOver(playerOne.name);
    }
}

function gameOver(winner) {
    players.currentPlayer = 'Game Over';
    const passDiv = document.querySelector('.pass-div');
    if (passDiv) removePassScreen();
    
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