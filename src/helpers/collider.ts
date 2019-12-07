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
    this.x = parent.x - parent.anchor.x * parent.width + parent.width * this.ox;
    this.y =
      parent.y - parent.anchor.y * parent.height + parent.height * this.oy;
    this.width = parent.width * this.ow;
    this.height = parent.height * this.oh;
  }

  render() {
    // draw the rectangle sprite normally
    this.draw();

    // outline the sprite
    this.context.fillStyle = "transparent";
    this.context.strokeStyle = "yellow";
    this.context.lineWidth = 1;
    this.context.strokeRect(this.x, this.y, this.width, this.height);
  }
}
