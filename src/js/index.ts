import { init, GameLoop } from "../vendors/kontra/kontra.js";
import { $, $$, configCanvas } from "../helpers/index";
import { Game } from "./game";
import { Log } from "../helpers/log";

let { canvas, context } = init();

configCanvas(canvas, 640, 512, 1, "#111111");

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
