/**
 * 四舍五入
 * @param {number} num 转换的数字
 * @param {number} len 保留小数的位数
 */
export function round(num: number, len: number = 2) {
  // eslint-disable-next-line no-restricted-properties
  return Math.round(num * Math.pow(10, len)) / Math.pow(10, len);
}
