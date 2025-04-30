import { Gameboard } from "./gameboard";

export class Player {
    constructor() {
        this.gameboard = new Gameboard(10, 10);
    }
}