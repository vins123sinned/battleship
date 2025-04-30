import { electron } from "webpack";
import { Ship } from "./ship";

export class Gameboard {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;

    this.board = null;
    this.ships = [];
    this.attacks = [];

    this.createBoard();
  }

  createBoard() {
    this.board = [];

    for (let i = 0; i < this.rows; i++) {
      const row = [];

      for (let j = 0; j < this.columns; j++) {
        row.push([]);
      }

      this.board.push(row);
    }
  }

  placeShip(coordinates) {
    const newShip = new Ship(coordinates.length);

    coordinates.forEach((coordinate) => {
      this.board[coordinate[0]][coordinate[1]] = newShip;
    });

    this.ships.push(newShip);
  }

  receiveAttack(coordinate) {
    // checks if attack was already received
    if (this.attacks.some((attack) => attack.coordinate[0] === coordinate[0] && attack.coordinate[1] === coordinate[1])) return 'Already attacked!';

    if (this.board[coordinate[0]][coordinate[1]].length !== 0) {
      // invokes hit method on ship that occupies the coordinates
      this.board[coordinate[0]][coordinate[1]].hit();

      this.attacks.push({
        coordinate,
        result: 'hit',
      });
    } else {
      this.attacks.push({
        coordinate,
        result: 'miss',
      });
    }
  }

  allShipsSunk() {
    return this.ships.some((ship) => !ship.isSunk()) ? false : true;
  }
}
