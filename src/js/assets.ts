import {
  load,
  loadData,
  loadImage,
  SpriteSheet,
  Animation,
  on,
  TileEngine,
  dataAssets,
  Sprite
} from "../vendors/kontra/kontra.js";

export function loadAnimatedPlayer(imageSrc) {
  return new Promise(resolve => {
    let image = new Image();
    image.src = imageSrc;

    image.onload = function() {
      let spriteSheet = SpriteSheet({
        image: image,
        frameWidth: 16,
        frameHeight: 16,
        animations: {
          idle: {
            frames: "0",
            frameRate: 0
          },
          up: {
            frames: "6..8", // frames 0 through 9
            frameRate: 6
          },
          down: {
            frames: "0..2", // frames 0 through 9
            frameRate: 6
          },
          left: {
            frames: "3..5", // frames 0 through 9
            frameRate: 6
          },
          right: {
            frames: "3..5", // frames 0 through 9
            frameRate: 6
          }
        }
      });

      let sprite = Sprite({
        x: 100,
        y: 100,

        // use the sprite sheet animations for the sprite
        animations: spriteSheet.animations
      });

      resolve(sprite);
    };
  });
}

export function loadTiles(mapJson, tilesImage) {
  return new Promise(resolve => {
    return load(tilesImage).then(img => {
      mapJson.tilesets[0].image = tilesImage;
      let tileEngine = TileEngine(mapJson);

      resolve(tileEngine);
    });
  });
}
