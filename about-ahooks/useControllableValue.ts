// 在某些组件开发时，我们需要组件的状态即可以自己管理，也可以被外部控制，useControllableValue 就是帮你管理这种状态的 Hook。
import { useCallback, useState } from "react";
import useUpdateEffect from "./useUpdateEffect";

export interface Options<T> {
  defaultValue?: T;
  defaultValuePropName?: string;
  valuePropName?: string;
  tigger?: string;
}

export interface Props {
  [key: string]: any;
}

// 一个标准的props参入的参数
interface StandardProps<T> {
  value: T;
  defaultValue?: T;
  onChange: (val: T) => void;
}

// 函数重载，不用的函数参数返回不同的结果集
// 标准传参，返回一个当前的值，以及一个改变值的函数
function useControllableValue<T = any>(
  props: StandardProps<T>
): [T, (val: T) => void];
// 选择了没有value的传参，返回当前的值，以及一个接受剩余参数的改变值得函数
function useControllableValue<T = any>(
  props?: Props,
  options?: Options<T>
): [T, (val: T, ...args: any[]) => void];
//实现
function useControllableValue<T = any>(
  props: Props = {},
  options: Options<T> = {}
) {
  const {
    defaultValue,
    defaultValuePropName = "defaultValue",
    valuePropName = "value",
    tigger = "onChange",
  } = options;

  // 获取传入的value,父组件传入的value，必须是一个状态值才行，否则是没办法进行监听的
  const value = props[valuePropName];

  const [state, setState] = useState<T>(() => {
    if (valuePropName in props) return value;
    // 如果props中函数defaultValuePropName，那么返回props中的
    if (defaultValuePropName in props) return props[defaultValuePropName];
    // 如果props中不包含value以及defaultValue，那么返回options中的
    return defaultValue;
  });

  // 这里适用于在父组件接管了value的设置后，每次更新value，那么自动进行更新设置
  /**初始化的时候 不执行值得设置，在更新的时候自动设置最新的value */
  useUpdateEffect(() => {
    valuePropName in props && setState(value);
  }, [value, valuePropName]);

  // 触发更新的函数
  const handleSetState = useCallback(
    (v: T, ...args: any[]) => {
      // 如果props中不包含value，也就是没有被父组件接管的情况下，直接设置传入的value
      !(valuePropName in props) && setState(v);
      // 如果props中的存在onChange回调，那么调用此函数
      props[tigger] && props[tigger](v, ...args);
    },
    [props, valuePropName, tigger]
  );

  return [valuePropName in props ? value : state, handleSetState] as const;
}

export default useControllableValue;
