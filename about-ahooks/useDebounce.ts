// 输入值实现防抖功能
import { useState, useEffect } from "react";
import useDebounceFn, { DebounceOptions } from "./useDebounceFn";

const useDebounce = <T>(value: T, options?: DebounceOptions) => {
  const [state, setState] = useState(value);

  const { run } = useDebounceFn(() => {
    setState(value);
  }, options);

  // 当value改变的时候就调用run方法，run方法又会回调setState的方法，所以就能够动态的防抖改变state
  useEffect(() => {
    run();
  }, [value]);

  return state;
};

export default useDebounce;
