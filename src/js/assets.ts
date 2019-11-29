import {
  load,
  loadData,
  loadImage,
  on,
  TileEngine,
  dataAssets,
  Sprite
} from "../kontra/kontra.js";
import tilesImage from "../maps/tiles.png";
import mapJson from "../maps/map.json";
let assetsLoaded = 0;
console.log(mapJson);

export function loadAssets() {
  on("assetLoaded", (asset: any, url: any) => {
    assetsLoaded++;
  });

  const loadingImages = load(tilesImage);

  Promise.all([loadingImages])
    .then(function(assets: any) {
      mapJson.tilesets[0].image = tilesImage;
      let tileEngine = TileEngine(mapJson);

      let sprite = Sprite({
        x: 100,        // starting x,y position of the sprite
        y: 80,
        color: 'red',  // fill color of the sprite rectangle
        width: 20,     // width and height of the sprite rectangle
        height: 40,
        dx: 0          // move the sprite 2px to the right every frame
      });

      tileEngine.addObject(sprite)
      tileEngine.render();
      sprite.render();


      console.log("GAME CAN START NOW");
    })
    .catch(function(err: any) {
      console.log(err);
    });

  return true;
}

// load('assets/imgs/mapPack_tilesheet.png', 'assets/data/tile_engine_basic.json')
//   .then(assets => {
//     let tileEngine = TileEngine(dataAssets['assets/data/tile_engine_basic']);
//     tileEngine.render();
//   });
