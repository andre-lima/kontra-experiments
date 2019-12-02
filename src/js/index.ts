import {
  TileEngine,
  init,
  dataAssets,
  GameLoop,
  Sprite,
  SpriteSheet
} from "../kontra/kontra.js";
import "../plugins/extendSprite";
import { $, $$, configCanvas } from "../helpers/index";
import { Game } from "./game";
import { Log } from "../helpers/log";

let { canvas, context } = init();

configCanvas(canvas, 640, 512, "#111111");

// Manage loading screen and all.

const game = new Game();
game.load();

let loop = GameLoop({
  update: function() {
    game.update();
  },
  render: function() {
    game.render();
    Log.fps();
  }
});

loop.start(); // start the game
