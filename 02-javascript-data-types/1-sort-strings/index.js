const direction = {
  asc: 'asc',
  desc: 'desc',
};

/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = direction.asc) {
  const sortedArray = [...arr];

  switch (param) {
    case direction.asc:
      sortedArray.sort((a, b) => a.localeCompare(b, 'ru', { caseFirst: 'upper' }));
      break;
    case direction.desc:
      sortedArray.sort((a, b) => b.localeCompare(a, 'ru', { caseFirst: 'upper' }));
      break;
    default:
      throw new Error(`Wrong sorting type: ${param}`);
  }

  return sortedArray;
}
