// 一个只在依赖更新时执行的 useLayoutEffect Hook。
import { useLayoutEffect,useRef } from "react"

const useUpdateLayoutEffect:typeof useLayoutEffect = (effect,deps) => {
  const isMountRef = useRef(true)

  useLayoutEffect(() => {
    if(isMountRef.current){
      isMountRef.current = false
      return
    }else{
      return effect()
    }
  },deps)
}

export default useUpdateLayoutEffect