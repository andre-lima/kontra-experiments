import { Sprite } from "../../declarations/kontra";
import { loadAnimatedPlayer } from "./assets";
import { KeyboardController } from "./controller";
import { Log } from "../helpers/log";

export class Player {
  protected speed = 2;
  public body: Sprite;
  private initialWidth: number;
  private controller: KeyboardController;

  constructor() {
    this.controller = new KeyboardController();
  }

  load(playerImg, posX, posY, speed): Promise<Sprite> {
    return new Promise(resolve => {
      loadAnimatedPlayer(playerImg).then((loadedPlayer: Sprite) => {
        this.body = loadedPlayer;
        this.initialWidth = this.body.width;
        this.body.x = posX;
        this.body.y = posY;
        this.speed = speed;
        resolve(this.body);
      });
    });
  }

  update() {
    if (this.body) {
      const dirs = this.controller.update();
      this.body.dx = dirs.x * this.speed;
      this.body.dy = dirs.y * this.speed;

      this.body.update();
      this.setAnimation();
    }
  }

  render() {
    if (this.body) {
      this.body.render();
      Log.q(this.body.x);
      // console.log(this.body.x, this.body.y);
    }
  }

  setAnimation() {
    // Change animation based on velocity
    if (this.body.dy < 0) {
      this.body.playAnimation("up");
    }
    if (this.body.dy > 0) {
      this.body.playAnimation("down");
    }
    if (this.body.dx < 0) {
      this.body.playAnimation("left");
      this.unflip();
    }
    if (this.body.dx > 0) {
      this.body.playAnimation("right");
      this.flip();
    }
    if (this.body.dx === 0 && this.body.dy === 0) {
      this.body.playAnimation("idle");
    }
  }

  flip() {
    this.body.width = -this.initialWidth;
  }

  unflip() {
    this.body.width = this.initialWidth;
  }

  // collidesWith(object) {

  //   if (this.body.rotation || object.rotation) return null;

  //   // take into account sprite anchors
  //   let x = this.body.x - this.body.width * this.body.anchor.x;
  //   let y = this.body.y - this.body.height * this.body.anchor.y;

  //   let objX = object.x;
  //   let objY = object.y;
  //   if (object.anchor) {
  //     objX -= object.width * object.anchor.x;
  //     objY -= object.height * object.anchor.y;
  //   }

  //   console.log(
  //     "jjj",
  //     x < objX + object.width &&
  //       x + this.body.width > objX &&
  //       y < objY + object.height &&
  //       y + this.body.height > objY
  //   );

  //   return (
  //     x < objX + object.width &&
  //     x + this.body.width > objX &&
  //     y < objY + object.height &&
  //     y + this.body.height > objY
  //   );
  // }
}
