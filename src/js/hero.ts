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
  }

  plugController() {
    this.controller = new KeyboardController();
  }

  load(playerImg, posX, posY, speed, tiles): Promise<Sprite> {
    return super.load(playerImg, posX, posY, speed, tiles);
  }
}
