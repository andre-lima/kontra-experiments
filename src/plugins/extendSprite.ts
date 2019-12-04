import { extendObject, Sprite } from "../vendors/kontra/kontra.js";

extendObject(Sprite, {
  addChild(child) {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(child);
  }
});
