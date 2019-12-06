import { Log } from "./log";

export class Ray {
  private p1;
  private p2;
  private ctx;
  private lineStep;
  private lineLength;
  private tilesCollided;

  update() {}

  findX = t => {
    return null;
  };
  findY = t => {
    return null;
  };

  cast(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.ctx = this.p1.context;

    // Create parametric functions to get X and Y.
    [this.findX, this.findY] = this.lineFunctions(p1.x, p1.y, p2.x, p2.y);

    // Reduce lineStep when ray is big in length. If not, we could skip lots of tiles like this.
    this.lineLength = this.rayLength(p1.x, p1.y, p2.x, p2.y);
    this.lineStep = 5 / this.lineLength;
  }

  render() {
    this.drawLine(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p1.context);
  }

  drawLine(x0, y0, x1, y1, ctx) {
    ctx.save();
    ctx.beginPath();

    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 1;

    ctx.stroke();
    ctx.restore();
  }

  collidesWithTiles(colMap) {
    let collided = [];
    let index = 0;

    for (let t = 0; t <= 1; t += this.lineStep) {
      const x = Math.floor(this.findX(t) / colMap.width);
      const y = Math.floor(this.findY(t) / colMap.height);

      index = x + y * colMap.widthInTiles;

      if (colMap.tilesData[index]) {
        // Advance a bit faster to avoid checking the same tile many times.
        // Need to better tweak this value to be even more efficient.
        t += this.lineStep * 2;

        // Adds collision tile point while avoiding repeated entries in array.
        const lastItemAdded = collided[collided.length - 1];
        if (
          !lastItemAdded ||
          x * colMap.width !== lastItemAdded.x ||
          y * colMap.height !== lastItemAdded.y
        ) {
          collided.push({ x: x * colMap.width, y: y * colMap.height });
        }
      }
    }

    Log.q(JSON.stringify(collided), "tiles_collided");

    this.tilesCollided = collided;

    return collided.length > 0;
  }

  collidesWithSprite(sprite) {
    let x = 0;
    let y = 0;

    for (let t = 0; t <= 1; t += this.lineStep) {
      x = this.findX(t);
      y = this.findY(t);

      if (
        x >= sprite.x &&
        x <= sprite.x + sprite.width &&
        y >= sprite.y &&
        y <= sprite.y + sprite.height
      ) {
        return true;
      }
    }
    return false;
  }

  drawDebugTiles(w, h) {
    this.tilesCollided.forEach(pos => {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.fillStyle = "rgba(200,22,22,0.5)";
      this.ctx.fillRect(+pos.x, +pos.y, w, h);
      this.ctx.restore();
    });
  }

  drawDebugSprites(sprite) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(200,22,22,0.5)";
    this.ctx.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);
    this.ctx.restore();
  }

  rayLength(x0, y0, x1, y1) {
    return Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
  }

  lineFunctions(x0, y0, x1, y1) {
    const V = [x1 - x0, y1 - y0];

    const functionForX = t => x0 + V[0] * t;
    const functionForY = t => y0 + V[1] * t;

    return [functionForX, functionForY];
  }
}
