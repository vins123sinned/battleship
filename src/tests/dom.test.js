import { createPlayer, updatePlayerTurn } from "../dom";

describe('dom logic functions correctly', () => {
    test('creates player', () => {
        const playerOne = createPlayer('Player One', true);
        const playerTwo = createPlayer('Player Two');

        expect(playerOne).toHaveProperty('name', 'Player One');
        expect(playerOne).toHaveProperty('gameboard');
        expect(playerOne.gameboard.board).toHaveLength(10);
        expect(playerOne).toHaveProperty('currentTurn', true);

        expect(playerTwo).toHaveProperty('name', 'Player Two');
        expect(playerTwo).toHaveProperty('gameboard');
        expect(playerTwo.gameboard.rows).toBe(10);
        expect(playerTwo).toHaveProperty('currentTurn', false);
    });
});