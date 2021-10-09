// 一个可以管理Map类型状态的hook
import { useMemo, useCallback, useState } from "react";

function useMap<K, T>(initialValue?: Iterable<readonly [K, T]>) {
  // 获取初始化的值
  const initialMap = useMemo(
    () => (initialValue ? new Map(initialValue) : new Map()),
    []
  );

  // 存储对应的map
  const [map, setMap] = useState(initialMap)

  // 设置对应的方法
  const stableActions = useMemo(() => ({
    set(key:K,entry:T){
      setMap(prev=>{
        const _map = new Map(prev);
        _map.set(key,entry);
        return _map
      })
    },
    setAll(newMap:Iterable<readonly [K,T]>){
      setMap(new Map(newMap))
    },
    remove(key:K){
      setMap(prev => {
        const _map = new Map(prev);
        _map.delete(key)
        return _map
      })
    },
    reset(){
      setMap(initialMap)
    }
  }),[initialMap,setMap])

  const utils = {
    ...stableActions,
    get:useCallback((key: string) => map.get(key),[map])
  }

  return [map,utils] as const
}

export default useMap;
