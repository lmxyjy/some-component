// 气泡柱状图
import { FC, ReactElement, memo } from 'react';
import { Chart, Axis, Tooltip, Legend, Point, Interval } from 'bizcharts';
import { Spin } from 'antd';
import { round } from '@/utils/round';

interface IProps {
  data: { key: string; value: number }[];
  color?: string;
}

const BubblesChart: FC<IProps> = (props): ReactElement => {
  const { data, color = '#FFE7EA' } = props;
  const scale = {
    vote: {
      min: 0,
    },
  };
  return (
    <Chart
      data={data}
      padding={[60, 20, 40, 60]}
      placeholder={<Spin style={{ position: 'relative', left: '50%', top: '50%' }} />}
      scale={scale}
      autoFit
      height={270}
    >
      <Axis name="value" title={null} line={null} label={null} tickLine={null} grid={null} />
      <Interval
        position="key*value"
        shape="line"
        color="#E1E3E6"
        style={{
          lineDash: [4, 2],
        }}
      />
      <Tooltip
        showTitle={false}
        domStyles={{
          'g2-tooltip': {
            background: 'rgba(255,255,255,0.8)',
            boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.16)',
            borderRadius: '4px',
          },
          'g2-tooltip-value': {
            fontSize: '14px',
            fontWeight: 500,
            marginLeft: '5px',
          },
          'g2-tooltip-marker': {
            background: color,
          },
        }}
      />
      <Legend visible={false} />
      <Point
        position="key*value"
        label={[
          'value',
          (xValue) => {
            return {
              content: `${(xValue * 100).toFixed(2)}%`,
              style: { fill: '#FF2442', fontSize: 14, fontWeight: 'bold' },
              offsetY: 12,
            };
          },
        ]}
        size={['value', [15, 30]]}
        style={{ fill: color }}
        shape="circle"
        tooltip={[
          'key*value',
          (key, value) => {
            return {
              name: key,
              value: `${round(value * 100)}%`,
            };
          },
        ]}
      />
    </Chart>
  );
};

export default memo(BubblesChart);
