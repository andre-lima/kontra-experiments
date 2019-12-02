const renderChildrenPlugin = {
  afterUpdate(sprite, result, object) {
    if (sprite.children) {
      sprite.children.forEach(c => {
        c.x = sprite.x;
        c.y = sprite.y;
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
