import { players } from "..";
import { updateBoard } from "./board";
import { dragInfo, temporaryCoordinates } from "./cell";
import { updatePlayerTurn } from "./dom";

/* Randomize Button */

export function chooseRandom(max) {
    return Math.floor(Math.random() * max);
}

export function populateGameboard(coordinates, gameboard) {
    coordinates.forEach((coordinate) => {
        gameboard.placeShip(coordinate);
    });
}

/* Grid/Adjacents Functions */

export function useAdjacent(row, column) {
    const usedCoordinates = dragInfo.player.gameboard.usedCoordinates;
    const adjacentCells = [
        [row + 1, column], [row - 1, column],
        [row, column + 1], [row, column - 1],
        [row + 1, column + 1], [row + 1, column - 1],
        [row - 1, column + 1], [row - 1, column - 1],
    ];

    adjacentCells.forEach((cell) => {
        if (cell[0] > 9 || cell[0] < 0 || cell [1] > 9 || cell[1] < 0) return;

        usedCoordinates.add(`${cell[0]},${cell[1]}`);
    });
}

export function takeAdjacent(row, column, takenCoordinates) {
    const adjacentCells = [
        [row + 1, column], [row - 1, column],
        [row, column + 1], [row, column - 1],
        [row + 1, column + 1], [row + 1, column - 1],
        [row - 1, column + 1], [row - 1, column - 1],
    ];

    adjacentCells.forEach((cell) => {
        if (cell[0] > 9 || cell[0] < 0 || cell [1] > 9 || cell[1] < 0) return;

        if (!takenCoordinates.has(`${cell[0]},${cell[1]}`)) takenCoordinates.add(`${cell[0]},${cell[1]}`);
    });
}

export function untakeCoordinates(usedCoordinates) {
    // makes sure to clear temporary coordinates beforehand!
    temporaryCoordinates.clear();

    const shipCells = dragInfo.draggedShip.querySelectorAll('.ship-cell');
    const draggedShipCells = dragInfo.draggedShip.querySelectorAll('.ship-cell');
    const skipCells = new Set();

    draggedShipCells.forEach((cell) => {
        skipCells.add(cell.dataset.coordinate);
    });
    
    shipCells.forEach((cell) => {
        const [row, column] = cell.dataset.coordinate.split(',').map(Number);

        // populate temporaryCoordinates with coordinates to remove
        temporaryCoordinates.add(cell.dataset.coordinate);
        temporaryAdjacents(row, column, skipCells);

        temporaryCoordinates.forEach((coordinate) => {
            usedCoordinates.delete(coordinate);
        });
    });
}

export function temporaryAdjacents(row, column, skipCells) {
    const adjacentCells = [
        [row + 1, column], [row - 1, column],
        [row, column + 1], [row, column - 1],
        [row + 1, column + 1], [row + 1, column - 1],
        [row - 1, column + 1], [row - 1, column - 1],
    ];

    adjacentCells.forEach((cell) => {
        if (cell[0] > 9 || cell[0] < 0 || cell [1] > 9 || cell[1] < 0) return;

        if (adjacentsTaken(cell[0], cell[1], skipCells)) return;

        if (!temporaryCoordinates.has(`${cell[0]},${cell[1]}`)) temporaryCoordinates.add(`${cell[0]},${cell[1]}`);
    });
}

function adjacentsTaken(row, column, skipCells) {
    // check if adjacent is taken by a different ship already
    const adjacentCells = new Set([
        `${row + 1},${column}`, `${row - 1},${column}`,
        `${row},${column + 1}`, `${row},${column - 1}`,
        `${row + 1},${column + 1}`, `${row + 1},${column - 1}`,
        `${row - 1},${column + 1}`, `${row - 1},${column - 1}`,
    ]);

    const playerGameboard = document.querySelector(`[data-player="${dragInfo.player.name}"]`);
    const shipCells = playerGameboard.querySelectorAll('.ship-cell');

    // used a for loop to break out of loop!
    for (const cell of shipCells) {
        if (skipCells.has(cell.dataset.coordinate)) continue;

        if (adjacentCells.has(cell.dataset.coordinate)) return true;
    }

    return false;
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

            shipCoordinates.push(createShipItem(startingRow, startingColumn, isHorizontal, takenCoordinates, length));
            break;
        }
    });
    
    gameboard.use(takenCoordinates);
    return shipCoordinates;
}

function createShipItem(startingRow, startingColumn, isHorizontal, takenCoordinates, length) {
    const shipArray = [];

    for (let i = 0; i < length; i++) {
        const row = isHorizontal ? startingRow : startingRow + i;
        const column = isHorizontal ? startingColumn + i : startingColumn;

        shipArray.push([row, column]);
        takenCoordinates.add(`${row},${column}`);

        // add adjacent cells to takenCoordinates
        takeAdjacent(row, column, takenCoordinates);
    }

    return shipArray;
}

