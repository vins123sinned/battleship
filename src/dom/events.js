import { players } from "../index.js";
import { updateBoard } from "./board.js";
import { updatePlayerTurn, checkGameOver } from "./dom";
import { untakeCoordinates } from "./helpers.js";
import { previewShipPlacement, dragInfo } from "./cell.js";

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

export function shipMousedown(event, usedCoordinates) {
    // reset these at mouseup after finished!
    dragInfo.player = (event.target.parentNode.parentNode.dataset.player === 'Player One') ? players.playerOne : players.playerTwo;
    dragInfo.draggedShip = event.target.parentNode;
    dragInfo.draggedCellIndex = event.target.dataset.shipIndex;
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
    const elementsAtPoint = document.elementsFromPoint(event.clientX, event.clientY);
    const coordinate = elementsAtPoint.find((element) =>  element.classList.contains('column')).dataset.coordinate;

    const gridRect = draggedShip.parentNode.getBoundingClientRect();
    draggedShip.style.left = `${event.clientX - gridRect.left - dragInfo.offsetX}px`;
    draggedShip.style.top = `${event.clientY - gridRect.top - dragInfo.offsetY}px`;

    previewShipPlacement(event, coordinate, dragInfo.player.gameboard.usedCoordinates);
};

function dragEnd() {
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
}