import tilesImage from "../maps/tiles.png";
import playerImg from "../assets/images/player.png";
import monsterImg from "../assets/images/enemy-0.png";
import bossImg from "../assets/images/enemy-1.png";
import coinImg from "../assets/images/coin.png";
import mapJson from "../maps/map.json";
import { loadTiles, loadObjects } from "./assets";
import { Hero } from "./hero";
import { Log, DepthSort, Panel } from "../helpers/index";
import { tilesCollisionMapping } from "../helpers/collision-map";
import { Sprite } from "../vendors/kontra/kontra.js";
import { getCanvas } from "../vendors/kontra/core.js";
import GameObject from "../vendors/kontra/gameObject";
import { Collectible } from "./collectible";
import { collides } from "../vendors/kontra/collision";
import { Monster } from "./monster";
import { Snapped } from "./snapped";

export class Game {
  private player: Hero;
  private monsters: GameObject;
  private boss: Monster;
  private coin: Sprite;
  private coins;
  private tiles: TileEngine;
  private ready = false;
  private collisionMap;
  private panel: Panel;
  private snapped: Snapped;

  constructor() {
    // Instantiating characters and items
    this.monsters = new GameObject();
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

    // Coins works as a group

    // Adding items to depth sort module
    DepthSort.add(this.coins);
    // DepthSort.add(this.player, this.monster, this.boss);

    loadTiles(mapJson, tilesImage).then((tiles: TileEngine) => {
      const promises = [];

      this.tiles = tiles;

      // Generate collision mapping to be used by raycasting
      this.collisionMap = tilesCollisionMapping(this.tiles, "walls");

      // Get all objects from tilemap
      const objects = loadObjects("entities", tiles);
      objects.forEach(obj => {
        switch (obj.type) {
          case "player":
            this.player = new Hero();
            promises.push(
              this.player.load(playerImg, obj.x, obj.y, 2, this.tiles)
            );
            DepthSort.add(this.player);
            break;

          case "boss":
            const boss = new Monster();
            this.monsters.addChild(boss);
            promises.push(boss.load(bossImg, obj.x, obj.y, 1, this.tiles));
            DepthSort.add(boss);
            break;

          case "enemy":
            const monster = new Monster();
            this.monsters.addChild(monster);
            promises.push(
              monster.load(monsterImg, obj.x, obj.y, 1, this.tiles)
            );
            DepthSort.add(monster);
            break;

          case "coin":
            const coin = new Collectible();
            promises.push(coin.load(coinImg, obj.x + 8, obj.y + 8, 8, 8));
            DepthSort.add(coin);
            this.coins.addChild(coin);
            break;

          default:
            break;
        }
      });

      Promise.all(promises).then(res => {
        this.ready = true;

        this.snapped = new Snapped(16, this.tiles);

        this.monsters.children.forEach(monster =>
          monster.setVision(this.player.body, this.collisionMap)
        );
      });
    });
  }

  update() {
    if (this.ready) {
      DepthSort.update();
      this.snapped.update();

      this.coins.children.forEach(coin => {
        if (collides(this.player.body, coin.body)) {
          coin.onCollected();
          this.coins.removeChild(coin);
        }
      });
    }
  }

  render() {
    if (this.ready) {
      this.tiles.render();
      this.coins.render();
      DepthSort.render();
      this.snapped.render();
      // this.panel.render();
    }
  }
}
