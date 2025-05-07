import { dragInfo } from "./dom/cell.js";
import { randomizeShips } from "./dom/helpers.js";
import { Ship } from "./ship.js";

export class Gameboard {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;

    this.board = null;
    this.ships = [];
    this.attacks = [];
    this.availableMoves = new Set();
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
        this.availableMoves.add(`${r},${c}`);
      }
    }
  }

  placeShip(coordinates) {
    // check and add correct ship direction
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
    const [ row, column ] = coordinate.split(',').map(Number);

    if (this.board[row][column].length !== 0) {
      // invokes hit method on ship that occupies the coordinates
      this.board[row][column].hit();

      this.attacks.push({
        coordinate,
        result: 'hit',
      });

      console.log(this.attacks)
      return true;
    } else {
      this.attacks.push({
        coordinate,
        result: 'miss',
      });

      console.log(this.attacks)
      return false;
    }
  }

  isAlreadyAttacked(coordinate) {
    return this.attacks.some((attack) => attack.coordinate === coordinate);
  }

  chooseRandomCoordinate() {
    const moves = Array.from(this.availableMoves);
    const randomIndex = Math.floor(Math.random() * moves.length);
    const coordinate = moves[randomIndex];

    this.availableMoves.delete(coordinate);
    
    // returns a string (row,column. Just a reminder!)
    return coordinate;
  }

  takeDiagonalCoordinate(coordinate) {
    this.availableMoves.delete(coordinate);
  }

  allShipsSunk() {
    return this.ships.some((ship) => !ship.isSunk()) ? false : true;
  }

  clearBoard() {
    this.board = null;
    this.ships = [];
    this.attacks = [];
    this.availableMoves = new Set();
    this.usedCoordinates = new Set();

    this.createBoard();
    this.populateMoves();
  }

  use(coordinates) {
    coordinates.forEach((coordinate) => {
      this.usedCoordinates.add(coordinate);
    })
  }
}
