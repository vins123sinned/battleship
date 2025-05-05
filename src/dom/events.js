import { players } from "../index.js";
import { updateBoard } from "./board.js";
import { updatePlayerTurn, checkGameOver } from "./dom";
import { takeAdjacent, untakeCoordinates, useAdjacent } from "./helpers.js";
import { previewShipPlacement, dragInfo, temporaryCoordinates, placeShip, getStartingCoords } from "./cell.js";

export function cellClickHandler(event) {
    cellListener(event, players.playerOne, players.playerTwo);
}

export function cellListener(event, playerOne, playerTwo) {
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

export function shipMousedown(event, usedCoordinates, ship) {
    // reset these at mouseup after finished!
    dragInfo.player = (event.target.parentNode.parentNode.dataset.player === 'Player One') ? players.playerOne : players.playerTwo;
    dragInfo.draggedShip = event.target.parentNode;
    dragInfo.draggedCellIndex = event.target.dataset.shipIndex;
    dragInfo.draggedShipInstance = ship;
    const draggedShip = dragInfo.draggedShip;

    // makes ship's taken coordinates temporarily available
    untakeCoordinates(usedCoordinates);

    const rect = draggedShip.getBoundingClientRect();
    
    dragInfo.offsetX = event.clientX - rect.left;
    dragInfo.offsetY = event.clientY - rect.top;

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
}

function dragMove(event) {
    const draggedShip = dragInfo.draggedShip;
    const gridRect = draggedShip.parentNode.getBoundingClientRect();
    const coordinate = getCurrentCoordinate(event);

    draggedShip.style.left = `${event.clientX - gridRect.left - dragInfo.offsetX}px`;
    draggedShip.style.top = `${event.clientY - gridRect.top - dragInfo.offsetY}px`;

    previewShipPlacement(coordinate, dragInfo.player.gameboard.usedCoordinates);
};

function dragEnd(event) {
    const { draggedShip, draggedShipInstance } = dragInfo;
    const usedCoordinates = dragInfo.player.gameboard.usedCoordinates;
    const coordinate = getCurrentCoordinate(event);

    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);

    if (previewShipPlacement(coordinate, usedCoordinates)) {
        // invalid

        temporaryCoordinates.forEach((coordinate) => {
            usedCoordinates.add(coordinate);
        });

        draggedShip.style.removeProperty('outline');
        draggedShip.querySelectorAll('.ship-cell').forEach((cell) => {
            cell.style.removeProperty('background-color');
            cell.style.removeProperty('opacity');
        });

        placeShip(draggedShipInstance, draggedShip);
    } else {
        // make adjacents invalid in new place
        updateShipCoordinates(coordinate);

        draggedShip.style.removeProperty('outline');
        draggedShip.querySelectorAll('.ship-cell').forEach((cell) => {
            cell.style.removeProperty('background-color');
        });
    }

    // set dragInfo back to default
    dragInfo.player = null;
    dragInfo.draggedShip = null;
    dragInfo.draggedShipInstance = null;
    dragInfo.draggedCellIndex = null;
    dragInfo.offsetX = 0;
    dragInfo.offsetY = 0;
}

function updateShipCoordinates(coordinate) {
    const { draggedShip, draggedShipInstance } = dragInfo;
    const [startingRow, startingColumn, isVertical] = getStartingCoords(coordinate);
    // and also don't forget to update usedCoordinates
    
    const newShipCoordinates = [];
    for (let i = 0; i < draggedShip.childElementCount; i++) {
        const currentRow = isVertical ? startingRow + i : startingRow;
        const currentColumn = isVertical ? startingColumn : startingColumn + i;

        newShipCoordinates.push([currentRow, currentColumn]);
    }

    draggedShipInstance.coordinates = newShipCoordinates;

    let i = 0;
    draggedShip.querySelectorAll('.ship-cell').forEach((cell) => {
        cell.dataset.coordinate = draggedShipInstance.coordinates[i];
        i++;
    });

    dragInfo.player.gameboard.use(draggedShipInstance.coordinates);

    draggedShipInstance.coordinates.forEach((coordinate) => useAdjacent(coordinate[0], coordinate[1]));
}

function getCurrentCoordinate(event) {
    const elementsAtPoint = document.elementsFromPoint(event.clientX, event.clientY);
    const findElement = elementsAtPoint.find((element) =>  element.classList.contains('column'));
    const coordinate = findElement ? findElement.dataset.coordinate : null;

    return coordinate;
}