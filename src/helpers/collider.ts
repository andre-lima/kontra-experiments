import { Sprite } from "../vendors/kontra/kontra";

export class Collider extends Sprite.class {
  public ox: number;
  public oy: number;
  public ow: number;
  public oh: number;

  constructor(ox, oy, ow, oh) {
    super();
    this.ox = ox;
    this.oy = oy;
    this.ow = ow;
    this.oh = oh;
    this.anchor = { x: 0.5, y: 0.5 };
  }

  update(parent) {
    this.anchor = parent.anchor;
    this.x = parent.x;
    this.y = parent.y;
    this.width = parent.width * this.ow;
    this.height = parent.height * this.oh;
  }

  render() {
    // draw the rectangle sprite normally
    this.draw();

    // outline the sprite
    this.context.fillStyle = "rgba(222,22,222,0.6)";
    this.context.strokeStyle = "yellow";
    this.context.lineWidth = 1;
    this.context.fillRect(
      this.x - this.anchor.x * this.width,
      this.y,
      this.width,
      this.height
    );
  }
}
