import { Sprite, TileEngine } from "../../declarations/kontra";
import tilesImage from "../maps/tiles.png";
import playerImg from "../assets/images/player.png";
import mapJson from "../maps/map.json";
import { loadTiles } from "./assets";
import { Player } from "./player";
import { Log } from "../helpers/log";

export class Game {
  private player: Player;
  private player2: Player;
  private tiles: TileEngine;
  private ready = false;
  private sortGroup = [];

  constructor() {
    this.player = new Player();
    this.player2 = new Player();
    this.sortGroup.push(this.player);
    this.sortGroup.push(this.player2);
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
      // this.tiles.render();
      depthRender(this.sortGroup)
    }
  }
}

function depthRender(group) {
  const sorted = group.sort((i1, i2) => i1.body.y - i2.body.y );
  sorted.forEach(i => i.render())
}