/* eslint-disable no-restricted-properties */
// 封装词云组件
import { FC, ReactElement, useRef, useEffect, useMemo, useState, memo } from 'react';
import WordCloud from 'wordcloud';
import styles from './index.module.less';
import _ from 'lodash';

type Op = WordCloud.Options;

interface IProps {
  // 源数据 例如： [['foo', 1200], ['bar', 6], ['foo1', 1], ['bar1', 2]]
  data?: [string, number][];
  // 最大字体大小
  maxFontSize?: number;
  // 覆盖配置
  options?: Op;
  // 颜色
  color?: string | { R: number; G: number; B: number };
}

const WordCouldPro: FC<IProps> = (props): ReactElement => {
  const {
    data = [
      ['foo', 1200],
      ['bar', 6],
      ['foo1', 1],
      ['bar1', 2],
    ],
    maxFontSize = 30,
    options = {},
    color = { R: 255, G: 36, B: 66 },
  } = props;

  const wordCouldRef = useRef<HTMLDivElement>(null!);
  // 缓存计算的最大最小值
  const [computedValue, setComputedValue] = useState<{ min: number; max: number }>();

  // 获取最大值&最小值
  const getMaxMin = () => {
    let min = 0;
    let max = 0;
    if (_.isEmpty(computedValue)) {
      const len = data.length;
      for (let x = 0; x < len; x++) {
        const val = data[x][1];
        if (min > val) min = val;
        if (max < val) max = val;
      }
      setComputedValue({ min, max });
    } else {
      min = computedValue!.min;
      max = computedValue!.max;
    }

    return { min, max };
  };

  // 设置不同权重的字体大小
  const setFontSize = (weight: number) => {
    // 找到数据中的最大值和最小值
    const { min, max } = getMaxMin();

    // 进行值处理
    if (max === min) return maxFontSize;

    // 如果大小值有区间，那么从字号上进行处理
    const r = 1 / 10;
    const a = (maxFontSize - 14) / (Math.pow(max, r) - Math.pow(min, r));
    const b = maxFontSize - a * Math.pow(max, r);
    return Math.ceil(a * Math.pow(weight, r) + b);
    // const minFontSize = 12;
    // console.log(weight)
    // let fontSize = weight / max;
    // if (fontSize < minFontSize) fontSize = minFontSize;
    // return fontSize
  };

  // 设置不同权重的颜色透明度
  const setColor = (_: string, weight: number): string => {
    // 找到数据中的最大值和最小值
    const { min, max } = getMaxMin();

    // 进行值处理
    const { R, G, B } = color as any;

    if (max === min && R && G && B) return `rgba(${R},${G},${B},1)`;

    const maxOpacity = 1
    const minOpacity = 0.4;

    const r = 1 / 10;
    const a = (maxOpacity - minOpacity) / (Math.pow(max, r) - Math.pow(min, r));
    const b = maxOpacity - a * Math.pow(max, r);

    const opacity = a * Math.pow(weight, r) + b;

    // let opacity = weight / max;
    // if (opacity < minOpacity) opacity = minOpacity;
    return `rgba(${R},${G},${B},${opacity})`;
  };

  // 词云配置
  const newOptions: Op = useMemo(
    () => ({
      origin: [220, 50],
      ellipticity: -1,
      backgroundColor: 'transparent',
      list: data,
      weightFactor(weight: number) {
        if (!data.length) return 14;
        return setFontSize(weight);
      },
      color: (typeof color === 'string' || setColor) as any,
      rotateRatio: 0,
      ...options,
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [data, options, color],
  );

  useEffect(() => {
    if (wordCouldRef.current) {
      WordCloud(wordCouldRef.current, newOptions);
    }
  }, [newOptions]);

  return <div className={styles.container} ref={wordCouldRef}></div>;
};

export default memo(WordCouldPro);
