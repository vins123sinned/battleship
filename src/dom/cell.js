import { shipMousedown } from "./events.js";

export const dragInfo = {
    player: null,
    draggedShip: null,
    draggedShipInstance: null,
    draggedCellIndex: null,
    offsetX: 0,
    offsetY: 0,
}
export let temporaryCoordinates = new Set();
export let isInvalid = false;

export function createCells(gameboard, boardData, gameboardObject) {
    let rowIndex = 0;
    let columnIndex = 0;

    boardData.forEach((row) => {
        row.forEach(() => {
            const columnDiv = document.createElement('div');

            columnDiv.dataset.coordinate = `${rowIndex},${columnIndex}`;
            columnDiv.classList.add('column');

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
        });

        rowIndex++;
        columnIndex = 0;
    });

    if (gameboardObject.ships) createShipCells(gameboardObject.ships, gameboard);
}

export function createShipCells(ships, gameboard) {
    ships.forEach((ship) => {
        const shipDiv = document.createElement('div');
        shipDiv.classList.add('ship-div');
        shipDiv.style.position = 'absolute';

        placeShip(ship, shipDiv);

        // reminder to update coordinates when dragged!
        let shipIndex = 0;
        ship.coordinates.forEach((coordinate) => {
            const shipCell = document.createElement('div');
            shipCell.classList.add('ship-cell');
            shipCell.dataset.coordinate = `${coordinate[0]},${coordinate[1]}`;
            shipCell.dataset.shipIndex = shipIndex;

            shipDiv.appendChild(shipCell);
            shipIndex++;
        });

        gameboard.appendChild(shipDiv);

        shipDiv.addEventListener('mousedown', (event) => {
            event.preventDefault();
            shipMousedown(event, ship);
        });
    });
}

export function placeShip(ship, shipDiv) {
    // place ship in correct location
    const [startingRow, startingColumn] = ship.coordinates[0];

    shipDiv.style.top = `${(startingRow * 50) - 1}px`;
    shipDiv.style.left = `${(startingColumn * 50) - 1}px`;
    shipDiv.style.display = (ship.direction === 'vertical') ? 'block' : 'flex';
}

export function previewShipPlacement(coordinate, usedCoordinates) {
    const { draggedShip } = dragInfo;

    if (!coordinate) return applyInvalid(draggedShip);
    if (!usedCoordinates) return;

    const [startingRow, startingColumn, isVertical] = getStartingCoords(coordinate);
    let isInvalid = false;

    for (let i = 0; i < draggedShip.childElementCount; i++) {
        const currentRow = isVertical ? startingRow + i : startingRow;
        const currentColumn = isVertical ? startingColumn : startingColumn + i;

        if (currentRow > 9 || currentRow < 0 || currentColumn > 9 || currentColumn < 0 ||
            usedCoordinates.has(`${currentRow},${currentColumn}`)) {
            isInvalid = true;
            break;
        }
    }

    if (isInvalid) {
        applyInvalid(draggedShip);
    } else {
        applyValid(draggedShip, startingRow, startingColumn);
    }

    return isInvalid;
}

export function getStartingCoords(coordinate) {
    const { draggedShip, draggedCellIndex } = dragInfo;

    const [row, column] =  coordinate.split(',').map(Number);
    const isVertical = (window.getComputedStyle(draggedShip).display === 'block') ? true : false;
    const startingRow = isVertical ? row - draggedCellIndex : row;
    const startingColumn = isVertical? column : column - draggedCellIndex;

    return [startingRow, startingColumn, isVertical];
}

function applyInvalid(draggedShip) {
    draggedShip.style.outline = '4px solid #d62828';
    draggedShip.style.zIndex = '999';

    const draggedShipCells = draggedShip.querySelectorAll('.ship-cell');
    draggedShipCells.forEach((cell) => {
        cell.style.backgroundColor = '#f7dada';
        cell.style.opacity = '0.5';
    });
}

function applyValid(draggedShip, startingRow, startingColumn) {
    draggedShip.style.outline = '4px solid #8ac926';
    draggedShip.style.top = `${(startingRow * 50) - 1}px`;
    draggedShip.style.left = `${(startingColumn * 50) - 1}px`;

    const draggedShipCells = draggedShip.querySelectorAll('.ship-cell');
    draggedShipCells.forEach((cell) => {
        cell.style.backgroundColor = '#f1fcf7';
    });
}

// removes unnecessary border between adjacent ship cells
export function mergeShipCells(gameboard) {
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