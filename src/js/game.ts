import tilesImage from "../maps/tiles.png";
import playerImg from "../assets/images/player.png";
import mapJson from "../maps/map.json";
import { loadTiles } from "./assets";
import { Player } from "./player";
import { Log, DepthSort, Ray } from "../helpers/index";
import { tilesCollisionMapping } from "../helpers/collision-map";
import { Sprite } from "../vendors/kontra/kontra.js";

export class Game {
  private player: Player;
  private player2: Player;
  private tiles: TileEngine;
  private ready = false;
  private collisionMap;
  private ray: Ray;

  private testSprite;
  private tsmap;

  constructor() {
    this.player = new Player();
    this.player2 = new Player();
    DepthSort.add(this.player, this.player2);
    this.ray = new Ray();

    this.testSprite = Sprite({
      x: 100,
      y: 120,
      width: 40,
      height: 20,
      color: "#bada55"
    });
  }

  load() {
    console.log("loading game assets");

    loadTiles(mapJson, tilesImage).then((tiles: TileEngine) => {
      this.tiles = tiles;
      this.collisionMap = tilesCollisionMapping(this.tiles, "walls");

      this.player.load(playerImg, 16 * 5, 16 * 5, 2).then(body => {
        this.ready = true;
      });

      this.player2.load(playerImg, 16 * 10, 16 * 10, -0).then(body => {
        this.ready = true;
      });
    });
  }

  update() {
    if (this.ready) {
      this.player.update();
      this.player2.update();
      this.testSprite.render();

      this.ray.cast(this.player.body, this.player2.body);

      if (this.tiles.layerCollidesWith("walls", this.player.body)) {
        // console.log("colliding");
      }

      this.ray.collidesWithTiles(this.collisionMap);
      this.ray.collidesWithSprite(this.testSprite);
      Log.q(this.player.body.x + " " + this.player2.body.x, "players");
    }
  }

  render() {
    if (this.ready) {
      // this.tiles.render();
      DepthSort.render();

      this.testSprite.render();
      if (this.ray.collidesWithSprite(this.testSprite)) {
        this.ray.drawDebugSprites(this.testSprite);
      }

      this.ray.render();
      this.ray.drawDebugTiles(16, 16);
    }
  }
}
