export const Line = {
  lineTo: (p1, p2) => {
    const ctx = p1.context;
    ctx.save();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    const slope = (p2.y - p1.y) / (p2.x - p1.x);
    const yIntercept = p1.y - slope * p1.x;
    // console.log(slope, yIntercept);
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // calcular formula da linha
    // ver se colide com tilemap
  }
};
