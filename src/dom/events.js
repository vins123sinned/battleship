import { players } from "../index.js";
import { disableBoard, enableBoard, hideBoard, removeRandomizeButtons, updateBoard } from "./board.js";
import { updatePlayerTurn, checkGameOver, showPassScreen, removePassScreen, removeIntermissionDiv, showIntermissionDiv, showEndTurnButton } from "./dom";
import { getStartingCoords, getStartingSwitchCoords, shipIsHit, switchIsPossible, takeAdjacent, untakeCoordinates, updateBoardData } from "./helpers.js";
import { previewShipPlacement, dragInfo, placeShip, applyInvalid } from "./cell.js";

/* Cell Listeners */

export function cellClickHandler(event) {
    cellListener(event, players.playerOne, players.playerTwo);
}

export function cellListener(event, playerOne, playerTwo) {
    const intermissionDiv = document.querySelector('.intermission-div');
    if (intermissionDiv) return;

    if (event.target.classList.contains('column')) {
        const currentPlayer = playerOne.currentTurn ? playerTwo : playerOne;
        const currentBoard = currentPlayer.gameboard;
        const coordinate = event.target.dataset.coordinate;

        if (currentBoard.isAlreadyAttacked(coordinate)) return;
        const isHit = currentBoard.receiveAttack(coordinate);

        // let player keep going after getting a successful hit
        if (isHit) {
            takeDiagonalCoordinates(currentBoard, coordinate);
            updateBoard(currentPlayer);
            return;
        };

        updateBoard(currentPlayer);
        updatePlayerTurn(playerOne, playerTwo);

        if (playerTwo.currentTurn === true && playerTwo.name === 'Computer') {
            setTimeout(computerAttacks, 100);
        } else if (playerTwo.name === 'Player Two' && players.currentPlayer !== 'Game Over') {
            // player makes move
            disableBoard(playerOne);
            disableBoard(playerTwo);

            showEndTurnButton();
        }

        checkGameOver(playerOne, playerTwo);
    }
}

