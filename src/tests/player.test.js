import { Player } from "../player";

describe("player class", () => {
    test("player class creates gameboard", () => {
        const testPlayer = new Player();
        const testPlayer2 = new Player();

        expect(testPlayer).toBeDefined();
        expect(testPlayer.gameboard.board).toHaveLength(10);
        expect(testPlayer.gameboard.rows).toBe(10);

        expect(testPlayer2.gameboard.ships).toHaveLength(0);
        expect(testPlayer2.gameboard.board).not.toBeNull();
    })
})