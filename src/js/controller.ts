import { initKeys, keyPressed } from "../vendors/kontra/kontra.js";
import { normalize } from "../helpers/index";

export class KeyboardController {
  private restrictions;

  constructor() {
    initKeys();
  }

  update() {
    let dirs = { x: 0, y: 0 };

    if (keyPressed("left")) {
      if (!this.restrictions.blockedLeft()) {
        dirs.x = -1;
      }
    }

    if (keyPressed("up")) {
      if (!this.restrictions.blockedUp()) {
        dirs.y = -1;
      }
    }

    if (keyPressed("right")) {
      if (!this.restrictions.blockedRight()) {
        dirs.x = 1;
      }
    }

    if (keyPressed("down")) {
      if (!this.restrictions.blockedDown()) {
        dirs.y = 1;
      }
    }

    return normalize(dirs);
  }

  addRestrictions(dirCollider) {
    this.restrictions = dirCollider;
  }
}
