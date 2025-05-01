import { Player } from "./player.js";

export function createPlayer() {
    const player = new Player();

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

export function displayBoards(player, name) {
    const board = player.gameboard.board;

    const boards = document.querySelector('.boards');
    const gameboardContainer = document.createElement('div');
    const gameboard = document.createElement('div');
    const boardName = document.createElement('h2');

    boardName.textContent = name;
    gameboardContainer.classList.add('gameboard-container');
    gameboard.classList.add('gameboard');
    boardName.classList.add('board-name');
    
    let rowIndex = 0;
    let columnIndex = 0;
    board.forEach((row) => {
        // add dataset for coordinates
        row.forEach((column) => {
            const columnDiv = document.createElement('div');

            columnDiv.dataset.coordinate = `${rowIndex},${columnIndex}`;
            columnDiv.classList.add('column');
            if (column.length !== 0) columnDiv.classList.add('ship-column');

            gameboard.appendChild(columnDiv);
            columnIndex++;
        });

        rowIndex++;
        columnIndex = 0;
    });

    gameboardContainer.appendChild(gameboard);
    gameboardContainer.appendChild(boardName);
    boards.appendChild(gameboardContainer);
}