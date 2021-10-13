// 优雅使用 addEventListener 的 Hook。
import { MutableRefObject,useRef,useEffect } from "react"

// 类型：
export type BasicTarget<T = HTMLElement> =
  | (() => T | null)
  | T
  | null
  | MutableRefObject<T | null | undefined>;

export type Target = BasicTarget<HTMLElement | Element | Window | Document>

type TargetElement = HTMLElement | Element | Document | Window;

type Options<T extends Target = Target> = {
  target?:T,
  capture?:boolean,
  once?:boolean,
  passive?:boolean
}

// 函数重载
function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName:K,
  handler:(ev: HTMLElementEventMap[K]) => void,
  options?:Options<HTMLElement>
):void
function useEventListener<K extends keyof ElementEventMap>(
  eventName:K,
  handler:(ev:ElementEventMap[K])=>void,
  options?:Options<Element>
):void
function useEventListener<K extends keyof DocumentEventMap>(
  eventName:K,
  handler:(ev:DocumentEventMap)=>void,
  options?:Options<Document>
):void
function useEventListener<K extends keyof WindowEventMap>(
  eventName:K,
  handler:(ev:WindowEventMap[K])=>void,
  options?:Options<Window>
):void
function useEventListener(eventName:string,handler:Function,options:Options):void

function useEventListener(eventName:string,handler:Function,options:Options={}){
  const handlerRef = useRef<Function>()
  handlerRef.current = handler

  useEffect(() => {
    const targetElement = getTargetElement(options.target);
    if(!targetElement.addEventListener) return

    const eventListener = (event:Event):EventListenerOrEventListenerObject | AddEventListenerOptions => {
      return handlerRef.current && handlerRef.current(event)
    }

    targetElement.addEventListener(eventName,eventListener,{
      capture:options.capture,
      once:options.once,
      passive:options.passive
    })

    return () => {
      targetElement.removeEventListener(eventName,eventListener,{
        capture: options.capture
      })
    }

  },[eventName,options.target,options.capture,options.once,options.passive])
}

export function getTargetElement(
  target?: BasicTarget<TargetElement>,
  defaultElement?: TargetElement,
): TargetElement | undefined | null {
  if (!target) {
    return defaultElement;
  }

  let targetElement: TargetElement | undefined | null;

  if (typeof target === 'function') {
    targetElement = target();
  } else if ('current' in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
}
export default useEventListener