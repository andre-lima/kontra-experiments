export const DepthSort = {
  sortGroup: [],
  sorted: [],
  sortBy: "y",
  add(...args) {
    this.sortGroup = [...this.sortGroup, ...args];
  },
  remove(itemToRemove) {
    this.sortGroup = this.sortGroup.filter(item => item !== itemToRemove);
  },
  emptyGroup() {
    this.sortGroup = [];
  },
  update() {
    this.sorted = this.sortGroup.sort(
      (i1, i2) => i1[this.sortBy] - i2[this.sortBy]
    );

    this.sorted.forEach(i => i.update());
  },
  render() {
    // this.sortGroup.sort((i1, i2) => i1[this.sortBy] - i2[this.sortBy]).forEach(i => i.render());
    this.sorted.forEach(i => i.render());
  }
};
