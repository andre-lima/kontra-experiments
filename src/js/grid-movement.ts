import { initKeys, keyPressed } from "../vendors/kontra/kontra.js";

enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT
}

export class GridMovement {
  private restrictions;
  private gridSize;
  private moveToNext = true;
  private currDirection: Direction;

  constructor(gridSize) {
    initKeys();

    this.gridSize = gridSize;
  }

  update(x, y) {
    // console.log(x,y);
    let dirs = { x: 0, y: 0 };

    console.log(y, y % this.gridSize);

    if (x % this.gridSize === 0 && y % this.gridSize === 0) {
      this.moveToNext = false;
    }

    if (keyPressed("left")) {
      this.moveTo(Direction.LEFT);
    } else if (keyPressed("up")) {
      this.moveTo(Direction.UP);
    } else if (keyPressed("right")) {
      this.moveTo(Direction.RIGHT);
    } else if (keyPressed("down")) {
      this.moveTo(Direction.DOWN);
    }

    if (this.moveToNext) {
      if (this.currDirection === Direction.LEFT) {
        if (!this.restrictions.blockedLeft()) {
          dirs.x = -1;
        }
      } else if (this.currDirection === Direction.UP) {
        if (!this.restrictions.blockedUp()) {
          dirs.y = -1;
        }
      } else if (this.currDirection === Direction.RIGHT) {
        if (!this.restrictions.blockedRight()) {
          dirs.x = 1;
        }
      } else if (this.currDirection === Direction.DOWN) {
        if (!this.restrictions.blockedDown()) {
          dirs.y = 1;
        }
      }
    }

    return dirs;
  }

  private moveTo(dir: Direction) {
    if (!this.moveToNext) {
      this.currDirection = dir;
      this.moveToNext = true;
    }
  }

  addRestrictions(dirCollider) {
    this.restrictions = dirCollider;
  }
}
