export function fullTextSearch(items, text) {
  text = text.split(' ');
  return items.filter(function (item) {
    return text.every(function (el) {
      return item.content.indexOf(el) > -1;
    });
  });
}
