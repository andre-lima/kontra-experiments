import { Sprite, kontra } from "../vendors/kontra/kontra";

export class Panel {
  private bg;
  private ctx;
  private text = "testestestsetset";
  private active = false;

  constructor(canvas, y, fromTop, width, height, color) {
    const screenW = canvas.width;
    const screenH = canvas.height;
    this.bg = Sprite({
      x: screenW * 0.5,
      y: fromTop ? height : screenH - y,
      width: screenW * width,
      height,
      color,
      anchor: { x: 0.5, y: 0.5 }
    });
    console.log(canvas.width);
  }

  setText() {}

  show() {
    this.active = true;
  }

  hide() {
    this.active = false;
  }

  render() {
    if (this.active) {
      this.bg.render();
    }
  }
}
