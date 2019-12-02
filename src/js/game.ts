import { Sprite, TileEngine } from "../../declarations/kontra";
import tilesImage from "../maps/tiles.png";
import playerImg from "../assets/images/player.png";
import mapJson from "../maps/map.json";
import { loadTiles } from "./assets";
import { Player } from "./player";

export class Game {
  private player: Player;
  private tiles: TileEngine;
  private ready = false;

  constructor() {
    this.player = new Player(playerImg);
  }

  load() {
    console.log("loading game assets");

    loadTiles(mapJson, tilesImage).then((tiles: TileEngine) => {
      console.log(mapJson);
      this.tiles = tiles;
      this.player.load(playerImg).then(body => {
        this.ready = true;
      });
    });
  }

  update() {
    if (this.ready) {
      if (this.tiles.layerCollidesWith("walls", this.player.body)) {
        console.log(this.player.body);
      }
      this.player.update();
    }
  }

  render() {
    if (this.ready) {
      this.tiles.render();
      this.player.render();
    }
  }
}
