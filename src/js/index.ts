import {
  TileEngine,
  init,
  dataAssets,
  GameLoop,
  Sprite,
  SpriteSheet
} from "../vendors/kontra/kontra.js";
import { $, $$, configCanvas } from "../helpers/index";
import { Game } from "./game";
import { Log } from "../helpers/log";

let { canvas, context } = init();

configCanvas(canvas, 640 / 2, 512 / 2, "#111111");

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
