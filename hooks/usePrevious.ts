// 记录上一个值
import { useRef } from "react"

// 一个是判断是否需要更新值的回调函数
export type compareFunction<T> = (prev: T | undefined,next: T) => boolean

function usePervious<T>(state: T, compare?:compareFunction<T>):T | undefined {
  const prevRef = useRef<T>()
  const curRef = useRef<T>()

  const isNeedUpdate = typeof compare === "function" ? compare(curRef.current,state) : true
  if(isNeedUpdate){
    prevRef.current = curRef.current
    curRef.current = state
  }

  return prevRef.current
}

export default usePervious