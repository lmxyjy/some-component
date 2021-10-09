// 只在组件首屏渲染时执行的钩子
import { useEffect } from "react"

const useMount = (fn: () => void) => {
  useEffect(() => {
    fn()
  },[])
}

export default useMount