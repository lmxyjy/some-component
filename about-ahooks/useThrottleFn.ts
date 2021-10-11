// 节流hook
import throttle from 'lodash.throttle';
import { useRef } from 'react';
import useCreation from './useCreation';
import useUnmount from './useUnmount';

export interface ThrottleOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}

type Fn = (...args: any[]) => any

function useThrottleFn<T extends Fn>(fn:T,options?:ThrottleOptions){
  const fnRef = useRef<T>(fn);
  // 以确保每次都获取到最新的fn
  fnRef.current = fn

  const wait = options?.wait ?? 1000

  const throttled = useCreation(() => {
    return throttle<T>(
      (...args:any[]) => {
        return fnRef.current(...args)
      },
      wait,
      options
    )
  },[])

  useUnmount(() => {
    throttled.cancel()
  })


  return {
    run:throttled,
    cancel:throttled.cancel,
    flush:throttled.flush
  }
}

export default useThrottleFn