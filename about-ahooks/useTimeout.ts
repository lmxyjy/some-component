// 定时器hook
import { useRef,useEffect } from "react"

function useTimeout(
  fn:() => void,
  delay?:number | null | undefined,
  options?:{
    immediate?:boolean
  }
){
  const immediate = options?.immediate;

  const fnRef = useRef<() => void>()
  fnRef.current = fn

  useEffect(() => {
    if(delay == undefined) return
    immediate && fnRef.current?.()

    const timer = setTimeout(() => {
      fnRef.current?.()
    },delay)

    return () => {
      clearTimeout(timer)
    }
  },[delay])

}

export default useTimeout
