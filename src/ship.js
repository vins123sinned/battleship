export class Ship {
  constructor(length, coordinates, direction) {
    this.length = length;
    this.hitTimes = 0;
    this.sunk = false;
    this.coordinates = coordinates;
    this.direction = direction;
  }

  hit() {
    this.hitTimes += 1;
  }

  isSunk() {
    if (this.hitTimes === this.length) this.sunk = true;
    return this.sunk;
  }
}
