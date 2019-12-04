const renderChildrenPlugin = {
  afterUpdate(sprite, result, object) {
    if (sprite.children) {
      sprite.children.forEach(c => {
        c.anchor = { x: 0.5, y: 0.5 };
        c.x = sprite.x - sprite.anchor.x * sprite.width + sprite.width * c.ox;
        c.y = sprite.y - sprite.anchor.y * sprite.height + sprite.height * c.oy;
        c.width = sprite.width * c.ow;
        c.height = sprite.height * c.oh;
        c.update();
      });
    }
  },
  afterRender(sprite, result, object) {
    if (sprite.children) {
      sprite.children.forEach(c => {
        c.render();
      });
    }
  }
};

export default renderChildrenPlugin;
