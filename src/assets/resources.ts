import * as ex from '../engine/index';
import { TiledResource } from '../plugins/excalibur-tiled';

import mapJson from '../assets/data/maps/map2.json';
import tiles from '../assets/data/maps/tiles.png';
import coinImage from '../assets/images/coin.png';
import heartImage from '../assets/images/health.png';
import playerImage from '../assets/images/player.png';
import enemyImage from '../assets/images/enemy-0.png';
import bossImage from '../assets/images/enemy-1.png';
import { TileMap, SpriteSheet, TileSprite } from '../engine/index';

const resources: { [key: string]: ex.Texture } = {
  tiles: new ex.Texture(tiles),
  coin: new ex.Texture(coinImage),
  heart: new ex.Texture(heartImage),
  player: new ex.Texture(playerImage),
  enemy: new ex.Texture(enemyImage),
  boss: new ex.Texture(bossImage)
};

const loader = new ex.Loader();
const heroSpritesheet = new ex.SpriteSheet(resources.player, 9, 1, 16, 16);
const enemySpritesheet = new ex.SpriteSheet(resources.enemy, 9, 1, 16, 16);
const bossSpritesheet = new ex.SpriteSheet(resources.boss, 9, 1, 16, 16);
const tilesSpritesheet = new ex.SpriteSheet(resources.tiles, 3, 1, 16, 16);
const coinSprite = resources.coin.asSprite();
const heartSprite = resources.heart.asSprite();

Object.values(resources).map((resource: ex.Loadable) => {
  loader.addResource(resource);
});

const map = new TileMap(
  0,
  0,
  mapJson.tilewidth,
  mapJson.tileheight,
  mapJson.height,
  mapJson.width
);

// const map = new TiledResource(mapJson);
// map.setData(mapJson);
// map.imagePathAccessor = (path, tileset) => {
//   return tiles.substring(1);
// };
// map.externalTilesetPathAccessor = (path, tileset) => {
//   return tiles.substring(1);
// };
// console.log(map);
// loader.addResource(map);

// register sprite sheets for each tileset in map
for (const ts of mapJson.tilesets) {
  const ss = tilesSpritesheet;

  map.registerSpriteSheet(ts.firstgid.toString(), ss);
}

for (const layer of mapJson.layers) {
  if (layer.type === 'tilelayer') {
    for (let i = 0; i < layer.data.length; i++) {
      const gid = layer.data[i] as number;
      if (gid !== 0) {
        const ts = getTilesetForTile(gid);
        // console.log(gid, ts);
        map.data[i].sprites.push(
          new TileSprite(ts.firstgid.toString(), gid - ts.firstgid)
        );
      }
    }
  }
}

function getTilesetForTile(gid: number): any {
  for (let i = mapJson.tilesets.length - 1; i >= 0; i--) {
    const ts = mapJson.tilesets[i];

    if (ts.firstgid <= gid) {
      return ts;
    }
  }

  return null;
}

export {
  resources,
  loader,
  map,
  heroSpritesheet,
  enemySpritesheet,
  bossSpritesheet,
  coinSprite,
  heartSprite
};