export function getStartingCoords(coordinate) {
    const { draggedCellIndex, draggedShipInstance } = dragInfo;
    const [row, column] =  coordinate.split(',').map(Number);
    const isVertical = (draggedShipInstance.direction === 'vertical') ? true : false;
    const startingRow = isVertical ? row - draggedCellIndex : row;
    const startingColumn = isVertical? column : column - draggedCellIndex;

    return [startingRow, startingColumn, isVertical];
}

/* Ship Switch Direction */
export function switchIsPossible() {
    const { draggedShip, draggedShipInstance } = dragInfo;
    const usedCoordinates = dragInfo.player.gameboard.usedCoordinates;
    const startingCoordinate = draggedShip.firstChild.dataset.coordinate;
    const [ startingRow, startingColumn ] = startingCoordinate.split(',').map(Number);
    const isVertical = (draggedShipInstance.direction === 'vertical') ? false : true;
    let valid = true;

    untakeCoordinates(usedCoordinates);

    for (let i = 0; i < draggedShip.childElementCount; i++) {
        const currentRow = isVertical ? startingRow + i : startingRow;
        const currentColumn = isVertical ? startingColumn : startingColumn + i;

        if (currentRow > 9 || currentRow < 0 || currentColumn > 9 || currentColumn < 0 ||
            usedCoordinates.has(`${currentRow},${currentColumn}`)) {
            valid = false;
            break;
        }
    }

    return valid;
}

export function getStartingSwitchCoords() {
    const { draggedShipInstance } = dragInfo;
    const [row, column] =  draggedShipInstance.coordinates[0];
    const isVertical = (draggedShipInstance.direction === 'vertical') ? true : false;

    return [row, column, isVertical];
}


export function updateBoardData() {
    // updates gameboard.board and gameboard.ships
    const { player } = dragInfo;
    const gameboard = document.querySelector(`[data-player="${player.name}"]`);
    const newShipCoordinates = [];

    const shipDivs = gameboard.querySelectorAll('.ship-div');
    shipDivs.forEach((shipDiv) => {
        const shipCells = shipDiv.querySelectorAll('.ship-cell'); 
        const shipRow = [];
        
        shipCells.forEach((cell) => {
            const [ row, column ] = cell.dataset.coordinate.split(',').map(Number);
            shipRow.push([row, column]);
        })

        newShipCoordinates.push(shipRow);
    });

    player.gameboard.board = null;
    player.gameboard.ships = [];
    player.gameboard.createBoard();

    populateGameboard(newShipCoordinates, player.gameboard);
}

/* Computer AI */
export function takeDiagonalCoordinates(currentBoard, coordinate, computer) {
    const [ row, column ] = coordinate.split(',').map(Number);
    const diagonalCoords = [
       [row - 1, column - 1],[row - 1, column + 1],
       [row + 1, column - 1], [row + 1, column + 1],
    ];

    diagonalCoords.forEach((coord) => {
        const [ r, c ] = coord;
        if (r > 9 || r < 0 || c > 9 || c < 0) return;

        if (currentBoard.attacks.find((attack) => attack.coordinate === `${r},${c}`)) return;

        currentBoard.receiveAttack(`${r},${c}`);
        if (computer) currentBoard.takeDiagonalCoordinate(`${r},${c}`);
    });
}

export function computerAttacks() {
    // computer makes move
    const { playerOne, playerTwo } = players;
    const randomCoordinate = chooseComputerCoordinates(playerOne);
    const isHit = playerOne.gameboard.receiveAttack(randomCoordinate);

    if (isHit) {
        // attack again if ship is hit
        takeDiagonalCoordinates(playerOne.gameboard, randomCoordinate, playerTwo.name);

        setTimeout(computerAttacks, 100);
    } else {
        updatePlayerTurn(playerOne, playerTwo);
    }
    
    updateBoard(playerOne);
}

function chooseComputerCoordinates(playerOne) {
    const enemyGameboard = document.querySelector('[data-player="Player One"]');
    const hitCells = enemyGameboard.querySelectorAll('.ship-hit');

    for (const cell of hitCells) {
        const [ row, column ] = cell.dataset.coordinate.split(',').map(Number);
        const adjacentCells = [
            [row + 1, column], [row - 1, column],
            [row, column + 1], [row, column - 1],
            [row + 1, column + 1], [row + 1, column - 1],
            [row - 1, column + 1], [row - 1, column - 1],
        ];

        for (const [ r, c ] of adjacentCells) {
            const coord = `${r},${c}`;
            if (r > 9 || r < 0 || c > 9 || c < 0) continue;
            if (playerOne.gameboard.isAlreadyAttacked(coord)) continue;

            if (!playerOne.gameboard.isAlreadyAttacked(`${r},${c}`) && playerOne.gameboard.availableMoves.has(`${r},${c}`)) {
                playerOne.gameboard.availableMoves.delete(`${r},${c}`);
                return coord;
            };
        }
    }

    // when no ship cells hit with adjacents
    const fallback = playerOne.gameboard.chooseRandomCoordinate();
    if (fallback) playerOne.gameboard.availableMoves.delete(fallback);
    return fallback;
}