// 在组件卸载后，无法再次调用useState的dispatch
import { useState,Dispatch,SetStateAction,useCallback } from "react"
import useUnmountedRef from "./useUnmountedRef"

//设置函数重载，不同的传参返回不同的类型
function useSafeState<S>(initialState: S | (() => S)):[S,Dispatch<SetStateAction<S>>]
function useSafeState<S = undefined>():[S | undefined,Dispatch<SetStateAction<S | undefined>>]

function useSafeState(initialState?){
  const unmountedRef = useUnmountedRef()
  const [state,setState] = useState(initialState)

  const setCurrentState = useCallback(currentState => {
    if(unmountedRef) return
    setState(currentState)
  },[])

  return [state,setCurrentState]
}

export default useSafeState