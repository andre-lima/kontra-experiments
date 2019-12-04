// import { Sprite } from "../../declarations/kontra";
import { loadAnimatedPlayer } from "./assets";
import { KeyboardController } from "./controller";
import { Log, Collider, Line } from "../helpers/index";



export class Player {
  protected speed = 2;
  public body: Sprite;
  public collider: Collider;
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
        this.body.anchor.x = 0.5;
        this.body.anchor.y = 0.5;
        this.speed = speed;

        // this.collider = new Collider(0, 0.5, 1, 0.5);
        // this.body.addChild(this.collider);
        this.body.collider = new Collider(0, 0.5, 1, 0.5);

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
      this.body.collider.update(this.body);

      this.setAnimation();
    }
  }

  render() {
    if (this.body) {
      this.body.render();
      this.body.collider.render();
      Log.q(this.body.x);
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
