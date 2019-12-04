import { initKeys, keyPressed } from "../vendors/kontra/kontra.js";
import { normalize } from "../helpers/index";

export class KeyboardController {
  constructor() {
    initKeys();
  }

  update() {
    let dirs = { x: 0, y: 0 };

    if (keyPressed("left")) {
      dirs.x = -1;
    }

    if (keyPressed("up")) {
      dirs.y = -1;
    }

    if (keyPressed("right")) {
      dirs.x = 1;
    }

    if (keyPressed("down")) {
      dirs.y = 1;
    }

    return normalize(dirs);
  }
}
