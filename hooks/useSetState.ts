// 管理 object 类型 state 的 Hooks，用法与 class 组件的 this.setState 基本一致。
import { useCallback,useState } from "react"

export function isFunction(obj: any): obj is Function {
  return typeof obj === 'function';
};

// patch方法可以接受一个对象，也可以接受一个函数作为参数
const useSetState = <T extends object>(initialState):[
  T, 
  (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void
]=>{
  const [state,setState] = useState<T>(initialState);

  const setMergeState = useCallback((patch) => {
    setState(prevState => ({...prevState,...(isFunction(patch) ? patch(prevState) : patch)}))
  },[])

  return [state,setMergeState]
}

export default useSetState