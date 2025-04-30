import { Gameboard } from "../gameboard";

describe("gameboard class", () => {
  test("gameboard creates correct instance", () => {
    const testGameboard = new Gameboard(8, 8);
    const testGameboard2 = new Gameboard(4, 8);

    expect(testGameboard.rows).toBe(8);
    expect(testGameboard.columns).toBe(8);

    expect(testGameboard2.rows).toBe(4);
    expect(testGameboard2.columns).toBe(8);
  });

  test("gameboard creates correct board", () => {
    const testGameboard = new Gameboard(8, 8);
    const testGameboard2 = new Gameboard(4, 7);

    expect(testGameboard.board).not.toBeNull();
    expect(testGameboard2.board).not.toBeNull();

    expect(testGameboard.board.length).toBe(8);
    expect(testGameboard2.board.length).toBe(4);

    expect(testGameboard.board[0].length).toBe(8);
    expect(testGameboard2.board[3].length).toBe(7);
  });

  test("place ship on board", () => {
    const testGameboard = new Gameboard(8, 8);
    const testGameboard2 = new Gameboard(4, 7);

    testGameboard.placeShip([[3, 3]]);
    testGameboard2.placeShip([[1, 1], [1, 2], [1, 3]]);
    testGameboard2.placeShip([[3, 6], [3, 5]]);

    expect(testGameboard.ships.length).toBe(1);
    expect(testGameboard2.ships.length).toBe(2);

    expect(testGameboard.board[1][1].ship).toBeDefined();
    expect(testGameboard.board[2][0].ship).toBeNull();
    expect(testGameboard2.board[3][6].ship).toBeDefined();
    expect(testGameboard2.board[3][4].ship).toBeNull();
  });
});
