// import { Sprite } from "../../declarations/kontra";
import { loadAnimatedPlayer } from "./assets";
import { KeyboardController } from "./controller";
import { Log, Collider } from "../helpers/index";
import { DirectionalCollider } from "../helpers/directional-collider";
import { Character } from "./character";

export class Hero extends Character {
  protected controller: KeyboardController;

  constructor() {
    super();
    this.controller = new KeyboardController();
  }

  update() {
    const dirs = this.controller.update();

    super.update(dirs, this.speed);
  }

  load(playerImg, posX, posY, speed, tiles): Promise<Sprite> {
    return super.load(playerImg, posX, posY, speed, tiles).then(loadedHero => {
      this.controller.addRestrictions(this.restrictions);
    });
  }
}
