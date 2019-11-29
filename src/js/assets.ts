import {
  load,
  loadData,
  loadImage,
  on,
  TileEngine,
  dataAssets
} from "../kontra/kontra.js";
import tilesImage from "../maps/tiles.png";
import mapJson from "../maps/map2.json";
let assetsLoaded = 0;
console.log(mapJson);

export function loadAssets() {
  on("assetLoaded", (asset: any, url: any) => {
    assetsLoaded++;
  });

  const loadingImages = load(tilesImage);
  // const loadingMaps = loadData(mapJson);

  Promise.all([loadingImages])
    .then(function(assets: any) {
      console.log(dataAssets);
      mapJson.tilesets[0].image = tilesImage;
      let tileEngine = TileEngine(mapJson);
      tileEngine.render();

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
