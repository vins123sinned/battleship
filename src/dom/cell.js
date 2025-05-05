import { shipMousedown } from "./events.js";

export const dragInfo = {
    draggedShip: null,
    draggedCellIndex: null,
    ghostShip: null,
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

    if (gameboardObject.ships) createShipCells(gameboardObject.ships, gameboard, gameboardObject.usedCoordinates);
}

export function createShipCells(ships, gameboard, usedCoordinates) {
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
        });

        gameboard.appendChild(shipDiv);

        shipDiv.addEventListener('mousedown', (event) => {
            event.preventDefault();
            shipMousedown(event, usedCoordinates);
        });
    });
}

export function previewShipPlacement(event, coordinate, usedCoordinates) {
    const [row, column] =  coordinate.split(',').map(Number);
    const isVertical = (window.getComputedStyle(dragInfo.draggedShip).display === 'block') ? true : false;
    const startingRow = isVertical ? row - dragInfo.draggedCellIndex : row;
    const startingColumn = isVertical? column : column - dragInfo.draggedCellIndex;

    for (let i = 0; i < dragInfo.draggedShip.childElementCount; i++) {
        const currentRow = isVertical ? startingRow + i : startingRow;
        const currentColumn = isVertical ? startingColumn : startingColumn + i;

        if (usedCoordinates.has(`${currentRow},${currentColumn}`)) {
            isInvalid = true;
            break;
        }
    }
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