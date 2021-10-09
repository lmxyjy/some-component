// 优雅的管理 boolean 值的 Hook。
import { useMemo } from "react"
import useToggle from "./useToggle"

export interface Actions {
  setTrue:() => void;
  setFalse:() => void;
  toggle:(value?:boolean | undefined) => void
}

const useBoolean = (defaltValue = false):[boolean,Actions] => {
  const [state,{ toggle } ] = useToggle(defaltValue)

  const actions = useMemo(() => ({
    setTrue:() => toggle(true),
    setFalse:() => toggle(false),
    toggle
  }),[])

  return [state,actions]
}

export default useBoolean