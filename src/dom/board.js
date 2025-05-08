import { createCells } from "./cell";
import { showIntermissionDiv } from "./dom.js";
import { populateGameboard, randomizeShips } from "./helpers.js";

export function displayBoard(player, showRandomizer) {
  const boardData = player.gameboard.board;

  const boards = document.querySelector(".boards");
  const gameboardContainer = document.createElement("div");
  const gameboard = document.createElement("div");
  const gameboardName = document.createElement("h2");

  gameboard.dataset.player = player.name;
  gameboardName.textContent = player.name;
  gameboardContainer.classList.add("gameboard-container");
  gameboard.classList.add("gameboard");
  gameboardName.classList.add("board-name");

  gameboardContainer.appendChild(gameboard);
  gameboardContainer.appendChild(gameboardName);
  boards.appendChild(gameboardContainer);

  // initial randomize button for player one
  if (showRandomizer) addRandomizeButton(gameboard, player, gameboardContainer);

  createCells(gameboard, boardData, player.gameboard, player.name);
}

export function displayEmptyBoard(rows = 10, columns = 10) {
  const boards = document.querySelector(".boards");
  const gameboardContainer = document.createElement("div");
  const gameboard = document.createElement("div");
  const gameboardName = document.createElement("h2");

  gameboard.dataset.player = "Opponent";
  gameboardName.textContent = "Opponent";
  gameboardContainer.classList.add("gameboard-container");
  gameboard.classList.add("gameboard", "start-board");
  gameboardName.classList.add("board-name");

  gameboardContainer.appendChild(gameboard);
  gameboardContainer.appendChild(gameboardName);
  boards.appendChild(gameboardContainer);

  // creates necessary data to output empty grid
  const boardData = [];
  const attacks = new Set();

  for (let r = 0; r < rows; r++) {
    const row = [];

    for (let c = 0; c < columns; c++) {
      row.push([]);
    }

    boardData.push(row);
  }

  createCells(gameboard, boardData, attacks);
}

/* Board Misc Functions */

export function enableBoard(player) {
  const gameboard = document.querySelector(`[data-player="${player.name}"]`);
  gameboard.classList.remove("disabled");
}

export function disableBoard(player) {
  const gameboard = document.querySelector(`[data-player="${player.name}"]`);
  gameboard.classList.add("disabled");
}

export function updateBoard(player) {
  const gameboard = document.querySelector(`[data-player="${player.name}"]`);
  gameboard.replaceChildren();

  createCells(gameboard, player.gameboard.board, player.gameboard, player.name);
}

export function removeEmptyBoard() {
  const emptyBoard = document.querySelector(".start-board").parentNode;
  emptyBoard.remove();
}

function addRandomizeButton(gameboard, player, gameboardContainer) {
  const randomizeButton = document.createElement("button");
  const randomizeIcon = document.createElement("span");

  randomizeButton.classList.add("randomize-button");
  randomizeIcon.classList.add("material-symbols-outlined");
  randomizeIcon.textContent = "refresh";

  randomizeButton.type = "button";
  randomizeButton.textContent = "Randomize";

  randomizeButton.appendChild(randomizeIcon);
  gameboardContainer.appendChild(randomizeButton);

  randomizeButton.addEventListener("click", () => {
    player.gameboard.clearBoard();
    gameboard.replaceChildren();

    const shipCoordinates = randomizeShips(player.gameboard);
    populateGameboard(shipCoordinates, player.gameboard);

    createCells(
      gameboard,
      player.gameboard.board,
      player.gameboard,
      player.name,
    );
  });
}

export function removeRandomizeButtons() {
  const randomizeButton = document.querySelectorAll(".randomize-button");
  randomizeButton.forEach((button) => {
    button.remove();
  });
}

export function setupHideBoard(player) {
  hideBoard(player);
  showIntermissionDiv(player);
}

export function hideBoard(player) {
  const gameboard = document.querySelector(`[data-player="${player.name}"]`);
  const shipDivs = gameboard.querySelectorAll(".ship-div");
  shipDivs.forEach((shipDiv) => {
    shipDiv.remove();
  });
}
