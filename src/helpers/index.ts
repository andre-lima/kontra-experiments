import { DepthSort } from "./depth-sort";
import { Log } from "./log";
import { Collider } from "./collider";
import { Ray } from "./ray";
import { Panel } from "./panel";

export {
  $,
  $$,
  configCanvas,
  Log,
  DepthSort,
  Collider,
  Ray,
  normalize,
  distance,
  directionVector,
  Panel
};

// OTHER HELPER FUNCTIONS BELOW

// based on https://gist.github.com/paulirish/12fb951a8b893a454b32
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function configCanvas(
  canvas: HTMLCanvasElement,
  width = 480,
  height = 320,
  zoom = 1,
  color?: string
) {
  canvas.width = width / zoom;
  canvas.height = height / zoom;
  canvas.style.backgroundColor = color;

  return canvas;
}

function distance(obj, tgt = { x: 0, y: 0 }): number {
  return Math.sqrt(Math.pow(obj.x - tgt.x, 2) + Math.pow(obj.y - tgt.y, 2));
}

function directionVector(obj, tgt = { x: 0, y: 0 }) {
  const V = { x: tgt.x - obj.x, y: tgt.y - obj.y };
  // console.log(normalize(V));
  return normalize(V);
}

function normalize(v) {
  const d = distance(v);

  if (d > 0) {
    return { x: v.x / d, y: v.y / d };
  } else {
    return { x: 0, y: 0 };
  }
}
