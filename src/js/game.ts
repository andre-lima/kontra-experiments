import tilesImage from "../maps/tiles.png";
import playerImg from "../assets/images/player.png";
import coinImg from "../assets/images/coin.png";
import mapJson from "../maps/map.json";
import { loadTiles } from "./assets";
import { Player } from "./player";
import { Log, DepthSort, Ray } from "../helpers/index";
import { tilesCollisionMapping } from "../helpers/collision-map";
import { Sprite } from "../vendors/kontra/kontra.js";
import GameObject from "../vendors/kontra/gameObject";

export class Game {
  private player: Player;
  private player2: Player;
  private coin: Sprite;
  private coins;
  private tiles: TileEngine;
  private ready = false;
  private collisionMap;
  private ray: Ray;

  constructor() {
    this.player = new Player();
    this.player2 = new Player();
    this.ray = new Ray();

    this.coins = new GameObject();
  }

  load() {
    console.log("loading game assets");

    let coin = new Image();
    coin.src = coinImg;

    this.coin = Sprite({
      x: 100,
      y: 120,
      width: 8,
      height: 8,
      image: coin
    });

    this.coins.addChild(this.coin);

    DepthSort.add(this.coins);
    DepthSort.add(this.player, this.player2);

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
      // this.coin.update();

      this.ray.cast(this.player.body, this.player2.body);

      if (this.tiles.layerCollidesWith("walls", this.player.collider)) {
        console.log("colliding");
      }

      this.ray.collidesWithTiles(this.collisionMap);
      this.ray.collidesWithSprite(this.coin);
      Log.q(this.player.body.x + " " + this.player2.body.x, "players");
    }
  }

  render() {
    if (this.ready) {
      this.tiles.render();
      DepthSort.render();
      this.coins.render();

      if (this.ray.collidesWithSprite(this.coin)) {
        this.ray.drawDebugSprites(this.coin);
      }

      this.ray.render();
      this.ray.drawDebugTiles(16, 16);
    }
  }
}
