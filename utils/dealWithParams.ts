/**
 * 对链接参数进行加密，防止被用户看出明文地址
 * @param link 需要加密的连接地址
 */
/**
 * 10, 传播表现趋势图
 * 11, 实时数据
 * 12, 传播效果对比图
 * 13，性别分布
 * 14，年龄分布
 * 15, 地域分布
 * 16，地域分布TOP 5
 * 17，兴趣分布
 * 18，兴趣分布TOP 5
 * 19，评论热词TOP 10
 * 20，评论列表
 * 21，评论情绪
 * 22，品牌推广
 */

export const MapAuth = [
  { key: 10, desc: '传播表现趋势图' },
  { key: 11, desc: '实时数据' },
  { key: 12, desc: '传播效果对比图' },
  { key: 13, desc: '性别分布' },
  { key: 14, desc: '年龄分布 ' },
  { key: 15, desc: '地域分布' },
  { key: 16, desc: '地域分布TOP 5' },
  { key: 17, desc: '兴趣分布' },
  { key: 18, desc: '兴趣分布TOP 5' },
  { key: 19, desc: '评论热词TOP 10' },
  { key: 20, desc: '评论列表' },
  { key: 21, desc: '评论情绪' },
  { key: 22, desc: '品牌推广' },
];

// 将编号转换为二进制->二进制+'00'->转换为10进制
export const encryptedParams = (link: string, strList: number[]) => {
  const numList = [];
  for (let i = 0; i < strList.length; i++) {
    const num = strList[i];
    const _s = `${num.toString(2)}00`;
    const _num = parseInt(_s, 2);
    numList.push(_num);
  }
  return `${link}?params=${numList.join('_')}`;
};

// 解密
export const decryptionParams = (link: string) => {
  if (!link.includes('params=')) return [];
  const strList = link.split('params=')[1].split('_');
  const numList = [];

  for (let i = 0; i < strList.length; i++) {
    const n = strList[i];
    const _n = (+n).toString(2).slice(0, -2);
    numList.push(parseInt(_n, 2));
  }

  return numList;
};
