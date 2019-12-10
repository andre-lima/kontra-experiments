
// Gives info to be used be the ray casted to check if there was any collisions with tiles
export const tilesCollisionMapping = function(tiles, layer) {
  const width = tiles.tilewidth;
  const height = tiles.tileheight;
  
  const widthInTiles = tiles.layerMap[layer].width;
  const tilesData = tiles.layerMap[layer].data;

  return {
    widthInTiles, tilesData, width, height
  }

};