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

    createCells(gameboard, boardData, player.gameboard.attacks, player.gameboard.ships);
}

function createCells(gameboard, boardData, attacks, ships) {
    let rowIndex = 0;
    let columnIndex = 0;

    boardData.forEach((row) => {
        row.forEach(() => {
            const columnDiv = document.createElement('div');

            columnDiv.dataset.coordinate = `${rowIndex},${columnIndex}`;
            columnDiv.classList.add('column');

            // maybe move to ship div
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

    if (ships) createShipCells(ships, gameboard);
    //mergeShipCells(gameboard);
}

function createShipCells(ships, gameboard) {
    ships.forEach((ship) => {
        const shipDiv = document.createElement('div');

        shipDiv.classList.add('ship-div');

        // reminder to update coordinates when dragged!
        ship.coordinates.forEach((coordinate) => {
            const shipCell = document.createElement('div');
            shipCell.classList.add('ship-cell');
            shipCell.dataset.coordinate = `${coordinate[0]},${coordinate[1]}`;

            shipDiv.appendChild(shipCell);
        });

        gameboard.appendChild(shipDiv);
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