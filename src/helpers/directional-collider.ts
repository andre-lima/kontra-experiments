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

  update() {
    const size = 2;

    // check up
    this.up = this.tiles.layerCollidesWith("walls", {
      width: this.parent.width,
      height: size,
      x: this.parent.x - this.parent.anchor.x * this.parent.width,
      y: this.parent.y - this.parent.anchor.y * this.parent.height - size
    });

    // check left
    this.left = this.tiles.layerCollidesWith("walls", {
      width: size,
      height: this.parent.height,
      x: this.parent.x - this.parent.anchor.x * this.parent.width - size,
      y: this.parent.y - this.parent.anchor.y * this.parent.height
    });

    // check down
    this.down = this.tiles.layerCollidesWith("walls", {
      width: this.parent.width,
      height: size,
      x: this.parent.x - this.parent.anchor.x * this.parent.width,
      y:
        this.parent.y +
        this.parent.height -
        this.parent.anchor.y * this.parent.height +
        size
    });

    // check right
    this.right = this.tiles.layerCollidesWith("walls", {
      width: size,
      height: this.parent.height,
      x:
        this.parent.x +
        this.parent.width -
        this.parent.anchor.x * this.parent.width +
        size,
      y: this.parent.y - this.parent.anchor.y * this.parent.height
    });

    // const uplft = this.tiles.layerCollidesWith("walls", {
    //   width: size,
    //   height: size,
    //   x: this.parent.x - this.parent.anchor.x * this.parent.width - size,
    //   y: this.parent.y - this.parent.anchor.y * this.parent.height - size
    // });

    // const uprgt = this.tiles.layerCollidesWith("walls", {
    //   width: size,
    //   height: size,
    //   x: this.parent.x + this.parent.anchor.x * this.parent.width,
    //   y: this.parent.y - this.parent.anchor.y * this.parent.height - size
    // });

    // const dnlft = this.tiles.layerCollidesWith("walls", {
    //   width: size,
    //   height: size,
    //   x: this.parent.x - this.parent.anchor.x * this.parent.width - size,
    //   y: this.parent.y + this.parent.anchor.y * this.parent.height
    // });

    // const dnrgt = this.tiles.layerCollidesWith("walls", {
    //   width: size,
    //   height: size,
    //   x: this.parent.x + this.parent.anchor.x * this.parent.width,
    //   y: this.parent.y + this.parent.anchor.y * this.parent.height
    // });

    // this.up = (uplft || uprgt) && this.up;
    // this.left = (uplft || dnlft) && this.left;
    // this.down = (dnlft || dnrgt) && this.down;
    // this.right = (uprgt || dnrgt) && this.right;
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
