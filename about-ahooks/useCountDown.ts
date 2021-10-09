// 一个用于管理倒计时的Hook。
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import usePersistFn from './usePersistFn';

type TDate = Date | number | string | undefined

export interface Options{
  targetDate?:TDate;
  interval?:number;
  onEnd?:() => void
}

export interface FormattedRes {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

const calcLeft = (t?:TDate) => {
  if(!t) return 0

  const left = dayjs(t).valueOf() - new Date().getTime()
  return left < 0 ? 0 : left
}

const parseMs = (milliseconds:number):FormattedRes => {
  return {
    days: Math.floor(milliseconds / 86400000),
    hours: Math.floor(milliseconds / 3600000) % 24,
    minutes: Math.floor(milliseconds / 60000) % 60,
    seconds: Math.floor(milliseconds / 1000) % 60,
    milliseconds: Math.floor(milliseconds) % 1000,
  };
}

const useCountdown = (options?:Options) => {
  const { targetDate,interval = 1000,onEnd } = options || {};

  // 设置目标日期
  const [target,setTargetDate] = useState<TDate>(targetDate)
  // 设置剩余时间
  const [timeLeft,setTimeLeft] = useState(() => calcLeft(target))

  // 存储结束回调
  const onEndPersistFn = usePersistFn(() => {
    onEnd && onEnd()
  });

  useEffect(() => {
    if(!target){
      setTimeLeft(0)
      return
    }

    // 立即执行
    setTimeLeft(calcLeft(target));

    const timer = setInterval(() => {
      const targetLeft = calcLeft(target);
      setTimeLeft(targetLeft)
      if(targetLeft === 0){
        clearInterval(timer);
        onEndPersistFn()
      }
    },interval)
    
    return () => clearInterval(timer)

  },[target,interval])

  // 返回格式化的剩余时间
  const formattedRes = useMemo(() => {
    return parseMs(timeLeft);
  },[timeLeft])

  return [timeLeft,setTargetDate,formattedRes] as const
}

export default useCountdown