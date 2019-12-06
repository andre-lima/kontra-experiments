export const tilesCollisionMapping = function(tiles, layer) {
  let collisionMap = {};
  const widthInTiles = tiles.layerMap[layer].width;
  const tilesLayer = tiles.layerMap[layer];
  const tilesData = tilesLayer.data;

  tilesData.forEach((tile, index) => {
    const x = index % widthInTiles;
    const y = Math.floor(index / widthInTiles);

    if (tile) {
      collisionMap[x] = collisionMap[x] || {};
      collisionMap[x][y] = tile;
    }
  });

  return collisionMap;
};
