// based on https://gist.github.com/paulirish/12fb951a8b893a454b32
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function configCanvas(
  canvas: HTMLCanvasElement,
  width = 480,
  height = 320,
  color?: string
) {
  canvas.width = width;
  canvas.height = height;
  canvas.style.backgroundColor = color;

  return canvas;
}

export { $, $$, configCanvas };
