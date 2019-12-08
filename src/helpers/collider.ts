import { Sprite } from "../vendors/kontra/kontra";
import GameObject from "../vendors/kontra/gameObject";

export class Collider extends GameObject {
  public x;
  public y;
  public width;
  public height;
  public parent;
  public ox: number;
  public oy: number;
  public ow: number;
  public oh: number;

  constructor(parent, ox, oy, ow, oh) {
    super({
      x: parent.x - parent.anchor.x * parent.width,
      y: parent.y,
      width: parent.width,
      height: parent.height
    });

    this.parent = parent;
    this.ox = ox;
    this.oy = oy;
    this.ow = ow;
    this.oh = oh;
    this.anchor = { x: 0, y: 0 };
  }

  update() {
    // this.anchor = parent.anchor;
    this.x =
      this.parent.x -
      this.parent.anchor.x * this.parent.width +
      this.ox * this.parent.width;
    this.y = this.parent.y;
    this.width = this.parent.width * this.ow;
    this.height = this.parent.height * this.oh;
  }

  render() {
    // draw the rectangle sprite normally
    // this.draw();
    // outline the sprite
    // this.context.fillStyle = "rgba(22,22,222,0.6)";
    // this.context.strokeStyle = "yellow";
    // this.context.lineWidth = 1;
    // this.context.fillRect(this.x, this.y, this.width, this.height);
  }
}
