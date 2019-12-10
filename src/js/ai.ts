import { normalize } from "../helpers/index";

enum LeftRight {
  Idle,
  Left,
  Right
}

enum UpDown {
  Idle,
  Up,
  Down
}

export class AiController {
  private restrictions;
  public isChasing = false;
  public moveLR: LeftRight = LeftRight.Idle;
  public moveUD: UpDown = UpDown.Idle;

  constructor() {
    const checkDelay = Math.floor((Math.random() - 0.5) * 100 + 1000);

    this.moveLR = Math.floor(Math.random() * 3);
    this.moveUD = Math.floor(Math.random() * 3);

    setInterval(() => {
      this.moveLR = Math.floor(Math.random() * 3);
    }, checkDelay);

    setInterval(() => {
      this.moveUD = Math.floor(Math.random() * 3);
    }, checkDelay * 0.8);
  }

  update() {
    let dirs = { x: 0, y: 0 };

    if (this.moveLR === LeftRight.Left) {
      if (!this.restrictions.blockedLeft()) {
        dirs.x = -1;
      }
    }

    if (this.moveLR === LeftRight.Right) {
      if (!this.restrictions.blockedRight()) {
        dirs.x = 1;
      }
    }

    if (this.moveUD === UpDown.Up) {
      if (!this.restrictions.blockedUp()) {
        dirs.y = -1;
      }
    }

    if (this.moveUD === UpDown.Down) {
      if (!this.restrictions.blockedDown()) {
        dirs.y = 1;
      }
    }

    return dirs;
  }

  chasing(dirs) {
    if (this.restrictions.blockedLeft() && dirs.x < 0) {
      dirs.x = 0;
    }

    if (this.restrictions.blockedRight() && dirs.x > 0) {
      dirs.x = 0;
    }

    if (this.restrictions.blockedUp() && dirs.y < 0) {
      dirs.y = 0;
    }

    if (this.restrictions.blockedDown() && dirs.y > 0) {
      dirs.y = 0;
    }

    return dirs;
  }

  addRestrictions(dirCollider) {
    this.restrictions = dirCollider;
  }
}
