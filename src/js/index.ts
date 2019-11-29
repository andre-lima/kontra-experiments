import { TileEngine, init, dataAssets } from "../kontra/kontra.js";
// import mapImage from "../maps/tiles.png";
// import { loadAssets } from "./assets.ts";

import { $, $$, configCanvas } from "../helpers";
import { loadAssets } from "./assets";

let { canvas, context } = init();

loadAssets();

configCanvas(canvas, 800, 800, "#111111");
// context.scale(2, 2);
// canvas.style.imageRendering = "crisp-edges";

// let img = new Image();
// img.src = mapImage;

// console.log($(".bling"));


