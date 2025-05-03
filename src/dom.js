import { gameController, players } from "./index.js";
import { Player } from "./player.js";

export function createPlayer(name, currentTurn = false) {
    const player = new Player(name, currentTurn);

    // clear ships' stuff too!
    const shipCoordinates = randomizeShips();

    populateGameboard(shipCoordinates, player.gameboard);

    return player;
}

function randomizeShips() {
    const shipsLengths = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
    const shipCoordinates = [];
    const takenCoordinates = new Set();

    shipsLengths.forEach((length) => {
        while (true) {
            const startingRow = chooseRandom(10);
            const startingColumn = chooseRandom(10);
            // chooses randomly between horizontal and vertical
            const isHorizontal = chooseRandom(2) === 0;
            let invalid = false;

            // check if placement is invalid

            if (isHorizontal && (startingColumn + length) > 10) continue;
            if (!isHorizontal && (startingRow + length) > 10) continue;

            for (let i = 0; i < length; i++) {
                const row = isHorizontal ? startingRow : startingRow + i;
                const column = isHorizontal ? startingColumn + i : startingColumn;

                if (takenCoordinates.has(`${row},${column}`)) {
                    invalid = true;
                    break;
                };
            }

            if (invalid) continue;

            const shipArray = [];
            for (let i = 0; i < length; i++) {
                const row = isHorizontal ? startingRow : startingRow + i;
                const column = isHorizontal ? startingColumn + i : startingColumn;

                shipArray.push([row, column]);
                takenCoordinates.add(`${row},${column}`);

                // add adjacent cells to takenCoordinates
                takeAdjacent(row, column, takenCoordinates)
            }

            shipCoordinates.push(shipArray);
            break;
        }
    });
    
    return shipCoordinates
}

function chooseRandom(max) {
    return Math.floor(Math.random() * max);
}

function takeAdjacent(row, column, takenCoordinates) {
    const adjacentCells = [
        [row + 1, column], [row - 1, column],
        [row, column + 1], [row, column - 1],
        [row + 1, column + 1], [row + 1, column - 1],
        [row - 1, column + 1], [row - 1, column - 1],
    ]

    adjacentCells.forEach((cell) => {
        if (cell[0] > 9 || cell[0] < 0 || cell [1] > 9 || cell[1] < 0) return;

        if (!takenCoordinates.has(`${cell[0]},${cell[1]}`)) takenCoordinates.add(`${cell[0]},${cell[1]}`);
    })
}

function populateGameboard(coordinates, gameboard) {
    coordinates.forEach((coordinate) => {
        gameboard.placeShip(coordinate);
    });
}

export function displayBoard(player) {
    const boardData = player.gameboard.board;

    const boards = document.querySelector('.boards');
    const gameboardContainer = document.createElement('div');
    const gameboard = document.createElement('div');
    const gameboardName = document.createElement('h2');

    gameboard.dataset.player = player.name;
    gameboardName.textContent = player.name;
    gameboardContainer.classList.add('gameboard-container');
    gameboard.classList.add('gameboard');
    gameboardName.classList.add('board-name');

    gameboardContainer.appendChild(gameboard);
    gameboardContainer.appendChild(gameboardName);
    boards.appendChild(gameboardContainer);

    createCells(gameboard, boardData, player.gameboard.attacks);
    mergeShipCells();
}

function createCells(gameboard, boardData, attacks) {
    let rowIndex = 0;
    let columnIndex = 0;

    boardData.forEach((row) => {
        row.forEach((column) => {
            const columnDiv = document.createElement('div');

            columnDiv.dataset.coordinate = `${rowIndex},${columnIndex}`;
            columnDiv.classList.add('column');
            if (column.length !== 0) columnDiv.classList.add('ship-column');

            const attackInfo = attacks.find((attack) => attack.coordinate[0] === rowIndex && attack.coordinate[1] === columnIndex);
            if (attackInfo) {
                // cell already hit
                if (attackInfo.result === 'hit') {
                    const closeIcon = document.createElement('span');
                    closeIcon.classList.add('material-symbols-outlined');
                    closeIcon.textContent = 'close';

                    columnDiv.classList.add('hit-column');
                    columnDiv.appendChild(closeIcon);
                } else {   
                    columnDiv.classList.add('miss-column');
                }
            }

            gameboard.appendChild(columnDiv);
            columnIndex++;
        });

        rowIndex++;
        columnIndex = 0;
    });

    mergeShipCells();
}

