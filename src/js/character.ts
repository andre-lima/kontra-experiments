// import { Sprite } from "../../declarations/kontra";
import { loadAnimatedPlayer } from "./assets";
import { AiController } from "./ai";
import { Log, Collider } from "../helpers/index";
import { DirectionalCollider } from "../helpers/directional-collider";

export class Character {
  protected speed = 2;
  public body: Sprite;
  public restrictions;
  public collider;
  private initialWidth: number;
  protected controller: AiController;

  constructor() {
    this.plugController();
  }

  plugController() {
    this.controller = new AiController();
  }

  load(playerImg, posX, posY, speed, tiles): Promise<Sprite> {
    return new Promise(resolve => {
      loadAnimatedPlayer(playerImg).then((loadedPlayer: Sprite) => {
        this.body = loadedPlayer;
        this.initialWidth = this.body.width;
        this.body.x = posX;
        this.body.y = posY;
        this.body.anchor.x = 0.5;
        this.body.anchor.y = 0.5;
        this.speed = speed;

        this.collider = new Collider(this.body, 0.15, 0.5, 0.7, 0.5);
        this.body.collider = this.collider;
        // this.body.addChild(this.collider);

        this.restrictions = new DirectionalCollider(this.collider, tiles);
        this.controller.addRestrictions(this.restrictions);

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
      this.collider.update(this.body);
      this.restrictions.update();

      this.setAnimation();
    }
  }

  render() {
    if (this.body) {
      this.body.render();
      this.collider.render();
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
