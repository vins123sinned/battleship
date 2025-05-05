import { dragInfo, temporaryCoordinates } from "./cell";
import { shipDragover, shipDrop } from "./events";

export function chooseRandom(max) {
    return Math.floor(Math.random() * max);
}

export function populateGameboard(coordinates, gameboard) {
    coordinates.forEach((coordinate) => {
        gameboard.placeShip(coordinate);
    });
}

/* Grid/Adjacents Functions */

export function takeAdjacent(row, column, takenCoordinates) {
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

export function untakeCoordinates(usedCoordinates) {
    const shipCells = dragInfo.draggedShip.querySelectorAll('.ship-cell');
    
    // this needs fixing!
    // double check at drop
    shipCells.forEach((cell) => {
        const [row, column] = cell.dataset.coordinate.split(',').map(Number);

        // make sure to restore if invalid at drop!
        temporaryCoordinates.add(cell.dataset.coordinate);
        temporaryAdjacents(row, column);
        temporaryCoordinates.forEach((coordinate) => {
            usedCoordinates.delete(coordinate);
        });

        /*
        // add cell drag listeners for temporarily available cells
        if (usedCoordinates && !usedCoordinates.has(cell.dataset.coordinate)) {
            cell.addEventListener('dragover', (event) => {
                shipDragover(event, usedCoordinates);
            });
            cell.addEventListener('drop', shipDrop);
        }
        */
    });
}

export function temporaryAdjacents(row, column) {
    const adjacentCells = [
        [row + 1, column], [row - 1, column],
        [row, column + 1], [row, column - 1],
        [row + 1, column + 1], [row + 1, column - 1],
        [row - 1, column + 1], [row - 1, column - 1],
    ]

    adjacentCells.forEach((cell) => {
        if (cell[0] > 9 || cell[0] < 0 || cell [1] > 9 || cell[1] < 0) return;

        if (!temporaryCoordinates.has(`${cell[0]},${cell[1]}`)) temporaryCoordinates.add(`${cell[0]},${cell[1]}`);
    })
}

/* Ship Functions */

export function randomizeShips(gameboard) {
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