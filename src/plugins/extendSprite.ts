import { extendObject, Sprite } from "../kontra/kontra.js";

extendObject(Sprite, {
  children: [],
  addChild(child) {
    console.log('Adding child: ', child, this.children);
    this.children.push(child);
  }
})