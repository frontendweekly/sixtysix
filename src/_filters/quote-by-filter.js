module.exports = function quoteByJoin(value = []) {
  if (value.length === 0) {
    return '';
  }

  if (value.length === 1) {
    return value[0];
  }

  const newArr = [...value];
  const last = newArr.pop();
  return newArr.join(', ') + ' and ' + last;
};
