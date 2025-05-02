import { Gameboard } from "./gameboard.js";

export class Player {
    constructor(name, currentTurn) {
        this.gameboard = new Gameboard(10, 10);
        this.name = name;
        this.currentTurn = currentTurn;
    }
}