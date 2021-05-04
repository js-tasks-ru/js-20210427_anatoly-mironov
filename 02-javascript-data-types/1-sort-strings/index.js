const direction = {
  asc: 'asc',
  desc: 'desc',
};

const localeCompareSort = (a, b) => a.localeCompare(b, 'ru', {caseFirst: 'upper'});

/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = direction.asc) {
  const sortedArray = arr.slice();

  switch (param) {
    case direction.asc:
      sortedArray.sort(localeCompareSort);
      break;
    case direction.desc:
      sortedArray.sort(localeCompareSort).reverse();
      break;
    default:
      console.error(`Wrong sorting type: ${param}`);
  }

  return sortedArray;
}