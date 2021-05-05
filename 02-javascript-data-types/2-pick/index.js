/**
 * Get new object based on should it include properties from initial or not
 * @param {boolean} isPeak - is it pick (true) or omit (false) operation
 * @param {Object} obj
 * @param {...string} fields
 * @returns {Object}
 */
export const getNewObject = (isPeak, obj, ...fields) => {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    if (fields.includes(key) && isPeak) {
      newObj[key] = value;
    } else if (!fields.includes(key) && !isPeak) {
      newObj[key] = value;
    }
  }
  return newObj;
};


/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => getNewObject(true, obj, ...fields);
