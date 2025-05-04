let draggedShip = null;
let draggedCellIndex = null;
let temporaryCoordinates = new Set();
let isInvalid = false;

export function createCells(gameboard, boardData, gameboardObject) {
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

            shipCell.addEventListener('mousedown', () => {
                draggedCellIndex = shipCell.dataset.shipIndex;
            });
        });

        gameboard.appendChild(shipDiv);

        shipDiv.addEventListener('dragstart', (event) => {
            draggedShip = event.target;

            // create ghost ship for dragging over invalid cells
            const ghost = shipDiv.cloneNode(true);
            ghost.style.opacity = '0.5';
            ghost.style.border = '2px solid #c1121f';
            ghost.style.position = 'absolute';
            ghost.style.top = '-1000px'; 

            document.body.appendChild(ghost);
            event.dataTransfer.setDragImage(ghost, 0, 0);

            setTimeout(() => {
                document.body.removeChild(ghost);
            }, 0);

            // makes ship's taken coordinates temporarily available
            untakeCoordinates(usedCoordinates);
            console.log(temporaryCoordinates)
        });
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