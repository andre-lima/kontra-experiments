export const DepthSort = {
  sortGroup: [],
  sortBy: 'y',
  add(...args) {
    this.sortGroup = [...this.sortGroup, ...args]
  },
  remove(itemToRemove) {
    this.sortGroup = this.sortGroup.filter(item => item !== itemToRemove)
  },
  emptyGroup() {
    this.sortGroup = [];
  },
  render() {
    this.sortGroup.sort((i1, i2) => i1.body[this.sortBy] - i2.body[this.sortBy]).forEach(i => i.render());
  }
}
