// import { Sprite } from "../../declarations/kontra";
import { loadAnimatedPlayer } from "./assets";
import { AiController } from "./ai";
import { Log, Collider, Ray } from "../helpers/index";
import { DirectionalCollider } from "../helpers/directional-collider";

export class Character {
  protected speed = 2;
  public body: Sprite;
  public target;
  public canSeeTarget: boolean;
  public collisionMap;
  public restrictions;
  private ray: Ray;
  public collider;
  private initialWidth: number;
  protected controller: AiController;

  constructor() {
    this.plugController();

    this.ray = new Ray();
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

        tiles.addObject(this.body);
        tiles.addObject(this.ray);

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
      // console.log(!!this.body, !!this.target, !!this.collisionMap);

      if (this.target && this.collisionMap) {
        this.ray.cast(this.body, this.target);
      }

      if (this.ray.direction && !this.ray.collidesWithTiles(this.collisionMap)) {
        this.canSeeTarget = true;
        
      } else {
        this.canSeeTarget = false;
      }

      let dirs = {x: 0, y:0};
      if(this.canSeeTarget) {
        dirs = this.ray.direction || dirs;

        // PUT THIS LOGIN IN AI
        if (this.restrictions.blockedLeft() || this.restrictions.blockedRight()) {
          dirs.x = 0;
        }
        if (this.restrictions.blockedUp() || this.restrictions.blockedDown()) {
          dirs.y = 0;
        }

      } else {
        dirs = this.controller.update();
      }

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

      if (this.target && this.collisionMap) {
        this.ray.render();
        this.ray.drawDebugTiles(16, 16);
      }
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

  setVision(target, collisionMap) {
    this.target = target;
    this.collisionMap = collisionMap;
  }

  moveTowards() {
    console.log('moving towasdf');
  }
}
