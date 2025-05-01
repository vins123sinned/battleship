import { Player } from "./player.js";

export function createPlayer() {
    const player = new Player();

    const shipCoordinates = [
        [[1, 1]],
        [[3, 1], [3, 2], [3, 3]],
        [[8, 1], [8, 2]],
        [[5, 3], [5, 4], [5, 5], [5, 6]],
        [[8, 4], [8, 5]],
        [[0, 4]],
        [[1, 7]],
        [[1, 9]],
        [[4, 8], [3, 8]],
        [[5, 9], [6, 9], [7, 9]],
    ];

    populateGameboard(shipCoordinates, player.gameboard);

    return player;
}

function populateGameboard(coordinates, gameboard) {
    coordinates.forEach((coordinate) => {
        gameboard.placeShip(coordinate);
    });
}