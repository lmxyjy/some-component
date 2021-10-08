// 仅在更新的时候进行运行，首屏渲染不执行的effect
import { useEffect,useRef } from "react"

const useUpdateEffect: typeof useEffect = (effect,deps) => {
  // 是否首屏渲染
  const isMount = useRef(true);
  
  useEffect(() => {
    if(isMount.current){
      isMount.current = false;
    }else{
      return effect()
    }
  },deps)
}

export default useUpdateEffect