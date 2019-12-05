export const collisionMapping = function(tiles, layer) {
  let collisionMap = {};

  const tileW = tiles.tilewidth;
  const tileH = tiles.tileheight;
  const widthInTiles = tiles.layerMap[layer].width;
  const tilesLayer = tiles.layerMap[layer];
  const tilesData = tilesLayer.data;

  tilesData.forEach((tile, index) => {
    const x = index % widthInTiles;
    const y = Math.floor(index / widthInTiles);

    if (tile) {
      collisionMap[x * tileW + "x" + y * tileH] = tile;
    }
  });

  return collisionMap;
};
