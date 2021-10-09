// 仅在组件卸载的时候执行
import { useEffect } from "react"
import usePersistFn from "./usePersistFn"

function isFunction(f: any):f is () => void {
  return typeof f === "function"
}

const useUnmount = (fn: any) => {
  const _fn = usePersistFn(fn)

  useEffect(() => () => {
    isFunction(_fn) && _fn()
  },[])
}

export default useUnmount