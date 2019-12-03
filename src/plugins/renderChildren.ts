const renderChildrenPlugin = {
  afterUpdate(sprite, result, object) {
    if (sprite.children) {
      sprite.children.forEach(c => {
        c.x = sprite.x + sprite.width * c.ox;
        c.y = sprite.y + sprite.width * c.oy;
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
