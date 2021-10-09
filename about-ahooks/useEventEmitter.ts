// 类似于vue中的事件总线
import { useRef,useEffect } from "react"

type Subscription<T> = (val: T) => void

export class EventEmitter<T>{
  private subscriptions = new Set<Subscription<T>>()

  emit = (val: T) => {
    for(const cb of this.subscriptions) cb(val)
  }

  useSubscription = (cb:Subscription<T>) => {
    const cbRef = useRef<Subscription<T>>(cb);
    
    useEffect(() => {
      function subCb(val: T){
        cbRef.current && cbRef.current(val)
      }
      this.subscriptions.add(subCb)
      return () => {
        this.subscriptions.delete(subCb)
      }
    },[])
  }
}

const useEventEmitter = <T>():EventEmitter<T>=>{
  const eventEmitterRef = useRef<EventEmitter<T>>()
  if(!eventEmitterRef.current){
    eventEmitterRef.current = new EventEmitter()
  }
  return eventEmitterRef.current
}

export default useEventEmitter