function takeDiagonalCoordinates(currentBoard, coordinate, computer) {
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

function computerAttacks() {
    // computer makes move
    const { playerOne, playerTwo } = players;
    const randomCoordinate = playerOne.gameboard.chooseRandomCoordinate();
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

/* Drag and Drop Listeners */

export function shipMousedown(event, ship) {
    dragInfo.player = (event.target.parentNode.parentNode.dataset.player === 'Player One') ? players.playerOne : players.playerTwo;
    dragInfo.draggedShip = event.target.parentNode;
    dragInfo.draggedCellIndex = event.target.dataset.shipIndex;
    dragInfo.draggedShipInstance = ship;

    const draggedShip = dragInfo.draggedShip;
    const usedCoordinates = dragInfo.player.gameboard.usedCoordinates;
    const rect = draggedShip.getBoundingClientRect();

    // makes ship's taken coordinates temporarily available
    untakeCoordinates(usedCoordinates);
    
    dragInfo.offsetX = event.clientX - rect.left;
    dragInfo.offsetY = event.clientY - rect.top;

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
}

function dragMove(event) {
    const draggedShip = dragInfo.draggedShip;
    const gridRect = draggedShip.parentNode.getBoundingClientRect();
    const coordinate = getCurrentCoordinate(event);

    // prevent click (switchShipDirection) from executing
    dragInfo.isDragging = true;

    draggedShip.style.left = `${event.clientX - gridRect.left - dragInfo.offsetX}px`;
    draggedShip.style.top = `${event.clientY - gridRect.top - dragInfo.offsetY}px`;

    previewShipPlacement(coordinate, dragInfo.player.gameboard.usedCoordinates);
};

function dragEnd(event) {
    const { draggedShip, draggedShipInstance } = dragInfo;
    const coordinate = getCurrentCoordinate(event);

    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);

    if (!coordinate || previewShipPlacement(coordinate)) {
        // invalid
        updateUsedCoordinates(draggedShip);
        removeDragStyles(draggedShip);
        placeShip(draggedShipInstance, draggedShip);
    } else {
        // valid
        updateShipCoordinates(coordinate);
        removeDragStyles(draggedShip);
        updateUsedCoordinates(draggedShip);
        updateBoardData();
    }
}

function updateShipCoordinates(coordinate) {
    const { draggedShip, draggedShipInstance, player } = dragInfo;
    const [startingRow, startingColumn, isVertical] = getStartingCoords(coordinate);
    const newShipCoordinates = [];

    for (let i = 0; i < draggedShip.childElementCount; i++) {
        const currentRow = isVertical ? startingRow + i : startingRow;
        const currentColumn = isVertical ? startingColumn : startingColumn + i;

        newShipCoordinates.push([currentRow, currentColumn]);
    }

    draggedShipInstance.coordinates = newShipCoordinates;

    draggedShip.querySelectorAll('.ship-cell').forEach((cell, index) => {
        cell.dataset.coordinate = draggedShipInstance.coordinates[index];
    });
}

function updateUsedCoordinates(draggedShip) {
    const usedCoordinates = dragInfo.player.gameboard.usedCoordinates;

    draggedShip.querySelectorAll('.ship-cell').forEach((cell) => {
        const [row, column] = cell.dataset.coordinate.split(',').map(Number);
        
        usedCoordinates.add(cell.dataset.coordinate);
        takeAdjacent(row, column, usedCoordinates)
    });
}

function removeDragStyles(draggedShip) {
    draggedShip.style.removeProperty('outline');
    draggedShip.querySelectorAll('.ship-cell').forEach((cell) => {
        cell.style.removeProperty('background-color');
        cell.style.removeProperty('opacity');
    });
}

function getCurrentCoordinate(event) {
    const elementsAtPoint = document.elementsFromPoint(event.clientX, event.clientY);
    const findElement = elementsAtPoint.find((element) =>  element.classList.contains('column'));
    const coordinate = findElement ? findElement.dataset.coordinate : null;

    return coordinate;
}

function resetDragInfo() {
    // set dragInfo back to default
    dragInfo.player = null;
    dragInfo.draggedShip = null;
    dragInfo.draggedShipInstance = null;
    dragInfo.draggedCellIndex = null;
    dragInfo.offsetX = 0;
    dragInfo.offsetY = 0;
    dragInfo.isDragging = false;
}

export function switchShipDirection(event) {
    event.preventDefault();

    if (dragInfo.isDragging) {
        event.stopImmediatePropagation();
        resetDragInfo();
        return;
    }

    if (switchIsPossible()) {
        // update ship coordinates
        const { draggedShip, draggedShipInstance } = dragInfo;

        draggedShipInstance.direction = (draggedShipInstance.direction === 'vertical') ? 'horizontal' : 'vertical';
        updateShipSwitchCoordinates();
        placeShip(draggedShipInstance, draggedShip);
        updateBoardData();
    } else {
        invalidSwitchShake();
    }

    resetDragInfo();
}

function updateShipSwitchCoordinates() {
    const { draggedShip, draggedShipInstance } = dragInfo;
    const [startingRow, startingColumn, isVertical] = getStartingSwitchCoords();
    const newShipCoordinates = [];

    for (let i = 0; i < draggedShip.childElementCount; i++) {
        const currentRow = isVertical ? startingRow + i : startingRow;
        const currentColumn = isVertical ? startingColumn : startingColumn + i;

        newShipCoordinates.push([currentRow, currentColumn]);
    }

    draggedShipInstance.coordinates = newShipCoordinates;

    draggedShip.querySelectorAll('.ship-cell').forEach((cell, index) => {
        cell.dataset.coordinate = draggedShipInstance.coordinates[index];
    });
}

function invalidSwitchShake() {
    // style to let user know it's not possible (PAS BIEN)
    const { draggedShip } = dragInfo;

    draggedShip.classList.add('shake');
    applyInvalid(draggedShip);

    setTimeout(() => {
        draggedShip.classList.remove('shake');
        removeDragStyles(draggedShip);
    }, 200);
}

/* Game Controller Listeners */
export function playerGameStart() {
    const { playerOne, playerTwo } = players;

    removeIntermissionDiv(playerOne);
    removeRandomizeButtons();
    hideBoard(playerOne);
    hideBoard(playerTwo);

    showPassScreen();
}

export function switchTurns() {
    // fix here
    const { currentPlayer, playerOne, playerTwo } = players;
    const newCurrentPlayer = (players.currentPlayer === playerOne) ? playerTwo : playerOne
    players.currentPlayer = newCurrentPlayer;

    removePassScreen();

    updateBoard(currentPlayer);
    updateBoard(newCurrentPlayer);
    disableBoard(newCurrentPlayer);
}

export function endTurnClicked() {
    const { playerOne, playerTwo } = players;
    const endTurnButton = document.querySelector('.end-turn-button');

    endTurnButton.remove();

    hideBoard(playerOne);
    hideBoard(playerTwo);
    enableBoard(playerOne);
    enableBoard(playerTwo);

    showPassScreen();
}