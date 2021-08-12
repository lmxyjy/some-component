import { round } from './round';

const ONE_HUNDRED_MILLION = 100000000 as const;
const TEN_THOUSAND = 10000 as const;
const ONE_THOUSAND = 1000 as const;

type Num = number | string | undefined | null;

// type Opt = {
//   /** 保留小数的位数 默认两位 会去掉小数点后面的0 */
//   len?: number;
//   /** 去掉小于1w的小数 */
//   isPoint?: boolean;
//   /** 是否把大于1k的值格式化 */
//   isK?: boolean;
// };

// TODO: 添加jsdoc注释

/**
 * 格式化数字
 */
export default function formatUnit(num: Num, { len = 2, isPoint = false, isK = false } = {}) {
  if (num === undefined || num === null) return num;

  if (typeof num === 'string') {
    // 匹配空字符和非数字字符
    if (!/^-?\d+(\.\d+)?$/.test(num)) {
      return num;
    }

    // eslint-disable-next-line no-param-reassign
    num = Number(num);
  }

  // 大于一亿
  if (num >= ONE_HUNDRED_MILLION) {
    return `${round(num / ONE_HUNDRED_MILLION, len)}亿`;
  }

  // 大于1万
  if (num >= TEN_THOUSAND) {
    return `${round(num / TEN_THOUSAND, len)}w`;
  }

  // 大于1千
  if (isK && num >= ONE_THOUSAND) {
    return `${round(num / ONE_THOUSAND, len)}k`;
  }

  // 小于负一亿
  if (num <= -ONE_HUNDRED_MILLION) {
    return `${round(num / ONE_HUNDRED_MILLION, len)}亿`;
  }

  // 小于负1万
  if (num <= -TEN_THOUSAND) {
    return `${round(num / TEN_THOUSAND, len)}w`;
  }

  return !isPoint ? `${num}` : `${round(num, 0)}`;
}
