import tilesImage from "../maps/tiles.png";
import playerImg from "../assets/images/player.png";
import monsterImg from "../assets/images/enemy-0.png";
import bossImg from "../assets/images/enemy-1.png";
import coinImg from "../assets/images/coin.png";
import mapJson from "../maps/map.json";
import { loadTiles } from "./assets";
import { Character } from "./character";
import { Hero } from "./hero";
import { Log, DepthSort, Ray } from "../helpers/index";
import { tilesCollisionMapping } from "../helpers/collision-map";
import { Sprite } from "../vendors/kontra/kontra.js";
import GameObject from "../vendors/kontra/gameObject";
import { collides } from "../vendors/kontra/collision";

export class Game {
  private player: Hero;
  private monster: Character;
  private boss: Character;
  private coin: Sprite;
  private coins;
  private tiles: TileEngine;
  private ready = false;
  private collisionMap;
  private ray: Ray;
  private ray2: Ray;

  constructor() {
    this.player = new Hero();
    this.monster = new Character();
    this.boss = new Character();
    this.ray = new Ray();
    this.ray2 = new Ray();

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
    DepthSort.add(this.player, this.monster, this.boss);

    loadTiles(mapJson, tilesImage).then((tiles: TileEngine) => {
      this.tiles = tiles;
      this.collisionMap = tilesCollisionMapping(this.tiles, "walls");

      this.player.load(playerImg, 16 * 5, 16 * 5, 2, this.tiles).then(body => {
        this.ready = true;
      });

      this.monster
        .load(monsterImg, 16 * 31, 16 * 20, 1, this.tiles)
        .then(body => {
          this.ready = true;
        });

      this.boss.load(bossImg, 16 * 31, 16 * 28, 3, this.tiles).then(body => {
        this.ready = true;
      });
    });
  }

  update() {
    if (this.ready) {
      // this.player.update();
      // this.monster.update();
      DepthSort.update();
      this.coin.update();

      this.ray.cast(this.player.body, this.monster.body);
      this.ray2.cast(this.player.body, this.boss.body);

      if (collides(this.player.collider, this.coin)) {
        console.log("colliding");
      }

      this.ray.collidesWithTiles(this.collisionMap);
      this.ray2.collidesWithTiles(this.collisionMap);

      this.ray.collidesWithSprite(this.coin);
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

      this.ray2.render();
      this.ray2.drawDebugTiles(16, 16);
    }
  }
}
