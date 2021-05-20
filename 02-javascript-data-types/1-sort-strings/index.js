const multiplier = {
  asc: 1,
  desc: -1,
};

/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export const sortStrings = (arr, param = 'asc') =>
  [...arr].sort((a, b) => multiplier[param] * a.localeCompare(b, 'ru', { caseFirst: 'upper' }));
