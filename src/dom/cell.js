import { players } from "../index.js";
import { shipMousedown, switchShipDirection } from "./events.js";
import { getStartingCoords } from "./helpers.js";

export const dragInfo = {
  player: null,
  draggedShip: null,
  draggedShipInstance: null,
  draggedCellIndex: null,
  offsetX: 0,
  offsetY: 0,
  isDragging: false,
};
export let temporaryCoordinates = new Set();
export let isInvalid = false;

export function createCells(gameboard, boardData, gameboardObject, playerName) {
  const { currentPlayer } = players;

  let rowIndex = 0;
  let columnIndex = 0;

  boardData.forEach((row) => {
    row.forEach(() => {
      const columnDiv = document.createElement("div");

      columnDiv.dataset.coordinate = `${rowIndex},${columnIndex}`;
      columnDiv.classList.add("column");

      if (
        gameboardObject.attacks &&
        gameboardObject.isAlreadyAttacked(`${rowIndex},${columnIndex}`)
      ) {
        // cell already hit
        const attackInfo = gameboardObject.attacks.find(
          (object) => object.coordinate === `${rowIndex},${columnIndex}`,
        );

        columnDiv.classList.add(
          attackInfo.result === "hit" ? "hit-column" : "miss-column",
        );

        if (columnDiv.classList.contains("hit-column")) styleHit(columnDiv);
      }

      gameboard.appendChild(columnDiv);
      columnIndex++;
    });

    rowIndex++;
    columnIndex = 0;
  });

  if (
    gameboardObject.ships &&
    playerName !== "Computer" &&
    currentPlayer &&
    currentPlayer.name === playerName
  )
    createShips(gameboardObject.ships, gameboard);
}

export function createShips(ships, gameboard) {
  ships.forEach((ship) => {
    const shipDiv = document.createElement("div");
    shipDiv.classList.add("ship-div");
    shipDiv.style.position = "absolute";

    placeShip(ship, shipDiv);

    let shipIndex = 0;
    shipDiv.style.outline = "4px solid #fe4f4f";
    ship.coordinates.forEach((coordinate) => {
      const shipCell = document.createElement("div");
      const cell = gameboard.querySelector(
        `[data-coordinate="${`${coordinate[0]},${coordinate[1]}`}"]`,
      );

      shipCell.classList.add("ship-cell");
      shipCell.dataset.coordinate = `${coordinate[0]},${coordinate[1]}`;
      shipCell.dataset.shipIndex = shipIndex;

      if (!cell.classList.contains("hit-column"))
        shipDiv.style.removeProperty("outline");
      if (cell.classList.contains("hit-column")) {
        shipCell.classList.add("ship-hit");
        styleHit(shipCell);
      }

      shipDiv.appendChild(shipCell);
      shipIndex++;
    });

    gameboard.appendChild(shipDiv);

    shipDiv.addEventListener("mousedown", (event) => {
      event.preventDefault();
      shipMousedown(event, ship);
    });

    shipDiv.addEventListener("click", switchShipDirection);
  });
}

function styleHit(cell) {
  const closeIcon = document.createElement("span");
  closeIcon.classList.add("material-symbols-outlined");
  closeIcon.textContent = "close";

  cell.appendChild(closeIcon);
}

export function placeShip(ship, shipDiv) {
  // place ship in correct location
  const [startingRow, startingColumn] = ship.coordinates[0];

  shipDiv.style.top = `${startingRow * 50 - 1}px`;
  shipDiv.style.left = `${startingColumn * 50 - 1}px`;
  shipDiv.style.display = ship.direction === "vertical" ? "block" : "flex";
}

export function previewShipPlacement(coordinate) {
  const { draggedShip } = dragInfo;
  const usedCoordinates = dragInfo.player.gameboard.usedCoordinates;

  if (!usedCoordinates) return;
  if (!coordinate) return applyInvalid(draggedShip);

  const [startingRow, startingColumn, isVertical] =
    getStartingCoords(coordinate);
  let isInvalid = false;

  for (let i = 0; i < draggedShip.childElementCount; i++) {
    const currentRow = isVertical ? startingRow + i : startingRow;
    const currentColumn = isVertical ? startingColumn : startingColumn + i;

    if (
      currentRow > 9 ||
      currentRow < 0 ||
      currentColumn > 9 ||
      currentColumn < 0 ||
      usedCoordinates.has(`${currentRow},${currentColumn}`)
    ) {
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

export function applyInvalid(draggedShip) {
  draggedShip.style.outline = "4px solid #d62828";
  draggedShip.style.zIndex = "999";

  const draggedShipCells = draggedShip.querySelectorAll(".ship-cell");
  draggedShipCells.forEach((cell) => {
    cell.style.backgroundColor = "#f7dada";
    cell.style.opacity = "0.5";
  });
}

function applyValid(draggedShip, startingRow, startingColumn) {
  draggedShip.style.outline = "4px solid #8ac926";
  draggedShip.style.top = `${startingRow * 50 - 1}px`;
  draggedShip.style.left = `${startingColumn * 50 - 1}px`;

  const draggedShipCells = draggedShip.querySelectorAll(".ship-cell");
  draggedShipCells.forEach((cell) => {
    cell.style.backgroundColor = "#f1fcf7";
  });
}
