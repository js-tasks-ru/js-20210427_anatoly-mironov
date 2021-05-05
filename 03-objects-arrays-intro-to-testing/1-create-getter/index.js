/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const keysChain = path.split('.');

  return ((obj) => {
    let newObj = {...obj};

    for (const key of keysChain) {
      if (newObj) {
        newObj = newObj[key];
      }
    }

    return newObj;
  });
}
