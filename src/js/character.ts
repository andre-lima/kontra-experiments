// import { Sprite } from "../../declarations/kontra";
import { loadAnimatedPlayer } from "./assets";
import { Log, Collider, Ray, normalize } from "../helpers/index";
import { DirectionalCollider } from "../helpers/directional-collider";

export class Character {
  protected speed = 2;
  public body: Sprite;
  public collisionMap;
  public restrictions;
  public collider;
  private initialWidth: number;
  protected controller: any;

  constructor() {}

  load(characterImg, posX, posY, speed, tiles): Promise<Sprite> {
    return new Promise(resolve => {
      loadAnimatedPlayer(characterImg).then((loadedCharacter: Sprite) => {
        this.body = loadedCharacter;
        this.initialWidth = this.body.width;
        this.body.x = posX;// - this.body.width * 0.5;
        this.body.y = posY;// - this.body.height * 0.5;
        this.body.anchor.x = 0;//.5;
        this.body.anchor.y = 0;//.5;
        this.speed = speed;

        tiles.addObject(this.body);

        // Custom collider
        this.collider = new Collider(this.body, 0.15, 0.5, 0.7, 0.5);
        this.body.collider = this.collider;
        // this.body.addChild(this.collider);

        // Creating logic to block character from moving (eg colliding with tiles)
        this.restrictions = new DirectionalCollider(this.collider, tiles);

        resolve(this.body);
      });
    });
  }

  update(direction, speed = this.speed) {
    if (this.body) {
      direction = normalize(direction);

      this.body.dx = direction.x * speed;
      this.body.dy = direction.y * speed;

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
