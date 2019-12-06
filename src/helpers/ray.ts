import { Log } from "./log";

// Usage: On render method...
// Line.lineTo(this.player.body, this.player2.body);

export class Ray {
  findX = t => {
    return null;
  };
  findY = t => {
    return null;
  };

  cast(p1, p2) {
    // Create parametric functions to get X and Y.
    [this.findX, this.findY] = this.lineFunctions(p1.x, p1.y, p2.x, p2.y);

    this.drawLine(p1.x, p1.y, p2.x, p2.y, p1.context);
  }

  drawLine(x0, y0, x1, y1, ctx) {
    ctx.save();
    Log.q(5 / this.rayLength(x0, y0, x1, y1), "miopia");
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 1;

    ctx.translate(0, 0);

    ctx.stroke();
    ctx.restore();
  }

  collidesWithTiles(tiles, tileW, tileH) {
    let tilesKey = "0x0";
    let collided = [];

    for (let t = 0; t <= 1; t += 0.1) {
      tilesKey =
        Math.floor(this.findX(t) / tileW) +
        "x" +
        Math.floor(this.findY(t) / tileH);

      if (tilesKey in tiles) {
        collided.push(tilesKey);
        Log.q(collided.join("|"), "tilesKey");
      }
    }

    return collided.length > 0;
  }

  collidesWithSprite(sprite) {
    let x = 0;
    let y = 0;

    for (let t = 0; t <= 1; t += 0.1) {
      x = this.findX(t);
      y = this.findY(t);

      if (
        x >= sprite.x &&
        x <= sprite.x + sprite.width &&
        y >= sprite.y &&
        y <= sprite.y + sprite.height
      ) {
        console.log("object");
        return true;
      }
    }
    return false;
  }

  drawDebugTiles() {}

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
