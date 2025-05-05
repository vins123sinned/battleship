import { Ship } from "./ship.js";

export class Gameboard {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;

    this.board = null;
    this.ships = [];
    this.attacks = [];
    this.availableMoves = [];
    this.usedCoordinates = new Set();

    this.createBoard();
    this.populateMoves();
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

  populateMoves() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.availableMoves.push([r, c]);
      }
    }
  }

  placeShip(coordinates) {
    let direction = 'vertical';
    if (coordinates.length > 1) {
      if (coordinates[0][0] + 1 !== coordinates[1][0]) direction = 'horizontal';
    }
    const newShip = new Ship(coordinates.length, coordinates, direction);

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

  isAlreadyAttacked(coordinate) {
    return this.attacks.some((attack) => attack.coordinate[0] === coordinate[0] && attack.coordinate[1] === coordinate[1]);
  }

  chooseRandomCoordinate() {
    const randomIndex = Math.floor(Math.random() * this.availableMoves.length);
    const coordinate = this.availableMoves.splice(randomIndex, 1);

    return coordinate[0];
  }

  allShipsSunk() {
    return this.ships.some((ship) => !ship.isSunk()) ? false : true;
  }

  clearBoard() {
    this.board = null;
    this.ships = [];
    this.attacks = [];
    this.availableMoves = [];

    this.createBoard();
    this.populateMoves();
  }

  use(coordinates) {
    coordinates.forEach((coordinate) => {
      this.usedCoordinates.add(coordinate);
      console.log(this.usedCoordinates)
    })
  }
}
