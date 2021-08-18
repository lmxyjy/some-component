// 地图
import { useState, useEffect, useMemo, FC } from 'react';
import { Chart, Tooltip, Geom, Legend, View } from 'bizcharts';
import DataSet from '@antv/data-set';
import { Spin } from 'antd';
import APILoader from '@/utils/APILoader';
import { getGeojsonByCode } from '@/utils/geoJson';
import SouChinaSeaIcon from './southChinaSea.png';
import styles from './index.module.less';
import fetch from '@newrank/axios-fetch';
import _ from 'lodash';

interface IProps {
  data: { key: string; value: number }[];
  type?: 'province' | 'city';
}
const ds = new DataSet();
const MapChart: FC<IProps> = ({ data, type = 'province' }) => {
  // 缓存省份数据
  const [chinaGeo, setChinaGeo] = useState<any>({});

  // 请求省份数据
  useEffect(() => {
    if (!data.length) return;
    const map = new APILoader();
    const loadMap = async () => {
      await map?.load();
      await map?.getAmapuiPromise();
      const cityJsonLink =
        'https://gw.alipayobjects.com/os/bmw-prod/707cd4be-8ffe-4778-b863-3335eefd5fd5.json';
      const res =
        type === 'city'
          ? await fetch(cityJsonLink).then((res) => res.data)
          : await getGeojsonByCode();
      setChinaGeo(res);
    };
    loadMap();
  }, [data, type]);

  const mapData = useMemo(() => {
    if (_.isEmpty(chinaGeo)) return { rows: [] };

    const { features = [] } = chinaGeo;
    // 将值添加到geo对象上
    features.forEach((one: any) => {
      const name = one && one.properties && one.properties.name;
      const _one = one;
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (name.includes(item.key)) {
          _one.value = +(item.value * 100).toFixed(2);
        }
      }
    });

    return ds.createView()?.source(chinaGeo, { type: 'GeoJSON' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chinaGeo]);

  const renderMapChart = useMemo(() => {
    // const centerData = mapData
    //   ? mapData.rows.map((p: any) => {
    //     return {
    //       longitude: p.centroidX,
    //       latitude: p.centroidY,
    //       name: p.name,
    //       size: p.value,
    //     };
    //   })
    //   : [];
    const scale = {
      latitude: {
        sync: true,
        nice: false,
      },
      longitude: {
        sync: true,
        nice: false,
      },
    };
    return (
      <div className={styles.mapWrap}>
        <Chart
          pure
          height={350}
          scale={scale}
          data={mapData.rows}
          autoFit
          placeholder={<Spin style={{ position: 'relative', left: '36%', top: '42%' }} />}
          padding="auto"
        >
          <Legend
            // track={{
            //   style: {
            //     fill: 'l (90) 0:#2998FF .2:#2998FF 1:#E1EFFF',
            //   },
            // }}
            offsetX={0}
            offsetY={-50}
            position="left-bottom"
            slidable={false}
          />
          <Tooltip
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
            }}
          />
          <View data={mapData.rows}>
            <Geom
              type="polygon"
              position="longitude*latitude"
              color={['value', ['#E1EFFF', '#2998FF']]}
              tooltip={[
                'name*value',
                (name, value) => ({
                  title: name,
                  name,
                  value: value ? `${value.toFixed(2) || 0}%` : '0%',
                }),
              ]}
            />
          </View>

          {/* <View data={centerData}>
            <Legend visible={false} />
            <Geom
              type="point"
              position="longitude*latitude"
              color={["size", "#E1EFFF-#2998FF"]}
              size="size"
              shape="circle"
            ></Geom>
          </View> */}
        </Chart>
        <img src={SouChinaSeaIcon} className={styles.southChinaSea} />
      </div>
    );
  }, [mapData.rows]);

  return <div style={{ width: '100%' }}>{renderMapChart}</div>;
};

export default MapChart;
