import { Sprite } from "../../declarations/kontra";
import { loadAnimatedPlayer } from "./assets";
import { KeyboardController } from "./controller";

export class Player {
  protected speed = 2;
  public body: Sprite;
  private initialWidth: number;
  private controller: KeyboardController;

  constructor(playerImg) {
    this.controller = new KeyboardController();
  }

  load(playerImg): Promise<Sprite> {
    return new Promise(resolve => {
      loadAnimatedPlayer(playerImg).then((loadedPlayer: Sprite) => {
        this.body = loadedPlayer;
        this.initialWidth = this.body.width;

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
}
