import { gameController, players } from "./index.js";
import { Player } from "./player.js";

let draggedShip = null;
let draggedCellIndex = null;

export function createPlayer(name, currentTurn = false) {
    const player = new Player(name, currentTurn);

    const shipCoordinates = randomizeShips(player.gameboard);

    populateGameboard(shipCoordinates, player.gameboard);

    return player;
}

function randomizeShips(gameboard) {
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
    
    gameboard.use(takenCoordinates);
    return shipCoordinates
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

/* Gameboard */

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

    // fix when 2 player implementation started!
    if (player.name === 'Player One') {
        addRandomizeButton(player, gameboardContainer);
    }

    createCells(gameboard, boardData, player.gameboard);
}

function createCells(gameboard, boardData, gameboardObject) {
    let rowIndex = 0;
    let columnIndex = 0;

    boardData.forEach((row) => {
        row.forEach(() => {
            const columnDiv = document.createElement('div');

            columnDiv.dataset.coordinate = `${rowIndex},${columnIndex}`;
            columnDiv.classList.add('column');

            // maybe move to ship div
            if (gameboardObject.attacks && gameboardObject.attacks.find((attack) => attack.coordinate[0] === rowIndex && attack.coordinate[1] === columnIndex)) {
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

            if (gameboardObject.usedCoordinates && !gameboardObject.usedCoordinates.has(columnDiv.dataset.coordinate)) {
                // check if droppable
                columnDiv.addEventListener('dragover', (event) => {
                    event.preventDefault();

                    previewShipPlacement(event.target.dataset.coordinate, gameboardObject.usedCoordinates);
                });

                columnDiv.addEventListener('drop', (event) => {
                    event.preventDefault();
                });
            }
        });

        rowIndex++;
        columnIndex = 0;
    });

    if (gameboardObject.ships) createShipCells(gameboardObject.ships, gameboard);
    //mergeShipCells(gameboard);
}

function previewShipPlacement(coordinate, usedCoordinates) {
    // no need to check if taken because only adjacent will change
    console.log(coordinate);
}

function createShipCells(ships, gameboard) {
    console.log(ships);
    ships.forEach((ship) => {
        const shipDiv = document.createElement('div');
        shipDiv.classList.add('ship-div');
        shipDiv.style.position = 'absolute';

        // place ship in correct location
        const [startingRow, startingColumn] = ship.coordinates[0];
        shipDiv.style.top = `${(startingRow * 50) - 1}px`;
        shipDiv.style.left = `${(startingColumn * 50) - 1}px`;
        shipDiv.style.display = (ship.direction === 'vertical') ? 'block' : 'flex';
        shipDiv.draggable = 'true';

        // reminder to update coordinates when dragged!
        let shipIndex = 0;
        ship.coordinates.forEach((coordinate) => {
            const shipCell = document.createElement('div');
            shipCell.classList.add('ship-cell');
            shipCell.dataset.coordinate = `${coordinate[0]},${coordinate[1]}`;
            shipCell.dataset.shipIndex = shipIndex;

            shipDiv.appendChild(shipCell);
            shipIndex++;

            shipCell.addEventListener('mousedown', () => {
                draggedCellIndex = shipCell.dataset.shipIndex;
            });
        });

        gameboard.appendChild(shipDiv);

        shipDiv.addEventListener('dragstart', (event) => {
            draggedShip = event.target;
        });
    });
}

// removes unnecessary border between adjacent ship cells
function mergeShipCells(gameboard) {
    const shipCells = gameboard.querySelectorAll('.ship-column');
    
    shipCells.forEach((cell) => {
        const shipCoordinate = cell.dataset.coordinate.split(',');

        const upCell = gameboard.querySelector(`[data-coordinate="${parseInt(shipCoordinate[0]) + 1},${shipCoordinate[1]}"]`);
        const downCell = gameboard.querySelector(`[data-coordinate="${parseInt(shipCoordinate[0]) - 1},${shipCoordinate[1]}"]`);
        const rightCell = gameboard.querySelector(`[data-coordinate="${shipCoordinate[0]},${parseInt(shipCoordinate[1]) + 1}"]`);
        const leftCell = gameboard.querySelector(`[data-coordinate="${shipCoordinate[0]},${parseInt(shipCoordinate[1]) - 1}"]`);

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

function addRandomizeButton(player, gameboardContainer) {
    const randomizeButton = document.createElement('button');
    const randomizeIcon = document.createElement('span');

    randomizeButton.classList.add('randomize-button');
    randomizeIcon.classList.add('material-symbols-outlined');
    randomizeIcon.textContent = 'refresh';

    randomizeButton.type = 'button';
    randomizeButton.textContent = 'Randomize';

    randomizeButton.appendChild(randomizeIcon);
    gameboardContainer.appendChild(randomizeButton);

    randomizeButton.addEventListener('click', () => {
        player.gameboard.clearBoard();

        const shipCoordinates = randomizeShips();
        populateGameboard(shipCoordinates, player.gameboard);

        updateBoard(player);
    });
}

function removeRandomizeButtons() {
    const randomizeButton = document.querySelectorAll('.randomize-button');
    randomizeButton.forEach((button) => {
        button.remove();
    });
}

function updateBoard(player) {
    const gameboard = document.querySelector(`[data-player="${player.name}"]`);
    gameboard.replaceChildren();

    createCells(gameboard, player.gameboard.board, player.gameboard.attacks);
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

export function disableBoard(player) {
    const gameboard = document.querySelector(`[data-player="${player.name}"]`);
    gameboard.classList.add('disabled');
}

export function enableBoard(player) {
    const gameboard = document.querySelector(`[data-player="${player.name}"]`);
    gameboard.classList.remove('disabled');
}

/* Helper Functions */

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

        players.playerTwo = createPlayer(currentOption.textContent);
        displayBoard(players.playerTwo);

        document.addEventListener('click', cellClickHandler);
    });
}

function updatePlayerTurn(playerOne, playerTwo) {
    const currentPlayer = playerOne.currentTurn ? playerOne : playerTwo;
    const nextPlayer = playerOne.currentTurn ? playerTwo: playerOne;

    currentPlayer.currentTurn = false;
    nextPlayer.currentTurn = true;

    disableBoard(nextPlayer);
    enableBoard(currentPlayer);
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

function chooseRandom(max) {
    return Math.floor(Math.random() * max);
}