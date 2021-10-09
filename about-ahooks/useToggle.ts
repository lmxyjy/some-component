// 用于在两个状态值间切换的 Hook。
import { useState, useMemo } from 'react';

type IState = string | number | boolean | undefined

export interface Actions<T = IState>{
  setLeft:() => void;
  setRight:() => void;
  toggle:(value?:T) => void
}

// 设置函数重载
function useToggle<T = boolean | undefined>():[boolean,Actions<T>];

function useToggle<T = IState>(defaultValue:T):[T,Actions<T>];

function useToggle<T = IState,U = IState>(defaultValue:T,reverseValue:U):[T | U,Actions<T | U>]

function useToggle<D extends IState = IState, R extends IState = IState>(
  defaultValue: D = false as D,
  reverseValue?: R
){
  const [ state,setState ] = useState<D | R>(defaultValue);

  const reverseValueOrigin = reverseValue === undefined ? !defaultValue : reverseValue

  const actions = useMemo(() => ({
    setLeft:() => {
      setState(defaultValue)
    },
    setRight:() => {
      setState(reverseValueOrigin)
    },
    toggle:(value?: D | R)=>{
      // 如果传入了值
      if(value){
        setState(value)
        return 
      }
      // 如果没有传入值,就切换当前值
      setState(prveState=>prveState === defaultValue ? reverseValueOrigin : defaultValue)
    }
  }),[defaultValue,reverseValue])

  return [state,actions]
}

export default useToggle