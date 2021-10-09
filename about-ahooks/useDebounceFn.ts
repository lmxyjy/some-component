// 基于lodash的防抖hook
import debounce from 'lodash.debounce';
import { useRef } from 'react';
import useCreation from './useCreation';
import useUnmount from './useUnmount';

export interface DebounceOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}

type Fn = (...args:any)=>any

function useDebounceFn<T extends Fn>(fn: T,options?:DebounceOptions){
  const fnRef = useRef<T>(fn)
  fnRef.current = fn;

  const wait = options?.wait ?? 1000

  const debounced = useCreation(() => {
    return debounce<T>(
      (...args: any[]) => fnRef.current(...args),
      wait,
      options
    )
  },[])

  // 组件卸载时，取消
  useUnmount(() => {
    debounced.cancel()
  })

  return {
    run: debounced,
    cancel: debounced.cancel,
    flush:debounced.flush
  }

}

export default useDebounceFn