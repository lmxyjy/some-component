/* eslint-disable no-restricted-properties */
import { FC, ReactElement, useEffect, useState } from 'react';
// 3D词云

interface IProps {
  data: any[];
  // 画布宽度
  width?: number;
  // 画布高度
  height?: number;
  // 最大字体
  maxFontSize?: number;
  // 字体颜色
  color?: string;
}
const ThreeDWordCloud: FC<IProps> = (props): ReactElement => {
  const { data, width = 300, height = 220, maxFontSize = 30, color = '#2998FF' } = props;

  // 缓存计算的最大最小值
  const [computedValue, setComputedValue] = useState<{ min: number; max: number }>();

  useEffect(() => {
    try {
      // @ts-ignore
      TagCanvas?.Start('myCanvas', 'tags', {
        interval: 30,
        textColour: color,
        outlineColour: '#97d4ff',
        bgOutline: 'tag',
        shape: 'sphere',
        weight: true,
        weightMode: 'size',
        textHeight: 12,
        decel: 0.005,
        reverse: true,
        noMouse: true,
        depth: 0.5,
        dragControl: false,
        maxSpeed: 0.05,
        minSpeed: 0.05,
        initial: [-0.08, 0],
        activeCursor: 'pointer',
      });
    } catch (e) {
      e;
    }
  }, [data]);

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
  };

  // const handleClick = (e: any, text: string) => {
  //     e.preventDefault()
  //     console.log("text", text)
  // }

  return (
    <div>
      <canvas width={width} height={height} id="myCanvas"></canvas>
      <div id="tags" style={{ display: 'none' }}>
        {data.map((item) => (
          <a
            style={{ fontSize: `${setFontSize(item[1])}px` }}
            key={item[0]}
            // href="javascript:void(0);"
            // onClick={(e: any) => handleClick(e, item[0])}
          >
            {item[0]}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ThreeDWordCloud;
