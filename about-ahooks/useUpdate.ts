// 强制组件重新渲染的hook
import { useState,useCallback } from "react"

const useUpdate = () => {
  const [,setState] = useState({})

  // 执行改变state的值，react则进行重新渲染
  return useCallback(() => setState({}),[])
}

export default useUpdate