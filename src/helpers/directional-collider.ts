import { Sprite } from "../vendors/kontra/kontra";
import { Log } from "./log";

export class DirectionalCollider extends Sprite.class {
  private up;
  private down;
  private left;
  private right;
  private tiles;
  private parent;

  constructor(parent, tiles) {
    super();
    this.tiles = tiles;
    this.parent = parent;
  }

  update(tiles) {
    // check up
    this.up = this.tiles.layerCollidesWith("walls", {
      width: this.parent.width,
      height: 1,
      x: this.parent.x - this.parent.anchor.x * this.parent.width,
      y: this.parent.y - this.parent.anchor.y * this.parent.height - 1
    });

    // check left
    this.left = this.tiles.layerCollidesWith("walls", {
      width: 1,
      height: this.parent.height,
      x: this.parent.x - this.parent.anchor.x * this.parent.width - 1,
      y: this.parent.y - this.parent.anchor.y * this.parent.height
    });

    // check down
    this.down = this.tiles.layerCollidesWith("walls", {
      width: this.parent.width,
      height: 1,
      x: this.parent.x - this.parent.anchor.x * this.parent.width,
      y: this.parent.y + this.parent.anchor.y * this.parent.height + 1
    });

    // check right
    this.right = this.tiles.layerCollidesWith("walls", {
      width: 1,
      height: this.parent.height,
      x: this.parent.x + this.parent.anchor.x * this.parent.width + 1,
      y: this.parent.y - this.parent.anchor.y * this.parent.height
    });

    // Avoid blocking player if collider entered 1 pixel into restriction, making
    // both up and down (or left and right) be colliding at the same time.
    if (this.up && this.down) {
      // this.up = this.down = false;
    }

    if (this.left && this.right) {
      // this.left = this.right = false;
    }

    // console.log(this.up, this.left, this.down, this.right);
  }

  blockedUp() {
    return this.up;
  }

  blockedLeft() {
    return this.left;
  }

  blockedDown() {
    return this.down;
  }

  blockedRight() {
    return this.right;
  }
}
