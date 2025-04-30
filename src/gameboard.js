import { Ship } from "./ship";

export class Gameboard {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;

    this.board = null;
    this.ships = [];
    this.missedAttacks = [];

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
    if (this.board[coordinate[0]][coordinate[1]].length !== 0) {
      // invokes hit method on ship that occupies the coordinates
      this.board[coordinate[0]][coordinate[1]].hit();
    } else {
      this.missedAttacks.push(coordinate);
    }
  }
}
