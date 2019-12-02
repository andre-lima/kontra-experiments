import { extendObject, Sprite } from "../kontra/kontra.js";

extendObject(Sprite, {
  addChild(child) {
    this.children.push(child);
  }
})
