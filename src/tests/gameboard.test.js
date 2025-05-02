import { experiments } from "webpack";
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

  test("gameboard populates available moves", () => {
    const testGameboard = new Gameboard(8, 8);
    const testGameboard2 = new Gameboard(4, 8);

    expect(testGameboard.availableMoves).toBeDefined();
    expect(testGameboard.availableMoves).toContainEqual([2, 2]);
    expect(testGameboard.availableMoves).toContainEqual([7, 7]);
    expect(testGameboard.availableMoves).toContainEqual([5, 6]);

    expect(testGameboard2.availableMoves).toBeDefined();
    expect(testGameboard2.availableMoves).toContainEqual([0, 0]);
    expect(testGameboard2.availableMoves).toContainEqual([3, 7]);
    expect(testGameboard2.availableMoves).toContainEqual([3, 0]);
  })

  test("place ship on board", () => {
    const testGameboard = new Gameboard(8, 8);
    const testGameboard2 = new Gameboard(4, 7);

    testGameboard.placeShip([[3, 3]]);
    testGameboard2.placeShip([[1, 1], [1, 2], [1, 3]]);
    testGameboard2.placeShip([[3, 6], [3, 5]]);

    expect(testGameboard.ships.length).toBe(1);
    expect(testGameboard2.ships.length).toBe(2);

    expect(testGameboard.board[1][1]).toBeDefined();
    expect(testGameboard.board[2][0]).toHaveLength(0);
    expect(testGameboard2.board[3][6]).toBeDefined();
    expect(testGameboard2.board[3][4]).toHaveLength(0);
  });

  test("board receives an attack", () => {
    const testGameboard = new Gameboard(8, 8);
    const testGameboard2 = new Gameboard(4, 7);

    testGameboard.placeShip([[3, 3]]);
    testGameboard2.placeShip([[1, 1], [1, 2], [1, 3]]);
    testGameboard2.placeShip([[3, 6], [3, 5]]);

    testGameboard.receiveAttack([3, 2]);
    expect(testGameboard.attacks).toHaveLength(1);
    testGameboard.receiveAttack([3, 1]);
    expect(testGameboard.attacks).toHaveLength(2);
    testGameboard.receiveAttack([3, 3]);
    expect(testGameboard.board[3][3].hitTimes).toBe(1);

    testGameboard2.receiveAttack([3, 5]);
    testGameboard2.receiveAttack([3, 6]);
    expect(testGameboard2.board[3][5].hitTimes).toBe(2);
    expect(testGameboard2.ships[0].hitTimes).toBe(0);
    expect(testGameboard2.ships[1].hitTimes).toBe(2);

    expect(testGameboard.receiveAttack([3, 2])).toBe('Already attacked!');
  });

  test("board checks for duplicate attacks", () => {
    const testGameboard = new Gameboard(10, 10);
    const testGameboard2 = new Gameboard(4, 7);

    expect(testGameboard.isAlreadyAttacked([1, 2])).toBe(false);
    testGameboard.receiveAttack([1, 2]);
    expect(testGameboard.isAlreadyAttacked([1, 2])).toBe(true);

    expect(testGameboard2.receiveAttack([3, 6]));
    expect(testGameboard2.isAlreadyAttacked([3, 6])).toBe(true);
    expect(testGameboard2.isAlreadyAttacked([0, 0])).toBe(false);
  });

  test("all ships have sunk", () => {
    const testGameboard = new Gameboard(8, 8);
    const testGameboard2 = new Gameboard(4, 7);

    testGameboard.placeShip([[3, 3]]);
    testGameboard2.placeShip([[1, 1]]);
    testGameboard2.placeShip([[3, 6], [3, 5]]);

    expect(testGameboard.allShipsSunk()).toBe(false);
    testGameboard.receiveAttack([3, 3]);
    expect(testGameboard.allShipsSunk()).toBe(true);

    testGameboard2.receiveAttack([1, 1]);
    testGameboard2.receiveAttack([3, 6]);
    expect(testGameboard2.allShipsSunk()).toBe(false);
    testGameboard2.receiveAttack([3, 5]);
    expect(testGameboard2.allShipsSunk()).toBe(true);
  });
});
