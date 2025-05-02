import './styles.css';
import { createPlayer, disableBoard, displayBoards, updatePlayerTurn } from "./dom.js";

const playerOne = createPlayer('Player One', true);
const playerTwo = createPlayer('Player Two');

displayBoards(playerOne);
displayBoards(playerTwo);

disableBoard(playerOne);

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('column')) {
        updatePlayerTurn(playerOne, playerTwo);
    }
});
