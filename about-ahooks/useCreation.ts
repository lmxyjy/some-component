// 返回恒定的值，相比于useMemo更加稳定
import { useRef } from "react"

export interface IMemoizedState<T> {
  deps:any[];
  obj: undefined | T;
  initialized:boolean
}

const useCreation = <T>(f:() => T,deps:any[])=>{
  const { current:memoizedState } = useRef<IMemoizedState<T>>({
    deps,
    obj:void 0,
    initialized:false
  });

  if(memoizedState.initialized === false || !depsAreSame(memoizedState.deps,deps)){
    memoizedState.deps = deps
    memoizedState.obj = f()
    memoizedState.initialized = true
  }

  return memoizedState.obj 
}

// 浅比较
function depsAreSame(prevDeps:any[],currentDeps:any[]){
  if(prevDeps === currentDeps) return true
  for(let i = 0;i < currentDeps.length;i++) {
    if(prevDeps[i] !== currentDeps[i]) return false
  }
  return true
}

export default useCreation