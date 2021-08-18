// <script src="https://webapi.amap.com/maps?v=1.4.8&key=55bf1adb55b9465c53096728e392be29&plugin=Map3D"></script>
const MAPKEY = '55bf1adb55b9465c53096728e392be29';
export const mapStyle = 'amap://styles/284729b5f021993a898c6343680a43c5';
export default class APILoader {
  getScriptSrc() {
    return `https://webapi.amap.com/maps?v=1.4.15&key=${MAPKEY}&plugin=Map3D`;
  }
  buildScriptTag(src: string, id: string) {
    const ids = document.getElementById(id);
    if (ids?.parentNode) {
      ids.parentNode.removeChild(ids);
    }
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = src;
    script.id = id;
    return script;
  }

  getAmapuiPromise() {
    const script = this.buildScriptTag(`https://webapi.amap.com/ui/1.0/main.js`, 'amap_ui_xd');
    const p = new Promise((resolve) => {
      script.onload = () => {
        // @ts-ignore
        resolve();
      };
    });
    document.body.appendChild(script);
    return p;
  }

  getMainPromise() {
    const script = this.buildScriptTag(this.getScriptSrc(), 'amap_xd');
    const p = new Promise((resolve) => {
      script.onload = () => {
        // @ts-ignore
        resolve();
      };
    });
    document.body.appendChild(script);
    return p;
  }

  load() {
    return this.getMainPromise();
  }
}
