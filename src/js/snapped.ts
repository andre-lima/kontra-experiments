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
  public body
  
  constructor(gridSize, tiles) {
    super({x: 16*10, y:16*10, width: 16, height: 16, color: 'red'});

    initKeys();
    this.gridSize = gridSize;
    this.restrictions = new DirectionalCollider(this, tiles);
  }
  
  update() {
    super.update();
    this.restrictions.update();
    
    if (this.movingToNext) {
      if (this.currDirection === Direction.LEFT) {
        if (!this.restrictions.blockedLeft()) {
          this.x += -1;
        }
      } else if (this.currDirection === Direction.UP) {
        if (!this.restrictions.blockedUp()) {
          this.y += -1;
        }
      } else if (this.currDirection === Direction.RIGHT) {
        if (!this.restrictions.blockedRight()) {
          this.x += 1;
        }
      } else if (this.currDirection === Direction.DOWN) {
        if (!this.restrictions.blockedDown()) {
          this.y += 1;
        }
      }
    }

    if (this.x % this.gridSize === 0 && this.y % this.gridSize === 0) {
      this.movingToNext = false;
    }

    if (keyPressed("a")) {
      this.moveTo(Direction.LEFT);
    } else if (keyPressed("w")) {
      this.moveTo(Direction.UP);
    } else if (keyPressed("d")) {
      this.moveTo(Direction.RIGHT);
    } else if (keyPressed("s")) {
      this.moveTo(Direction.DOWN);
    }
  }

  private moveTo(dir: Direction) {
    if (!this.movingToNext) {
      this.currDirection = dir;
      this.movingToNext = true;
    }
  }

  addRestrictions(dirCollider) {
    this.restrictions = dirCollider;
  }
}
