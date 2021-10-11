// 防抖的useEffect hook
import { useEffect,EffectCallback,DependencyList,useState } from "react";
import useDebounceFn, { DebounceOptions } from "./useDebounceFn";
import useUpdateEffect from "./useUpdateEffect"
import useUnmount from "./useUnmount";

function useDebounceEffect(
  effect: EffectCallback,
  deps?:DependencyList,
  options?:DebounceOptions
){
  const [flag,setFlag] = useState({});

  const { run,cancel } = useDebounceFn(() => {
    setFlag({});
  },options)

  // deps改变的时候，防抖刷新组件
  useEffect(() => {
    return run()
  },deps)

  // 组件卸载后取消防抖
  useUnmount(cancel)

  // 当flag更新的时候，调用传入的回调函数
  useUpdateEffect(effect,[flag])
}

export default useDebounceEffect
