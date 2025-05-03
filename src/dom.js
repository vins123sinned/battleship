import { Player } from "./player.js";

export function createPlayer(name, currentTurn = false) {
    const player = new Player(name, currentTurn);

    const shipCoordinates = [
        [[1, 1]],
        [[3, 1], [3, 2], [3, 3]],
        [[8, 1], [8, 2]],
        [[5, 3], [5, 4], [5, 5], [5, 6]],
        [[8, 4], [8, 5]],
        [[0, 4]],
        [[1, 7]],
        [[1, 9]],
        [[4, 8], [3, 8]],
        [[6, 9], [7, 9], [8, 9]],
    ];

    populateGameboard(shipCoordinates, player.gameboard);

    return player;
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

    createCells(gameboard, boardData, player.gameboard.attacks);

    gameboardContainer.appendChild(gameboard);
    gameboardContainer.appendChild(gameboardName);
    boards.appendChild(gameboardContainer);

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

export function updateBoard(player) {
    const gameboard = document.querySelector(`[data-player="${player.name}"]`);
    gameboard.replaceChildren();

    createCells(gameboard, player.gameboard.board, player.gameboard.attacks);
}

export function updatePlayerTurn(playerOne, playerTwo) {
    const currentPlayer = playerOne.currentTurn ? playerOne : playerTwo;
    const nextPlayer = playerOne.currentTurn ? playerTwo: playerOne;

    currentPlayer.currentTurn = false;
    nextPlayer.currentTurn = true;

    disableBoard(nextPlayer);
    enableBoard(currentPlayer);
}

export function disableBoard(player) {
    const gameboard = document.querySelector(`[data-player="${player.name}"]`);
    gameboard.classList.add('disabled');
}

export function enableBoard(player) {
    const gameboard = document.querySelector(`[data-player="${player.name}"]`);
    gameboard.classList.remove('disabled');
}

export function gameOver(winner) {
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
        console.log('click!');
    });

    gameOverDiv.appendChild(gameOverHeading);
    gameOverDiv.appendChild(gameOverResult);
    gameOverDiv.appendChild(newGameButton);

    document.body.appendChild(overlay);
    document.body.appendChild(gameOverDiv);
}

export function gameStart() {
    const startBoard = document.querySelector('.start-board');
    const overlay = document.createElement('div');
    overlay.classList.add('start-overlay');

    startBoard.appendChild(overlay);
    // createOverlay
}