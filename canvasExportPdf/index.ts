// 将dom结构绘制成图片，并且以pdf的形式导出。如果需要忽略导出某个元素，在改元素标签上加上date-pdf="ignore"
// 如果要用权限的方式控制某一个模块不导出，可以设置使用AuthContainer容器进行权限配置。
import { message } from 'antd';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import { jsPDF as JsPDF } from 'jspdf';

interface IDownloadPdf {
  id: string; // 导出的容器id
  name: string; // 导出的文件名称
  checkList: number[]; // 需要包含的权限导出模块
  setSpinning: (bool: boolean) => void; // 关闭or开启导出loading效果
}

/** PDF导出 */
const exportPdf = ({ id, name, checkList, setSpinning }: IDownloadPdf) => {
  if (!id) return;
  document.documentElement.scrollTop = 0;
  const el = document.getElementById(id)!;
  setSpinning(true);
  // @ts-ignore
  // const elW = el.offsetWidth;

  html2canvas(el, {
    width: 1200,
    // x: (elW - 1300) / 2,
    useCORS: true,
    imageTimeout: 20000,
    scale: window.devicePixelRatio * 2, // 解决图片不清晰问题
    ignoreElements: (node: any) => {
      if (!node.dataset) return true;

      // 导出的时候，不展示元素。但是要展示元素的占位，配置data-pdf="ignore-slot"属性
      if (node.dataset.pdf === 'ignore-slot') {
        const _node = node;
        _node.style.opacity = 0;
        setTimeout(() => {
          _node.style.opacity = 1;
        }, 0);
        return false;
      }

      // 导出的时候，不展示元素。配置data-pdf="ignore"属性
      if (node.dataset.pdf === 'ignore') {
        const _node = node;
        const _init = _node.style.display;
        _node.style.display = 'none';
        setTimeout(() => {
          _node.style.display = _init;
        }, 0);
        return true;
      }

      // 是否具有权限key
      const { auth } = node.dataset;
      // 如果没有权限配置，则需要显示
      if (!auth) return false;
      // 如果有权限配置，并且选中了显示。那么输出显示
      if (checkList.includes(+auth)) return false;
      // 如果有权限配置，没有选中，那么不进行输出
      return true;
    },
  })
    .then((canvas: any) => {
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;

      // html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
      const imgWidth = 596.28;
      const imgHeight = (596.28 / contentWidth) * contentHeight;

      const pageData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new JsPDF({
        orientation: 'p',
        unit: 'pt',
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${name}${dayjs().format('YYYY-MM-DD')}.pdf`);
    })
    .catch(() => {
      message.error('报告导出失败，请稍后重试');
    })
    .finally(() => {
      setSpinning(false);
    });
};

export default exportPdf;
