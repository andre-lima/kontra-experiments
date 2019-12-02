import { Sprite, TileEngine } from "../../declarations/kontra";
import tilesImage from "../maps/tiles.png";
import playerImg from "../assets/images/player.png";
import mapJson from "../maps/map.json";
import { loadTiles } from "./assets";
import { Player } from "./player";

export class Game {
  private player: Player;
  private player2: Player;
  private tiles: TileEngine;
  private ready = false;

  constructor() {
    this.player = new Player();
    this.player2 = new Player();
  }

  load() {
    console.log("loading game assets");

    loadTiles(mapJson, tilesImage).then((tiles: TileEngine) => {
      this.tiles = tiles;
      this.player.load(playerImg, 100, 100, 2).then(body => {
        this.ready = true;
      });
      this.player2.load(playerImg, 180, 100, -1).then(body => {
        this.ready = true;
      });
    });
  }

  update() {
    if (this.ready) {
      if (this.tiles.layerCollidesWith("walls", this.player.body)) {
        // console.log(this.player.body);
      }
      this.player.update();
      this.player2.update();
      this.player.body.collidesWith(this.player2.body);
    }
  }

  render() {
    if (this.ready) {
      this.tiles.render();
      this.player.render();
      this.player2.render();
    }
  }
}
