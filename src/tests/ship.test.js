import { Ship } from "../ship";

describe('ship class', () => {
    test('ship returns correct properties', () => {
        const testShip = new Ship(3);
        const testShip2 = new Ship(1);

        expect(testShip.length).toBe(3);
        expect(testShip.hitTimes).toBe(0);
        expect(testShip2.length).toBe(1);
    });
    
    test('ship registers hit', () => {
        const testShip = new Ship(3);
        const testShip2 = new Ship(1);

        testShip.hit();
        expect(testShip.hitTimes).toBe(1);
        testShip.hit();
        expect(testShip.hitTimes).toBe(2);

        testShip2.hit();
        expect(testShip2.hitTimes).not.toBe(0);
    });

    test('ship registers sunk', () => {
        const testShip = new Ship(3);
        const testShip2 = new Ship(1);

        testShip.hit();
        testShip2.hit();

        expect(testShip.isSunk()).toBe(false);
        expect(testShip2.isSunk()).toBe(true);

        testShip.hit();
        testShip.hit();

        expect(testShip.isSunk()).toBe(true);
    })
});