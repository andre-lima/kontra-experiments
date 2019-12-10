// import { Sprite } from "../../declarations/kontra";
import { loadAnimatedPlayer } from "./assets";
import { AiController } from "./ai";
import { Log, Collider, Ray } from "../helpers/index";
import { DirectionalCollider } from "../helpers/directional-collider";
import { Character } from "./character";

export class Monster extends Character {
  private runningSpeed;
  public target;
  public canSeeTarget: boolean;
  public collisionMap;
  private ray: Ray;
  protected controller: AiController;

  constructor() {
    super();
    this.ray = new Ray();
    this.controller = new AiController();
  }

  load(monsterImg, posX, posY, speed, tiles): Promise<Sprite> {
    return super
      .load(monsterImg, posX, posY, speed, tiles)
      .then(loadedMonster => {
        tiles.addObject(this.ray);
        this.runningSpeed = this.speed * 1.2;
        this.controller.addRestrictions(this.restrictions);
      });
  }

  update() {
    if (this.body) {
      this.ray.cast(this.body, this.target);

      let currentSpeed = this.speed;
      let currentDirection = { x: 0, y: 0 };

      if (
        this.ray.direction &&
        !this.ray.collidesWithTiles(this.collisionMap)
      ) {
        this.canSeeTarget = true;
        this.controller.isChasing = true;
      } else {
        this.canSeeTarget = false;
        this.controller.isChasing = false;
      }

      if (this.canSeeTarget) {
        currentDirection = this.controller.chasing(this.ray.direction);
        currentSpeed = this.runningSpeed;
      } else {
        currentDirection = this.controller.update();
      }

      super.update(currentDirection, currentSpeed);
    }
  }

  render() {
    if (this.body) {
      this.body.render();
      this.collider.render();

      this.ray.render();
      this.ray.drawDebugTiles(16, 16);
    }
  }

  setVision(target, collisionMap) {
    this.target = target;
    this.collisionMap = collisionMap;
  }
}
