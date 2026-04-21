/**
 * Utilidad compartida para paginación con ellipsis.
 * Si hay más de 3 páginas: 1 2 3 … última, o 1 … actual … última.
 * @param {number} pageCount - Total de páginas
 * @param {number} currentPage - Página actual (1-based)
 * @returns {{ type: 'number'|'ellipsis', value: number|null }[]}
 */
function getPaginationItems(pageCount, currentPage) {
  var items = [];
  if (pageCount <= 0) return items;
  if (pageCount <= 3) {
    for (var i = 1; i <= pageCount; i++) items.push({ type: "number", value: i });
    return items;
  }
  if (currentPage <= 2) {
    items.push({ type: "number", value: 1 }, { type: "number", value: 2 }, { type: "number", value: 3 });
    items.push({ type: "ellipsis", value: null }, { type: "number", value: pageCount });
  } else if (currentPage >= pageCount - 1) {
    items.push({ type: "number", value: 1 }, { type: "ellipsis", value: null });
    if (pageCount > 2) items.push({ type: "number", value: pageCount - 1 });
    items.push({ type: "number", value: pageCount });
  } else {
    items.push({ type: "number", value: 1 }, { type: "ellipsis", value: null }, { type: "number", value: currentPage }, { type: "ellipsis", value: null }, { type: "number", value: pageCount });
  }
  return items;
}
