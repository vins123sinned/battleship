import './styles.css';
import { createPlayer, displayBoards } from "./dom.js";

const playerOne = createPlayer();
const playerTwo = createPlayer();

displayBoards(playerOne, 'Player One');
displayBoards(playerTwo, 'Player Two');