/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  const newStringArray = [];
  const separator = '';
  let counter;
  let previousSymbol;

  string.split(separator).map(symbol => {
    if (size !== 0 && (counter < size || previousSymbol !== symbol || !size)) {
      if (previousSymbol !== symbol) {
        counter = 0;
      }

      newStringArray.push(symbol);
      previousSymbol = symbol;
      counter++;
    } else {
      counter++;
    }
  });
  
  return newStringArray.join(separator);
}
