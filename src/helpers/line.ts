// Usage: On render method...
// Line.lineTo(this.player.body, this.player2.body);

export const Line = {
  lineTo: (p1, p2) => {
    const ctx = p1.context;
    ctx.save();

    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 1;

    ctx.stroke();
    ctx.restore();
  }
};

// const slope = (p2.y - p1.y) / (p2.x - p1.x);
// const yIntercept = p1.y - slope * p1.x;
// console.log(slope, yIntercept);
// calcular formula da linha
// ver se colide com tilemap
