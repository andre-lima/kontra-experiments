export const tilesCollisionMapping = function(tiles, layer) {
  let collisionMap = {};
  const widthInTiles = tiles.layerMap[layer].width;
  const tilesLayer = tiles.layerMap[layer];
  const tilesData = tilesLayer.data;

  tilesData.forEach((tile, index) => {
    const x = index % widthInTiles;
    const y = Math.floor(index / widthInTiles);

    if (tile) {
      collisionMap[x + "x" + y] = tile;
    }
  });

  return collisionMap;
};

export const spriteCollisionMapping = function(sprite) {
  let collisionMap = {};
  collisionMap[
    Math.floor(sprite.x / sprite.width) + "x" + Math.floor(sprite.y / sprite.height)
  ] = 1;

  return collisionMap;
};
