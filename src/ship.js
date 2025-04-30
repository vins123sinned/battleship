export class Ship {
  constructor(length) {
    this.length = length;
    this.hitTimes = 0;
    this.sunk = false;
  }

  hit() {
    this.hitTimes += 1;
  }

  isSunk() {
    if (this.hitTimes === this.length) this.sunk = true;
    return this.sunk;
  }
}
