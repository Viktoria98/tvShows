import numeral from 'numeral';

/**
 * By default function will format number
 * in normal mode that means that the number will be
 * formatted using US-English decimals and thousands separators
 * e.g
 *  3192987245 → 3,192,987,245 (integer values w/o decimals)
 *  3192987245.20 → 3,192,987,245.20 (values w/ decimals)
 * if u want to format in short mode
 * e.g
 *  1100, 2101,.. 9999 → 1.1K, 2.1K,.. 9.9K
 *  10000, 20000,.. 90000 → 10K, 20K,.. 90K
 * explicitly pass [false] as the second argument
 */

const formatNumber = (num, isNormalMode = true) => {
  if (typeof num !== 'number' || isNaN(num)) {
    return num;
  }
  const hundred = 100;
  const thousand = 1000;
  const million = 1000000;
  const billion = 1000000000;
  if (isNormalMode) {
    if (num.toString()
      .indexOf('.') !== -1) {
      return numeral(num)
        .format('0,0.00');
    }
    return numeral(num)
      .format('0,0');
  }
  if (num >= thousand && num < thousand * hundred && num % thousand) {
    num = Math.floor(num / hundred) * hundred;
    return numeral(num)
      .format('0.0a')
      .toUpperCase();
  }
  if (num >= thousand * hundred && num < million && num % thousand) {
    num = Math.floor(num / thousand) * thousand;
    return numeral(num)
      .format('0a')
      .toUpperCase();
  }
  if (num >= million && num < billion && num % million) {
    num = Math.floor(num / million) * million;
    return numeral(num)
      .format('0a')
      .toUpperCase();
  }
  return numeral(num)
    .format('0a')
    .toUpperCase();
};

export default formatNumber;