export function displayEmptyBoard(rows = 10, columns = 10) {
    const boards = document.querySelector('.boards');
    const gameboardContainer = document.createElement('div');
    const gameboard = document.createElement('div');
    const gameboardName = document.createElement('h2');

    gameboard.dataset.player = 'Opponent';
    gameboardName.textContent = 'Opponent';
    gameboardContainer.classList.add('gameboard-container');
    gameboard.classList.add('gameboard', 'start-board');
    gameboardName.classList.add('board-name');

    gameboardContainer.appendChild(gameboard);
    gameboardContainer.appendChild(gameboardName);
    boards.appendChild(gameboardContainer);

    // creates necessary data to output empty grid
    const boardData = [];
    const attacks  = [];
    
    for (let r = 0; r < rows; r++) {
        const row = [];

        for (let c = 0; c < columns; c++) {
            row.push([]);
        }

        boardData.push(row);
    }

    createCells(gameboard, boardData, attacks);
}

function removeEmptyBoard() {
    const emptyBoard = document.querySelector('.start-board').parentNode;
    emptyBoard.remove();
}

// removes unnecessary border between adjacent ship cells
function mergeShipCells() {
    const shipCells = document.querySelectorAll('.ship-column');
    
    shipCells.forEach((cell) => {
        const shipCoordinate = cell.dataset.coordinate.split(',');

        const upCell = document.querySelector(`[data-coordinate="${parseInt(shipCoordinate[0]) + 1},${shipCoordinate[1]}"]`);
        const downCell = document.querySelector(`[data-coordinate="${parseInt(shipCoordinate[0]) - 1},${shipCoordinate[1]}"]`);
        const rightCell = document.querySelector(`[data-coordinate="${shipCoordinate[0]},${parseInt(shipCoordinate[1]) + 1}"]`);
        const leftCell = document.querySelector(`[data-coordinate="${shipCoordinate[0]},${parseInt(shipCoordinate[1]) - 1}"]`);

        if (upCell && upCell.classList.contains('ship-column')) {
            cell.style.borderBottom = 'none';
        }

        if (downCell && downCell.classList.contains('ship-column')) {
            cell.style.borderTop = 'none';
        }

        if (rightCell && rightCell.classList.contains('ship-column')) {
            cell.style.borderRight = 'none';
        }

        if (leftCell && leftCell.classList.contains('ship-column')) {
            cell.style.borderLeft = 'none';
        }
    });
}

export function disableBoard(player) {
    const gameboard = document.querySelector(`[data-player="${player.name}"]`);
    gameboard.classList.add('disabled');
}

export function enableBoard(player) {
    const gameboard = document.querySelector(`[data-player="${player.name}"]`);
    gameboard.classList.remove('disabled');
}

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

        players.playerTwo = createPlayer(currentOption.textContent);
        displayBoard(players.playerTwo);

        document.addEventListener('click', cellClickHandler);
    });
}

function cellClickHandler(event) {
    cellListener(event, players.playerOne, players.playerTwo);
}

function cellListener(event, playerOne, playerTwo) {
    if (event.target.classList.contains('column')) {
        const currentPlayer = playerOne.currentTurn ? playerTwo : playerOne;
        const currentBoard = currentPlayer.gameboard;
        const coordinate = event.target.dataset.coordinate.split(',').map(Number);

        if (currentBoard.isAlreadyAttacked(coordinate)) return;
        currentBoard.receiveAttack(coordinate);

        updateBoard(currentPlayer);
        updatePlayerTurn(playerOne, playerTwo);

        // computer makes move
        if (playerTwo.currentTurn === true && playerTwo.name === 'Computer') {
            playerOne.gameboard.receiveAttack(playerOne.gameboard.chooseRandomCoordinate());
            updateBoard(playerOne);
            updatePlayerTurn(playerOne, playerTwo);
        };

        checkGameOver(playerOne, playerTwo);
    }
}

function updatePlayerTurn(playerOne, playerTwo) {
    const currentPlayer = playerOne.currentTurn ? playerOne : playerTwo;
    const nextPlayer = playerOne.currentTurn ? playerTwo: playerOne;

    currentPlayer.currentTurn = false;
    nextPlayer.currentTurn = true;

    disableBoard(nextPlayer);
    enableBoard(currentPlayer);
}

function updateBoard(player) {
    const gameboard = document.querySelector(`[data-player="${player.name}"]`);
    gameboard.replaceChildren();

    createCells(gameboard, player.gameboard.board, player.gameboard.attacks);
}

function checkGameOver(playerOne, playerTwo) {
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