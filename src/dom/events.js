import { players } from "../index.js";
import { updateBoard } from "./board.js";
import { updatePlayerTurn, checkGameOver } from "./dom";
import { untakeCoordinates } from "./helpers.js";
import { previewShipPlacement, dragInfo, temporaryCoordinates, isInvalid } from "./cell.js";

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

export function shipDragstart(event, usedCoordinates) {
    dragInfo.draggedShip = event.target;
    
    // create ghost ship for dragging over invalid cells
    const ghost = dragInfo.draggedShip.cloneNode(true);
    ghost.style.opacity = '0.5';
    ghost.style.border = '2px solid #c1121f';
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px'; 

    ghost.querySelectorAll('.ship-cell').forEach((cell) => {
        cell.style.backgroundColor = '#f5cdcd';
    });

    const rect = event.target.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    document.body.appendChild(ghost);
    event.dataTransfer.setDragImage(ghost, offsetX, offsetY);

    setTimeout(() => {
        document.body.removeChild(ghost);
    }, 0);

    // makes ship's taken coordinates temporarily available
    untakeCoordinates(usedCoordinates);
    console.log(temporaryCoordinates)
}

export function shipDragover(event, gameboardObject) {
    event.preventDefault();
    
    previewShipPlacement(event.target.dataset.coordinate, gameboardObject.usedCoordinates);
    console.log(isInvalid);
}

export function shipDrop(event) {
    event.preventDefault();
}   