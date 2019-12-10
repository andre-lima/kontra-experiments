import tilesImage from "../maps/tiles.png";
import playerImg from "../assets/images/player.png";
import monsterImg from "../assets/images/enemy-0.png";
import bossImg from "../assets/images/enemy-1.png";
import coinImg from "../assets/images/coin.png";
import mapJson from "../maps/map.json";
import { loadTiles } from "./assets";
import { Hero } from "./hero";
import { Log, DepthSort, Panel } from "../helpers/index";
import { tilesCollisionMapping } from "../helpers/collision-map";
import { Sprite } from "../vendors/kontra/kontra.js";
import { getCanvas } from "../vendors/kontra/core.js";
import GameObject from "../vendors/kontra/gameObject";
import { collides } from "../vendors/kontra/collision";
import { Monster } from "./monster";

export class Game {
  private player: Hero;
  private monster: Monster;
  private boss: Monster;
  private coin: Sprite;
  private coins;
  private tiles: TileEngine;
  private ready = false;
  private collisionMap;
  private panel: Panel;

  constructor() {
    // Instantiating characters and items
    this.player = new Hero();
    this.monster = new Monster();
    this.boss = new Monster();
    this.coins = new GameObject();

    // WIP: Dialog box
    /*
    this.panel = new Panel(
      getCanvas(),
      80,
      false,
      0.8,
      100,
      "rgba(222,222,222,0.5)"
    );
    this.panel.show();
    */
  }

  load() {
    console.log("loading game assets");

    // Adding coin to game. 
    let coin = new Image();
    coin.src = coinImg;

    this.coin = Sprite({
      x: 100,
      y: 120,
      width: 8,
      height: 8,
      image: coin
    });

    // Coins works as a group
    this.coins.addChild(this.coin);

    // Adding items to depth sort module
    DepthSort.add(this.coins);
    DepthSort.add(this.player, this.monster, this.boss);

    loadTiles(mapJson, tilesImage).then((tiles: TileEngine) => {
      this.tiles = tiles;

      // Generate collision mapping to be used by raycasting
      this.collisionMap = tilesCollisionMapping(this.tiles, "walls");

      const promises = []

      promises.push(this.player.load(playerImg, 16 * 5, 16 * 5, 2, this.tiles))
      promises.push(this.monster.load(monsterImg, 16 * 10, 16 * 25, 1, this.tiles));
      promises.push(this.boss.load(bossImg, 16 * 31, 16 * 28, 1.8, this.tiles));
      
      Promise.all(promises).then(res => {
        this.ready = true;
        this.monster.setVision(this.player.body, this.collisionMap);
        this.boss.setVision(this.player.body, this.collisionMap);
      });


    });
  }

  update() {
    if (this.ready) {
      DepthSort.update();

      if (collides(this.player.collider, this.coin)) {
        console.log("bling!");
      }
    }
  }

  render() {
    if (this.ready) {
      this.tiles.render();
      DepthSort.render();
      // this.coins.render();
      // this.panel.render();
    }
  }
}
