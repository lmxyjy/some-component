export const constructGeoJSON = (features: any) => {
  if (!features) return false;
  if (Array.isArray(features)) {
    return {
      type: 'FeatureCollection',
      features: [...features],
    };
  }
  return features;
};

export const getGeojsonByCode = (adcode = 100000, withSub = true) => {
  if (!AMapUI) {
    return Promise.reject();
  }
  return new Promise((resolve, reject) => {
    AMapUI.load('ui/geo/DistrictExplorer', (DistrictExplorer: any) => {
      const districtExplorer = DistrictExplorer && new DistrictExplorer();
      districtExplorer?.loadAreaNode(adcode, (error: any, areaNode: any) => {
        error && reject();

        const res = withSub ? areaNode?.getSubFeatures() : areaNode?.getParentFeature();

        resolve(constructGeoJSON(res));
      });
    });
  });
};

// 请求城市数据
