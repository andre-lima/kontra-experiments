import tilesImage from "../maps/tiles.png";
import playerImg from "../assets/images/player.png";
import mapJson from "../maps/map.json";
import { loadTiles } from "./assets";
import { Player } from "./player";
import { Log, DepthSort, Line } from "../helpers/index";

export class Game {
  private player: Player;
  private player2: Player;
  private tiles: TileEngine;
  private ready = false;

  constructor() {
    this.player = new Player();
    this.player2 = new Player();
    DepthSort.add(this.player, this.player2);
  }

  load() {
    console.log("loading game assets");

    loadTiles(mapJson, tilesImage).then((tiles: TileEngine) => {
      this.tiles = tiles;

      this.player.load(playerImg, 16 * 5, 16 * 5, 2).then(body => {
        this.ready = true;
      });

      this.player2.load(playerImg, 16 * 18, 16 * 10, -1).then(body => {
        this.ready = true;
      });
    });
  }

  update() {
    if (this.ready) {
      this.player.update();
      this.player2.update();

      if (this.tiles.layerCollidesWith("walls", this.player.body)) {
        console.log("colliding");
      }
    }
  }

  render() {
    if (this.ready) {
      this.tiles.render();
      Line.lineTo(this.player.body, this.player2.body);
      DepthSort.render();
    }
  }
}
