function recursionGenerateTree(level, range, depth, prefix) {
  const arr = [];
  for (let i = 1; i <= range; i++) {
    const item = {
      _key: prefix ? `${prefix}-${i}` : `${i}`,
    };
    if (level >= depth) {
      item.children = [];
    } else {
      item.children = recursionGenerateTree(level + 1, range, depth, item._key);
    }
    arr.push(item);
  }
  return arr;
}

export default recursionGenerateTree(1, 10, 5);
