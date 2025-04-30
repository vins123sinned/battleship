import { Ship } from "../ship";

test('ship returns correct properties', () => {
    const testShip = new Ship(3);
    const testShip2 = new Ship(1);

    expect(testShip.length).toBe(3);
    expect(testShip.hit).toBe(0);

    expect(testShip2.length).toBe(1);
});