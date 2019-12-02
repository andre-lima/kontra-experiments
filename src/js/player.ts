// import { Sprite } from "../../declarations/kontra";
import { loadAnimatedPlayer } from "./assets";
import { KeyboardController } from "./controller";
import { Log } from "../helpers/log";
import renderChildrenPlugin from "../plugins/renderChildren";
import { registerPlugin, Sprite } from "../kontra/kontra";

export class Player {
  protected speed = 2;
  public body: Sprite;
  public collider: Sprite;
  public children = [];
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

        this.body.children = []

        registerPlugin(Sprite, renderChildrenPlugin);

        this.collider = Sprite({
          x: 0,
          y: 0,
          width: 5,
          height: 5,
          color: "red"
        });

        this.body.addChild(this.collider);

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

      // this.collider.update();
      this.setAnimation();
    }
  }

  render() {
    if (this.body) {
      this.body.render();
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
