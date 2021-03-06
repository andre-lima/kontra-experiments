// import { Sprite } from "../../declarations/kontra";
import { Character } from "./character";
import { initKeys, keyPressed, Sprite } from "../vendors/kontra/kontra.js";
import { DirectionalCollider } from "../helpers/directional-collider";

enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT
}

export class Snapped extends Sprite.class {
  private gridSize: number;
  private restrictions;
  private movingToNext = false;
  private currDirection: Direction;
  public body;
  public collider;
  private colliderOffset = 1;

  constructor(gridSize, tiles) {
    super({ x: 16 * 10, y: 16 * 10, width: 16, height: 16, color: "red" });

    this.collider = Sprite({
      x: 16 * 10 + this.colliderOffset,
      y: 16 * 10 + this.colliderOffset,
      width: 16 - this.colliderOffset * 2,
      height: 16 - this.colliderOffset * 2,
      color: "yellow"
    });

    initKeys();
    this.gridSize = gridSize;
    this.restrictions = new DirectionalCollider(this.collider, tiles);
  }

  update() {
    super.update();

    if (this.movingToNext) {
      if (this.currDirection === Direction.LEFT) {
        this.x += -1;
      } else if (this.currDirection === Direction.UP) {
        this.y += -1;
      } else if (this.currDirection === Direction.RIGHT) {
        this.x += 1;
      } else if (this.currDirection === Direction.DOWN) {
        this.y += 1;
      }
    }

    if (this.x % this.gridSize === 0 && this.y % this.gridSize === 0) {
      this.movingToNext = false;
    }

    if (keyPressed("a") && !this.restrictions.blockedLeft()) {
      this.moveTo(Direction.LEFT);
    } else if (keyPressed("w") && !this.restrictions.blockedUp()) {
      this.moveTo(Direction.UP);
    } else if (keyPressed("d") && !this.restrictions.blockedRight()) {
      this.moveTo(Direction.RIGHT);
    } else if (keyPressed("s") && !this.restrictions.blockedDown()) {
      this.moveTo(Direction.DOWN);
    }

    this.collider.x = this.x + this.colliderOffset;
    this.collider.y = this.y + this.colliderOffset;

    this.collider.update();
    this.restrictions.update();
  }

  private moveTo(dir: Direction) {
    if (!this.movingToNext) {
      this.currDirection = dir;
      this.movingToNext = true;
    }
  }

  render() {
    super.render();
    this.collider.render();
  }

  addRestrictions(dirCollider) {
    this.restrictions = dirCollider;
  }
}
