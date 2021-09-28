function download(data: any, filename: any) {
  // @ts-ignore
  if (typeof window.chrome !== 'undefined') {
    // Chrome version
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // IE version
    const blob = new Blob([data], { type: 'application/force-download' });
    // @ts-ignore
    window.navigator.msSaveBlob(blob, filename);
  } else {
    // Firefox version
    let file = new File([data], filename, { type: 'application/force-download' });
    window.open(URL.createObjectURL(file));
  }
}

/**
 * 下载excel
 * @param param0
 * @returns
 */
export const PromiseDownloadExcel = ({
  url,
  data,
  method = 'post',
  filename,
  headers,
}: {
  url: string;
  data: any;
  method: 'post';
  filename?: string;
  headers?: any;
}) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    let fileName = '';
    request.open(method, url, true);
    request.responseType = 'blob';
    request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    request.withCredentials = true;
    if (headers) {
      request.setRequestHeader('n-token', headers['n-token']);
    }
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status === 200) {
          fileName = decodeURI(request.getResponseHeader('Content-Disposition') || '');
          fileName = filename || fileName.substr(20, fileName.length - 1) || '下载文件.xlsx';
          resolve(true);
        } else {
          reject(request);
        }
      }
    };
    request.onload = function () {
      download(request.response, fileName);
    };
    request.send(JSON.stringify(data));
  });
};


// 使用：
// 导出pdf
// const handleDownLoadPdf = () => {
//   PromiseDownloadExcel({
//     url: `${BASE_CONFIG.baseURL}/throwdata/throw/data/xhs/exportMarkDailyData`,
//     data: { ...lineParams, view: chartTab === 'all' ? 1 : 2 },
//     method: 'post',
//     headers: { 'n-token': BASE_CONFIG.headers['N-Token'] },
//     filename: '小红书 - 互动表现趋势图',
//   });
// };
