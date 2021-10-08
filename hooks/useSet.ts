// 一个可以管理 Set 类型状态的 Hook。
import { useMemo,useCallback,useState } from "react"

interface IPatch<K> {
  has:(key:K) => boolean,
  add:(key:K) => void,
  remove:(key:K) => void,
  reset:() => void
}

const useSet = <K>(initialValue?:Iterable<K>):[K,IPatch<K>] => {
  // 创建初始值
  const initialSet = useMemo<Set<K>>(() => {
    return initialValue === undefined ? new Set() : new Set(initialValue)
  },[]);

  const [set,setSet] = useState<Set<K>>(initialSet);

  const actions = useMemo(() => ({
    add:(key:K)=>{
      setSet(prevSet=>{
        const temp = new Set(prevSet);
        temp.add(key)
        return temp
      })
    },
    remove:(key:K)=>{
      setSet(prevSet=>{
        const temp = new Set(prevSet);
        temp.delete(key);
        return temp
      })
    },
    reset:()=>{setSet(initialSet)}
  }),[initialSet,setSet]);

  const utils:IPatch<K> = {
    has:useCallback((key:K)=>set.has(key),[set]),
    ...actions
  }

  return [set,utils]
}

export default useSet