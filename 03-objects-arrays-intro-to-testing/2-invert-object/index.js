/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  let newObj;

  if (obj) {
    newObj = {};
    const objEntries = Object.entries(obj);

    for (const [key, value] of objEntries) {
      newObj[value] = key;
    }
  }

  return newObj;
}
