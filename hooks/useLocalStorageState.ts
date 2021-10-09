// 一个可以将状态持久化存储在 localStorage 中的 Hook 。
import createUseStorageState from './createUseStorageState';

const useLocalStorageState = createUseStorageState(
  typeof window === "object" ? window.localStorage : null
)
export default useLocalStorageState

