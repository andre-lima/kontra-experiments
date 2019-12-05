import { Log } from "./log";

// Usage: On render method...
// Line.lineTo(this.player.body, this.player2.body);

export class Line {
  findX = t => {return null};
  findY = t => {return null};

  lineTo(p1, p2) {
    const ctx = p1.context;
    ctx.save();

    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 1;

    // Create parametric functions to get X and Y.
    [this.findX, this.findY] = lineFunctions(p1.x, p1.y, p2.x, p2.y);

    Log.q(this.findX(0.01) + " $$$ " + this.findY(0.01), "lineeee");

    ctx.stroke();
    ctx.restore();
  }

  lineCollidesWith(tiles, tileW, tileH) {
    let tilesKey = "0x0";
    let collided = [];

    for (let t = 0; t <= 1; t += 0.1) {
      tilesKey = Math.floor(this.findX(t) / tileW)  + "x" + Math.floor(this.findY(t) / tileH);

      if (tilesKey in tiles) {
        collided.push(tilesKey)
        Log.q(collided.join('|'), 'tilesKey')
      }
    }

    return collided.length > 0;
  }
}

function lineFunctions(x0, y0, x1, y1) {
  const V = [x1 - x0, y1 - y0];

  const functionForX = t => x0 + V[0] * t;
  const functionForY = t => y0 + V[1] * t;

  return [functionForX, functionForY];
}
