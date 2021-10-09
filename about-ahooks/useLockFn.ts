// 给异步函数提供竞态锁
import { useRef, useCallback } from "react";

const useLockFn = <P extends any[] = any[], V extends any = any>(
  fn: (...args: P) => Promise<V>
) => {
  const lockRef = useRef(false);

  return useCallback(async (...args: P) => {
    if (lockRef.current) return;
    lockRef.current = true;
    try {
      const res = await fn(...args);
      lockRef.current = false;
      return res;
    } catch (e) {
      lockRef.current = false;
      throw e;
    }
  }, []);
};

export default useLockFn;
