import { TileEngine, init } from "kontra";
import mapImage from "../maps/tiles.png";
import { $, $$, configCanvas } from "../helpers";

let { canvas, context } = init();

configCanvas(canvas, 571, 571, "#111111");
// context.scale(2, 2);
// canvas.style.imageRendering = "crisp-edges";

let img = new Image();
img.src = mapImage;

console.log($(".bling"));

img.onload = function() {
  let tileEngine = TileEngine({
    // tile size
    tilewidth: 16,
    tileheight: 16,

    // map size in tiles
    width: 9,
    height: 9,

    // tileset object
    tilesets: [
      {
        firstgid: 1,
        image: img
      }
    ],

    // layer object
    layers: [
      {
        name: "ground",
        data: [
          3,
          3,
          3,
          3,
          3,
          3,
          3,
          3,
          3,
          3,
          3,
          1,
          1,
          1,
          2,
          3,
          3,
          3,
          3,
          1,
          2,
          2,
          2,
          2,
          3,
          3,
          3,
          3,
          2,
          2,
          2,
          2,
          2,
          3,
          3,
          3,
          3,
          2,
          2,
          2,
          2,
          2,
          2,
          3,
          3,
          3,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          3,
          3,
          3,
          1,
          1,
          1,
          2,
          2,
          2,
          3,
          3,
          3,
          3,
          3,
          3,
          1,
          1,
          2,
          3,
          3,
          3,
          3,
          3,
          3,
          3,
          3,
          3,
          0
        ]
      }
    ]
  });

  tileEngine.render();
};
