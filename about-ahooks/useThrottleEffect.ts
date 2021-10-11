// 节流useEffect hook
import { useEffect,EffectCallback,DependencyList,useState } from "react"
import useThrottleFn,{ ThrottleOptions } from "./useThrottleFn"
import useUpdateEffect from "./useUpdateEffect"
import useUnmount from "./useUnmount"

function useThrottleEffect(
  effect:EffectCallback,
  deps?:DependencyList,
  options?:ThrottleOptions
){
  const [flag,setFlag] = useState({})

  const { run,cancel } = useThrottleFn(() => {
    setFlag({})
  },options)

  useEffect(() => {
    return run()
  },deps)

  useUnmount(cancel)

  useUpdateEffect(effect,[flag])
}

export default useThrottleEffect