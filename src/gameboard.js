export class Gameboard {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.board = null;

    this.createBoard();
  }

  createBoard() {
    this.board = [];

    for (let i = 0; i < this.rows; i++) {
      const row = [];

      for (let j = 0; j < this.columns; j++) {
        row.push({ship: null, hit: false});
      }

      this.board.push(row);
    }
  }
}
