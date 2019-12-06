
export const tilesCollisionMapping = function(tiles, layer) {
  const width = tiles.tilewidth;
  const height = tiles.tileheight;
  
  const widthInTiles = tiles.layerMap[layer].width;
  const tilesData = tiles.layerMap[layer].data;

  return {
    widthInTiles, tilesData, width, height
  }

};