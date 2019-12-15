import { Sprite } from "../vendors/kontra/kontra";
import GameObject from "../vendors/kontra/gameObject";

export class Collectible extends GameObject {
  public body;
  private type;

  constructor() {
    super();
  }

  load(imageSrc, x, y, width, height): Promise<any> {
    return new Promise(resolve => {
      let image = new Image();
      image.src = imageSrc;

      image.onload = function() {
        const sprite = Sprite({
          x,
          y,
          width,
          height,
          image,
          anchor: { x: 0.5, y: 0.5 }
        });

        this.body = sprite;
      }.bind(this);

      resolve(true);
    });
  }

  update() {
    this.body.update();
  }

  render() {
    this.body.render();
  }

  onCollected() {
    console.log("bling");
  }
}
